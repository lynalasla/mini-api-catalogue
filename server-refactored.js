/**
 * Fichier principal du serveur Express - VERSION MODULAIRE
 * Gère la configuration de l'application et l'initialisation des routes
 */

import express from 'express';
import cookieParser from 'cookie-parser';

// Import routes
import categoriesRoutes from './routes/categories.js';
import productRouter from './routes/products.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import usersRoutes from './routes/users.js';

// Import config
import prisma from './config/prisma.js';
import { register, productsGauge, ordersGauge, usersGauge, categoriesGauge } from './config/metrics/prometheus.js';

// Import middleware
import { corsMiddleware } from './middleware/cors.js';
import { metricsMiddleware } from './config/metrics/middleware.js';

// ============ APP INITIALIZATION ============

const app = express();

// ============ MIDDLEWARE CONFIGURATION ============

// CORS
app.use(corsMiddleware);

// Body parsers
app.use(express.json());
app.use(cookieParser());

// Static files
app.use(express.static('public'));

// Metrics tracking
app.use(metricsMiddleware);

// ============ ROUTES ============

/**
 * Route racine - Redirect vers boutique
 */
app.get('/', (req, res) => {
  res.redirect('/shop.html');
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

/**
 * Prometheus metrics endpoint
 * GET /metrics
 */
app.get('/metrics', async (req, res) => {
  try {
    // Update business metrics from database
    const [productsCount, ordersCount, usersCount, categoriesCount] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.category.count()
    ]);

    // Update gauge values
    productsGauge.set(productsCount);
    ordersGauge.set(ordersCount);
    usersGauge.set(usersCount);
    categoriesGauge.set(categoriesCount);

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

// ============ SERVER START ============

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Metrics available on http://localhost:${PORT}/metrics`);
  console.log(`🏥 Health check on http://localhost:${PORT}/health`);
});

// Export metrics for use in routes
export { 
  httpRequestDuration, 
  httpRequestTotal, 
  activeConnections, 
  dbQueryDuration,
  ordersTotal,
  orderRevenue,
  productsViewed,
  cartOperations
} from './config/metrics/prometheus.js';
