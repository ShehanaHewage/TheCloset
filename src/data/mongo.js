import { MongoClient } from 'mongodb';
import config from '../configs/config.js';

const client = new MongoClient(config.mongoURI);
export const db = client.db();

const collections = {
  users: db.collection('users'),
  clothingItems: db.collection('clothingItems'),
  orders: db.collection('orders'),
  files: db.collection('files'),
};

export default collections;
