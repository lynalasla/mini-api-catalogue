/**
 * Module de gestion des routes pour les catégories
 * Fournit les endpoints CRUD pour gérer les catégories de produits
 */

// Importation des modules nécessaires
import express from 'express';
import fs from 'fs';

// Création du router Express pour les catégories
const categoriesRoutes = express.Router();

// Chemin vers le fichier JSON contenant les catégories
const path = './data/categories.json';

/**
 * GET /categories
 * Récupère la liste complète de toutes les catégories
 * @returns {Array} Liste des catégories au format JSON
 */
categoriesRoutes.get('/', (req, res) => {
  // Lecture du fichier JSON
  const categories = JSON.parse(fs.readFileSync(path));
  // Envoi de la réponse avec toutes les catégories
  res.json(categories);
});

/**
 * POST /categories
 * Crée une nouvelle catégorie
 * @body {string} name - Le nom de la catégorie à créer
 * @returns {Object} La catégorie créée avec son ID généré
 */
categoriesRoutes.post('/', (req, res) => {
  // Lecture des catégories existantes
  const categories = JSON.parse(fs.readFileSync(path));
  
  // Création d'une nouvelle catégorie avec un ID auto-incrémenté
  const newCategory = {
    id: categories.length + 1,
    name: req.body.name
  };
  
  // Ajout de la nouvelle catégorie au tableau
  categories.push(newCategory);
  
  // Sauvegarde dans le fichier JSON avec indentation
  fs.writeFileSync(path, JSON.stringify(categories, null, 2));
  
  // Réponse avec le code 201 (Created) et la catégorie créée
  res.status(201).json(newCategory);
});

/**
 * PUT /categories/:id
 * Met à jour une catégorie existante
 * @param {number} id - L'ID de la catégorie à modifier
 * @body {string} name - Le nouveau nom de la catégorie
 * @returns {Object} La catégorie mise à jour ou une erreur 404
 */
categoriesRoutes.put('/:id', (req, res) => {
  // Lecture des catégories existantes
  const categories = JSON.parse(fs.readFileSync(path));
  
  // Recherche de la catégorie par ID
  const category = categories.find(c => c.id == req.params.id);
  
  // Vérification de l'existence de la catégorie
  if (!category) return res.status(404).json({ error: 'Category not found' });
  
  // Mise à jour du nom de la catégorie
  category.name = req.body.name;
  
  // Sauvegarde des modifications dans le fichier
  fs.writeFileSync(path, JSON.stringify(categories, null, 2));
  
  // Réponse avec la catégorie mise à jour
  res.json(category);
});

/**
 * DELETE /categories/:id
 * Supprime une catégorie
 * @param {number} id - L'ID de la catégorie à supprimer
 * @returns {Object} Message de confirmation ou erreur 404
 */
categoriesRoutes.delete('/:id', (req, res) => {
  // Lecture des catégories existantes
  let categories = JSON.parse(fs.readFileSync(path));
  
  // Recherche de la catégorie à supprimer
  const category = categories.find(c => c.id == req.params.id);
  
  // Vérification de l'existence de la catégorie
  if (!category) return res.status(404).json({ error: 'Category not found' });
  
  // Filtrage pour retirer la catégorie du tableau
  categories = categories.filter(c => c.id != req.params.id);
  
  // Sauvegarde du tableau mis à jour
  fs.writeFileSync(path, JSON.stringify(categories, null, 2));
  
  // Réponse avec message de confirmation
  res.json({ message: 'Category deleted' });
});

// Export du router pour utilisation dans server.js
export default categoriesRoutes;
