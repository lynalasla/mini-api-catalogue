import express from 'express';
import fs from 'fs';

const productRouter = express.Router();
const path = './data/products.json';

// Lire tous les produits
productRouter.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(path));
  res.json(products);
});

// Ajouter un produit
productRouter.post('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(path));
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    categoryId: req.body.categoryId
  };
  products.push(newProduct);
  fs.writeFileSync(path, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

// Mettre à jour un produit
productRouter.put('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(path));
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.name = req.body.name;
  product.price = req.body.price;
  product.categoryId = req.body.categoryId;
  fs.writeFileSync(path, JSON.stringify(products, null, 2));
  res.json(product);
});

// Supprimer un produit
productRouter.delete('/:id', (req, res) => {
  let products = JSON.parse(fs.readFileSync(path));
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  products = products.filter(p => p.id != req.params.id);
  fs.writeFileSync(path, JSON.stringify(products, null, 2));
  res.json({ message: 'Product deleted' });
});

export default productRouter;
