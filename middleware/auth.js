import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware pour vérifier le token JWT
 */
export const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
};

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
    }
    next();
};

/**
 * Générer un token JWT
 */
export const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user.id,
            id: user.id, 
            email: user.email, 
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};
