/**
 * Module de gestion des routes pour les produits
 * Fournit les endpoints CRUD pour gérer les produits du catalogue
 */

// Importation des modules nécessaires
import express from 'express';
import fs from 'fs';

// Création du router Express pour les produits
const productRouter = express.Router();

// Chemin vers le fichier JSON contenant les produits
const path = './data/products.json';

/**
 * GET /products
 * Récupère la liste complète de tous les produits
 * @returns {Array} Liste des produits au format JSON
 */
productRouter.get('/', (req, res) => {
  // Lecture du fichier JSON contenant les produits
  const products = JSON.parse(fs.readFileSync(path));
  // Envoi de la réponse avec tous les produits
  res.json(products);
});

/**
 * POST /products
 * Crée un nouveau produit
 * @body {string} name - Le nom du produit
 * @body {number} price - Le prix du produit
 * @body {number} categoryId - L'ID de la catégorie du produit
 * @returns {Object} Le produit créé avec son ID généré
 */
productRouter.post('/', (req, res) => {
  // Lecture des produits existants
  const products = JSON.parse(fs.readFileSync(path));
  
  // Création d'un nouveau produit avec un ID auto-incrémenté
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    categoryId: req.body.categoryId
  };
  
  // Ajout du nouveau produit au tableau
  products.push(newProduct);
  
  // Sauvegarde dans le fichier JSON avec indentation
  fs.writeFileSync(path, JSON.stringify(products, null, 2));
  
  // Réponse avec le code 201 (Created) et le produit créé
  res.status(201).json(newProduct);
});

/**
 * PUT /products/:id
 * Met à jour un produit existant
 * @param {number} id - L'ID du produit à modifier
 * @body {string} name - Le nouveau nom du produit
 * @body {number} price - Le nouveau prix du produit
 * @body {number} categoryId - Le nouvel ID de catégorie du produit
 * @returns {Object} Le produit mis à jour ou une erreur 404
 */
productRouter.put('/:id', (req, res) => {
  // Lecture des produits existants
  const products = JSON.parse(fs.readFileSync(path));
  
  // Recherche du produit par ID
  const product = products.find(p => p.id == req.params.id);
  
  // Vérification de l'existence du produit
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  // Mise à jour des propriétés du produit
  product.name = req.body.name;
  product.price = req.body.price;
  product.categoryId = req.body.categoryId;
  
  // Sauvegarde des modifications dans le fichier
  fs.writeFileSync(path, JSON.stringify(products, null, 2));
  
  // Réponse avec le produit mis à jour
  res.json(product);
});

/**
 * DELETE /products/:id
 * Supprime un produit
 * @param {number} id - L'ID du produit à supprimer
 * @returns {Object} Message de confirmation ou erreur 404
 */
productRouter.delete('/:id', (req, res) => {
  // Lecture des produits existants
  let products = JSON.parse(fs.readFileSync(path));
  
  // Recherche du produit à supprimer
  const product = products.find(p => p.id == req.params.id);
  
  // Vérification de l'existence du produit
  if (!product) return res.status(404).json({ error: 'Product not found' });
  
  // Filtrage pour retirer le produit du tableau
  products = products.filter(p => p.id != req.params.id);
  
  // Sauvegarde du tableau mis à jour
  fs.writeFileSync(path, JSON.stringify(products, null, 2));
  
  // Réponse avec message de confirmation
  res.json({ message: 'Product deleted' });
});

// Export du router pour utilisation dans server.js
export default productRouter;
