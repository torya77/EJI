# 🏛️ EJI - Application de Tourisme Algérien

## 📋 Description

**EJI** (Explore Journey Intelligence) est une plateforme complète de tourisme pour l'Algérie, similaire à GetYourGuide. Elle connecte les voyageurs avec des prestataires locaux authentiques pour découvrir les trésors cachés de l'Algérie.

## ✨ Fonctionnalités Principales

### 🎯 **Pour les Voyageurs**
- 🗺️ **Carte Interactive** : Événements et restaurants recommandés
- 🏛️ **Découverte Culturelle** : Visite de la Casbah d'Alger (UNESCO)
- 🚗 **Location de Voitures** : Intégration Yassir et iDrive
- 👥 **Guides Locaux Authentiques** : Guides certifiés et passionnés
- 💬 **Réseau Social** : Partage d'expériences de voyage
- 🛒 **Marketplace** : Produits artisanaux algériens
- 🌐 **Multilingue** : Français, Arabe, Coréen, Allemand, Anglais
- 📸 **Traducteur Photo** : Menus et panneaux traduits
- 💱 **Convertisseur de Devises** : Taux de change temps réel

### 🏢 **Pour les Prestataires**
- 📊 **Tableau de Bord Complet** : Statistiques, réservations, revenus
- ✅ **Système d'Approbation** : Processus qualité en 4 étapes
- 💰 **Transparence des Commissions** : Calculs clairs par type
- 🔔 **Notifications Temps Réel** : Nouvelles réservations, approbations
- 📝 **Gestion d'Activités** : Création et modification de services
- 👤 **Gestion de Profil** : Informations et certifications

### 👨‍💼 **Pour les Administrateurs**
- 🎛️ **Panel d'Administration** : Vue d'ensemble de la plateforme
- 📈 **Statistiques Avancées** : Revenus, prestataires, activités
- ✅ **Approbation Prestataires** : Validation qualité et charte
- 🔔 **Notifications Admin** : Nouveaux prestataires, activités
- 📊 **Analytics** : Performance de la plateforme

## 🏗️ Architecture Technique

### **Stack Technologique**
- **Frontend** : React 18, Tailwind CSS, Radix UI
- **Backend** : FastAPI (Python), Pydantic
- **Base de Données** : MongoDB avec Motor (async)
- **Authentification** : Bearer Token system
- **Déploiement** : Supervisorctl, NGINX
- **UI/UX** : Responsive design, composants accessibles

### **Structure du Projet**
```
/app
├── backend/                 # API FastAPI
│   ├── models/             # Modèles Pydantic
│   │   ├── notification.py # Système de notifications
│   │   ├── user.py        # Modèles utilisateurs
│   │   └── ...
│   ├── routes/             # Endpoints API
│   │   ├── admin.py       # Routes administrateur
│   │   ├── providers.py   # Routes prestataires
│   │   ├── notifications.py # API notifications
│   │   └── ...
│   ├── server.py          # Application principale
│   └── requirements.txt   # Dépendances Python
└── frontend/               # Application React
    ├── src/
    │   ├── components/     # Composants réutilisables
    │   │   ├── ui/        # Composants UI (Radix)
    │   │   ├── NotificationCenter.jsx
    │   │   └── ...
    │   ├── pages/         # Pages principales
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ProviderDashboard.jsx
    │   │   ├── ProviderRegistration.jsx
    │   │   └── ...
    │   ├── services/      # Services API
    │   └── contexts/      # Contextes React
    └── package.json       # Dépendances Node.js
```

## 🚀 Installation et Configuration

### **Prérequis**
- Python 3.8+
- Node.js 16+
- MongoDB
- Yarn ou npm

### **Installation Backend**
```bash
cd backend
pip install -r requirements.txt

# Configuration environnement
cp .env.example .env
# Modifier MONGO_URL selon votre configuration MongoDB

# Démarrage
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### **Installation Frontend**
```bash
cd frontend
yarn install

# Configuration environnement
cp .env.example .env
# Modifier REACT_APP_BACKEND_URL=http://localhost:8001

# Démarrage
yarn start
```

### **Démarrage avec Supervisorctl (Production)**
```bash
# Démarrer tous les services
sudo supervisorctl start all

# Vérifier le statut
sudo supervisorctl status

