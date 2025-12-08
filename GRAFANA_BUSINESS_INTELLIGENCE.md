# Business Intelligence avec Grafana

## 📊 Vue d'ensemble

Ce projet utilise **Grafana** comme plateforme unique de Business Intelligence et monitoring. Grafana est connecté à Prometheus qui collecte les métriques de l'application en temps réel.

## 🎯 Dashboards Disponibles

### 1. **Business Intelligence - E-Commerce** 
**URL:** http://localhost:3001/d/business-intelligence

Le dashboard principal de Business Intelligence avec les panels suivants :

#### Métriques Financières
- 💰 **Chiffre d'Affaires Total** : Revenu cumulé de toutes les commandes
- 💵 **Panier Moyen** : Valeur moyenne des commandes (CA total / nombre de commandes)
- 📈 **Évolution du CA** : Graphique temporel du chiffre d'affaires
- 📊 **Taux de Commandes** : Nombre de commandes par minute

#### Métriques Clients
- 👥 **Clients Inscrits** : Nombre total d'utilisateurs enregistrés
- ✅ **Taux de Succès API** : Pourcentage de requêtes HTTP réussies (200)

#### Métriques Opérationnelles
- 📦 **Commandes Totales** : Nombre total de commandes passées
- 🛒 **Requêtes par Endpoint** : Distribution des appels API produits
- 🔥 **Top 10 Endpoints** : Endpoints les plus populaires
- 📊 **Vue d'ensemble Catalogue** : Évolution des produits, catégories, utilisateurs, commandes

### 2. **E-Commerce Overview**
**URL:** http://localhost:3001/d/ecommerce-overview

Métriques générales de l'e-commerce.

### 3. **API Performance**
**URL:** http://localhost:3001/d/api-performance

Performance technique de l'API (temps de réponse, codes HTTP, etc.).

## 🔌 API Analytics

De nouvelles routes API ont été ajoutées pour la Business Intelligence :

### Revenus
```bash
GET /api/analytics/revenue
```
Retourne :
- `totalRevenue` : Chiffre d'affaires total
- `averageOrderValue` : Panier moyen
- `totalOrders` : Nombre de commandes
- `todayRevenue` : CA du jour
- `todayOrders` : Commandes du jour

### Clients
```bash
GET /api/analytics/customers
```
Retourne :
- `totalCustomers` : Nombre total de clients
- `activeCustomers` : Clients ayant passé au moins une commande
- `averageLifetimeValue` : Valeur vie client moyenne (LTV)
- `topCustomers` : Top 10 des meilleurs clients

### Conversion
```bash
GET /api/analytics/conversion
```
Retourne :
- `totalVisitors` : Nombre de visiteurs (utilisateurs inscrits)
- `convertedVisitors` : Utilisateurs ayant commandé
- `conversionRate` : Taux de conversion en %

### Inventaire
```bash
GET /api/analytics/inventory
```
Retourne :
- `totalProducts` : Nombre total de produits
- `lowStockProducts` : Produits avec stock < 10
- `outOfStockProducts` : Produits en rupture (stock = 0)
- `totalStockValue` : Valeur totale du stock
- `lowStockPercentage` : % de produits en stock faible

### Top Ventes
```bash
GET /api/analytics/products/top-sellers?limit=10
```
Retourne les produits les plus vendus avec :
- `orderCount` : Nombre de commandes contenant le produit
- `totalQuantitySold` : Quantité totale vendue
- `totalRevenue` : Revenu généré par le produit

### Dashboard Global
```bash
GET /api/analytics/dashboard
```
Retourne une vue d'ensemble complète de toutes les métriques clés.

## 📈 Métriques Prometheus

Les métriques suivantes sont exposées sur `/metrics` :

### Métriques Business Standard
- `products_count` : Nombre de produits au catalogue
- `orders_count` : Nombre total de commandes
- `users_count` : Nombre d'utilisateurs inscrits
- `categories_count` : Nombre de catégories

### Nouvelles Métriques BI
- `orders_total_value` : Valeur totale des commandes (CA)
- `average_order_value` : Panier moyen
- `conversion_rate` : Taux de conversion (%)
- `customer_lifetime_value` : Distribution LTV (histogram)
- `low_stock_products_count` : Produits en stock faible
- `revenue_today` : CA du jour
- `orders_today` : Commandes du jour
- `active_users_count` : Clients actifs

### Métriques Techniques
- `http_requests_total` : Total des requêtes HTTP
- `http_request_duration_seconds` : Durée des requêtes (histogram)
- `active_connections` : Connexions actives

## 🚀 Accès Grafana

**URL:** http://localhost:3001

**Credentials par défaut:**
- Username: `admin`
- Password: `admin`

### Navigation
1. Cliquez sur le menu hamburger (☰) en haut à gauche
2. Allez dans **Dashboards**
3. Sélectionnez le dashboard souhaité

