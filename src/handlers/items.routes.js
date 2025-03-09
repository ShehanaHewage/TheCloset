import { Router } from 'express';
import { ObjectId } from 'mongodb';

import collections from '../data/mongo.js';
import { transformKeysToCamel } from '../utilities/objects.utils.js';
import { transformMongoData } from '../utilities/mongo.utils.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', async (req, res) => {
  const {
    code,
    type,
    size,
    title,
    startPrice,
    endPrice,
    stockStatus,
    page = 1,
    limit = 10,
  } = transformKeysToCamel(req.query);

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = {};

  if (code) query.code = code;
  if (type) query.type = type;
  if (size) query.size = size;
  if (title) query.title = { $regex: title, $options: 'i' };

  if (startPrice || endPrice) {
    query.price = {};
    if (startPrice) query.price.$gte = parseFloat(startPrice);
    if (endPrice) query.price.$lte = parseFloat(endPrice);
  }

  if (stockStatus === 'true' || stockStatus === true) query.stock = { $gt: 0 };
  if (stockStatus === 'false' || stockStatus === false) query.stock = { $lte: 0 };

  try {
    const items = await collections.clothingItems
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await collections.clothingItems.countDocuments(query);
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    res.json({
      items: items.map(transformMongoData),
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
      message: 'Failed to retrieve items',
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const item = await collections.clothingItems.findOne({
    _id: new ObjectId(id),
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }
  res.json(transformMongoData(item));
});

router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  const { code, title, description, price, stock, type, size, image } = transformKeysToCamel(req.body);

  const item = {
    code,
    title,
    description,
    price,
    stock,
    type,
    size,
    image,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const existingItem = await collections.clothingItems.findOne({ code });
  if (existingItem) {
    return res.status(400).json({
      success: false,
      message: `Item already exists with code ${code}`,
    });
  }

  const result = await collections.clothingItems.insertOne(item);
  const insertedItem = await collections.clothingItems.findOne({ _id: result.insertedId });
  res.json(transformMongoData(insertedItem));
});

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, stock, type, size, image } = transformKeysToCamel(req.body);

  const item = {
    title,
    description,
    price,
    stock,
    type,
    size,
    image,
    updatedAt: new Date(),
  };

  const existingItem = await collections.clothingItems.findOne({ _id: new ObjectId(id) });
  if (!existingItem) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }

  await collections.clothingItems.updateOne({ _id: new ObjectId(id) }, { $set: item });
  const updatedItem = await collections.clothingItems.findOne({ _id: new ObjectId(id) });
  res.json(transformMongoData(updatedItem));
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  const existingItem = await collections.clothingItems.findOne({ _id: new ObjectId(id) });
  if (!existingItem) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }

  await collections.clothingItems.deleteOne({ _id: new ObjectId(id) });
  res.json({
    success: true,
  });
});

export default router;
