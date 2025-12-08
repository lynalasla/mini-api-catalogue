/**
 * Script de restauration de la base de données depuis Excel
 * Importe toutes les données depuis un fichier Excel de backup
 * Usage: node restore-database.cjs <chemin_vers_fichier.xlsx>
 */

const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function restoreDatabase(filepath) {
    console.log('🔄 Démarrage de la restauration de la base de données...');
    console.log(`📁 Fichier: ${filepath}`);

    if (!fs.existsSync(filepath)) {
        console.error('❌ Fichier non trouvé:', filepath);
        process.exit(1);
    }

    // Vérifier que le schéma est appliqué
    console.log('🔍 Vérification du schéma de la base de données...');
    try {
        // Test si la colonne description existe
        await prisma.category.findFirst();
    } catch (error) {
        if (error.code === 'P2022' || error.message.includes('description')) {
            console.error('\n❌ ERREUR: Le schéma Prisma n\'est pas appliqué à la base de données!');
            console.error('\n📋 Veuillez exécuter cette commande AVANT la restauration:');
            console.error('   npx prisma db push\n');
            console.error('💡 Cette commande va créer/mettre à jour les tables dans la base de données.');
            console.error('   Ensuite, relancez la restauration.\n');
            process.exit(1);
        }
        // Autre erreur, continuer
    }
    console.log('✅ Schéma vérifié\n');

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
                    const imageUrl = row.getCell(6).value;
                    products.push({
                        id: row.getCell(1).value,
                        name: row.getCell(2).value,
                        description: row.getCell(3).value,
                        price: parseFloat(row.getCell(4).value) || 0,
                        stock: parseInt(row.getCell(5).value) || 0,
                        imageUrl: imageUrl || undefined,
                        categoryId: parseInt(row.getCell(7).value)
                    });
                }
            });
            
            for (const prod of products) {
                const productData = {
                    name: prod.name,
                    description: prod.description,
                    price: prod.price,
                    stock: prod.stock,
                    categoryId: prod.categoryId
                };
                
                // Only add imageUrl if it exists
                if (prod.imageUrl) {
                    productData.imageUrl = prod.imageUrl;
                }
                
                await prisma.product.upsert({
                    where: { id: prod.id },
                    update: productData,
                    create: {
                        id: prod.id,
                        ...productData
                    }
                });
            }
            console.log(`✅ ${products.length} produits restaurés`);
        }

        // 3. Restaurer les utilisateurs avec mots de passe temporaires
        const usersSheet = workbook.getWorksheet('Users');
        const restoredUsers = [];
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
            
            console.log('🔑 Génération de mots de passe temporaires...');
            
            for (const user of users) {
                // Générer un mot de passe temporaire
                const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`;
                const hashedPassword = await bcrypt.hash(tempPassword, 10);
                
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
                            password: hashedPassword,
                            role: user.role || 'USER'
                        }
                    });
                } else {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            password: hashedPassword
                        }
                    });
                }
                
                restoredUsers.push({
                    email: user.email,
                    password: tempPassword,
                    role: user.role
                });
            }
            console.log(`✅ ${users.length} utilisateurs restaurés`);
        }

        // 4. Restaurer les commandes
        const ordersSheet = workbook.getWorksheet('Orders');
        if (ordersSheet) {
            console.log('📊 Restauration des commandes...');
            const orders = [];
            
            ordersSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    orders.push({
                        id: parseInt(row.getCell(1).value),
                        userId: parseInt(row.getCell(2).value),
                        total: parseFloat(row.getCell(6).value) || 0,
                        status: row.getCell(7).value || 'PENDING'
                    });
                }
            });
            
            for (const order of orders) {
                await prisma.order.upsert({
                    where: { id: order.id },
                    update: {
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
        
        if (restoredUsers.length > 0) {
            console.log('\n📋 INFORMATIONS DE CONNEXION:');
            console.log('═'.repeat(60));
            restoredUsers.forEach(user => {
                console.log(`\n👤 ${user.role === 'ADMIN' ? '🔐 ADMIN' : 'USER'}`);
                console.log(`   Email:    ${user.email}`);
                console.log(`   Password: ${user.password}`);
            });
            console.log('\n' + '═'.repeat(60));
            console.log('⚠️  IMPORTANT: Conservez ces mots de passe temporaires!');
            console.log('💡  Les utilisateurs peuvent les changer après connexion.');
        }

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
