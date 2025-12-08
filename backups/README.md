# 📦 Dossier des Backups

Ce dossier contient les sauvegardes de la base de données au format Excel.

## 📋 Fichiers disponibles

Chaque fichier suit le format : `database_backup_YYYY-MM-DDTHH-MM-SS.xlsx`

### Backups actuels

```bash
# Lister les backups disponibles
ls -lh backups/

# Exemple de sortie :
# -rw-r--r-- 30K Dec  5 00:26 database_backup_2025-12-04T23-26-27.xlsx
# -rw-r--r-- 13K Dec  5 00:34 database_backup_2025-12-04T23-34-09.xlsx
```

## 🔄 Comment restaurer un backup

### Commande à utiliser

**⚠️ IMPORTANT : Utilisez TOUJOURS cette commande exacte**

```bash
# Depuis la racine du projet (mini-api-catalogue/)
node restore-database.cjs backups/NOM_DU_FICHIER.xlsx
```

### Exemple concret

```bash
# 1. Se placer à la racine du projet
cd mini-api-catalogue

# 2. Appliquer le schéma Prisma (OBLIGATOIRE avant la première restauration)
npx prisma db push

# 3. Lister les backups disponibles
ls -lh backups/

# 4. Restaurer le backup le plus récent
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

## ✅ Ce qui se passe lors de la restauration

La restauration va :

1. ✅ Restaurer toutes les **catégories**
2. ✅ Restaurer tous les **produits**
3. ✅ Restaurer tous les **utilisateurs** avec mots de passe temporaires
4. ✅ Restaurer toutes les **commandes**
5. ✅ Restaurer tous les **articles de commande**

## 🔑 Identifiants après restauration

À la fin de la restauration, vous verrez :

```
✅ Restauration terminée avec succès!

📋 INFORMATIONS DE CONNEXION:
════════════════════════════════════════════════════════════

👤 🔐 ADMIN
   Email:    admin@catalogue.com
   Password: Tempmcfxhs6n!

👤 USER
   Email:    user@catalogue.com
   Password: Tempz9amf21a!

════════════════════════════════════════════════════════════
⚠️  IMPORTANT: Conservez ces mots de passe temporaires!
💡  Les utilisateurs peuvent les changer après connexion.
```

**📝 Notes importantes :**

- Les mots de passe sont **différents à chaque restauration**
- Vous pouvez vous **connecter immédiatement** avec ces identifiants
- Changez votre mot de passe après la première connexion

## 🆕 Créer un nouveau backup

```bash
# Depuis la racine du projet
npm run backup

# Un nouveau fichier sera créé dans backups/ avec la date actuelle
```

## ❌ Erreurs courantes

### "Fichier non trouvé"

```bash
# ❌ INCORRECT (chemin relatif depuis un autre dossier)
node restore-database.cjs database_backup_2025-12-04T23-26-27.xlsx

# ✅ CORRECT (chemin depuis la racine du projet)
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

### "Unknown argument `imageUrl`"

Assurez-vous d'utiliser `restore-database.cjs` et non `restore-database.js`

```bash
# ✅ CORRECT
node restore-database.cjs backups/fichier.xlsx

# ❌ INCORRECT
node restore-database.js backups/fichier.xlsx
```

### "Cannot find module 'exceljs'"

```bash
# Installer les dépendances manquantes
npm install exceljs --save-dev
npm install bcryptjs
```

## 🔒 Sécurité

- **NE PAS** commiter ces fichiers sur Git (ils sont dans .gitignore)
- **NE PAS** partager ces fichiers publiquement (données sensibles)
- Conserver les backups en lieu sûr
- Les mots de passe des utilisateurs ne sont PAS dans les backups

## 📚 Documentation complète

Pour plus d'informations, consultez :

- [BACKUP_README.md](../BACKUP_README.md) - Documentation complète du système de backup
- [GUIDE_COLLABORATEURS.md](../GUIDE_COLLABORATEURS.md) - Guide de démarrage rapide
- [README.md](../README.md) - Documentation principale du projet
