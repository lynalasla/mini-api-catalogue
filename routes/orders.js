import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /orders
 * Récupérer les commandes de l'utilisateur connecté
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('Erreur récupération commandes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
});

/**
 * GET /orders/:id
 * Récupérer une commande spécifique
 */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Vérifier que l'utilisateur a le droit d'accéder à cette commande
        if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        res.json(order);
    } catch (error) {
        console.error('Erreur récupération commande:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
    }
});

/**
 * POST /orders
 * Créer une nouvelle commande à partir du panier
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Récupérer le panier avec les articles
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Votre panier est vide' });
        }

        // Vérifier le stock pour chaque produit
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuffisant pour ${item.product.name}` 
                });
            }
        }

        // Calculer le total
        const total = cart.items.reduce((sum, item) => {
            return sum + (parseFloat(item.product.price) * item.quantity);
        }, 0);

        // Créer la commande avec transaction
        const order = await prisma.$transaction(async (tx) => {
            // Créer la commande
            const newOrder = await tx.order.create({
                data: {
                    userId: req.user.id,
                    total,
                    status: 'PENDING',
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price
                        }))
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            // Mettre à jour le stock
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            // Vider le panier
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return newOrder;
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Erreur création commande:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
});

/**
 * GET /orders/admin/all
 * Récupérer toutes les commandes (admin uniquement)
 */
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error('Erreur récupération commandes admin:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
});

/**
 * PATCH /orders/:id/status
 * Mettre à jour le statut d'une commande (admin uniquement)
 */
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const { status } = req.body;

        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Statut invalide',
                validStatuses 
            });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        res.json(order);
    } catch (error) {
        console.error('Erreur mise à jour statut:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
});

export default router;