### Refresh automatique
Les dashboards se rafraîchissent automatiquement toutes les **5 secondes** pour afficher les données en temps réel.

### Time Range
Par défaut, les dashboards affichent les **5 dernières minutes**. Vous pouvez changer cela dans le sélecteur de temps en haut à droite.

## 🔄 Auto-Provisioning

Les dashboards sont automatiquement provisionnés au démarrage de Grafana via :
- `grafana/provisioning/dashboards/dashboards.yml` : Configuration du provisioning
- `grafana/dashboards/` : Fichiers JSON des dashboards

Les modifications dans les fichiers JSON sont détectées automatiquement (toutes les 10 secondes) sans redémarrage de Grafana.

## 🎨 Personnalisation

### Modifier un dashboard existant
1. Ouvrez le dashboard dans Grafana
2. Cliquez sur l'icône engrenage (⚙️) en haut à droite
3. Modifiez les panels, variables, etc.
4. Cliquez sur **Save** puis **Save JSON to file**
5. Remplacez le fichier dans `grafana/dashboards/`

### Ajouter un nouveau dashboard
1. Créez le dashboard dans l'interface Grafana
2. Exportez-le en JSON
3. Placez le fichier dans `grafana/dashboards/`
4. Le dashboard sera automatiquement provisionné

## 🔍 Utilisation Avancée

### Créer une alerte
Grafana permet de créer des alertes sur n'importe quelle métrique :
1. Éditez un panel
2. Allez dans l'onglet **Alert**
3. Configurez les conditions (ex: CA < 1000€)
4. Ajoutez un canal de notification (email, Slack, etc.)

### Variables de dashboard
Les dashboards peuvent utiliser des variables pour filtrer dynamiquement :
```json
{
  "templating": {
    "list": [
      {
        "name": "category",
        "type": "query",
        "query": "label_values(products_count, category)"
      }
    ]
  }
}
```

### Annotations
Marquez des événements importants sur les graphiques :
- Lancements de produits
- Campagnes marketing
- Incidents techniques

## 📊 Exemples de Requêtes PromQL

### Calculs de métriques

**Taux de croissance du CA (5 dernières minutes):**
```promql
rate(orders_total_value[5m])
```

**Nombre de commandes par heure:**
```promql
increase(orders_count[1h])
```

**Pourcentage de requêtes réussies:**
```promql
(sum(http_requests_total{status_code="200"}) / sum(http_requests_total)) * 100
```

**Top 5 produits les plus consultés:**
```promql
topk(5, products_viewed_total)
```

**Panier moyen en temps réel:**
```promql
orders_total_value / orders_count
```

## 🛠️ Troubleshooting

### Dashboard vide "No data"
1. Vérifiez que Prometheus scrape bien l'API :
   ```bash
   curl http://localhost:9090/api/v1/targets
   ```
2. Vérifiez que les métriques sont exposées :
   ```bash
   curl http://localhost:3000/metrics | grep orders
   ```

### Métriques non mises à jour
Les métriques BI sont calculées lors des appels aux endpoints `/api/analytics/*`. Pour forcer la mise à jour :
```bash
curl http://localhost:3000/api/analytics/dashboard
```

### Données historiques manquantes
Prometheus ne conserve par défaut que 15 jours de données. Pour augmenter :
```yaml
# prometheus.yml
global:
  retention: 30d
```

## 📚 Ressources

- [Documentation Grafana](https://grafana.com/docs/)
- [Documentation Prometheus](https://prometheus.io/docs/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [Grafana Dashboards Community](https://grafana.com/grafana/dashboards/)

## ⚠️ Note sur Superset

Apache Superset a été **retiré** du projet en raison de problèmes d'intégration avec MySQL. Grafana offre toutes les fonctionnalités nécessaires pour la Business Intelligence avec une configuration plus simple et une meilleure intégration avec Prometheus.

Si vous avez besoin de fonctionnalités BI avancées non disponibles dans Grafana (SQL Lab, semantic layer, etc.), vous pouvez envisager :
- **Metabase** : Alternative open-source plus simple
- **Redash** : Orienté requêtes SQL et data viz
- **Apache Superset avec PostgreSQL** : Plus stable que MySQL

## 🎯 Prochaines Étapes

1. ✅ Dashboard Business Intelligence créé
2. ✅ Métriques BI ajoutées à Prometheus
3. ✅ Routes analytics implémentées
4. 🔄 Génération de données de test pour peupler les graphiques
5. ⏳ Alertes sur métriques critiques (CA, stock, erreurs)
6. ⏳ Export de rapports automatisés
7. ⏳ Intégration avec système de notification

---

**Auteur:** Mini API Catalogue Team  
**Dernière mise à jour:** 2024
