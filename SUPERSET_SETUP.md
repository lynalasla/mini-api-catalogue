# Apache Superset - Guide de Configuration

## Accès

- **URL** : http://localhost:8088
- **Login** : `admin`
- **Password** : `admin`

## Configuration de la Base de Données MySQL

### 1. Se Connecter à Superset

Ouvrez http://localhost:8088 dans votre navigateur et connectez-vous.

### 2. Ajouter la Connexion MySQL

1. Cliquez sur **Settings** (⚙️) en haut à droite
2. Sélectionnez **Database Connections**
3. Cliquez sur **+ Database**
4. Choisissez **MySQL** dans la liste

**Configuration** :

```
Host: mysql-catalogue
Port: 3306
Database: mini_catalogue
Username: root
Password: root_password
```

**SQLAlchemy URI** :

```
mysql://root:root_password@mysql-catalogue:3306/mini_catalogue
```

5. Cliquez sur **Test Connection**
6. Si réussi ✅, cliquez sur **Connect**

### 3. Explorer les Tables

1. Allez dans **Data** → **Datasets**
2. Cliquez sur **+ Dataset**
3. Sélectionnez :
   - **Database** : mini_catalogue
   - **Schema** : mini_catalogue
   - **Table** : Choisissez une table (Product, Order, User, Category)
4. Cliquez sur **Add**

Répétez pour toutes les tables que vous voulez analyser.

## Exemples de Dashboards à Créer

### Dashboard 1 : Vue d'Ensemble E-Commerce

**Graphiques suggérés** :

1. **KPI Cards** :

   - Total produits : `SELECT COUNT(*) FROM Product`
   - Total commandes : `SELECT COUNT(*) FROM Order`
   - Total utilisateurs : `SELECT COUNT(*) FROM User`
   - Total catégories : `SELECT COUNT(*) FROM Category`

2. **Top 10 Produits** (Bar Chart) :

   ```sql
   SELECT name, price
   FROM Product
   ORDER BY price DESC
   LIMIT 10
   ```

3. **Produits par Catégorie** (Pie Chart) :

   ```sql
   SELECT c.name, COUNT(p.id) as count
   FROM Product p
   JOIN Category c ON p.categoryId = c.id
   GROUP BY c.name
   ```

4. **Distribution des Prix** (Histogram) :
   ```sql
   SELECT price
   FROM Product
   ```

### Dashboard 2 : Analyse des Commandes

1. **Commandes par Statut** (Pie Chart) :

   ```sql
   SELECT status, COUNT(*) as count
   FROM Order
   GROUP BY status
   ```

2. **Évolution des Commandes** (Line Chart) :

   ```sql
   SELECT DATE(createdAt) as date, COUNT(*) as orders
   FROM Order
   GROUP BY DATE(createdAt)
   ORDER BY date
   ```

3. **Top Clients** (Table) :
   ```sql
   SELECT u.email, COUNT(o.id) as order_count
   FROM User u
   LEFT JOIN Order o ON u.id = o.userId
   GROUP BY u.email
   ORDER BY order_count DESC
   LIMIT 10
   ```

### Dashboard 3 : Analyse Produits

1. **Produits les Plus Chers** (Bar Chart) :

   ```sql
   SELECT name, price
   FROM Product
   ORDER BY price DESC
   LIMIT 20
   ```

2. **Stock par Catégorie** (Stacked Bar Chart) :

   ```sql
   SELECT c.name as category, SUM(p.stock) as total_stock
   FROM Product p
   JOIN Category c ON p.categoryId = c.id
   GROUP BY c.name
   ```

3. **Moyenne des Prix par Catégorie** (Bar Chart) :
   ```sql
   SELECT c.name, AVG(p.price) as avg_price
   FROM Product p
   JOIN Category c ON p.categoryId = c.id
   GROUP BY c.name
   ```

## Créer Votre Premier Graphique

### Étape par Étape

1. **Allez dans Charts** :

   - Cliquez sur **Charts** dans le menu
   - Cliquez sur **+ Chart**

2. **Choisissez un Dataset** :

   - Sélectionnez la table **Product**
   - Cliquez sur **Create new chart**

3. **Choisissez un Type de Graphique** :

   - Par exemple : **Bar Chart**

