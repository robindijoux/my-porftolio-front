# Portfolio Robin DIJOUX 🚀

> Portfolio moderne et interactif de développeur Full-Stack avec interface d'administration intégrée

Un site web moderne et responsive construit avec React, TypeScript et Tailwind CSS, consommant une API RESTful pour afficher dynamiquement les projets et leurs détails.

## ✨ Fonctionnalités Principales

### 🏠 Pages Utilisateur
- **Page d'accueil** : Présentation avec projets phares et statistiques
- **Détail de projet** : Galerie média, stack technique, liens GitHub/Live
- **Interface multilingue** : Support français/anglais avec i18next
- **Navigation fluide** : Routing avec React Router et animations

### ⚙️ Interface d'Administration
- **Création de projets** : Formulaire complet avec validation
- **Upload de médias** : Glisser-déposer avec prévisualisation
- **Gestion des technologies** : Sélection dynamique du stack technique
- **Validation avancée** : Formulaires avec React Hook Form + Zod

### 🔧 Fonctionnalités Techniques
- **API RESTful** : Service centralisé pour tous les appels
- **Gestion d'erreurs** : Messages informatifs avec option de retry
- **États de chargement** : Spinners et feedback visuel
- **Design responsive** : Approche mobile-first
- **Animations légères** : Transitions et micro-interactions
- **SEO optimisé** : Métadonnées et structure HTML sémantique

## 🛠️ Stack Technique

```
Frontend          Backend API
├── React 18      ├── API REST
├── TypeScript    ├── Upload médias
├── Tailwind CSS  ├── Gestion projets
├── shadcn/ui     └── Technologie stack
├── React Router
├── React Hook Form
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
git clone https://github.com/robindijoux/my-portfolio-front.git
cd my-portfolio-front

# Installer les dépendances
npm install

# Configurer les variables d'environnement
echo "VITE_API_URL=https://my-portfolio-back-1.onrender.com/api" > .env

# Démarrer le serveur de développement
npm run dev
```

Le site sera disponible sur `http://localhost:8080`

### Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement avec hot reload

# Production
npm run build        # Build de production
npm run build:dev    # Build de développement
npm run preview      # Prévisualisation du build

# Qualité de code
npm run lint         # Linting avec ESLint
```

## 📁 Structure du Projet

```
src/
├── components/              # Composants réutilisables
│   ├── ui/                 # Composants UI (shadcn/ui)
│   ├── Header.tsx          # Navigation principale
│   ├── ProjectCard.tsx     # Carte de projet
│   ├── CreateProjectForm.tsx # Formulaire création
│   ├── MediaUpload.tsx     # Upload de médias
│   └── LoadingSpinner.tsx  # Composants utilitaires
├── pages/                  # Pages principales
│   ├── Home.tsx           # Page d'accueil
│   ├── ProjectDetail.tsx  # Détail de projet
│   ├── CreateProject.tsx  # Page création
│   └── NotFound.tsx       # Page 404
├── services/              # Services et API
│   └── api.ts            # Service REST centralisé
├── i18n/                 # Internationalisation
│   ├── config.ts         # Configuration i18next
│   └── locales/          # Fichiers de traduction
├── hooks/                # Hooks personnalisés
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

- **Gestion d'erreurs robuste** avec messages i18n
- **Types TypeScript** pour la sécurité
- **Interface cohérente** pour les extensions futures
- **Upload de médias** avec FormData

### Endpoints Disponibles

```typescript
GET    /projects           // Liste des projets
GET    /projects/:id       // Détails d'un projet
POST   /projects           // Création de projet
POST   /media/upload       // Upload de média
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
VITE_API_URL=https://your-api-url.com/api
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

- **Components** : 20+ composants réutilisables
- **Pages** : 5 pages principales + 404
- **Langues** : 2 langues supportées
- **API Endpoints** : 4 endpoints principaux
- **UI Library** : 40+ composants shadcn/ui

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
