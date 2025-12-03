/**
 * Module de gestion des routes pour les produits
 * Fournit les endpoints CRUD pour gérer les produits du catalogue avec MySQL
 */

// Importation des modules nécessaires
import express from 'express';
import db from '../config/database.js';

// Création du router Express pour les produits
const productRouter = express.Router();

/**
 * GET /products
 * Récupère la liste complète de tous les produits
 * @returns {Array} Liste des produits au format JSON
 */
productRouter.get('/', async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /products
 * Crée un nouveau produit
 * @body {string} name - Le nom du produit
 * @body {number} price - Le prix du produit
 * @body {number} categoryId - L'ID de la catégorie du produit
 * @returns {Object} Le produit créé avec son ID généré
 */
productRouter.post('/', async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Le nom et le prix sont requis' });
    }
    
    const [result] = await db.query(
      'INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)',
      [name, price, categoryId || null]
    );
    
    const newProduct = {
      id: result.insertId,
      name: name,
      price: price,
      categoryId: categoryId || null
    };
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
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
productRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Le nom et le prix sont requis' });
    }
    
    const [result] = await db.query(
      'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?',
      [name, price, categoryId || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      id: parseInt(id),
      name: name,
      price: price,
      categoryId: categoryId || null
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /products/:id
 * Supprime un produit
 * @param {number} id - L'ID du produit à supprimer
 * @returns {Object} Message de confirmation ou erreur 404
 */
productRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Export du router pour utilisation dans server.js
export default productRouter;
