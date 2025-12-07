# ⚡ SOLUTION RAPIDE : Grafana "No Data"

## 🎯 Les données SONT là !

✅ API expose les métriques  
✅ Prometheus collecte les données (234 requêtes enregistrées)  
✅ Dashboards sont provisionnés  

## ❌ Pourquoi vous voyez "No Data" ?

**La plage de temps (Time Range) est trop large !**

Par défaut, Grafana affiche les **dernières 6 heures** ou **24 heures**.  
Mais vos métriques ont été générées il y a **quelques minutes** seulement.

## ✅ SOLUTION (30 secondes)

### Dans Grafana (http://localhost:3001)

#### Étape 1 : Cliquez sur l'horloge ⏰
En haut à droite de l'écran, vous verrez une horloge avec quelque chose comme "Last 6 hours" ou "Last 24 hours"

#### Étape 2 : Changez pour "Last 5 minutes"
Dans le menu déroulant qui s'ouvre :
- Cherchez **"Last 5 minutes"**
- OU entrez manuellement :
  - **From** : `now-5m`
  - **To** : `now`

#### Étape 3 : Appliquez
- Cliquez sur **"Apply"** (en bas à droite du sélecteur)

#### Étape 4 : Rafraîchissez
- Cliquez sur l'icône **Refresh** 🔄 en haut à droite
- OU appuyez sur **F5**

## 🎉 Résultat

Vous devriez maintenant voir :
- **Total Products** : 21 ✅
- **Total Orders** : 1 ✅
- **Total Users** : 2 ✅
- **Total Categories** : 2 ✅
- **Graphiques avec des données** 📊

## 🔄 Si Toujours Vide

Exécutez ce script pour générer plus de données :

```bash
bash test-grafana-data.sh
```

Ce script :
1. ✅ Vérifie Prometheus
2. ✅ Génère 30 nouvelles requêtes
3. ✅ Attend 15 secondes
4. ✅ Vous dit quand rafraîchir

## 📸 À Quoi Ça Ressemble

### AVANT (Time Range: Last 24 hours)
```
CPU Usage: No data
Memory Usage: No data
Active Connections: No data
Event Loop Lag: No data
```

### APRÈS (Time Range: Last 5 minutes)
```
CPU Usage: [graphique avec données] ✅
Memory Usage: [graphique avec données] ✅
Active Connections: [graphique avec données] ✅
Event Loop Lag: [graphique avec données] ✅
```

## 💡 Pourquoi Ce Problème ?

1. **docker-compose up** lance les services
2. **metrics-init** génère 30 requêtes (environ 30 secondes)
3. **Prometheus** collecte toutes les 15 secondes
4. **Vous** : Ouvrez Grafana immédiatement
5. **Grafana** : Affiche "Last 6 hours" par défaut
6. **Résultat** : Données récentes (< 5 min) noyées dans 6 heures vides

## 🎯 Solution Permanente

Une fois que vous avez changé pour "Last 5 minutes" :

1. Les dashboards gardent cette configuration
2. Les données s'accumulent avec le temps
3. Après quelques heures, vous pouvez revenir à "Last 6 hours"
4. Pour le développement, **"Last 5 minutes"** est idéal

## 📊 Types de Panneaux

### Gauges (Valeurs Instantanées)
Ces panneaux fonctionnent **TOUJOURS** :
- Total Products
- Total Orders
- Total Users
- Total Categories

**Si ceux-ci disent "No data"** → Redémarrez Grafana : `docker-compose restart grafana`

### Time Series (Graphiques)
Ces panneaux nécessitent **plusieurs points de données** :
- CPU Usage
- Memory Usage
- Request Rate
- Response Time

**Temps nécessaire** : 2-5 minutes de collecte

## 🆘 Aide Supplémentaire

```bash
# Diagnostic complet
bash diagnose-grafana.sh

# Test et génération de données
bash test-grafana-data.sh

# Vérifier les logs
docker logs metrics-init-catalogue
docker logs grafana-catalogue | tail -50
```

---

**🎯 TL;DR** : Changez Time Range de "Last 6 hours" → **"Last 5 minutes"** dans Grafana !
