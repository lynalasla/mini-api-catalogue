/**
 * Script de sauvegarde de la base de données vers Excel
 * Exporte toutes les tables (users, products, categories, orders, order_items, cart_items)
 * Usage: node backup-database.cjs
 */

const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupDatabase() {
    console.log('🔄 Démarrage de la sauvegarde de la base de données...');
    
    try {
        // Créer le dossier backups s'il n'existe pas
        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
            console.log('📁 Dossier backups créé');
        }

        // Créer un nouveau workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Mini API Catalogue';
        workbook.created = new Date();

        // 1. Exporter les utilisateurs
        console.log('📊 Export des utilisateurs...');
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        
        const usersSheet = workbook.addWorksheet('Users');
        usersSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'First Name', key: 'firstName', width: 20 },
            { header: 'Last Name', key: 'lastName', width: 20 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 }
        ];
        usersSheet.addRows(users);
        usersSheet.getRow(1).font = { bold: true };
        console.log(`✅ ${users.length} utilisateurs exportés`);

        // 2. Exporter les catégories
        console.log('📊 Export des catégories...');
        const categories = await prisma.category.findMany();
        
        const categoriesSheet = workbook.addWorksheet('Categories');
        categoriesSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 }
        ];
        categoriesSheet.addRows(categories);
        categoriesSheet.getRow(1).font = { bold: true };
        console.log(`✅ ${categories.length} catégories exportées`);

        // 3. Exporter les produits
        console.log('📊 Export des produits...');
        const products = await prisma.product.findMany({
            include: {
                category: {
                    select: { name: true }
                }
            }
        });
        
        const productsData = products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            stock: p.stock,
            imageUrl: p.imageUrl,
            categoryId: p.categoryId,
            categoryName: p.category?.name,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
        }));
        
        const productsSheet = workbook.addWorksheet('Products');
        productsSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Stock', key: 'stock', width: 10 },
            { header: 'Image URL', key: 'imageUrl', width: 40 },
            { header: 'Category ID', key: 'categoryId', width: 15 },
            { header: 'Category Name', key: 'categoryName', width: 25 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 }
        ];
        productsSheet.addRows(productsData);
        productsSheet.getRow(1).font = { bold: true };
        console.log(`✅ ${products.length} produits exportés`);

        // 4. Exporter les commandes
        console.log('📊 Export des commandes...');
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: { email: true, firstName: true, lastName: true }
                }
            }
        });
        
        const ordersData = orders.map(o => ({
            id: o.id,
            userId: o.userId,
            userEmail: o.user?.email,
            userFirstName: o.user?.firstName,
            userLastName: o.user?.lastName,
            total: Number(o.total),
            status: o.status,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt
        }));
        
        const ordersSheet = workbook.addWorksheet('Orders');
        ordersSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'User ID', key: 'userId', width: 10 },
            { header: 'User Email', key: 'userEmail', width: 30 },
            { header: 'First Name', key: 'userFirstName', width: 20 },
            { header: 'Last Name', key: 'userLastName', width: 20 },
            { header: 'Total', key: 'total', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 }
        ];
        ordersSheet.addRows(ordersData);
        ordersSheet.getRow(1).font = { bold: true };
        console.log(`✅ ${orders.length} commandes exportées`);

        // 5. Exporter les articles de commande
        console.log('📊 Export des articles de commande...');
        const orderItems = await prisma.orderItem.findMany({
            include: {
                product: {
                    select: { name: true }
                }
            }
        });
        
        const orderItemsData = orderItems.map(item => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            productName: item.product?.name,
            quantity: item.quantity,
            price: Number(item.price),
            createdAt: item.createdAt
        }));
        
        const orderItemsSheet = workbook.addWorksheet('OrderItems');
        orderItemsSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Order ID', key: 'orderId', width: 10 },
            { header: 'Product ID', key: 'productId', width: 10 },
            { header: 'Product Name', key: 'productName', width: 30 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 }
        ];
        orderItemsSheet.addRows(orderItemsData);
        orderItemsSheet.getRow(1).font = { bold: true };
        console.log(`✅ ${orderItems.length} articles de commande exportés`);

        // 6. Exporter les paniers
        console.log('📊 Export des paniers...');
        const cartItems = await prisma.cartItem.findMany({
            include: {
                cart: {
                    include: {
                        user: {
                            select: { email: true }
                        }
                    }
                },
                product: {
                    select: { name: true, price: true }
                }
            }
        });
        
        const cartItemsData = cartItems.map(item => ({
            id: item.id,
            cartId: item.cartId,
            userEmail: item.cart?.user?.email,
            productId: item.productId,
            productName: item.product?.name,
            productPrice: Number(item.product?.price),
            quantity: item.quantity,
            createdAt: item.createdAt
        }));
        
        const cartItemsSheet = workbook.addWorksheet('CartItems');
        cartItemsSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Cart ID', key: 'cartId', width: 10 },
            { header: 'User Email', key: 'userEmail', width: 30 },
            { header: 'Product ID', key: 'productId', width: 10 },
            { header: 'Product Name', key: 'productName', width: 30 },
            { header: 'Product Price', key: 'productPrice', width: 15 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Created At', key: 'createdAt', width: 20 }
        ];
        cartItemsSheet.addRows(cartItemsData);
        cartItemsSheet.getRow(1).font = { bold: true };
        console.log(`✅ ${cartItems.length} articles de panier exportés`);

        // Générer le nom du fichier avec la date
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `database_backup_${timestamp}.xlsx`;
        const filepath = path.join(backupDir, filename);

        // Écrire le fichier Excel
        await workbook.xlsx.writeFile(filepath);

        console.log('\n✅ Sauvegarde terminée avec succès!');
        console.log(`📁 Fichier: ${filepath}`);
        console.log('\n📊 Résumé:');
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Products: ${products.length}`);
        console.log(`   - Orders: ${orders.length}`);
        console.log(`   - Order Items: ${orderItems.length}`);
        console.log(`   - Cart Items: ${cartItems.length}`);

    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Exécuter la sauvegarde
backupDatabase();
