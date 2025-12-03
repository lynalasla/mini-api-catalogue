import express from 'express';
import fs from 'fs';

const categoriesRoutes = express.Router();
const path = './data/categories.json';

// Lire toutes les catégories
categoriesRoutes.get('/', (req, res) => {
  const categories = JSON.parse(fs.readFileSync(path));
  res.json(categories);
});

// Ajouter une catégorie
categoriesRoutes.post('/', (req, res) => {
  const categories = JSON.parse(fs.readFileSync(path));
  const newCategory = {
    id: categories.length + 1,
    name: req.body.name
  };
  categories.push(newCategory);
  fs.writeFileSync(path, JSON.stringify(categories, null, 2));
  res.status(201).json(newCategory);
});

// Mettre à jour une catégorie
categoriesRoutes.put('/:id', (req, res) => {
  const categories = JSON.parse(fs.readFileSync(path));
  const category = categories.find(c => c.id == req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  category.name = req.body.name;
  fs.writeFileSync(path, JSON.stringify(categories, null, 2));
  res.json(category);
});

// Supprimer une catégorie
categoriesRoutes.delete('/:id', (req, res) => {
  let categories = JSON.parse(fs.readFileSync(path));
  const category = categories.find(c => c.id == req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  categories = categories.filter(c => c.id != req.params.id);
  fs.writeFileSync(path, JSON.stringify(categories, null, 2));
  res.json({ message: 'Category deleted' });
});

export default categoriesRoutes;
