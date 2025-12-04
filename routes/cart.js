import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

// TODO: Implémenter les routes du panier

router.get('/', (req, res) => {
  res.json({ message: 'Cart routes not implemented yet' });
});

export default router;
