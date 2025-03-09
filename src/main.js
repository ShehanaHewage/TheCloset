import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import config from './configs/config.js';
import usersRoutes from './handlers/users.routes.js';
import itemsRoutes from './handlers/items.routes.js';
import ordersRoutes from './handlers/orders.routes.js';
import filesRoutes from './handlers/files.routes.js';
import { initCollections } from './data/seed.js';

const app = express();

// middlewares
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:standard',
      },
    },
  }),
);
app.use(cors());
app.use(express.json());

// routes
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/items', itemsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/files', filesRoutes);

// error handling
app.use((err, req, res, next) => {
  req.log.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// initialize collections
initCollections();

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
