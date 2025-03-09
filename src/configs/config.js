import dotenv from 'dotenv';

dotenv.config();

function orElseThrow(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not defined. Please check your .env file.`);
  }
  return value;
}

const config = {
  port: Number(orElseThrow('PORT')),
  mongoURI: orElseThrow('MONGO_URI'),
  jwtSecret: orElseThrow('JWT_SECRET'),
  storagePath: orElseThrow('STORAGE_PATH'),
};

export default config;