# Redémarrer
sudo supervisorctl restart all
```

## 📡 API Documentation

### **Endpoints Principaux**

#### **Authentication**
- `Bearer admin_token_123` (Admin)
- `Bearer provider_1_token` (Prestataire)

#### **Admin API** (`/api/admin/`)
- `GET /stats` - Statistiques plateforme
- `GET /providers` - Liste prestataires
- `PUT /providers/{id}/status` - Approuver/Rejeter prestataire
- `GET /activities` - Liste activités
- `PUT /activities/{id}/status` - Approuver/Rejeter activité

#### **Prestataires API** (`/api/providers/`)
- `GET /me` - Profil prestataire
- `PUT /me` - Modifier profil
- `GET /dashboard/stats` - Statistiques tableau de bord
- `GET /activities` - Mes activités
- `POST /activities` - Créer activité
- `GET /bookings` - Mes réservations
- `PUT /bookings/{id}/status` - Modifier statut réservation

#### **Notifications API** (`/api/notifications/`)
- `GET /` - Mes notifications (pagination, filtres)
- `GET /stats` - Statistiques notifications
- `PUT /{id}` - Marquer comme lu
- `PUT /mark-all-read` - Tout marquer comme lu
- `DELETE /{id}` - Supprimer notification

### **Commissions par Type de Prestataire**
- **Guide Local** : 15%
- **Restaurant/Café** : 12%
- **Hébergement** : 10%
- **Transport** : 15%
- **Artisan/Vendeur** : 8%
- **Organisateur Événements** : 15%

## 🎨 Composants UI Principaux

### **Pages**
- `Home.jsx` - Page d'accueil avec Casbah
- `ProviderDashboard.jsx` - Tableau de bord prestataire
- `AdminDashboard.jsx` - Panel administrateur
- `ProviderRegistration.jsx` - Inscription prestataire (4 étapes)
- `CarRental.jsx` - Location de voitures
- `LocalGuides.jsx` - Guides locaux

### **Composants**
- `NotificationCenter.jsx` - Centre de notifications
- `Header.jsx` - Navigation principale
- `EJIServicesMenu.jsx` - Menu services EJI
- `TranslatorModal.jsx` - Traducteur photo
- `CurrencyConverter.jsx` - Convertisseur devises

## 🔔 Système de Notifications

### **Types de Notifications**

#### **Prestataires**
- `new_booking` - Nouvelle réservation
- `provider_approved` - Profil approuvé
- `payment_received` - Paiement reçu
- `review_received` - Nouvel avis client

#### **Administrateurs**
- `new_provider_registration` - Nouveau prestataire
- `provider_needs_approval` - Approbation nécessaire

### **Priorités**
- `urgent` - Rouge
- `high` - Orange  
- `medium` - Bleu
- `low` - Gris

## 📱 Features Mobiles

- Design 100% responsive
- Menu mobile optimisé
- Notifications adaptatives
- Interface tactile intuitive

## 🌍 Internationalisation

Support de 5 langues avec contexte React :
- 🇫🇷 Français (par défaut)
- 🇸🇦 Arabe
- 🇰🇷 Coréen  
- 🇩🇪 Allemand
- 🇬🇧 Anglais

## 🔐 Sécurité

- Authentification Bearer Token
- Validation Pydantic côté backend
- Protection CORS configurée
- Validation des entrées utilisateur
- Gestion d'erreurs robuste

## 🧪 Tests

### **Backend**
Tests complets des API avec authentification :
```bash
python backend_test.py
```

### **Frontend**
Tests automatisés Playwright disponibles

## 📈 Performance

- Polling notifications optimisé (30s)
- Lazy loading des composants
- API pagination
- Gestion du cache navigateur
- Images optimisées

## 🚀 Déploiement

### **Variables d'Environnement Requises**

**Backend** (`.env`)
```
MONGO_URL=mongodb://localhost:27017/eji_database
```

**Frontend** (`.env`)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### **Production**
- Service managé par Supervisorctl
- NGINX reverse proxy
- MongoDB clustering recommandé
- Logs centralisés

## 🤝 Contribution

### **Structure des Commits**
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Style/UI
- `refactor:` Refactoring
- `test:` Tests

## 📞 Support

Pour toute question technique ou fonctionnelle concernant la plateforme EJI.

## 📜 Licence

Application développée pour promouvoir le tourisme algérien.

---

# 🎊 Statut du Projet

## ✅ **Fonctionnalités Complétées**
- ✅ Homepage avec Casbah UNESCO
- ✅ Système de notifications temps réel
- ✅ Provider Dashboard complet
- ✅ Admin Panel avec approbations
- ✅ Inscription prestataires (4 étapes)
- ✅ Location voitures (Yassir/iDrive)
- ✅ Guides locaux authentiques
- ✅ Transparence commissions
- ✅ Design responsive complet
- ✅ API REST complète
- ✅ Tests backend/frontend

## 🚀 **Prêt pour Production**

L'application EJI est **entièrement fonctionnelle** et prête pour le déploiement en production avec toutes les fonctionnalités principales implémentées, testées et validées.

**🏆 Mission Accomplie !**
