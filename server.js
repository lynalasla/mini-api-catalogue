/**
 * Fichier principal du serveur Express
 * Gère la configuration de l'application et l'initialisation des routes
 */

// Importation des modules nécessaires
import express from 'express';
import categoriesRoutes from './routes/categories.js';
import productRouter from './routes/products.js';

// Initialisation de l'application Express
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

/**
 * Route racine de l'API
 * GET /
 * Retourne un message de bienvenue
 */
app.get('/', (req, res) => {
  res.send('Bienvenue sur la mini API Catalogue !');
});

/**
 * Montage des routes de l'API
 * - /categories : Gestion des catégories de produits
 * - /products : Gestion des produits
 */
app.use('/categories', categoriesRoutes);
app.use('/products', productRouter);

// Définition du port d'écoute
const PORT = 3000;

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
