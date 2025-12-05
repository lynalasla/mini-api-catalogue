# 📦 Sauvegarde et Restauration de la Base de Données

Scripts pour sauvegarder et restaurer toutes les données de la base de données MySQL vers/depuis des fichiers Excel.

## 🎯 Fonctionnalités

- **Sauvegarde complète** : Exporte toutes les tables vers un fichier Excel
- **Restauration complète** : Réimporte les données depuis un fichier Excel
- **Organisation par onglets** : Chaque table dans un onglet séparé
- **Horodatage automatique** : Fichiers nommés avec date et heure
- **Sécurité** : Les mots de passe ne sont pas exportés/importés

## 📊 Tables sauvegardées

1. **Users** - Utilisateurs (sans mots de passe)
2. **Categories** - Catégories de produits
3. **Products** - Produits avec relations
4. **Orders** - Commandes
5. **OrderItems** - Articles de commande
6. **CartItems** - Paniers en cours

## 🚀 Utilisation

### Créer une sauvegarde

```bash
npm run backup
```

Ou directement :

```bash
node backup-database.js
```

Le fichier sera créé dans le dossier `backups/` avec le format :

```
database_backup_2025-12-05T00-30-00.xlsx
```

### Restaurer depuis une sauvegarde

```bash
npm run restore backups/database_backup_2025-12-05T00-30-00.xlsx
```

Ou directement :

```bash
node restore-database.js backups/database_backup_2025-12-05T00-30-00.xlsx
```

## ⚙️ Configuration requise

Les packages suivants sont nécessaires :

- `xlsx` - Pour la génération/lecture de fichiers Excel
- `@prisma/client` - Pour l'accès à la base de données

Installation :

```bash
npm install xlsx --save-dev
```

## 🔒 Sécurité

**Important** :

- Les mots de passe des utilisateurs **ne sont pas exportés** pour des raisons de sécurité
- Lors d'une restauration, les utilisateurs devront **réinitialiser leur mot de passe**
- Les fichiers Excel de backup contiennent des données sensibles - **ne pas les partager**
- Ajoutez `backups/` et `*.xlsx` dans `.gitignore`

## 📝 Exemples

### Sauvegarde automatique quotidienne

Ajoutez à votre crontab (Linux/Mac) :

```bash
0 2 * * * cd /path/to/mini-api-catalogue && npm run backup
```

Ou dans Task Scheduler (Windows).

### Sauvegarde avant migration

```bash
# Sauvegarder les données
npm run backup

# Effectuer la migration
npm run prisma:migrate

# En cas de problème, restaurer
npm run restore backups/database_backup_XXXX.xlsx
```

## 📂 Structure du fichier Excel

Chaque onglet contient :

**Users**

- id, email, name, role, created_at, updated_at

**Categories**

- id, name, description, created_at, updated_at

**Products**

- id, name, description, price, stock, image_url, category_id, category_name, created_at, updated_at

**Orders**

- id, user_id, user_email, user_name, total, status, created_at, updated_at

**OrderItems**

- id, order_id, product_id, product_name, quantity, price

**CartItems**

- id, user_id, user_email, product_id, product_name, product_price, quantity, created_at

## 🛠️ Dépannage

### Erreur de connexion à la base de données

Vérifiez que :

- Docker containers sont en cours d'exécution : `docker-compose ps`
- La variable `DATABASE_URL` est correctement configurée
- MySQL est accessible sur le port 3306

### Fichier Excel non trouvé

Utilisez le chemin complet :

```bash
node restore-database.js C:/Users/dell/mini-api-catalogue/backups/database_backup_XXXX.xlsx
```

### Erreur lors de la restauration

- Vérifiez que le fichier Excel n'est pas corrompu
- Assurez-vous que les IDs ne sont pas en conflit
- Restaurez d'abord les catégories, puis les produits

## 📌 Bonnes pratiques

1. **Sauvegardes régulières** : Effectuez des backups quotidiens
2. **Versioning** : Conservez plusieurs versions de backup
3. **Test de restauration** : Testez régulièrement la restauration sur un environnement de test
4. **Stockage externe** : Copiez les backups sur un stockage cloud (Google Drive, Dropbox, etc.)
5. **Documentation** : Notez la date et la raison de chaque backup important

## 🔄 Automatisation

### Script PowerShell (Windows)

Créez `backup-daily.ps1` :

```powershell
cd C:\Users\dell\mini-api-catalogue
npm run backup
Copy-Item backups\*.xlsx "D:\Backups\Database\" -Force
```

### Script Bash (Linux/Mac)

Créez `backup-daily.sh` :

```bash
#!/bin/bash
cd /path/to/mini-api-catalogue
npm run backup
cp backups/*.xlsx /mnt/backup/database/
```

## 📧 Support

En cas de problème, contactez l'équipe de développement ou consultez la documentation Prisma.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2025
