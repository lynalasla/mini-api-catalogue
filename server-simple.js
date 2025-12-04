/**
 * Serveur Express simplifié pour tester l'API users
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key-change-in-production';
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Route de test
app.get('/health', (req, res) => {
  console.log('Health check called');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route de connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user.id, id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log('Login successful for:', email);
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Route pour récupérer tous les utilisateurs (admin seulement)
app.get('/api/users', async (req, res) => {
  try {
    console.log('GET /api/users called');
    console.log('Cookies:', req.cookies);
    
    const token = req.cookies.token;
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', { userId: decoded.userId || decoded.id, role: decoded.role });
    
    const userId = decoded.userId || decoded.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    if (!user) {
      console.log('User not found in DB');
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (user.role !== 'ADMIN') {
      console.log('User is not admin:', user.role);
      return res.status(403).json({ error: 'Admin access required' });
    }

    console.log('Fetching all users from database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Found', users.length, 'users');
    res.json(users);
  } catch (error) {
    console.error('Error in /api/users:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Route pour tester Prisma directement
app.get('/api/test/db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const count = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    res.json({ 
      status: 'Database OK', 
      userCount: count,
      users: users
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET  /health');
  console.log('  GET  /api/test/db');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/users');
  console.log('='.repeat(50));
});
