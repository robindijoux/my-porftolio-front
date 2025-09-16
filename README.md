# Portfolio Robin DIJOUX 🚀

> Portfolio moderne et interactif de développeur Full-Stack avec interface d'administration intégrée et authentification AWS Cognito

Un site web moderne et responsive construit avec React, TypeScript et Tailwind CSS, consommant une API RESTful pour afficher dynamiquement les projets et leurs détails. L'application intègre une authentification optionnelle via AWS Cognito pour sécuriser la création de projets.

## ✨ Fonctionnalités Principales

### 🏠 Pages Utilisateur
- **Page d'accueil** : Présentation avec projets phares et statistiques
- **Détail de projet** : Galerie média, stack technique, liens GitHub/Live
- **Interface multilingue** : Support français/anglais avec i18next
- **Navigation fluide** : Routing avec React Router et animations

### 🔐 Interface d'Administration & Authentification
- **Authentification AWS Cognito** : Connexion sécurisée optionnelle
- **Création de projets** : Formulaire complet avec validation (protégé)
- **Upload de médias** : Glisser-déposer avec prévisualisation 
- **Gestion des technologies** : Sélection dynamique du stack technique
- **Validation avancée** : Formulaires avec React Hook Form + Zod
- **Accès public** : Navigation libre sans authentification requise

### 🔧 Fonctionnalités Techniques
- **API RESTful** : Service centralisé avec TanStack Query
- **Gestion d'erreurs** : Messages informatifs avec option de retry
- **États de chargement** : Spinners et feedback visuel
- **Design responsive** : Approche mobile-first avec Tailwind CSS
- **Animations légères** : Transitions et micro-interactions
- **SEO optimisé** : Métadonnées et structure HTML sémantique
- **Upload avancé** : React Dropzone avec gestion multi-formats

## � Authentification AWS Cognito

### Fonctionnement
L'application utilise une **authentification optionnelle** via AWS Cognito. Les visiteurs peuvent explorer librement le portfolio, mais la création de projets nécessite une connexion.

### 🌐 **Accès Public (sans connexion)**
- ✅ Page d'accueil et navigation
- ✅ Visualisation de tous les projets
- ✅ Détails complets des projets
- ✅ Galeries médias et informations techniques

### 🔒 **Accès Protégé (connexion requise)**
- 🔐 Création de nouveaux projets
- 🔐 Upload de médias
- 🔐 Gestion du contenu (futures fonctionnalités)

### Configuration (optionnelle)
Pour activer l'authentification, configurez ces variables d'environnement :

```env
# Configuration AWS Cognito (optionnel)
VITE_AWS_COGNITO_REGION=eu-west-3
VITE_AWS_COGNITO_USER_POOL_ID=your-user-pool-id  
VITE_AWS_COGNITO_CLIENT_ID=your-client-id
VITE_AWS_COGNITO_DOMAIN=https://cognito-idp.region.amazonaws.com/...
VITE_REDIRECT_URI=http://localhost:5173
VITE_AUTH_SCOPE=phone openid email
```

> **Documentation complète** : Consultez `AUTHENTICATION.md` pour la configuration détaillée

## �🛠️ Stack Technique

```
Frontend             Backend API           Authentification
├── React 18         ├── API REST          ├── AWS Cognito
├── TypeScript       ├── Upload médias     ├── OIDC Client
├── Tailwind CSS     ├── Gestion projets   └── Tokens JWT
├── shadcn/ui        └── Technologie stack
├── TanStack Query
├── React Router
├── React Hook Form  
├── React Dropzone
├── i18next
├── Vite
└── Lucide Icons
```

## � Installation & Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/robindijoux/my-porftolio-front.git
cd my-porftolio-front

# Installer les dépendances
npm install

# Configurer les variables d'environnement
echo "VITE_API_URL=https://my-portfolio-back-1.onrender.com/api" > .env

# Démarrer le serveur de développement
npm run dev
```

Le site sera disponible sur `http://localhost:5173`

> **Note sur le port** : Vite utilise par défaut le port 5173. Le port 8080 est configuré pour la production via `vite.config.ts`.

### Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement avec hot reload (port 5173)

# Production
npm run build        # Build de production optimisé
npm run build:dev    # Build de développement avec sources maps
npm run preview      # Prévisualisation du build (port 4173)

