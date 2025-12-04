import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'USER'
            }
        });

        // Créer un panier pour l'utilisateur
        await prisma.cart.create({
            data: {
                userId: user.id
            }
        });

        // Générer le token
        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        res.status(201).json({
            message: 'Inscription réussie',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

/**
 * POST /auth/login
 * Connexion d'un utilisateur
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer le token
        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Connexion réussie',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

/**
 * POST /auth/logout
 * Déconnexion
 */
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Déconnexion réussie' });
});

/**
 * GET /auth/me
 * Obtenir les informations de l'utilisateur connecté
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erreur récupération profil:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
    }
});

export default router;
