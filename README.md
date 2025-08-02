# Developer Portfolio - Modern Website

A modern, responsive portfolio for developers, built with React, TypeScript, and Tailwind CSS. The site consumes a RESTful API to dynamically display projects and their details.

## 🚀 Features

### Main Pages
- **Home Page**: Displays all projects with featured highlights
- **Project Detail Page**: Full information with media gallery, tech stack, and links
- **Smooth Navigation**: Routing with React Router and smooth animations

### Technical Features
- **RESTful API**: Dedicated service for API calls (`GET /projects`, `GET /projects/:id`)
- **Error Handling**: Informative error messages with retry option
- **Loading States**: Spinners and visual feedback
- **Responsive Design**: Mobile-first adaptive interface
- **Lightweight Animations**: Transitions and hover effects
- **SEO-friendly**: Proper metadata and semantic HTML structure

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **State Management**: Native React hooks
- **Build Tool**: Vite
- **API Calls**: Native Fetch API

## 🛠️ Installation & Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd portfolio-dev

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at `http://localhost:8080`

### Available Scripts

```bash
# Development
npm run dev          # Development server with hot reload

# Production
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Linting with ESLint
```

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── ui/              # UI components (shadcn)
│   ├── Header.tsx       # Navigation header
│   ├── ProjectCard.tsx  # Project card
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/               # Main pages
│   ├── Home.tsx         # Home page
│   ├── ProjectDetail.tsx # Project detail page
│   └── NotFound.tsx     # 404 page
├── services/            # Services and API
│   └── api.ts           # REST API service
├── lib/                 # Utilities
│   └── utils.ts         # Utility functions
└── styles/
  └── index.css        # Global styles and design system
```

## 🎨 Design System

The project uses a consistent design system based on:

- **Color Palette**: Dark tech theme with cyan/violet accents
- **Typography**: Clear hierarchy with system fonts
- **Components**: Customized shadcn/ui library
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first approach

### Main Color Tokens
```css
--primary: 199 89% 48%        /* Cyan */
--secondary: 262 65% 45%      /* Violet */
--background: 220 27% 8%      /* Dark blue */
--card: 222 24% 11%           /* Cards */
```

## 🔌 API Integration

### API Service (`src/services/api.ts`)

The API service centralizes all REST calls with:

- **Robust error handling**
- **TypeScript types** for safety
- **Mock data** for development
- **Consistent interface** for future extensions

### Simulated Endpoints

```typescript
GET /projects           // List all projects
GET /projects/:id       // Project details
GET /projects/featured  // Featured projects (bonus)
```

### Data Format

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

- **Mobile First**: Designed for mobile screens
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Flexible Grids**: Automatic layout adaptation
- **Optimized Navigation**: Adaptive menu based on screen size

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The build generates a `dist/` folder ready for deployment.

### Quick Deployment
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop the `dist/` folder
- **Lovable**: Click "Share → Publish"

## 🔮 Future Extensions

### Admin Interface (planned)
- Modular structure for easy admin addition
- Extensible API service for CRUD operations
- Authentication system ready to integrate

### SEO Improvements
- Dynamic metadata per project
- Sitemap generation
- Image optimization
- Schema.org for projects

### Advanced Features
- **Filters**: By technology, date, type
- **Search**: Full-text search in projects
- **Analytics**: User interaction tracking
- **PWA**: Offline mode and installation
- **Internationalization**: Multi-language support

## 📄 License

This project is MIT licensed. See the `LICENSE` file for details.

---

**Built with ❤️ and the latest modern web technologies**
