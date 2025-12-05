# 🖼️ Troubleshooting - Images ne s'affichent pas

## 🔍 Diagnostic Rapide

Si les images des produits ne s'affichent pas, suivez ces étapes :

### Étape 1 : Vérifier la console du navigateur

1. Ouvrir les **DevTools** (F12)
2. Aller dans l'onglet **Console**
3. Chercher des erreurs comme :
   - `Failed to load resource`
   - `CORS policy`
   - `net::ERR_INTERNET_DISCONNECTED`
   - `Mixed Content`

### Étape 2 : Vérifier l'URL des images dans l'API

```bash
# Tester l'API et vérifier les URLs d'images
curl http://localhost:3000/api/products | grep image_url

# Vous devriez voir des URLs comme :
# "image_url":"https://images.unsplash.com/photo-xxxxx"
```

### Étape 3 : Tester une image directement

Copiez une URL d'image depuis l'API et collez-la dans votre navigateur :
```
https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400
```

Si l'image ne charge pas, c'est un **problème réseau**.

---

## ❌ Problèmes Courants et Solutions

### Problème 1 : Pas d'accès internet ou Unsplash bloqué

**Symptômes :**
- Les images ne chargent pas
- Console affiche : `net::ERR_INTERNET_DISCONNECTED` ou `Failed to load resource`

**Cause :**
- Firewall d'entreprise bloque Unsplash
- Pas de connexion internet
- VPN ou proxy interfère

**Solutions :**

**Option A : Vérifier la connexion**
```bash
# Tester si Unsplash est accessible
ping images.unsplash.com

# Ou avec curl
curl -I https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400
```

**Option B : Utiliser un proxy ou VPN**
Si Unsplash est bloqué par le firewall d'entreprise

**Option C : Utiliser des images locales (RECOMMANDÉ)**
Voir section "Migration vers images locales" ci-dessous

---

### Problème 2 : Erreur CORS

**Symptômes :**
- Console affiche : `CORS policy: No 'Access-Control-Allow-Origin' header`

**Cause :**
Le serveur backend ne permet pas les requêtes cross-origin

**Solution :**

Vérifier que CORS est activé dans `server.js` :

```javascript
// Devrait être présent dans server.js
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

Si manquant, ajouter et redémarrer :
```bash
npm install cors
docker-compose restart mini-api-catalogue
```

---

### Problème 3 : Mixed Content (HTTP/HTTPS)

**Symptômes :**
- Console affiche : `Mixed Content: The page was loaded over HTTPS, but requested an insecure resource`

**Cause :**
Le site est en HTTPS mais les images sont en HTTP

**Solution :**
Toutes nos images Unsplash utilisent déjà HTTPS, donc ce problème ne devrait pas arriver.
Si vous avez des images custom, assurez-vous qu'elles sont en HTTPS.

---

### Problème 4 : URLs d'images manquantes ou nulles

**Symptômes :**
- Certaines images s'affichent, d'autres non
- Console affiche : Image src is null

**Solution :**

Vérifier la base de données :
```bash
npx prisma studio
# Aller dans Products
# Vérifier que image_url n'est pas NULL
```

Ou via API :
```bash
curl http://localhost:3000/api/products | grep -E "image_url.*null"
```

Si des produits ont `image_url: null`, les mettre à jour :
```bash
npx prisma studio
# Éditer chaque produit et ajouter une URL valide
```

---

## ✅ Solution Définitive : Migration vers Images Locales

Pour éviter les problèmes de réseau, utilisez des images hébergées localement :

### Étape 1 : Créer le dossier public

```bash
mkdir -p client/public/images/products
```

### Étape 2 : Télécharger des images

Téléchargez des images et placez-les dans `client/public/images/products/`

Exemple :
```
client/public/images/products/
├── jacket.jpg
├── hat.jpg
├── camera-bag.jpg
├── heels.jpg
└── ...
```

### Étape 3 : Mettre à jour les URLs dans la base de données

```sql
-- Via phpMyAdmin (http://localhost:8080) ou Prisma Studio

UPDATE products SET image_url = '/images/products/jacket.jpg' WHERE id = 1;
UPDATE products SET image_url = '/images/products/hat.jpg' WHERE id = 2;
-- etc...
```

### Étape 4 : Mettre à jour le seed.js

```javascript
// Dans prisma/seed.js, remplacer les URLs Unsplash par :
imageUrl: '/images/products/product-1.jpg'
```

---

## 🔧 Utiliser le Composant ProductImage (Avec Fallback)

Un nouveau composant `ProductImage` a été créé avec gestion d'erreurs.

### Utilisation :

```jsx
import ProductImage from '../components/ProductImage';

// Au lieu de :
<img src={product.image_url} alt={product.name} />

// Utiliser :
<ProductImage src={product.image_url} alt={product.name} />
```

**Avantages :**
- ✅ Affiche un placeholder si l'image ne charge pas
- ✅ Gère les erreurs de chargement
- ✅ Skeleton loader pendant le chargement
- ✅ Lazy loading pour performance

---

## 📊 Checklist de Vérification

Après restauration, vérifier :

- [ ] API renvoie des URLs d'images : `curl http://localhost:3000/api/products | grep image_url`
- [ ] Les URLs sont valides (HTTPS, accessibles)
- [ ] Aucune erreur CORS dans la console
- [ ] Connexion internet fonctionne
- [ ] Images Unsplash accessibles : `curl -I https://images.unsplash.com`
- [ ] DevTools ne montrent pas d'erreurs de chargement

---

## 🆘 Commandes de Diagnostic

```bash
# Vérifier les URLs d'images dans la base
curl -s http://localhost:3000/api/products | jq '.[].image_url'

# Tester une URL Unsplash
curl -I https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400

# Vérifier les logs de l'API
docker logs mini-api-catalogue --tail 50

# Vérifier la configuration CORS
grep -n "cors" server.js
```

---

## 💡 Recommandation Finale

**Pour un environnement de production stable :**

1. **Hébergez les images localement** (dans `client/public/images/`)
2. **Ou utilisez un CDN dédié** (Cloudinary, AWS S3, etc.)
3. **Évitez les dépendances externes** comme Unsplash en production

**Pour le développement :**
- Les images Unsplash fonctionnent bien si connexion internet disponible
- Le composant `ProductImage` gère les erreurs automatiquement

---

**Questions ? Consultez :**
- GUIDE_COLLABORATEURS.md
- RESTAURATION_GUIDE.md
- README.md
