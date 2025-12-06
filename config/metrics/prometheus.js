/**
 * Configuration Prometheus Metrics
 * Définit toutes les métriques custom de l'application
 */

import promClient from 'prom-client';

// Créer le registre
const register = new promClient.Registry();

// Métriques par défaut (CPU, Memory, Event Loop, etc.)
promClient.collectDefaultMetrics({ register });

// ============ HTTP METRICS ============

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

// ============ DATABASE METRICS ============

const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});

// ============ BUSINESS METRICS ============

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

// ============ REGISTER METRICS ============

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

// ============ EXPORTS ============

export { 
  register,
  httpRequestDuration, 
  httpRequestTotal, 
  activeConnections, 
  dbQueryDuration,
  ordersTotal,
  orderRevenue,
  productsViewed,
  cartOperations,
  productsGauge,
  ordersGauge,
  usersGauge,
  categoriesGauge
};
