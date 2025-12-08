/**
 * Middleware Prometheus
 * Capture automatiquement les métriques HTTP
 */

import { 
  httpRequestDuration, 
  httpRequestTotal, 
  activeConnections 
} from './prometheus.js';

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path || 'unknown';
    const method = req.method;
    const statusCode = res.statusCode;

    // Record metrics
    httpRequestDuration.labels(method, route, statusCode).observe(duration);
    httpRequestTotal.labels(method, route, statusCode).inc();
    activeConnections.dec();
  });

  next();
};
