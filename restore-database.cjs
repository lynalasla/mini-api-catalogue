/**
 * Script de restauration de la base de données depuis Excel
 * Importe toutes les données depuis un fichier Excel de backup
 * Usage: node restore-database.cjs <chemin_vers_fichier.xlsx>
 */

const ExcelJS = require('exceljs');
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
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filepath);

        // 1. Restaurer les catégories
        const categoriesSheet = workbook.getWorksheet('Categories');
        if (categoriesSheet) {
            console.log('\n📊 Restauration des catégories...');
            const categories = [];
            
            categoriesSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { // Skip header
                    categories.push({
                        id: row.getCell(1).value,
                        name: row.getCell(2).value,
                        description: row.getCell(3).value
                    });
                }
            });
            
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
        const productsSheet = workbook.getWorksheet('Products');
        if (productsSheet) {
            console.log('📊 Restauration des produits...');
            const products = [];
            
            productsSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    products.push({
                        id: row.getCell(1).value,
                        name: row.getCell(2).value,
                        description: row.getCell(3).value,
                        price: row.getCell(4).value,
                        stock: row.getCell(5).value,
                        imageUrl: row.getCell(6).value,
                        categoryId: row.getCell(7).value
                    });
                }
            });
            
            for (const prod of products) {
                await prisma.product.upsert({
                    where: { id: prod.id },
                    update: {
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        stock: prod.stock,
                        imageUrl: prod.imageUrl,
                        categoryId: prod.categoryId
                    },
                    create: {
                        id: prod.id,
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        stock: prod.stock,
                        imageUrl: prod.imageUrl,
                        categoryId: prod.categoryId
                    }
                });
            }
            console.log(`✅ ${products.length} produits restaurés`);
        }

        // 3. Restaurer les utilisateurs (sans les mots de passe)
        const usersSheet = workbook.getWorksheet('Users');
        if (usersSheet) {
            console.log('📊 Restauration des utilisateurs...');
            const users = [];
            
            usersSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    users.push({
                        id: row.getCell(1).value,
                        email: row.getCell(2).value,
                        firstName: row.getCell(3).value,
                        lastName: row.getCell(4).value,
                        role: row.getCell(5).value
                    });
                }
            });
            
            console.log('⚠️  Note: Les mots de passe ne sont pas restaurés pour des raisons de sécurité');
            console.log('   Les utilisateurs devront réinitialiser leur mot de passe');
            
            for (const user of users) {
                // Vérifier si l'utilisateur existe déjà
                const existing = await prisma.user.findUnique({
                    where: { id: user.id }
                });
                
                if (!existing) {
                    await prisma.user.create({
                        data: {
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            password: 'RESET_PASSWORD_REQUIRED',
                            role: user.role || 'USER'
                        }
                    });
                }
            }
            console.log(`✅ ${users.length} utilisateurs traités`);
        }

        // 4. Restaurer les commandes
        const ordersSheet = workbook.getWorksheet('Orders');
        if (ordersSheet) {
            console.log('📊 Restauration des commandes...');
            const orders = [];
            
            ordersSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    orders.push({
                        id: row.getCell(1).value,
                        userId: row.getCell(2).value,
                        total: row.getCell(6).value,
                        status: row.getCell(7).value
                    });
                }
            });
            
            for (const order of orders) {
                await prisma.order.upsert({
                    where: { id: order.id },
                    update: {
                        userId: order.userId,
                        total: order.total,
                        status: order.status
                    },
                    create: {
                        id: order.id,
                        userId: order.userId,
                        total: order.total,
                        status: order.status
                    }
                });
            }
            console.log(`✅ ${orders.length} commandes restaurées`);
        }

        // 5. Restaurer les articles de commande
        const orderItemsSheet = workbook.getWorksheet('OrderItems');
        if (orderItemsSheet) {
            console.log('📊 Restauration des articles de commande...');
            const orderItems = [];
            
            orderItemsSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    orderItems.push({
                        id: row.getCell(1).value,
                        orderId: row.getCell(2).value,
                        productId: row.getCell(3).value,
                        quantity: row.getCell(5).value,
                        price: row.getCell(6).value
                    });
                }
            });
            
            for (const item of orderItems) {
                await prisma.orderItem.upsert({
                    where: { id: item.id },
                    update: {
                        orderId: item.orderId,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    },
                    create: {
                        id: item.id,
                        orderId: item.orderId,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }
                });
            }
            console.log(`✅ ${orderItems.length} articles de commande restaurés`);
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
    console.log('Usage: node restore-database.cjs <chemin_vers_fichier.xlsx>');
    console.log('Exemple: node restore-database.cjs backups/database_backup_2025-12-05T00-00-00.xlsx');
    process.exit(1);
}

const filepath = path.resolve(args[0]);
restoreDatabase(filepath);
