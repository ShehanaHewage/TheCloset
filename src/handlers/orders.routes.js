import { Router } from 'express';
import { ObjectId } from 'mongodb';
import collections from '../data/mongo.js';
import { transformKeysToCamel } from '../utilities/objects.utils.js';
import { transformMongoData } from '../utilities/mongo.utils.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { generateTrackingCode, validateOrderItems } from '../utilities/order.utils.js';

const router = Router();

router.post('/', async (req, res) => {
  const { items, contactNumber, billingAddress, shippingAddress, userId } = transformKeysToCamel(req.body);

  if (!contactNumber || !billingAddress || !shippingAddress) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const validation = await validateOrderItems(items);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message,
    });
  }

  const trackingCode = generateTrackingCode();

  const order = {
    trackingCode,
    status: 'placed',
    paymentMethod: 'Cash on delivery',
    items: validation.validatedItems,
    total: validation.total,
    contactNumber,
    billingAddress,
    shippingAddress,
    userId: userId ? new ObjectId(String(userId)) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await collections.orders.insertOne(order);

    for (const orderItem of validation.validatedItems) {
      await collections.clothingItems.updateOne({ _id: orderItem.item.id }, { $inc: { stock: -orderItem.pieces } });
    }

    const insertedOrder = await collections.orders.findOne({ _id: result.insertedId });

    res.status(201).json(transformMongoData(insertedOrder));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
});

router.get('/track/:trackingCode', async (req, res) => {
  const { trackingCode } = req.params;

  try {
    const order = await collections.orders.findOne({ trackingCode });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json(transformMongoData(order));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
    });
  }
});

router.get('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await collections.orders.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json(transformMongoData(order));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
    });
  }
});

router.get('/user', authenticate, async (req, res) => {
  const userId = String(req.user.id);

  try {
    const orders = await collections.orders
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(orders.map(transformMongoData));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
    });
  }
});

router.patch('/:id/status', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = transformKeysToCamel(req.body);

  const validStatuses = ['placed', 'processing', 'delivered', 'canceled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be one of: placed, processing, delivered, canceled',
    });
  }

  try {
    const order = await collections.orders.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status === 'canceled' && order.status !== 'canceled') {
      for (const orderItem of order.items) {
        await collections.clothingItems.updateOne({ _id: orderItem.item.id }, { $inc: { stock: orderItem.pieces } });
      }
    }

    if (status !== 'canceled' && order.status === 'canceled') {
      for (const orderItem of order.items) {
        await collections.clothingItems.updateOne({ _id: orderItem.item.id }, { $inc: { stock: -orderItem.pieces } });
      }
    }

    const result = await collections.orders.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update order status',
      });
    }

    const updatedOrder = await collections.orders.findOne({ _id: new ObjectId(id) });

    res.json(transformMongoData(updatedOrder));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
});

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  const { status, page = 1, limit = 10 } = transformKeysToCamel(req.query);

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = {};

  if (status) {
    query.status = status;
  }

  try {
    const orders = await collections.orders
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await collections.orders.countDocuments(query);
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    res.json({
      items: orders.map(transformMongoData),
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
    });
  }
});

export default router;
