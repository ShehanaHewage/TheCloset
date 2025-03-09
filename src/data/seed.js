import { db } from './mongo.js';

export async function initCollections() {
  await initUsersCollection();
}

export async function initUsersCollection() {
  const collections = await db.listCollections({ name: 'users' }).toArray();
  if (collections.length === 0) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['firstName', 'lastName', 'username', 'password', 'type', 'createdAt', 'updatedAt'],
          properties: {
            firstName: { bsonType: 'string' },
            lastName: { bsonType: 'string' },
            address: { bsonType: ['string', 'null'] },
            mobile: { bsonType: ['string', 'null'] },
            username: { bsonType: 'string' },
            password: { bsonType: 'string' },
            type: { enum: ['regular', 'admin'] },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });
    console.log('Users collection created with validation schema');
  } else {
    console.log('Users collection already exists');
  }
}
