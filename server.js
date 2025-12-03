const express = require('express');
const app = express();

const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');

app.use(express.json());

app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
