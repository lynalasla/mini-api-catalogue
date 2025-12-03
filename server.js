import express from 'express';
import categoriesRoutes from './routes/categories.js';
import productRouter from './routes/products.js';

const app = express();
app.use(express.json());

// Route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur la mini API Catalogue !');
});

// Routes API
app.use('/categories', categoriesRoutes);
app.use('/products', productRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
