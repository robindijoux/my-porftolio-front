// Service API pour la gestion des appels REST

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
  mediaIds: string[];
  techStack: string[];
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
      throw new Error('Impossible d\'uploader le fichier. Veuillez réessayer.');
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
          mediaIds: projectData.mediaIds,
          techStackNames: projectData.techStack,
        }),
      });
      return this.handleResponse<Project>(response);
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw new Error('Impossible de créer le projet. Veuillez réessayer.');
    }
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
      // randomize the projects array
      const shuffled = projects.sort(() => 0.5 - Math.random());
      // get sub-array of first 3 elements after shuffle
      return shuffled.slice(0, 3);
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