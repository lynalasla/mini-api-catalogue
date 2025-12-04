import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Démarrage du seed...');

    // Créer un admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@catalogue.com' },
        update: {},
        create: {
            email: 'admin@catalogue.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'Catalogue',
            role: 'ADMIN'
        }
    });
    console.log('✅ Admin créé:', admin.email);

    // Créer un utilisateur normal
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@catalogue.com' },
        update: {},
        create: {
            email: 'user@catalogue.com',
            password: userPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: 'USER',
            cart: {
                create: {}
            }
        }
    });
    console.log('✅ Utilisateur créé:', user.email);

    // Créer le panier pour l'admin si nécessaire
    const adminCart = await prisma.cart.findUnique({
        where: { userId: admin.id }
    });
    if (!adminCart) {
        await prisma.cart.create({
            data: { userId: admin.id }
        });
        console.log('✅ Panier admin créé');
    }

    console.log('\n📝 Identifiants de connexion:');
    console.log('Admin: admin@catalogue.com / admin123');
    console.log('User: user@catalogue.com / user123');
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
