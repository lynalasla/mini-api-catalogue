import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

/**
 * GET /api/orders
 * Récupère toutes les commandes
 */
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format orders to match expected frontend format (snake_case)
    const formattedOrders = orders.map(order => ({
      id: order.id,
      user_id: order.userId,
      status: order.status,
      total_amount: parseFloat(order.total),
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      user: order.user,
      items: order.items.map(item => ({
        id: item.id,
        order_id: item.orderId,
        product_id: item.productId,
        product_name: item.product?.name || 'Unknown',
        quantity: item.quantity,
        price: parseFloat(item.price),
        created_at: item.createdAt,
        product: item.product
      }))
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
