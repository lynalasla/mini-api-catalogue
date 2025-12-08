import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin1234', 10);
        console.log('Hashed password:', hashedPassword);

        // Update admin user
        const admin = await prisma.user.upsert({
            where: { email: 'admin@catalogue.com' },
            update: {
                password: hashedPassword,
                role: 'ADMIN'
            },
            create: {
                email: 'admin@catalogue.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'Catalogue',
                role: 'ADMIN'
            }
        });

        console.log('Admin user fixed:', admin);
        console.log('Email: admin@catalogue.com');
        console.log('Password: admin1234');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixAdmin();
