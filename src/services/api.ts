// Service API pour la gestion des appels REST
import i18n from '@/i18n/config';

export interface Project {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  shortDescription: string;
  repositoryLink: string;
  projectLink: string;
  media: Media[];
  views: number;
  techStack: Technology[];
  createdAt: string;
  featured: boolean;
}

export interface Technology {
  technology: string;
  iconUrl: string;
}

export interface Media {
  id: string;
  type: string;
  url: string;
  alt?: string;
}


export interface CreateProjectData {
  name: string;
  description: string;
  shortDescription: string;
  repositoryLink: string;
  projectLink: string;
  isPublished: boolean;
  featured: boolean;
  media: string[];
  techStack: Technology[];
}

export interface MediaUploadResponse {
  id: string;
  type: string;
  url: string;
  alt?: string;
  filename: string;
}

class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL || 'https://my-portfolio-back-1.onrender.com/api'

  // Upload de média
  async uploadMedia(file: File, alt?: string): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (alt) {
        formData.append('alt', alt);
      }

      const response = await fetch(`${this.baseUrl}/media/upload`, {
        method: 'POST',
        body: formData,
      });
      return this.handleResponse<MediaUploadResponse>(response);
    } catch (error) {
      console.error('Erreur lors de l\'upload du média:', error);
      throw new Error(i18n.t('errors.mediaUploadError'));
    }
  }

  // Création d'un nouveau projet
  async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description,
          shortDescription: projectData.shortDescription,
          repositoryLink: projectData.repositoryLink,
          projectLink: projectData.projectLink,
          isPublished: projectData.isPublished,
          featured: projectData.featured,
          media: projectData.media,
          techStack: projectData.techStack,
        }),
      });
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw new Error(i18n.t('errors.projectCreateError'));
    }
  }

  // Gestion des erreurs HTTP
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorMessage = i18n.t('errors.httpError', { 
        status: response.status, 
        statusText: response.statusText 
      });
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Récupération de tous les projets
  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`);
      return this.handleResponse<Project[]>(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw new Error(i18n.t('errors.projectsLoadError'));
    }
  }

  // Récupération d'un projet par ID
  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await fetch(`${this.baseUrl}/projects/${id}`);
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${id}:`, error);
      throw new Error(i18n.t('errors.projectDetailError'));
    }
  }

  // Récupération des projets mis en avant
  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const projects = await this.getProjects();
      // randomize the projects array
      const shuffled = projects.sort(() => 0.5 - Math.random());
      // get sub-array of first 3 elements after shuffle
      return shuffled.slice(0, 3);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets mis en avant:', error);
      throw new Error(i18n.t('errors.featuredProjectsError'));
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