4. **Configurez le Graphique** :
   - **Query** :
     - **Dimensions** : name
     - **Metrics** : COUNT(\*)
   - **Customize** :
     - Titre, couleurs, légendes
5. **Cliquez sur Run Query**

6. **Sauvegardez** :
   - Cliquez sur **Save**
   - Donnez un nom : "Top Products"

## Créer un Dashboard

1. **Allez dans Dashboards** :

   - Cliquez sur **Dashboards** dans le menu
   - Cliquez sur **+ Dashboard**

2. **Donnez un Nom** :

   - Par exemple : "E-Commerce Analytics"

3. **Ajoutez des Graphiques** :

   - Cliquez sur **Edit Dashboard**
   - Glissez-déposez vos graphiques
   - Redimensionnez et organisez

4. **Sauvegardez** :
   - Cliquez sur **Save**

## Requêtes SQL Utiles

### Statistiques Générales

```sql
-- Vue d'ensemble
SELECT
  (SELECT COUNT(*) FROM Product) as total_products,
  (SELECT COUNT(*) FROM Order) as total_orders,
  (SELECT COUNT(*) FROM User) as total_users,
  (SELECT COUNT(*) FROM Category) as total_categories;
```

### Analyse des Ventes

```sql
-- Produits les plus vendus (si vous avez OrderItem)
SELECT p.name, COUNT(oi.id) as times_ordered
FROM Product p
LEFT JOIN OrderItem oi ON p.id = oi.productId
GROUP BY p.name
ORDER BY times_ordered DESC
LIMIT 10;
```

### Analyse Clients

```sql
-- Utilisateurs actifs
SELECT role, COUNT(*) as count
FROM User
GROUP BY role;
```

### Analyse Catégories

```sql
-- Performance par catégorie
SELECT
  c.name,
  COUNT(p.id) as product_count,
  AVG(p.price) as avg_price,
  SUM(p.stock) as total_stock
FROM Category c
LEFT JOIN Product p ON c.id = p.categoryId
GROUP BY c.name
ORDER BY product_count DESC;
```

## Différence Grafana vs Superset

| Aspect           | Grafana               | Superset              |
| ---------------- | --------------------- | --------------------- |
| **URL**          | http://localhost:3001 | http://localhost:8088 |
| **Données**      | Métriques Prometheus  | Base MySQL            |
| **Utilisation**  | Monitoring technique  | Analyse business      |
| **Refresh**      | Temps réel (10s)      | À la demande          |
| **Utilisateurs** | DevOps                | Business/Analysts     |

## Astuces

### Actualisation Automatique

1. Dans un dashboard, cliquez sur **Edit Dashboard**
2. Allez dans **Settings** → **Dashboard Properties**
3. Activez **Auto-refresh** et choisissez l'intervalle

### Export de Données

1. Ouvrez un graphique
2. Cliquez sur **⋮** (menu)
3. Sélectionnez **Download as CSV** ou **Download as JSON**

### Partage de Dashboard

1. Ouvrez un dashboard
2. Cliquez sur **Share** (icône de partage)
3. Copiez le lien ou créez un embed code

## Troubleshooting

### Erreur de Connexion MySQL

```bash
# Vérifier que MySQL est accessible
docker exec superset-catalogue ping mysql-catalogue -c 1
```

### Vérifier les Logs

```bash
docker logs superset-catalogue
```

### Redémarrer Superset

```bash
docker-compose restart superset
```

### Réinitialiser la Base de Données Superset

```bash
docker-compose down superset
docker volume rm mini-api-catalogue_superset_data
docker-compose up -d superset
```

## Ressources

- **Documentation Superset** : https://superset.apache.org/docs/intro
- **Exemples de Dashboards** : https://superset.apache.org/gallery
- **Tutoriels SQL** : https://www.w3schools.com/sql/

---

**Votre stack complète maintenant** :

- ✅ **Grafana** (3001) : Monitoring technique
- ✅ **Superset** (8088) : Analytics business
- ✅ **Prometheus** (9090) : Collecte métriques
- ✅ **MySQL** (3306) : Base de données
- ✅ **API** (3000) : Backend
- ✅ **React** (5173) : Frontend
