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
 */
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

// Définition du port d'écoute
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
