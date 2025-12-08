/**
 * Fichier principal du serveur Express
 * Gère la configuration de l'application et l'initialisation des routes
 */

// Importation des modules nécessaires
import express from 'express';
import cookieParser from 'cookie-parser';
import categoriesRoutes from './routes/categories.js';
import productRouter from './routes/products.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import usersRoutes from './routes/users.js';
import analyticsRoutes from './routes/analytics.js';
import prisma from './config/prisma.js';
import { 
  register,
  productsGauge,
  ordersGauge,
  usersGauge,
  categoriesGauge,
  ordersTotalValue,
  averageOrderValue,
  lowStockProducts,
  revenueToday,
  activeUsers
} from './config/metrics/prometheus.js';
import { metricsMiddleware } from './config/metrics/middleware.js';

// Initialisation de l'application Express
const app = express();

// CORS pour le client React
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware pour parser les requêtes JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static('public'));

// Middleware pour tracker les métriques Prometheus
app.use(metricsMiddleware);

/**
 * Route racine de l'API
 * GET /
 * Redirige vers la boutique
 */
app.get('/', (req, res) => {
  res.redirect('/shop.html');
});

/**
 * Montage des routes de l'API
 * - /api/auth : Authentification (login, register, logout)
 * - /api/categories : Gestion des catégories de produits
 * - /api/products : Gestion des produits
 * - /api/cart : Gestion du panier
 * - /api/orders : Gestion des commandes
 * - /api/users : Gestion des utilisateurs (admin)
 * - /api/analytics : Business Intelligence et métriques avancées
 */
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/analytics', analyticsRoutes);

/**
 * Prometheus metrics endpoint
 * GET /metrics
 * Returns metrics in Prometheus format
 */
app.get('/metrics', async (req, res) => {
  try {
    // Update business metrics from database
    const [
      productsCount, 
      ordersCount, 
      usersCount, 
      categoriesCount,
      revenueData,
      lowStockCount,
      activeUsersCount
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.category.count(),
      // Calculate total revenue and average order value
      prisma.order.aggregate({
        _sum: { total: true },
        _avg: { total: true }
      }),
      // Count low stock products
      prisma.product.count({
        where: { stock: { lt: 10 } }
      }),
      // Count active users (users who placed orders) - use raw query
      prisma.$queryRaw`SELECT COUNT(DISTINCT user_id) as count FROM orders`.then(result => Number(result[0]?.count || 0))
    ]);

    // Calculate today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart }
      },
      _sum: { total: true }
    });

    // Update gauge values
    productsGauge.set(productsCount);
    ordersGauge.set(ordersCount);
    usersGauge.set(usersCount);
    categoriesGauge.set(categoriesCount);
    ordersTotalValue.set(Number(revenueData._sum.total) || 0);
    averageOrderValue.set(Number(revenueData._avg.total) || 0);
    lowStockProducts.set(lowStockCount);
    revenueToday.set(Number(todayRevenue._sum.total) || 0);
    activeUsers.set(activeUsersCount);

    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error('Error collecting metrics:', error);
    res.status(500).send('Error collecting metrics');
  }
});

/**
 * Health check endpoint
 * GET /health
 * Returns service health status
 */
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'mini-api-catalogue',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      timestamp: new Date().toISOString(),
      service: 'mini-api-catalogue',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Définition du port d'écoute
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
