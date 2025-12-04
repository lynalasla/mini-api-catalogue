# 🆘 Guide de Récupération - Mini API Catalogue

Guide complet pour récupérer l'application en cas de problème ou de perte de données.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Scénarios de récupération](#scénarios-de-récupération)
3. [Récupération complète](#récupération-complète)
4. [Récupération de la base de données](#récupération-de-la-base-de-données)
5. [Récupération après crash Docker](#récupération-après-crash-docker)
6. [Récupération des conteneurs](#récupération-des-conteneurs)
7. [Dépannage](#dépannage)
8. [Contacts d'urgence](#contacts-durgence)

---

## 🔧 Prérequis

Avant de commencer une récupération, assurez-vous d'avoir :

- ✅ Accès au repository GitHub : `lynalasla/mini-api-catalogue`
- ✅ Docker et Docker Compose installés
- ✅ Node.js 20+ installé
- ✅ Fichiers de backup (si disponibles) : `backups/*.xlsx`
- ✅ Variables d'environnement (`.env`)
- ✅ Droits administrateur sur le système

---

## 🎯 Scénarios de récupération

### Scénario 1 : Perte totale du système
**Symptômes** : Machine reformatée, disque dur défaillant, perte complète des fichiers

**Solution** : [Récupération complète](#récupération-complète)

### Scénario 2 : Base de données corrompue
**Symptômes** : Erreurs Prisma, données incohérentes, tables manquantes

**Solution** : [Récupération de la base de données](#récupération-de-la-base-de-données)

### Scénario 3 : Conteneurs Docker non fonctionnels
**Symptômes** : `docker-compose ps` montre des conteneurs Exit ou Unhealthy

**Solution** : [Récupération après crash Docker](#récupération-après-crash-docker)

### Scénario 4 : Code perdu mais base de données intacte
**Symptômes** : Repository supprimé localement, mais Docker MySQL fonctionne

**Solution** : [Récupération des conteneurs](#récupération-des-conteneurs)

---

## 🔄 Récupération complète

### Étape 1 : Récupérer le code source

```bash
# Cloner le repository
cd /c/Users/dell
git clone https://github.com/lynalasla/mini-api-catalogue.git
cd mini-api-catalogue

# Basculer sur la branche appropriée
git checkout frontend  # ou main selon le besoin
```

### Étape 2 : Installer les dépendances

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..

# Python A/B Testing
cd ab_testing
pip install -r requirements.txt
cd ..
```

### Étape 3 : Configurer l'environnement

Créer le fichier `.env` à la racine :

```env
# Base de données
DATABASE_URL="mysql://catalogue_user:catalogue_password@localhost:3306/catalogue"

# JWT
JWT_SECRET="votre_secret_jwt_super_securise_changez_moi"

# Node
NODE_ENV="production"

# Ports
PORT=3000
CLIENT_PORT=5173
```

### Étape 4 : Démarrer Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Attendre que MySQL soit prêt
sleep 30

# Vérifier l'état des conteneurs
docker-compose ps
```

### Étape 5 : Initialiser la base de données

```bash
# Générer Prisma Client
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Seed (données initiales)
npm run prisma:seed
```

### Étape 6 : Restaurer les données (si backup disponible)

```bash
# Si vous avez un fichier de backup Excel
npm run restore backups/database_backup_YYYY-MM-DDTHH-MM-SS.xlsx
```

### Étape 7 : Vérifier le fonctionnement

```bash
# Tester l'API
curl http://localhost:3000/api/products

# Tester le frontend
# Ouvrir http://localhost:5173 dans le navigateur

# Tester nginx
# Ouvrir http://localhost:80

# Tester phpMyAdmin
# Ouvrir http://localhost:8080
```

**✅ Récupération complète terminée !**

---

## 💾 Récupération de la base de données

### Option A : Depuis un backup Excel

```bash
# 1. Lister les backups disponibles
ls -la backups/

# 2. Restaurer depuis le backup le plus récent
npm run restore backups/database_backup_2025-12-04T23-34-09.xlsx

# 3. Vérifier la restauration
npx prisma studio
```

### Option B : Réinitialisation complète

```bash
# ⚠️ ATTENTION : Supprime toutes les données !

# 1. Arrêter les conteneurs
docker-compose down

# 2. Supprimer le volume MySQL
docker volume rm mini-api-catalogue_mysql_data

# 3. Redémarrer
docker-compose up -d

# 4. Attendre MySQL
sleep 30

# 5. Réappliquer les migrations
npx prisma migrate deploy

# 6. Réinsérer les données initiales
npm run prisma:seed
```

### Option C : Migration manuelle

```bash
# 1. Se connecter à MySQL
docker exec -it mysql-catalogue mysql -u catalogue_user -p

# 2. Vérifier les tables
USE catalogue;
SHOW TABLES;

# 3. Si tables manquantes, réappliquer migrations
EXIT;
npx prisma migrate reset --force
```

---

## 🐳 Récupération après crash Docker

### Diagnostic rapide

```bash
# Vérifier l'état
docker-compose ps

# Voir les logs
docker-compose logs --tail=50

# Vérifier les ressources
docker system df
```

### Solutions selon le problème

#### Problème : Conteneur en Exit

```bash
# Redémarrer le conteneur spécifique
docker-compose restart mini-api-catalogue

# Si échec, reconstruire
docker-compose up -d --build mini-api-catalogue
```

#### Problème : Out of Memory

```bash
# Nettoyer Docker
docker system prune -a --volumes

# Libérer de l'espace
docker volume prune
docker image prune -a
```

#### Problème : Port déjà utilisé

```bash
# Trouver le processus qui utilise le port
netstat -ano | findstr :3000
netstat -ano | findstr :3306

# Tuer le processus (remplacer PID)
taskkill /F /PID <PID>

# Ou changer le port dans docker-compose.yml
```

#### Problème : Réseau Docker

```bash
# Recréer le réseau
docker-compose down
docker network prune
docker-compose up -d
```

### Reconstruction complète des images

```bash
# 1. Tout arrêter
docker-compose down

# 2. Supprimer les images
docker rmi mini-api-catalogue-mini-api-catalogue
docker rmi mini-api-catalogue-react-dev
docker rmi mini-api-catalogue-nginx

# 3. Reconstruire
docker-compose build --no-cache

# 4. Redémarrer
docker-compose up -d
```

---

## 📦 Récupération des conteneurs

### MySQL (Base de données)

```bash
# Vérifier si le conteneur existe
docker ps -a | grep mysql-catalogue

# Redémarrer
docker start mysql-catalogue

# Si corrompu, recréer
docker-compose up -d mysql
```

### API Backend

```bash
# Reconstruire l'API
docker-compose build mini-api-catalogue
docker-compose up -d mini-api-catalogue

# Vérifier les logs
docker logs mini-api-catalogue --tail 50 -f
```

### Frontend React

```bash
# Reconstruire le frontend
docker-compose build react-dev
docker-compose up -d react-dev

# Tester
curl http://localhost:5173
```

### Nginx

```bash
# Reconstruire nginx
docker-compose build nginx
docker-compose up -d nginx

# Vérifier la configuration
docker exec belibeli-nginx nginx -t
```

---

## 🔍 Dépannage

### Erreur : "Cannot connect to MySQL"

**Solution 1** : Attendre que MySQL soit prêt
```bash
# Attendre 30 secondes
sleep 30
docker logs mysql-catalogue
```

**Solution 2** : Vérifier les credentials
```bash
# Dans .env, vérifier :
DATABASE_URL="mysql://catalogue_user:catalogue_password@localhost:3306/catalogue"
```

**Solution 3** : Recréer la base de données
```bash
docker exec -it mysql-catalogue mysql -u root -proot_password
CREATE DATABASE IF NOT EXISTS catalogue;
GRANT ALL PRIVILEGES ON catalogue.* TO 'catalogue_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### Erreur : "Prisma Client is not generated"

```bash
# Régénérer Prisma Client
npx prisma generate

# Si échec, nettoyer et régénérer
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

### Erreur : "Port already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Ou modifier docker-compose.yml
ports:
  - "3001:3000"  # Utiliser un autre port
```

### Erreur : "ENOSPC: System limit for file watchers reached"

```bash
# Augmenter la limite (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Windows : Redémarrer Docker Desktop
```

### Erreur : Migration Prisma échoue

```bash
# Option 1 : Force reset
npx prisma migrate reset --force

# Option 2 : Deploy manuel
npx prisma migrate deploy

# Option 3 : Résoudre les conflits
npx prisma migrate resolve --applied <migration_name>
```

---

## 📝 Checklist de récupération

Après chaque récupération, vérifier :

- [ ] Tous les conteneurs sont "Up" : `docker-compose ps`
- [ ] API répond : `curl http://localhost:3000/api/products`
- [ ] Frontend accessible : http://localhost:5173
- [ ] Base de données accessible : http://localhost:8080 (phpMyAdmin)
- [ ] Logs sans erreurs : `docker-compose logs --tail=20`
- [ ] Prisma fonctionne : `npx prisma studio`
- [ ] Backup créé : `npm run backup`

---

## 🔐 Sécurité après récupération

### Changer les secrets

```bash
# Générer un nouveau JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Mettre à jour .env
JWT_SECRET="nouveau_secret_généré"
```

### Mettre à jour les mots de passe

```bash
# MySQL root
docker exec -it mysql-catalogue mysql -u root -proot_password
ALTER USER 'root'@'%' IDENTIFIED BY 'nouveau_mot_de_passe_fort';
FLUSH PRIVILEGES;
```

### Réinitialiser les mots de passe utilisateurs

```bash
# Les utilisateurs devront réinitialiser leur mot de passe
# après restauration depuis backup Excel
```

---

## 📊 Tests post-récupération

### Test 1 : API Backend

```bash
# Produits
curl http://localhost:3000/api/products

# Catégories
curl http://localhost:3000/api/categories

# Santé
curl http://localhost:3000/api/health
```

### Test 2 : Frontend

```bash
# Page d'accueil
curl -I http://localhost:5173

# Build production (via nginx)
curl -I http://localhost:80
```

### Test 3 : Base de données

```bash
# Prisma Studio
npx prisma studio
# Ouvrir http://localhost:5555

# Ou via MySQL
docker exec -it mysql-catalogue mysql -u catalogue_user -pcatalogue_password catalogue
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
EXIT;
```

### Test 4 : A/B Testing

```bash
cd ab_testing
python -c "from ab_test import ABTestManager; print('✅ A/B Testing OK')"
```

---

## 🎯 Prévention des futurs problèmes

### Sauvegardes automatiques

Créer un script de backup automatique :

**Windows (Task Scheduler)**
```powershell
# backup-daily.ps1
cd C:\Users\dell\mini-api-catalogue
npm run backup
Copy-Item backups\*.xlsx D:\Backups\Database\ -Force
```

**Linux/Mac (Crontab)**
```bash
# Ajouter dans crontab -e
0 2 * * * cd /path/to/mini-api-catalogue && npm run backup
```

### Monitoring

```bash
# Vérifier régulièrement
docker-compose ps
docker-compose logs --tail=20
npm audit
```

### Mises à jour

```bash
# Mettre à jour les dépendances
npm update
cd client && npm update

# Mettre à jour Docker images
docker-compose pull
docker-compose up -d
```

---

## 📞 Contacts d'urgence

**GitHub Repository**
- https://github.com/lynalasla/mini-api-catalogue

**Documentation**
- `README.md` - Installation et utilisation
- `BACKUP_README.md` - Backup et restauration
- `API_DOCUMENTATION.md` - Documentation API

**Commandes utiles**
```bash
# Voir tous les logs
docker-compose logs -f

# Redémarrer tout
docker-compose restart

# Reconstruire tout
docker-compose down && docker-compose up -d --build

# Backup rapide
npm run backup

# Status général
docker-compose ps && docker system df
```

---

## ⚡ Récupération d'urgence en 5 minutes

Si vous avez besoin d'une récupération rapide :

```bash
# 1. Cloner le repo
git clone https://github.com/lynalasla/mini-api-catalogue.git
cd mini-api-catalogue

# 2. Installer
npm install && cd client && npm install && cd ..

# 3. Créer .env
cat > .env << 'EOF'
DATABASE_URL="mysql://catalogue_user:catalogue_password@localhost:3306/catalogue"
JWT_SECRET="changez_moi_secret_tres_securise"
NODE_ENV="production"
EOF

# 4. Démarrer Docker
docker-compose up -d

# 5. Attendre et migrer
sleep 30
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed

# 6. Vérifier
docker-compose ps
curl http://localhost:3000/api/products
```

**✅ Application récupérée en 5 minutes !**

---

## 📈 Temps de récupération estimés

| Scénario | Temps estimé | Complexité |
|----------|--------------|------------|
| Redémarrage simple | 2-5 min | ⭐ Facile |
| Reconstruction Docker | 5-10 min | ⭐⭐ Moyen |
| Récupération complète | 10-20 min | ⭐⭐⭐ Avancé |
| Restauration + Backup | 15-30 min | ⭐⭐⭐⭐ Expert |

---

**Dernière mise à jour** : Décembre 2025  
**Version** : 1.0.0  
**Testé sur** : Windows 11, Docker Desktop 4.x, Node.js 20.x
