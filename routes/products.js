import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

/**
 * GET /api/products
 * Récupère tous les produits
 */
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image_url: p.imageUrl,
      category_id: p.categoryId,
      category_name: p.category?.name || null,
      created_at: p.createdAt,
      updated_at: p.updatedAt
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * POST /api/products
 * Crée un nouveau produit
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, stock } = req.body;
    
    if (!name || !price || !image_url) {
      return res.status(400).json({ error: 'Name, price, and image_url are required' });
    }
    
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        categoryId: category_id ? parseInt(category_id) : null,
        imageUrl: image_url,
        stock: stock || 0
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    const formattedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      stock: newProduct.stock,
      image_url: newProduct.imageUrl,
      category_id: newProduct.categoryId,
      category_name: newProduct.category?.name || null,
      created_at: newProduct.createdAt,
      updated_at: newProduct.updatedAt
    };
    
    res.status(201).json(formattedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id
 * Met à jour un produit
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, stock } = req.body;
    
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        categoryId: category_id ? parseInt(category_id) : null,
        imageUrl: image_url,
        stock: stock !== undefined ? parseInt(stock) : undefined
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    const formattedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      image_url: updatedProduct.imageUrl,
      category_id: updatedProduct.categoryId,
      category_name: updatedProduct.category?.name || null,
      created_at: updatedProduct.createdAt,
      updated_at: updatedProduct.updatedAt
    };
    
    res.json(formattedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * PATCH /api/products/:id/stock
 * Met à jour le stock d'un produit
 */
router.patch('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { stock: parseInt(stock) }
    });
    
    res.json({ id: parseInt(id), stock: updatedProduct.stock });
  } catch (error) {
    console.error('Error updating stock:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

/**
 * DELETE /api/products/:id
 * Supprime un produit
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