# Qualité de code
npm run lint         # Linting avec ESLint
```

## 📁 Structure du Projet

```
src/
├── components/              # Composants réutilisables
│   ├── ui/                 # Composants UI (shadcn/ui - 40+ composants)
│   ├── Header.tsx          # Navigation avec authentification
│   ├── ProjectCard.tsx     # Carte de projet
│   ├── CreateProjectForm.tsx # Formulaire création (protégé)
│   ├── MediaUpload.tsx     # Upload avec React Dropzone
│   ├── AuthComponent.tsx   # Gestion authentification Cognito
│   ├── ProtectedRoute.tsx  # Protection de routes
│   └── LoadingSpinner.tsx  # Composants utilitaires
├── pages/                  # Pages principales
│   ├── Home.tsx           # Page d'accueil
│   ├── ProjectDetail.tsx  # Détail de projet
│   ├── CreateProject.tsx  # Page création (protégée)
│   └── NotFound.tsx       # Page 404
├── services/              # Services et API
│   └── api.ts            # Service REST avec TanStack Query
├── config/               # Configuration
│   └── auth.ts          # Configuration AWS Cognito
├── i18n/                 # Internationalisation
│   ├── config.ts         # Configuration i18next
│   └── locales/          # Fichiers de traduction (fr/en)
├── hooks/                # Hooks personnalisés  
│   ├── useAuthentication.ts # Hook auth Cognito
│   └── use-toast.ts        # Notifications
├── lib/                  # Utilitaires
└── utils/               # Fonctions helper
```

## 🎨 Design System

Le projet utilise un système de design cohérent basé sur :

- **Palette de couleurs** : Thème sombre tech avec accents cyan/violet
- **Typographie** : Hiérarchie claire avec Playfair Display et Inter
- **Composants** : Bibliothèque shadcn/ui personnalisée
- **Animations** : Transitions fluides et micro-interactions
- **Responsive** : Approche mobile-first

### Tokens de Couleur Principaux
```css
--primary: 199 89% 48%        /* Cyan */
--secondary: 262 65% 45%      /* Violet */
--background: 220 27% 8%      /* Bleu foncé */
--card: 222 24% 11%           /* Cartes */
--warm: 25 95% 53%            /* Orange chaleureux */
```

## 🔌 Intégration API

### Service API (`src/services/api.ts`)

Le service API centralise tous les appels REST avec :

- **TanStack Query** pour la gestion du cache et des états
- **Gestion d'erreurs robuste** avec messages i18n
- **Types TypeScript** pour la sécurité type-safe
- **Authentification** intégrée avec tokens Cognito
- **Upload de médias** avec FormData et React Dropzone

### Endpoints Disponibles

```typescript
GET    /projects           // Liste des projets (public)
GET    /projects/:id       // Détails d'un projet (public)
POST   /projects           // Création de projet (protégé)
POST   /media/upload       // Upload de média (protégé)
```

### Format des Données

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  repositoryLink: string;
  projectLink: string;
  media: Media[];
  techStack: Technology[];
  createdAt: string;
  featured: boolean;
  views: number;
  isPublished: boolean;
}
```

## 🌍 Internationalisation

- **Langues supportées** : Français (défaut), Anglais
- **Bibliothèque** : react-i18next
- **Traductions** : Fichiers JSON séparés par langue
- **Sélecteur** : Composant de changement de langue

## 📱 Design Responsive

- **Mobile First** : Conçu pour les écrans mobiles
- **Breakpoints** : `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Grilles flexibles** : Adaptation automatique de la mise en page
- **Navigation optimisée** : Menu adaptatif selon la taille d'écran

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

Le build génère un dossier `dist/` prêt pour le déploiement.

### Déploiement Rapide
- **Vercel** : Déploiement automatique via Git
- **Netlify** : Glisser-déposer le dossier `dist/`
- **Render** : Configuration via `render.yaml`

### Variables d'Environnement
```env
# API Backend (requis)
VITE_API_URL=https://your-api-url.com/api

# Authentification AWS Cognito (optionnel)
VITE_AWS_COGNITO_REGION=eu-west-3
VITE_AWS_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_AWS_COGNITO_CLIENT_ID=your-client-id
VITE_AWS_COGNITO_DOMAIN=https://cognito-idp.region.amazonaws.com/...
VITE_REDIRECT_URI=https://your-domain.com
VITE_AUTH_SCOPE=phone openid email
```

## 🔮 Fonctionnalités Avancées

### ✅ Déjà Implémentées
- Interface d'administration complète
- Upload de médias avec prévisualisation
- Validation de formulaires avancée
- Internationalisation complète
- Design system cohérent
- Gestion d'erreurs robuste

### 🎯 Améliorations Prévues
- **Authentification** : Système de login pour l'admin
- **Éditeur WYSIWYG** : Éditeur de contenu riche
- **Analytics** : Suivi des vues et interactions
- **PWA** : Mode hors ligne et installation
- **SEO avancé** : Métadonnées dynamiques par projet

## 📊 Statistiques du Projet

- **Components** : 25+ composants réutilisables
- **Pages** : 5 pages principales + 404
- **Langues** : 2 langues supportées (FR/EN)
- **API Endpoints** : 4 endpoints principaux 
- **UI Library** : 40+ composants shadcn/ui
- **Authentification** : AWS Cognito avec OIDC
- **Upload** : Support multi-formats (images, vidéos, documents)
- **Cache** : TanStack Query pour optimisation performances

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ par Robin DIJOUX | Construit avec les dernières technologies web modernes**
