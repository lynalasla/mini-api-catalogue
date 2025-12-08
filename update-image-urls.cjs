/**
 * Script pour mettre à jour les URLs d'images dans la base de données
 * Remplace les URLs externes par les chemins locaux
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function updateImageUrls() {
    console.log('🔄 Mise à jour des URLs d\'images...\n');

    try {
        // Lire le dossier d'images
        const imagesDir = path.join(__dirname, 'client', 'public', 'images', 'products');
        
        if (!fs.existsSync(imagesDir)) {
            console.error('❌ Le dossier images n\'existe pas:', imagesDir);
            console.log('💡 Lancez d\'abord: ./download-images.sh');
            process.exit(1);
        }

        // Lister les fichiers d'images
        const imageFiles = fs.readdirSync(imagesDir)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

        console.log(`📊 ${imageFiles.length} images trouvées dans ${imagesDir}\n`);

        let updated = 0;
        let errors = 0;

        // Pour chaque image, extraire l'ID du produit et mettre à jour
        for (const filename of imageFiles) {
            // Format: product-{id}.{ext}
            const match = filename.match(/product-(\d+)\./);
            
            if (match) {
                const productId = parseInt(match[1]);
                const newUrl = `/images/products/${filename}`;

                try {
                    const product = await prisma.product.findUnique({
                        where: { id: productId }
                    });

                    if (product) {
                        await prisma.product.update({
                            where: { id: productId },
                            data: { imageUrl: newUrl }
                        });

                        console.log(`✅ Produit #${productId}: ${product.name}`);
                        console.log(`   Ancien: ${product.imageUrl || 'null'}`);
                        console.log(`   Nouveau: ${newUrl}\n`);
                        updated++;
                    } else {
                        console.warn(`⚠️  Produit #${productId} non trouvé (fichier: ${filename})\n`);
                        errors++;
                    }
                } catch (error) {
                    console.error(`❌ Erreur produit #${productId}:`, error.message);
                    errors++;
                }
            } else {
                console.warn(`⚠️  Nom de fichier invalide: ${filename} (format attendu: product-{id}.ext)\n`);
            }
        }

        console.log('\n================================================');
        console.log('✅ Mise à jour terminée!');
        console.log(`   - ${updated} produits mis à jour`);
        console.log(`   - ${errors} erreurs`);
        console.log('================================================\n');

        // Vérifier le résultat
        console.log('🔍 Vérification: Produits avec images locales\n');
        const localImages = await prisma.product.findMany({
            where: {
                imageUrl: {
                    startsWith: '/images/products/'
                }
            },
            select: {
                id: true,
                name: true,
                imageUrl: true
            }
        });

        console.log(`📊 ${localImages.length} produits utilisent maintenant des images locales\n`);
        
        if (localImages.length > 0) {
            console.log('Exemples:');
            localImages.slice(0, 5).forEach(p => {
                console.log(`  - #${p.id}: ${p.name} → ${p.imageUrl}`);
            });
        }

        console.log('\n✨ Vous pouvez maintenant tester sur http://localhost:5173');
        console.log('   Les images devraient s\'afficher même sans accès à Unsplash!\n');

    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

updateImageUrls();
