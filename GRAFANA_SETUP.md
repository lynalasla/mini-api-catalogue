# 🎉 Grafana est maintenant opérationnel !

## ✅ Ce qui fonctionne

- **Grafana**: Accessible sur http://localhost:3001
- **Prometheus**: Collecte les métriques depuis http://localhost:9090
- **API Metrics**: Expose les données sur http://localhost:3000/metrics

## 🔑 Accès à Grafana

1. Ouvrez votre navigateur : **http://localhost:3001**
2. Connectez-vous avec :
   - **Username**: `admin`
   - **Password**: `admin`

## 📊 Configuration Manuelle des Dashboards

### Étape 1 : Vérifier le Datasource Prometheus

1. Dans Grafana, cliquez sur **☰ Menu** (en haut à gauche)
2. Allez dans **Connections** → **Data sources**
3. Vous devriez voir **Prometheus** configuré automatiquement
4. Cliquez dessus et scrollez en bas
5. Cliquez sur **Save & Test**
6. Vous devez voir : ✅ **"Successfully queried the Prometheus API"**

### Étape 2 : Importer le Dashboard E-Commerce Overview

1. Cliquez sur **☰ Menu** → **Dashboards**
2. Cliquez sur **New** → **Import**
3. Cliquez sur **Upload dashboard JSON file**
4. Sélectionnez le fichier : `grafana/dashboards/ecommerce-overview.json`
5. Dans la page d'import :
   - Sélectionnez **Prometheus** comme datasource
   - Cliquez sur **Import**

✅ Vous devriez maintenant voir 7 panneaux :

- **Total Products**: 21
- **Total Orders**: 1
- **Total Users**: 2
- **Total Categories**: 2
- **Request Rate**: Graphique en temps réel
- **Response Time (p95)**: Graphique de performance
- **Endpoints Statistics**: Table des endpoints

### Étape 3 : Importer le Dashboard API Performance

Répétez la même procédure avec le fichier :

- `grafana/dashboards/api-performance.json`

✅ Ce dashboard affiche 8 métriques techniques :

- CPU Usage
- Memory Usage
- Active Connections
- Event Loop Lag
- Response Time Percentiles (p50, p95, p99)
- HTTP Status Codes
- Memory Details
- Garbage Collection Rate

## 🚀 Générer Plus de Données

Pour voir les graphiques se remplir, générez du trafic :

```bash
bash test-metrics.sh
```

Ce script génère 50 requêtes HTTP et affiche les métriques collectées.

## 🔍 Vérifier que Tout Fonctionne

### Test 1 : Métriques API

```bash
curl http://localhost:3000/metrics | grep "products_count\|orders_count"
```

Devrait afficher :

```
products_count 21
orders_count 1
```

### Test 2 : Prometheus collecte les données

```bash
curl "http://localhost:9090/api/v1/query?query=products_count"
```

Devrait retourner la valeur `21`.

### Test 3 : Grafana peut interroger Prometheus

Dans Grafana, allez dans **Explore** (icône boussole) et testez cette requête :

```promql
products_count
```

Vous devriez voir la valeur 21.

## 📈 Requêtes PromQL Utiles

Copiez ces requêtes dans Grafana (Explore ou Dashboard panels) :

```promql
# Nombre de produits
products_count

# Taux de requêtes HTTP par seconde
rate(http_requests_total[5m])

# Temps de réponse 95e percentile
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Requêtes par endpoint
sum by (route) (rate(http_requests_total[5m]))

# Utilisation mémoire en MB
process_resident_memory_bytes / 1024 / 1024

# Connexions actives
nodejs_active_handles
```

## ⚠️ Points d'Attention

### Les graphiques time-series sont vides ?

C'est normal si vous venez de démarrer ! Les graphiques ont besoin de **plusieurs points de données** dans le temps :

1. **Changez la plage de temps** : En haut à droite du dashboard, changez de "Last 1 hour" à "Last 15 minutes"
2. **Attendez 2-3 minutes** : Prometheus scrape toutes les 10-15 secondes
3. **Générez du trafic** : `bash test-metrics.sh`

### Le panneau "Total Products" affiche "No data" ?

1. Vérifiez que le datasource est sélectionné dans le panneau
2. En mode édition du panneau, vérifiez que la requête est : `products_count`
3. Vérifiez que l'UID du datasource est bien `PROMETHEUS` (ou laissez-le vide pour utiliser le default)

## 🎨 Personnalisation

Vous pouvez modifier les dashboards :

1. Ouvrez un dashboard
2. Cliquez sur l'icône ⚙️ (Settings) en haut à droite
3. Cliquez sur le panneau que vous voulez modifier
4. Cliquez sur **Edit**
5. Modifiez la requête, le titre, les couleurs, etc.
6. Cliquez sur **Apply**
7. N'oubliez pas de **Save dashboard** (icône 💾 en haut)

## 📚 Documentation

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **API Metrics**: http://localhost:3000/metrics
- **PromQL Docs**: https://prometheus.io/docs/prometheus/latest/querying/basics/

## 🆘 Besoin d'Aide ?

Si quelque chose ne fonctionne pas :

```bash
# Vérifier les logs
docker logs grafana-catalogue
docker logs prometheus-catalogue
docker logs mini-api-catalogue

# Redémarrer les services
docker-compose restart grafana prometheus

# Vérifier que les containers tournent
docker ps | grep "grafana\|prometheus"
```

---

**Note**: Les dashboards ne sont pas provisionnés automatiquement pour éviter les erreurs de démarrage. Vous devez les importer manuellement une seule fois via l'interface Grafana.
