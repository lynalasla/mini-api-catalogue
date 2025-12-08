/**
 * Analytics Routes - Business Intelligence
 * Endpoints pour calculer et exposer les métriques business
 */

import express from 'express';
import prisma from '../config/prisma.js';
import {
  ordersTotalValue,
  averageOrderValue,
  conversionRate,
  customerLifetimeValue,
  lowStockProducts,
  revenueToday,
  ordersToday,
  activeUsers
} from '../config/metrics/prometheus.js';

const router = express.Router();

/**
 * GET /api/analytics/revenue
 * Calcule les métriques de revenus
 */
router.get('/revenue', async (req, res) => {
  try {
    // Calculer le revenu total
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true
      }
    });

    // Calculer le panier moyen
    const orderStats = await prisma.order.aggregate({
      _avg: {
        total: true
      },
      _count: true
    });

    // Calculer le revenu aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRevenue = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      _count: true,
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Mettre à jour les métriques Prometheus
    ordersTotalValue.set(Number(totalRevenue._sum.total) || 0);
    averageOrderValue.set(Number(orderStats._avg.total) || 0);
    revenueToday.set(Number(todayRevenue._sum.total) || 0);
    ordersToday.set(todayRevenue._count || 0);

    res.json({
      totalRevenue: Number(totalRevenue._sum.total) || 0,
      averageOrderValue: Number(orderStats._avg.total) || 0,
      totalOrders: orderStats._count,
      todayRevenue: Number(todayRevenue._sum.total) || 0,
      todayOrders: todayRevenue._count
    });
  } catch (error) {
    console.error('Error calculating revenue metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/customers
 * Calcule les métriques clients
 */
router.get('/customers', async (req, res) => {
  try {
    // Total clients
    const totalUsers = await prisma.user.count();

    // Clients actifs (avec au moins une commande)
    const activeUsersCount = await prisma.user.count({
      where: {
        orders: {
          some: {}
        }
      }
    });

    // Customer Lifetime Value (LTV)
    const userRevenues = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.email,
        COALESCE(SUM(o.total), 0) as lifetime_value
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id, u.email
      ORDER BY lifetime_value DESC
      LIMIT 100
    `;

    // Calculer la distribution LTV pour l'histogramme
    userRevenues.forEach(user => {
      customerLifetimeValue.observe(Number(user.lifetime_value));
    });

    // Mettre à jour les métriques
    activeUsers.set(activeUsersCount);

    // Calculer LTV moyen
    const avgLTV = userRevenues.length > 0
      ? userRevenues.reduce((sum, u) => sum + Number(u.lifetime_value), 0) / userRevenues.length
      : 0;

    res.json({
      totalCustomers: totalUsers,
      activeCustomers: activeUsersCount,
      averageLifetimeValue: avgLTV,
      topCustomers: userRevenues.slice(0, 10).map(u => ({
        id: u.id,
        email: u.email,
        lifetimeValue: Number(u.lifetime_value)
      }))
    });
  } catch (error) {
    console.error('Error calculating customer metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/conversion
 * Calcule le taux de conversion
 */
router.get('/conversion', async (req, res) => {
  try {
    // Compter les utilisateurs uniques
    const totalUsers = await prisma.user.count();

    // Compter les utilisateurs qui ont commandé
    const usersWithOrders = await prisma.user.count({
      where: {
        orders: {
          some: {}
        }
      }
    });

    // Calculer le taux de conversion
    const rate = totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0;
    
    // Mettre à jour la métrique
    conversionRate.set(rate);

    res.json({
      totalVisitors: totalUsers,
      convertedVisitors: usersWithOrders,
      conversionRate: rate.toFixed(2),
      unit: 'percent'
    });
  } catch (error) {
    console.error('Error calculating conversion rate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/inventory
 * Analyse de l'inventaire
 */
router.get('/inventory', async (req, res) => {
  try {
    // Produits avec stock faible (< 10)
    const lowStock = await prisma.product.count({
      where: {
        stock: {
          lt: 10
        }
      }
    });

    // Produits en rupture de stock
    const outOfStock = await prisma.product.count({
      where: {
        stock: 0
      }
    });

    // Total produits
    const totalProducts = await prisma.product.count();

    // Valeur totale du stock
    const stockValue = await prisma.$queryRaw`
      SELECT SUM(price * stock) as total_value
      FROM products
    `;

    // Mettre à jour les métriques
    lowStockProducts.set(lowStock);

    res.json({
      totalProducts,
      lowStockProducts: lowStock,
      outOfStockProducts: outOfStock,
      totalStockValue: Number(stockValue[0]?.total_value || 0),
      lowStockPercentage: ((lowStock / totalProducts) * 100).toFixed(2)
    });
  } catch (error) {
    console.error('Error calculating inventory metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/products/top-sellers
 * Top produits par ventes
 */
router.get('/products/top-sellers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.name,
        p.price,
        COUNT(oi.id) as order_count,
        SUM(oi.quantity) as total_quantity_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name, p.price
      ORDER BY total_revenue DESC
      LIMIT ${limit}
    `;

    res.json({
      topSellers: topProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        orderCount: Number(p.order_count),
        totalQuantitySold: Number(p.total_quantity_sold || 0),
        totalRevenue: Number(p.total_revenue || 0)
      }))
    });
  } catch (error) {
    console.error('Error fetching top sellers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/dashboard
 * Vue d'ensemble complète pour le dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Exécuter toutes les requêtes en parallèle
    const [
      revenueData,
      ordersData,
      usersData,
      productsData
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        _avg: { total: true }
      }),
      prisma.order.count(),
      prisma.user.count({
        where: {
          orders: { some: {} }
        }
      }),
      prisma.product.count({
        where: {
          stock: { lt: 10 }
        }
      })
    ]);

    // Mettre à jour toutes les métriques
    ordersTotalValue.set(Number(revenueData._sum.total) || 0);
    averageOrderValue.set(Number(revenueData._avg.total) || 0);
    activeUsers.set(usersData);
    lowStockProducts.set(productsData);

    res.json({
      revenue: {
        total: Number(revenueData._sum.total) || 0,
        average: Number(revenueData._avg.total) || 0
      },
      orders: {
        total: ordersData
      },
      customers: {
        active: usersData
      },
      inventory: {
        lowStock: productsData
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
