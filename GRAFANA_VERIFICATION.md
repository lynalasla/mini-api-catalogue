# 📊 Guide de Vérification Grafana

## ✅ État Actuel

### Services

- **API**: ✅ Opérationnelle (http://localhost:3000)
- **Prometheus**: ✅ Scraping actif (http://localhost:9090)
- **Grafana**: ✅ Démarrée (http://localhost:3001)

### Métriques Disponibles

- **Produits**: 21
- **Commandes**: 1
- **Utilisateurs**: 2
- **Catégories**: 2
- **Requêtes HTTP totales**: 225+

## 🔍 Comment Vérifier que Grafana Fonctionne

### 1. Accéder à Grafana

```
URL: http://localhost:3001
Login: admin
Password: admin
```

### 2. Vérifier le Datasource Prometheus

1. Allez dans **Configuration** (⚙️) → **Data sources**
2. Cliquez sur **Prometheus**
3. Cliquez sur **Test** en bas de la page
4. Vous devriez voir: ✅ **"Data source is working"**

Si le test échoue:

- Vérifiez que l'URL est: `http://prometheus-catalogue:9090`
- Vérifiez que Prometheus tourne: `docker ps | grep prometheus`

### 3. Ouvrir les Dashboards

1. Cliquez sur **Dashboards** (☰) dans le menu de gauche
2. Vous devriez voir le dossier **E-Commerce**
3. Deux dashboards disponibles:
   - **E-Commerce Overview** (métriques business)
   - **API Performance** (métriques techniques)

### 4. Dashboard "E-Commerce Overview"

#### Panneaux Stat (en haut)

Ces panneaux montrent les valeurs **instantanées**:

- **Total Products**: devrait afficher `21`
- **Total Orders**: devrait afficher `1`
- **Total Users**: devrait afficher `2`
- **Total Categories**: devrait afficher `2`

✅ Ces valeurs doivent s'afficher **immédiatement**.

#### Graphiques Time Series (en bas)

Ces graphiques montrent l'**évolution dans le temps**:

- **Request Rate**: requêtes par seconde
- **Response Time (p95)**: temps de réponse 95e percentile
- **Endpoints Statistics**: statistiques par endpoint

⚠️ Ces graphiques peuvent afficher "No data" si:

- Pas assez de données collectées (< 2-3 minutes)
- Plage de temps inadéquate (en haut à droite)

**Solution**:

- Changez la plage de temps en haut à droite: **Last 5 minutes** ou **Last 15 minutes**
- Attendez quelques minutes que Prometheus collecte plus de points de données
- Générez du trafic: `bash test-metrics.sh`

### 5. Dashboard "API Performance"

Ce dashboard montre:

- **CPU Usage**: utilisation du processeur
- **Memory Usage**: utilisation de la mémoire
- **Active Connections**: connexions actives
- **Event Loop Lag**: latence de la boucle d'événements Node.js
- **Response Time Percentiles**: p50, p95, p99
- **HTTP Status Codes**: répartition des codes de réponse
- **Memory Details**: détails de la mémoire (heap, RSS, external)
- **GC Rate**: taux de garbage collection

## 🚨 Résolution des Problèmes

### Problème: Tous les panneaux affichent "No data"

**Cause possible**: Datasource non configuré ou non trouvé

**Solution**:

```bash
# 1. Vérifier que les dashboards ont le bon UID
docker exec grafana-catalogue grep -c '${DS_PROMETHEUS}' //var/lib/grafana/dashboards/ecommerce-overview.json
# Devrait retourner un nombre > 0

# 2. Redémarrer Grafana
docker-compose restart grafana

# 3. Générer du trafic
bash test-metrics.sh
```

### Problème: Panneaux Stat OK, mais graphiques vides

**Cause**: Pas assez de points de données dans le temps

**Solution**:

1. Changez la plage de temps: **Last 15 minutes**
2. Attendez 2-3 minutes
3. Générez plus de trafic:

```bash
# Générer 100 requêtes
for i in {1..20}; do
  curl -s http://localhost:3000/api/products > /dev/null
  curl -s http://localhost:3000/api/categories > /dev/null
  sleep 1
done
```

### Problème: Datasource Prometheus test échoue

**Causes possibles**:

- Prometheus n'est pas démarré
- Mauvaise URL configurée

**Solution**:

```bash
# Vérifier que Prometheus tourne
docker ps | grep prometheus

# Tester depuis Grafana
docker exec grafana-catalogue wget -qO- http://prometheus-catalogue:9090/api/v1/query?query=up

# Redémarrer les deux services
docker-compose restart prometheus grafana
```

## 🎯 Test Rapide

Exécutez ce script pour tout vérifier:

```bash
bash test-metrics.sh
```

## 📈 Métriques Clés à Surveiller

### Business Metrics (E-Commerce Overview)

- **products_count**: Nombre de produits en catalogue
- **orders_count**: Nombre de commandes totales
- **users_count**: Nombre d'utilisateurs
- **categories_count**: Nombre de catégories
- **http_requests_total**: Total des requêtes HTTP
- **rate(http_requests_total[5m])**: Taux de requêtes/seconde

### Technical Metrics (API Performance)

- **process_cpu_user_seconds_total**: Temps CPU utilisateur
- **process_resident_memory_bytes**: Mémoire résidente
- **nodejs_active_handles**: Connexions actives Node.js
- **nodejs_eventloop_lag_seconds**: Latence event loop
- **http_request_duration_seconds**: Durée des requêtes HTTP

## 📊 Requêtes Prometheus Utiles

Testez ces requêtes dans Prometheus (http://localhost:9090):

```promql
# Nombre de produits
products_count

# Taux de requêtes par seconde (sur 5 min)
rate(http_requests_total[5m])

# Temps de réponse p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Requêtes par endpoint
sum by (route) (http_requests_total)

# Mémoire utilisée
process_resident_memory_bytes / 1024 / 1024
```

## 🎉 Tout est OK si...

✅ Datasource Prometheus test réussit  
✅ Les 4 panneaux Stat affichent: 21, 1, 2, 2  
✅ Les graphiques se remplissent après 2-3 minutes  
✅ Les requêtes Prometheus retournent des données

---

**Note**: Les graphiques time-series ont besoin de **plusieurs points de données** collectés dans le temps. Si vous venez de démarrer Grafana, attendez 5-10 minutes pour voir les courbes apparaître, ou générez du trafic avec `test-metrics.sh`.
