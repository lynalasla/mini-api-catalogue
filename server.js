/**
 * Fichier principal du serveur Express
 * Gère la configuration de l'application et l'initialisation des routes
 */

// Importation des modules nécessaires
import express from 'express';
import cookieParser from 'cookie-parser';
import promClient from 'prom-client';
import categoriesRoutes from './routes/categories.js';
import productRouter from './routes/products.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import usersRoutes from './routes/users.js';
import analyticsRoutes from './routes/analytics.js';
import prisma from './config/prisma.js';

// Initialisation de l'application Express
const app = express();

// ============ PROMETHEUS METRICS CONFIGURATION ============
const register = new promClient.Registry();

// Default metrics (CPU, Memory, Event Loop, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});

// Business metrics
const ordersTotal = new promClient.Counter({
  name: 'orders_total',
  help: 'Total number of orders placed',
  labelNames: ['status']
});

const orderRevenue = new promClient.Counter({
  name: 'order_revenue_total',
  help: 'Total revenue from orders',
  labelNames: ['currency']
});

const productsViewed = new promClient.Counter({
  name: 'products_viewed_total',
  help: 'Total number of product views',
  labelNames: ['product_id', 'category']
});

const cartOperations = new promClient.Counter({
  name: 'cart_operations_total',
  help: 'Total number of cart operations',
  labelNames: ['operation'] // add, remove, clear
});

// Business metrics (gauges created once)
const productsGauge = new promClient.Gauge({
  name: 'products_count',
  help: 'Total number of products in catalog'
});

const ordersGauge = new promClient.Gauge({
  name: 'orders_count',
  help: 'Total number of orders'
});

const usersGauge = new promClient.Gauge({
  name: 'users_count',
  help: 'Total number of registered users'
});

const categoriesGauge = new promClient.Gauge({
  name: 'categories_count',
  help: 'Total number of categories'
});

// Register all custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(dbQueryDuration);
register.registerMetric(ordersTotal);
register.registerMetric(orderRevenue);
register.registerMetric(productsViewed);
register.registerMetric(cartOperations);
register.registerMetric(productsGauge);
register.registerMetric(ordersGauge);
register.registerMetric(usersGauge);
register.registerMetric(categoriesGauge);

// Expose metrics for Prometheus
export { 
  httpRequestDuration, 
  httpRequestTotal, 
  activeConnections, 
  dbQueryDuration,
  ordersTotal,
  orderRevenue,
  productsViewed,
  cartOperations
};

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

// Middleware to track request metrics
app.use((req, res, next) => {
  const start = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration.labels(req.method, route, res.statusCode).observe(duration);
    httpRequestTotal.labels(req.method, route, res.statusCode).inc();
    activeConnections.dec();
  });

  next();
});

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
    const [productsCount, ordersCount, usersCount, categoriesCount] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.category.count()
    ]);

    // Update gauge values (gauges already registered at startup)
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
