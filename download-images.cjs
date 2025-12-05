/**
 * Script pour télécharger toutes les images externes localement
 * Version Node.js (pas besoin de jq)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Créer le dossier d'images
const imagesDir = path.join(__dirname, 'client', 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 Dossier créé:', imagesDir);
}

// Fonction pour télécharger une image
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        const file = fs.createWriteStream(filepath);
        
        client.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(true);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                // Suivre la redirection
                file.close();
                fs.unlinkSync(filepath);
                downloadImage(response.headers.location, filepath)
                    .then(resolve)
                    .catch(reject);
            } else {
                file.close();
                fs.unlinkSync(filepath);
                reject(new Error(`Status code: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            file.close();
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
            reject(err);
        });
    });
}

async function downloadAllImages() {
    console.log('================================================');
    console.log('  📥 Téléchargement des Images Localement');
    console.log('================================================\n');

    try {
        // Récupérer tous les produits
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                imageUrl: true
            },
            orderBy: {
                id: 'asc'
            }
        });

        console.log(`📊 ${products.length} produits trouvés\n`);

        let downloaded = 0;
        let skipped = 0;
        let errors = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const num = i + 1;

            console.log(`[${num}/${products.length}] ${product.name} (ID: ${product.id})`);

            if (!product.imageUrl) {
                console.log('  ⚠️  Pas d\'URL d\'image\n');
                skipped++;
                continue;
            }

            // Si déjà en local, skip
            if (product.imageUrl.startsWith('/images/products/')) {
                console.log('  ✅ Déjà local:', product.imageUrl, '\n');
                skipped++;
                continue;
            }

            // Déterminer l'extension
            let ext = 'jpg';
            if (product.imageUrl.includes('.png')) {
                ext = 'png';
            } else if (product.imageUrl.includes('.webp')) {
                ext = 'webp';
            }

            const filename = `product-${product.id}.${ext}`;
            const filepath = path.join(imagesDir, filename);

            // Si le fichier existe déjà, skip
            if (fs.existsSync(filepath)) {
                console.log(`  ✅ Déjà téléchargé: ${filename}\n`);
                downloaded++;
                continue;
            }

            // Télécharger
            try {
                await downloadImage(product.imageUrl, filepath);
                console.log(`  ✅ Téléchargé: ${filename}`);
                
                // Vérifier la taille du fichier
                const stats = fs.statSync(filepath);
                console.log(`     Taille: ${(stats.size / 1024).toFixed(2)} KB\n`);
                
                downloaded++;
            } catch (error) {
                console.error(`  ❌ Erreur: ${error.message}`);
                console.error(`     URL: ${product.imageUrl}\n`);
                errors++;
            }

            // Petit délai pour ne pas surcharger
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log('================================================');
        console.log('✅ Téléchargement terminé!\n');
        console.log('📊 Statistiques:');
        console.log(`   - Téléchargés: ${downloaded}`);
        console.log(`   - Ignorés (déjà local): ${skipped}`);
        console.log(`   - Erreurs: ${errors}`);
        console.log(`   - Total: ${products.length}\n`);

        // Lister les fichiers téléchargés
        const files = fs.readdirSync(imagesDir)
            .filter(f => /\.(jpg|png|webp)$/i.test(f));
        
        console.log(`📁 Fichiers dans ${imagesDir}:`);
        console.log(`   ${files.length} images\n`);

        if (files.length > 0) {
            console.log('🔄 Prochaine étape: Mettre à jour les URLs');
            console.log('   node update-image-urls.cjs\n');
        }

        console.log('================================================');

    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

downloadAllImages();
