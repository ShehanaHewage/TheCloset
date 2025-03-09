import { Router } from 'express';
import { ObjectId } from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import collections from '../data/mongo.js';
import { transformKeysToCamel, removeKeys } from '../utilities/objects.utils.js';
import { transformMongoData } from '../utilities/mongo.utils.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import config from '../configs/config.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, address, mobile, username, password } = transformKeysToCamel(req.body);

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const existingUser = await collections.users.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Username already exists',
    });
  }

  const hashedPassword = await argon2.hash(password);

  const user = {
    firstName,
    lastName,
    address,
    mobile,
    username,
    password: hashedPassword,
    type: 'regular',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await collections.users.insertOne(user);
  const createdUser = await collections.users.findOne({ username });
  console.log(createdUser);

  const userWithoutPassword = removeKeys(createdUser, 'password');
  res.status(201).json(transformMongoData(userWithoutPassword));
});

router.post('/login', async (req, res) => {
  const { username, password } = transformKeysToCamel(req.body);

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }

  const user = await collections.users.findOne({ username });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  try {
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying password',
    });
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      type: user.type,
    },
    config.jwtSecret,
    { expiresIn: '24h' },
  );

  const userWithoutPassword = removeKeys(user, 'password');
  res.json({
    token,
    user: transformMongoData(userWithoutPassword),
  });
});

router.get('/me', authenticate, async (req, res) => {
  const userId = String(req.user.id);

  const user = await collections.users.findOne({ _id: new ObjectId(userId) });

  const userWithoutPassword = removeKeys(user, 'password');
  res.json(transformMongoData(userWithoutPassword));
});

router.put('/me', authenticate, async (req, res) => {
  const { firstName, lastName, address, mobile } = transformKeysToCamel(req.body);
  const userId = String(req.user.id);

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (address) updateData.address = address;
  if (mobile) updateData.mobile = mobile;
  updateData.updatedAt = new Date();

  await collections.users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
  const updatedUser = await collections.users.findOne({ _id: new ObjectId(userId) });

  const userWithoutPassword = removeKeys(updatedUser, 'password');
  res.json(transformMongoData(userWithoutPassword));
});

router.put('/me/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = transformKeysToCamel(req.body);
  const userId = String(req.user.id);

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required',
    });
  }

  const user = await collections.users.findOne({ _id: new ObjectId(userId) });

  try {
    const isPasswordValid = await argon2.verify(user.password, currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying password',
    });
  }

  const hashedPassword = await argon2.hash(newPassword);

  await collections.users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    },
  );

  res.json({
    success: true,
  });
});

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  const users = await collections.users.find({}).toArray();

  const usersWithoutPasswords = users.map((user) => removeKeys(user, 'password'));
  res.json(transformMongoData(usersWithoutPasswords));
});

router.get('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  const user = await collections.users.findOne({ _id: new ObjectId(id) });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const userWithoutPassword = removeKeys(user, 'password');
  res.json(transformMongoData(userWithoutPassword));
});

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address, mobile, type } = transformKeysToCamel(req.body);

  const existingUser = await collections.users.findOne({ _id: new ObjectId(id) });
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (address) updateData.address = address;
  if (mobile) updateData.mobile = mobile;
  if (type && (type === 'admin' || type === 'regular')) updateData.type = type;

  updateData.updatedAt = new Date();

  await collections.users.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  const updatedUser = await collections.users.findOne({ _id: new ObjectId(id) });

  const userWithoutPassword = removeKeys(updatedUser, 'password');
  res.json(transformMongoData(userWithoutPassword));
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  const existingUser = await collections.users.findOne({ _id: new ObjectId(id) });
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  await collections.users.deleteOne({ _id: new ObjectId(id) });

  res.json({
    success: true,
  });
});

export default router;
