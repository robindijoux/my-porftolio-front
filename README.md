# Portfolio Développeur - Site Web Modern

Un portfolio moderne et responsive pour développeur, construit avec React, TypeScript et Tailwind CSS. Le site consomme une API RESTful pour afficher dynamiquement les projets et leurs détails.

## 🚀 Fonctionnalités

### Pages principales
- **Page d'accueil** : Affichage de tous les projets avec mise en avant des projets phares
- **Page détail projet** : Informations complètes avec galerie de médias, stack technique et liens
- **Navigation fluide** : Routing avec React Router et animations smooth

### Fonctionnalités techniques
- **API RESTful** : Service dédié pour les appels API (`GET /projects`, `GET /projects/:id`)
- **Gestion d'erreurs** : Messages d'erreur informatifs avec possibilité de retry
- **États de chargement** : Spinners et feedbacks visuels
- **Design responsive** : Interface adaptative mobile-first
- **Animations légères** : Transitions et hover effects
- **SEO-friendly** : Métadonnées appropriées et structure HTML sémantique

### Stack technique
- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS + Design System custom
- **UI Components** : shadcn/ui
- **Routing** : React Router v6
- **State Management** : React hooks natifs
- **Build Tool** : Vite
- **API Calls** : Fetch API native

## 🛠️ Installation et développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone <url-du-repo>
cd portfolio-dev

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:8080`

### Scripts disponibles

```bash
# Développement
npm run dev          # Serveur de développement avec hot reload

# Production
npm run build        # Build de production
npm run preview      # Preview du build de production

# Qualité de code
npm run lint         # Linting avec ESLint
```

## 📁 Structure du projet

```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI (shadcn)
│   ├── Header.tsx       # En-tête de navigation
│   ├── ProjectCard.tsx  # Carte de projet
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/               # Pages principales
│   ├── Home.tsx         # Page d'accueil
│   ├── ProjectDetail.tsx # Page détail projet
│   └── NotFound.tsx     # Page 404
├── services/            # Services et API
│   └── api.ts          # Service API REST
├── lib/                # Utilitaires
│   └── utils.ts        # Fonctions utilitaires
└── styles/
    └── index.css       # Styles globaux et design system
```

## 🎨 Design System

Le projet utilise un design system cohérent basé sur :

- **Palette de couleurs** : Thème sombre tech avec accents cyan/violet
- **Typographie** : Hiérarchie claire avec polices système
- **Composants** : Bibliothèque shadcn/ui customisée
- **Animations** : Transitions fluides et micro-interactions
- **Responsive** : Approche mobile-first

### Tokens de couleurs principales
```css
--primary: 199 89% 48%        /* Cyan */
--secondary: 262 65% 45%      /* Violet */
--background: 220 27% 8%      /* Bleu foncé */
--card: 222 24% 11%          /* Cartes */
```

## 🔌 API Integration

### Service API (`src/services/api.ts`)

Le service API centralise tous les appels REST avec :

- **Gestion d'erreurs** robuste
- **Types TypeScript** pour la sécurité
- **Simulation de données** pour le développement
- **Interface cohérente** pour les futures extensions

### Endpoints simulés

```typescript
GET /projects           // Liste tous les projets
GET /projects/:id      // Détail d'un projet
GET /projects/featured // Projets en vedette (bonus)
```

### Format des données

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  stack: string[];
  media: Array<{
    type: 'image' | 'video';
    url: string;
    alt?: string;
  }>;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  featured: boolean;
}
```

## 📱 Responsive Design

- **Mobile First** : Conception adaptée aux écrans mobiles
- **Breakpoints** : `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Grilles flexibles** : Adaptation automatique du layout
- **Navigation optimisée** : Menu adaptatif selon la taille d'écran

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

Le build génère un dossier `dist/` prêt pour le déploiement.

### Déploiement rapide
- **Vercel** : `vercel --prod`
- **Netlify** : Drag & drop du dossier `dist/`
- **Lovable** : Click sur "Share → Publish"

## 🔮 Extensions futures

### Interface d'administration (préparation)
- Structure modulaire permettant l'ajout facile d'un admin
- Service API extensible pour les opérations CRUD
- Système d'authentification prêt à intégrer

### Améliorations SEO
- Métadonnées dynamiques par projet
- Génération de sitemap
- Optimisation des images
- Schema.org pour les projets

### Fonctionnalités avancées
- **Filtres** : Par technologie, date, type
- **Recherche** : Recherche full-text dans les projets
- **Analytics** : Suivi des interactions utilisateurs
- **PWA** : Mode offline et installation
- **Internationalisation** : Support multi-langues

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ et les dernières technologies web modernes**
