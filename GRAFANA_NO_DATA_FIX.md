# 🚨 Grafana "No Data" - Solution Rapide

## Symptôme

Les dashboards Grafana affichent **"No data"** alors que :
- ✅ Les données sont dans la base MySQL
- ✅ L'API expose les métriques (`/metrics`)
- ✅ Prometheus collecte les données
- ✅ Les dashboards sont provisionnés

## 🎯 Cause Principale

**La plage de temps (Time Range) est inadéquate !**

Grafana affiche par défaut les données des dernières 6 heures ou 24 heures. Si vous venez de restaurer la base de données et redémarrer les services, **il n'y a pas encore assez de points de données** sur cette période.

## ✅ Solution en 3 Étapes

### 1. Changer la Plage de Temps

Dans Grafana (http://localhost:3001):

1. **Cliquez sur l'horloge** ⏰ en haut à droite
2. Sélectionnez une plage courte :
   - **Last 5 minutes** (recommandé)
   - **Last 15 minutes**
   - **Last 30 minutes**
3. Cliquez **Apply**

### 2. Générer du Trafic

Créez des données récentes :

```bash
# Générer 20 requêtes
for i in {1..20}; do
  curl -s http://localhost:3000/api/products > /dev/null
  curl -s http://localhost:3000/api/categories > /dev/null
  curl -s http://localhost:3000/api/orders > /dev/null
  sleep 1
done
```

Ou utilisez le script :

```bash
bash test-metrics.sh
```

### 3. Rafraîchir Grafana

- **Ctrl + Shift + R** (Windows/Linux)
- **Cmd + Shift + R** (Mac)

Ou cliquez sur l'icône **Refresh** 🔄 en haut à droite.

## 🔍 Vérification Rapide

```bash
# Diagnostic complet
bash diagnose-grafana.sh
```

Ce script vérifie :
- ✅ API expose les métriques
- ✅ Prometheus collecte les données
- ✅ Datasource Grafana configuré
- ✅ Dashboards présents

## 📊 Panels Concernés

### Panneaux Stat (Valeurs Instantanées)

Ces panneaux devraient **toujours fonctionner** car ils affichent la valeur actuelle :

- **Total Products** → `products_count`
- **Total Orders** → `orders_count`
- **Total Users** → `users_count`
- **Total Categories** → `categories_count`

**Si ces panneaux affichent "No data"** :
1. Le datasource n'est pas configuré
2. Redémarrez Grafana : `docker-compose restart grafana`

### Graphiques Time Series (Évolution dans le Temps)

Ces graphiques ont **besoin de plusieurs points de données** :

- **Request Rate** → `rate(http_requests_total[5m])`
- **Response Time (p95)** → `histogram_quantile(...)`
- **CPU Usage** → `rate(process_cpu_seconds_total[5m])`

**Temps nécessaire** : 2-5 minutes après génération de trafic

## 🚨 Si Ça Ne Fonctionne Toujours Pas

### Problème 1 : Datasource Non Trouvé

**Symptôme** : Tous les panneaux affichent "No data"

**Solution** :

```bash
# Redémarrer Grafana
docker-compose restart grafana

# Attendre 30 secondes
sleep 30

# Vérifier les logs
docker logs grafana-catalogue | grep -i "provision"
```

### Problème 2 : Prometheus Ne Scrape Pas

**Symptôme** : Les métriques business (products_count, etc.) fonctionnent mais pas les métriques HTTP

**Solution** :

```bash
# Vérifier Prometheus scrape l'API
curl "http://localhost:9090/api/v1/query?query=up{job='api-backend'}"

# Si "value": 0, redémarrer
docker-compose restart prometheus mini-api-catalogue
```

### Problème 3 : Métriques Obsolètes

**Symptôme** : Les valeurs affichées ne correspondent pas à la base de données

**Solution** :

```bash
# Forcer la mise à jour
curl http://localhost:3000/metrics

# Attendre 15 secondes (scrape_interval)
sleep 15

# Rafraîchir Grafana
```

## 📈 Workflow Normal Après Restauration

1. **Restaurer la base** : `node restore-database.cjs backups/...`
2. **Redémarrer l'API** : `docker-compose restart mini-api-catalogue`
3. **Attendre 30 secondes** : Prometheus commence à scraper
4. **Générer du trafic** : `bash test-metrics.sh`
5. **Ouvrir Grafana** : http://localhost:3001
6. **Changer Time Range** : Last 5 minutes
7. **Attendre 1-2 minutes** : Les graphiques se remplissent

## 🎯 Temps de Latence

| Métrique | Disponibilité |
|----------|---------------|
| Gauges (products_count, etc.) | **Immédiat** |
| Counters (http_requests_total) | **15 secondes** (scrape) |
| Histograms (durations) | **2-3 minutes** (besoin de données) |
| Rate calculations | **5+ minutes** (besoin d'historique) |

## 📞 Support

Si le problème persiste :

1. Exécutez : `bash diagnose-grafana.sh`
2. Copiez la sortie complète
3. Vérifiez les logs : `docker logs grafana-catalogue`

---

**💡 Astuce** : Utilisez **"Last 5 minutes"** comme plage de temps par défaut pendant le développement. Vous verrez les métriques se mettre à jour en temps réel !
