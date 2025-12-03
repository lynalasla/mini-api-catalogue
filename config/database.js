/**
 * Configuration de la connexion à la base de données MySQL
 * Utilise mysql2 avec support des Promises
 */

import mysql from 'mysql2';

// Configuration de la connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'catalogue_user',
  password: process.env.DB_PASSWORD || 'catalogue_password',
  database: process.env.DB_NAME || 'catalogue',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export du pool avec support des Promises
export default pool.promise();
