// Service API pour la gestion des appels REST
import project1 from '@/assets/project-1.jpg';
import project2 from '@/assets/project-2.jpg';
import project3 from '@/assets/project-3.jpg';
import project4 from '@/assets/project-4.jpg';

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  stack: string[];
  media: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  }[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  featured: boolean;
}

// Données simulées pour le développement
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Application E-commerce React',
    description: 'Une application e-commerce complète développée avec React, TypeScript et Node.js. Intègre un système de paiement Stripe, gestion des stocks en temps réel, et interface d\'administration avancée. L\'application utilise Redux pour la gestion d\'état et Material-UI pour l\'interface utilisateur.',
    shortDescription: 'Application e-commerce complète avec React et Node.js',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redux'],
    media: [
      { type: 'image', url: project1, alt: 'Page d\'accueil e-commerce' },
      { type: 'image', url: project1, alt: 'Page produit' }
    ],
    liveUrl: 'https://demo-ecommerce.com',
    githubUrl: 'https://github.com/username/ecommerce-app',
    createdAt: '2024-01-15',
    featured: true
  },
  {
    id: '2',
    title: 'Dashboard Analytics Vue.js',
    description: 'Dashboard analytique développé avec Vue.js 3 et Composition API. Affiche des métriques en temps réel avec Chart.js, filtres avancés et exports de données. Utilise Pinia pour la gestion d\'état et Tailwind CSS pour le styling.',
    shortDescription: 'Dashboard analytique en temps réel avec Vue.js',
    stack: ['Vue.js', 'TypeScript', 'Chart.js', 'Pinia', 'Tailwind CSS', 'Firebase'],
    media: [
      { type: 'image', url: project2, alt: 'Dashboard principal' },
      { type: 'image', url: project2, alt: 'Graphiques analytiques' }
    ],
    liveUrl: 'https://dashboard-analytics.com',
    githubUrl: 'https://github.com/username/analytics-dashboard',
    createdAt: '2024-02-20',
    featured: true
  },
  {
    id: '3',
    title: 'API REST Spring Boot',
    description: 'API REST robuste développée avec Spring Boot et Java. Implémente l\'authentification JWT, la documentation Swagger, et des tests unitaires complets. Utilise PostgreSQL comme base de données et Docker pour le déploiement.',
    shortDescription: 'API REST sécurisée avec Spring Boot',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker', 'Swagger'],
    media: [
      { type: 'image', url: project3, alt: 'Documentation Swagger' }
    ],
    githubUrl: 'https://github.com/username/spring-api',
    createdAt: '2024-03-10',
    featured: false
  },
  {
    id: '4',
    title: 'Application Mobile React Native',
    description: 'Application mobile cross-platform développée avec React Native. Intègre la géolocalisation, notifications push, et synchronisation offline. Utilise AsyncStorage pour le cache local et Firebase pour les services backend.',
    shortDescription: 'App mobile cross-platform avec React Native',
    stack: ['React Native', 'TypeScript', 'Firebase', 'AsyncStorage', 'React Navigation'],
    media: [
      { type: 'image', url: project4, alt: 'Écran d\'accueil mobile' },
      { type: 'image', url: project4, alt: 'Interface utilisateur' }
    ],
    liveUrl: 'https://apps.apple.com/app/example',
    githubUrl: 'https://github.com/username/mobile-app',
    createdAt: '2024-04-05',
    featured: true
  }
];

class ApiService {
  private baseUrl = '/api'; // En production, remplacer par l'URL réelle de l'API

  // Simulation d'un délai réseau
  private async simulateNetworkDelay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Gestion des erreurs HTTP
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorMessage = `Erreur HTTP: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Récupération de tous les projets
  async getProjects(): Promise<Project[]> {
    try {
      await this.simulateNetworkDelay();
      
      // En mode développement, retourner les données simulées
      if (process.env.NODE_ENV === 'development' || !this.baseUrl.startsWith('http')) {
        return mockProjects;
      }

      // En production, appel réel à l'API
      const response = await fetch(`${this.baseUrl}/projects`);
      return this.handleResponse<Project[]>(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw new Error('Impossible de charger les projets. Veuillez réessayer.');
    }
  }

  // Récupération d'un projet par ID
  async getProjectById(id: string): Promise<Project> {
    try {
      await this.simulateNetworkDelay();
      
      // En mode développement, retourner les données simulées
      if (process.env.NODE_ENV === 'development' || !this.baseUrl.startsWith('http')) {
        const project = mockProjects.find(p => p.id === id);
        if (!project) {
          throw new Error('Projet non trouvé');
        }
        return project;
      }

      // En production, appel réel à l'API
      const response = await fetch(`${this.baseUrl}/projects/${id}`);
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${id}:`, error);
      throw new Error('Impossible de charger les détails du projet. Veuillez réessayer.');
    }
  }

  // Récupération des projets mis en avant
  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const projects = await this.getProjects();
      return projects.filter(project => project.featured);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets mis en avant:', error);
      throw new Error('Impossible de charger les projets mis en avant.');
    }
  }
}

// Instance unique du service API
export const apiService = new ApiService();

// Types pour la gestion des erreurs
export interface ApiError {
  message: string;
  status?: number;
}

// Hook personnalisé pour la gestion des états d'API (optionnel, pour une future utilisation)
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}