# 🚀 Guide de Démarrage Rapide pour Collaborateurs

## 📋 Prérequis

- Docker et Docker Compose installés
- Git installé
- Node.js 20.x installé

## 🔄 Récupération du Projet

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/lynalasla/mini-api-catalogue.git
cd mini-api-catalogue
```

### Étape 2 : Installer les dépendances

```bash
# Dépendances backend
npm install

# Dépendances frontend
cd client
npm install
cd ..
```

### Étape 3 : Démarrer les conteneurs Docker

```bash
docker-compose up -d
```

**⏱️ Attendre environ 30 secondes** que tous les services démarrent.

## 📊 Deux options pour obtenir les données

### Option A : Utiliser le seed (données de test)

```bash
# Appliquer le schéma Prisma
npx prisma db push

# Insérer les données de test
npx prisma db seed
```

**✅ Résultat** :

- 2 catégories (Electronics, Fashion)
- 21 produits
- 1 utilisateur admin : `admin@catalogue.com` / `admin123`

### Option B : Restaurer depuis un backup (données réelles)

**⚠️ IMPORTANT : Suivez ces étapes dans l'ordre**

```bash
# 1. Appliquer le schéma Prisma (OBLIGATOIRE)
npx prisma db push

# 2. Vérifier les backups disponibles
ls -lh backups/

# 3. Restaurer depuis le backup le plus récent
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

**✅ Ce que vous allez obtenir** :

```
✅ Restauration terminée avec succès!

📋 INFORMATIONS DE CONNEXION:
════════════════════════════════════════════════════════════

👤 🔐 ADMIN
   Email:    admin@catalogue.com
   Password: Templ1cpdyb9!

👤 USER
   Email:    user@catalogue.com
   Password: Tempq5n1ocrj!

════════════════════════════════════════════════════════════
⚠️  IMPORTANT: Conservez ces mots de passe temporaires!
💡  Les utilisateurs peuvent les changer après connexion.
```

**📝 Notes** :

- ✅ Des mots de passe temporaires sont générés automatiquement
- 🔐 Vous pouvez vous connecter immédiatement avec ces identifiants
- 🔄 Changez votre mot de passe après la première connexion

## 🌐 Accès aux Services

Une fois démarré, accédez à :

| Service            | URL                   | Identifiants                                         |
| ------------------ | --------------------- | ---------------------------------------------------- |
| **Frontend React** | http://localhost:5173 | -                                                    |
| **API Backend**    | http://localhost:3000 | -                                                    |
| **Nginx (Proxy)**  | http://localhost:80   | -                                                    |
| **phpMyAdmin**     | http://localhost:8080 | user: `catalogue_user`<br>pass: `catalogue_password` |
| **Grafana**        | http://localhost:3001 | admin / admin                                        |
| **Prometheus**     | http://localhost:9090 | -                                                    |
| **Superset**       | http://localhost:8088 | admin / admin                                        |
| **Prisma Studio**  | http://localhost:5555 | Lancer: `npx prisma studio`                          |

## 🧪 Vérifier que tout fonctionne

```bash
# Tester l'API
curl http://localhost:3000/api/products

# Vérifier les conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f mini-api-catalogue
```

## ❌ Problèmes courants

### Le conteneur API ne démarre pas

```bash
# Redémarrer le conteneur
docker-compose restart mini-api-catalogue

# Voir les logs d'erreur
docker logs mini-api-catalogue --tail 50
```

### La base de données est vide

```bash
# Option 1 : Utiliser le seed
npx prisma db push
npx prisma db seed

# Option 2 : Restaurer un backup
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx
```

### Erreur "Unknown argument `imageUrl`"

Assurez-vous d'utiliser **`restore-database.cjs`** et non `restore-database.js`

```bash
# ✅ CORRECT
node restore-database.cjs backups/fichier.xlsx

# ❌ INCORRECT
node restore-database.js backups/fichier.xlsx
```

### Erreur "Cannot find module 'exceljs'"

```bash
# Installer les dépendances manquantes
npm install exceljs --save-dev
npm install bcryptjs
```

## 📚 Documentation complète

Pour plus de détails, consultez :

- **README.md** : Documentation principale du projet
- **BACKUP_README.md** : Guide de sauvegarde/restauration
- **API_DOCUMENTATION.md** : Documentation des endpoints API
- **GRAFANA_SETUP.md** : Configuration de Grafana
- **SUPERSET_SETUP.md** : Configuration de Superset

## 🆘 Besoin d'aide ?

1. Vérifiez les logs : `docker-compose logs -f`
2. Consultez les issues GitHub
3. Contactez l'équipe

## 🔄 Workflow quotidien

```bash
# Matin : Récupérer les dernières modifications
git pull origin frontend
docker-compose restart

# Travailler...

# Soir : Créer un backup avant de partir
npm run backup

# Commit et push
git add .
git commit -m "feat: votre message"
git push origin frontend
```

---

**✨ Vous êtes prêt à travailler !**
