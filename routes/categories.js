/**
 * Module de gestion des routes pour les catégories
 * Fournit les endpoints CRUD pour gérer les catégories de produits avec MySQL
 */

// Importation des modules nécessaires
import express from 'express';
import db from '../config/database.js';

// Création du router Express pour les catégories
const categoriesRoutes = express.Router();

/**
 * GET /categories
 * Récupère la liste complète de toutes les catégories
 * @returns {Array} Liste des catégories au format JSON
 */
categoriesRoutes.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /categories
 * Crée une nouvelle catégorie
 * @body {string} name - Le nom de la catégorie à créer
 * @returns {Object} La catégorie créée avec son ID généré
 */
categoriesRoutes.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    
    const [result] = await db.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );
    
    const newCategory = {
      id: result.insertId,
      name: name
    };
    
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /categories/:id
 * Met à jour une catégorie existante
 * @param {number} id - L'ID de la catégorie à modifier
 * @body {string} name - Le nouveau nom de la catégorie
 * @returns {Object} La catégorie mise à jour ou une erreur 404
 */
categoriesRoutes.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    
    const [result] = await db.query(
      'UPDATE categories SET name = ? WHERE id = ?',
      [name, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ id: parseInt(id), name: name });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /categories/:id
 * Supprime une catégorie
 * @param {number} id - L'ID de la catégorie à supprimer
 * @returns {Object} Message de confirmation ou erreur 404
 */
categoriesRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Export du router pour utilisation dans server.js
export default categoriesRoutes;
