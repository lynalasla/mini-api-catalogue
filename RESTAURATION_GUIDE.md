# 📋 RÉCAPITULATIF - Restauration des Données

## ⚡ Commande Rapide (À Retenir)

```bash
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

## 📚 Fichiers de Documentation

| Fichier                     | Description                  | Pour qui ?                 |
| --------------------------- | ---------------------------- | -------------------------- |
| **GUIDE_COLLABORATEURS.md** | Guide complet de démarrage   | 🆕 Nouveaux collaborateurs |
| **BACKUP_README.md**        | Documentation backup/restore | 👨‍💻 Tous                    |
| **backups/README.md**       | Guide du dossier backups     | 👨‍💻 Tous                    |
| **README.md**               | Documentation principale     | 📖 Référence générale      |
| **restore-helper.sh**       | Script d'aide interactif     | 🎯 Utilisation simplifiée  |

## 🔄 Processus Complet de Restauration

### 1️⃣ Prérequis

```bash
# Vérifier Docker
docker-compose ps

# Installer dépendances si nécessaire
npm install exceljs --save-dev
npm install bcryptjs
```

### 2️⃣ Localiser le backup

```bash
# Lister les backups disponibles
ls -lh backups/

# Vous devriez voir :
# database_backup_2025-12-04T23-26-27.xlsx (30K)
# database_backup_2025-12-04T23-34-09.xlsx (13K)
```

### 3️⃣ Restaurer

**Option A : Commande directe (Recommandé)**

```bash
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

**Option B : Script interactif**

```bash
./restore-helper.sh
```

### 4️⃣ Récupérer les identifiants

La restauration affiche automatiquement :

```
📋 INFORMATIONS DE CONNEXION:
════════════════════════════════════════════════════════════

👤 🔐 ADMIN
   Email:    admin@catalogue.com
   Password: [mot de passe temporaire]

👤 USER
   Email:    user@catalogue.com
   Password: [mot de passe temporaire]
```

**⚠️ IMPORTANT : Notez ces mots de passe !**

### 5️⃣ Se connecter

```bash
# Frontend accessible sur
http://localhost:5173

# Utilisez les identifiants affichés à l'étape 4
```

### 6️⃣ Vérifier les données

```bash
# Option 1 : Via Prisma Studio
npx prisma studio
# Ouvrir http://localhost:5555

# Option 2 : Via phpMyAdmin
# Ouvrir http://localhost:8080
# User: catalogue_user / Pass: catalogue_password

# Option 3 : Via API
curl http://localhost:3000/api/products
```

## ✅ Checklist de Vérification

Après la restauration, vérifiez :

- [ ] Catégories restaurées (devrait être 2)
- [ ] Produits restaurés (devrait être 21)
- [ ] Utilisateurs restaurés (devrait être 2)
- [ ] Commandes restaurées (devrait être 1)
- [ ] Connexion admin fonctionne
- [ ] Frontend affiche les produits
- [ ] API répond correctement

## ❌ Problèmes Courants et Solutions

### Problème 1 : "The column description does not exist"

**Symptôme :**

```
Invalid prisma.category.upsert() invocation
The column description does not exist in the current database.
code: 'P2022'
```

**Cause :**
Le schéma Prisma n'a pas été appliqué à la base de données.

**Solution :**

```bash
# Appliquer le schéma Prisma
npx prisma db push

# Puis relancer la restauration
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

**Important :** Cette étape doit TOUJOURS être faite avant la première restauration !

---

### Problème 2 : "Fichier non trouvé"

**Symptôme :**

```
❌ Fichier non trouvé: backups/database_backup_2025-12-04T23-26-27.xlsx
```

**Solution :**

```bash
# Vérifier que vous êtes à la racine du projet
pwd
# Devrait afficher : /c/Users/[user]/mini-api-catalogue

# Si non, retourner à la racine
cd /c/Users/[user]/mini-api-catalogue

# Puis relancer
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

### Problème 2 : "Unknown argument `imageUrl`"

**Symptôme :**

```
Unknown argument `imageUrl`. Available options are marked with ?.
```

**Solution :**

```bash
# Vous utilisez probablement .js au lieu de .cjs
# ✅ CORRECT
node restore-database.cjs backups/fichier.xlsx

# ❌ INCORRECT
node restore-database.js backups/fichier.xlsx
```

### Problème 3 : "Cannot find module 'exceljs'"

**Symptôme :**

```
Error: Cannot find module 'exceljs'
```

**Solution :**

```bash
# Installer les dépendances manquantes
npm install exceljs --save-dev
npm install bcryptjs

# Puis relancer
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

### Problème 4 : "Cannot connect to database"

**Symptôme :**

```
Error: Can't reach database server
```

**Solution :**

```bash
# Vérifier que Docker est lancé
docker-compose ps

# Si les conteneurs ne sont pas démarrés
docker-compose up -d

# Attendre 30 secondes puis réessayer
sleep 30
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

### Problème 5 : Base de données vide après restauration

**Solution :**

```bash
# Vérifier avec Prisma Studio
npx prisma studio

# Si vide, vérifier les logs de restauration
# Le script doit afficher "✅ X éléments restaurés" pour chaque table

# Si échec, réessayer avec le backup le plus récent
ls -lt backups/*.xlsx | head -1
```

## 🆘 Besoin d'Aide ?

### Ressources

1. **GUIDE_COLLABORATEURS.md** - Guide complet pas à pas
2. **BACKUP_README.md** - Documentation du système de backup
3. **Issues GitHub** - Problèmes connus et solutions
4. **Logs Docker** - `docker logs mini-api-catalogue --tail 50`

### Commandes de Diagnostic

```bash
# Vérifier l'état des services
docker-compose ps

# Voir les logs de l'API
docker logs mini-api-catalogue --tail 50

# Tester l'API
curl http://localhost:3000/api/products

# Voir le contenu de la base
npx prisma studio
```

### Contact

Si le problème persiste après avoir suivi ce guide :

1. Vérifiez les issues GitHub existantes
2. Créez une nouvelle issue avec les logs d'erreur
3. Contactez l'équipe sur le canal de communication

---

## 📌 Points Clés à Retenir

1. ✅ Toujours utiliser `restore-database.cjs` (pas `.js`)
2. ✅ Toujours lancer depuis la racine du projet
3. ✅ Toujours inclure `backups/` dans le chemin
4. ✅ Toujours noter les mots de passe temporaires affichés
5. ✅ Toujours vérifier que Docker est lancé avant

**Commande magique :**

```bash
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

---

**✨ Dernière mise à jour : 5 décembre 2025**
