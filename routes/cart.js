import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /cart
 * Récupérer le panier de l'utilisateur connecté
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        // Calculer le total
        const total = cart.items.reduce((sum, item) => {
            return sum + (parseFloat(item.product.price) * item.quantity);
        }, 0);

        res.json({
            ...cart,
            total: total.toFixed(2)
        });
    } catch (error) {
        console.error('Erreur récupération panier:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
});

/**
 * POST /cart/items
 * Ajouter un produit au panier
 */
router.post('/items', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Vérifier que le produit existe et qu'il y a du stock
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuffisant' });
        }

        // Récupérer le panier
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user.id }
        });

        // Si le panier n'existe pas, le créer
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id }
            });
        }

        // Vérifier si le produit est déjà dans le panier
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId)
                }
            }
        });

        let cartItem;
        if (existingItem) {
            // Mettre à jour la quantité
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ message: 'Stock insuffisant' });
            }
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
                include: { product: true }
            });
        } else {
            // Ajouter le produit au panier
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: parseInt(productId),
                    quantity
                },
                include: { product: true }
            });
        }

        res.status(201).json(cartItem);
    } catch (error) {
        console.error('Erreur ajout au panier:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout au panier' });
    }
});

/**
 * PUT /cart/items/:id
 * Modifier la quantité d'un article du panier
 */
router.put('/items/:id', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        const itemId = parseInt(req.params.id);

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { 
                cart: true,
                product: true 
            }
        });

        if (!cartItem || cartItem.cart.userId !== req.user.id) {
            return res.status(404).json({ message: 'Article non trouvé dans votre panier' });
        }

        if (cartItem.product.stock < quantity) {
            return res.status(400).json({ message: 'Stock insuffisant' });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: true }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Erreur modification panier:', error);
        res.status(500).json({ message: 'Erreur lors de la modification' });
    }
});

/**
 * DELETE /cart/items/:id
 * Supprimer un article du panier
 */
router.delete('/items/:id', authenticateToken, async (req, res) => {
    try {
        const itemId = parseInt(req.params.id);

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== req.user.id) {
            return res.status(404).json({ message: 'Article non trouvé dans votre panier' });
        }

        await prisma.cartItem.delete({
            where: { id: itemId }
        });

        res.json({ message: 'Article retiré du panier' });
    } catch (error) {
        console.error('Erreur suppression article:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
});

/**
 * DELETE /cart
 * Vider le panier
 */
router.delete('/', authenticateToken, async (req, res) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id }
        });

        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        res.json({ message: 'Panier vidé' });
    } catch (error) {
        console.error('Erreur vidage panier:', error);
        res.status(500).json({ message: 'Erreur lors du vidage du panier' });
    }
});

export default router;
