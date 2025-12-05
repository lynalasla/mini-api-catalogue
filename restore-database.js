/**
 * Script de restauration de la base de données depuis Excel
 * Importe toutes les données depuis un fichier Excel de backup
 * Usage: node restore-database.js <chemin_vers_fichier.xlsx>
 */

const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function restoreDatabase(filepath) {
    console.log('🔄 Démarrage de la restauration de la base de données...');
    console.log(`📁 Fichier: ${filepath}`);

    if (!fs.existsSync(filepath)) {
        console.error('❌ Fichier non trouvé:', filepath);
        process.exit(1);
    }

    try {
        // Lire le fichier Excel
        const workbook = XLSX.readFile(filepath);

        // 1. Restaurer les catégories
        if (workbook.SheetNames.includes('Categories')) {
            console.log('\n📊 Restauration des catégories...');
            const categoriesSheet = workbook.Sheets['Categories'];
            const categories = XLSX.utils.sheet_to_json(categoriesSheet);
            
            for (const cat of categories) {
                await prisma.category.upsert({
                    where: { id: cat.id },
                    update: {
                        name: cat.name,
                        description: cat.description
                    },
                    create: {
                        id: cat.id,
                        name: cat.name,
                        description: cat.description
                    }
                });
            }
            console.log(`✅ ${categories.length} catégories restaurées`);
        }

        // 2. Restaurer les produits
        if (workbook.SheetNames.includes('Products')) {
            console.log('📊 Restauration des produits...');
            const productsSheet = workbook.Sheets['Products'];
            const products = XLSX.utils.sheet_to_json(productsSheet);
            
            for (const prod of products) {
                await prisma.product.upsert({
                    where: { id: prod.id },
                    update: {
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        stock: prod.stock,
                        image_url: prod.image_url,
                        category_id: prod.category_id
                    },
                    create: {
                        id: prod.id,
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        stock: prod.stock,
                        image_url: prod.image_url,
                        category_id: prod.category_id
                    }
                });
            }
            console.log(`✅ ${products.length} produits restaurés`);
        }

        // 3. Restaurer les utilisateurs (sans les mots de passe pour sécurité)
        if (workbook.SheetNames.includes('Users')) {
            console.log('📊 Restauration des utilisateurs...');
            const usersSheet = workbook.Sheets['Users'];
            const users = XLSX.utils.sheet_to_json(usersSheet);
            
            console.log('⚠️  Note: Les mots de passe ne sont pas restaurés pour des raisons de sécurité');
            console.log('   Les utilisateurs devront réinitialiser leur mot de passe');
            
            for (const user of users) {
                // Vérifier si l'utilisateur existe déjà
                const existing = await prisma.user.findUnique({
                    where: { id: user.id }
                });
                
                if (!existing) {
                    // Créer uniquement les nouveaux utilisateurs avec un mot de passe temporaire
                    await prisma.user.create({
                        data: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            password: 'RESET_PASSWORD_REQUIRED', // Mot de passe temporaire
                            role: user.role || 'user'
                        }
                    });
                }
            }
            console.log(`✅ ${users.length} utilisateurs traités`);
        }

        // 4. Restaurer les commandes
        if (workbook.SheetNames.includes('Orders')) {
            console.log('📊 Restauration des commandes...');
            const ordersSheet = workbook.Sheets['Orders'];
            const orders = XLSX.utils.sheet_to_json(ordersSheet);
            
            for (const order of orders) {
                await prisma.order.upsert({
                    where: { id: order.id },
                    update: {
                        user_id: order.user_id,
                        total: order.total,
                        status: order.status
                    },
                    create: {
                        id: order.id,
                        user_id: order.user_id,
                        total: order.total,
                        status: order.status
                    }
                });
            }
            console.log(`✅ ${orders.length} commandes restaurées`);
        }

        // 5. Restaurer les articles de commande
        if (workbook.SheetNames.includes('OrderItems')) {
            console.log('📊 Restauration des articles de commande...');
            const orderItemsSheet = workbook.Sheets['OrderItems'];
            const orderItems = XLSX.utils.sheet_to_json(orderItemsSheet);
            
            for (const item of orderItems) {
                await prisma.orderItem.upsert({
                    where: { id: item.id },
                    update: {
                        order_id: item.order_id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    },
                    create: {
                        id: item.id,
                        order_id: item.order_id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    }
                });
            }
            console.log(`✅ ${orderItems.length} articles de commande restaurés`);
        }

        // 6. Restaurer les paniers
        if (workbook.SheetNames.includes('CartItems')) {
            console.log('📊 Restauration des paniers...');
            const cartItemsSheet = workbook.Sheets['CartItems'];
            const cartItems = XLSX.utils.sheet_to_json(cartItemsSheet);
            
            for (const item of cartItems) {
                await prisma.cartItem.upsert({
                    where: { id: item.id },
                    update: {
                        user_id: item.user_id,
                        product_id: item.product_id,
                        quantity: item.quantity
                    },
                    create: {
                        id: item.id,
                        user_id: item.user_id,
                        product_id: item.product_id,
                        quantity: item.quantity
                    }
                });
            }
            console.log(`✅ ${cartItems.length} articles de panier restaurés`);
        }

        console.log('\n✅ Restauration terminée avec succès!');
        console.log('⚠️  N\'oubliez pas de demander aux utilisateurs de réinitialiser leurs mots de passe');

    } catch (error) {
        console.error('❌ Erreur lors de la restauration:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Vérifier les arguments
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: node restore-database.js <chemin_vers_fichier.xlsx>');
    console.log('Exemple: node restore-database.js backups/database_backup_2025-12-05T00-00-00.xlsx');
    process.exit(1);
}

const filepath = path.resolve(args[0]);
restoreDatabase(filepath);
