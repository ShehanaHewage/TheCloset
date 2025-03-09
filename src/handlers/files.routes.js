import { Router } from 'express';
import fs from 'fs';
import path from 'path';

import config from '../configs/config.js';
import { upload } from '../data/multer.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/upload', authenticate, authorizeAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  return res.status(201).json({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploadDate: new Date(),
  });
});

router.get('/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.resolve(config.storagePath, filename);

  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  return res.sendFile(filePath);
});

export default router;
