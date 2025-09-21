// Service pour la gestion des événements de timeline
import i18n from '@/i18n/config';

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  type: 'education' | 'achievement' | 'work';
  location?: string;
  image: string;
}

export interface CreateTimelineEventData {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'achievement' | 'work';
  location?: string;
  image: string;
}

const STORAGE_KEY = 'portfolio_timeline_events';

class TimelineService {
  // Événements statiques de base
  private getStaticEvents(): TimelineEvent[] {
    return [
      {
        id: 'static_devops_2024',
        year: '2024-06-15',
        title: i18n.t('about.timeline.certificationDevOps.title'),
        description: i18n.t('about.timeline.certificationDevOps.description'),
        type: 'achievement',
        location: 'Online',
        image: 'https://www.devopsinstitute.com/wp-content/uploads/2022/10/DevOps-Foundation-New-Badge-1200x1200px.png'
      },
      {
        id: 'static_orange_engineer_2023',
        year: '2023-09-01',
        title: i18n.t('about.timeline.ingenieurOrange.title'),
        description: i18n.t('about.timeline.ingenieurOrange.description'),
        type: 'work',
        location: 'Sophia Antipolis, France',
        image: 'https://ordinal.fr/images/2025/08/28/800x420_orange-business-logo.png'
      },
      {
        id: 'static_aws_2023',
        year: '2023-08-10',
        title: i18n.t('about.timeline.certificationAWS.title'),
        description: i18n.t('about.timeline.certificationAWS.description'),
        type: 'achievement',
        location: 'Online',
        image: 'https://event.lecloudfacile.com/hs-fs/hubfs/affiche-aws-cloud-practitioner.png?width=600&height=600&name=affiche-aws-cloud-practitioner.png'
      },
      {
        id: 'static_diploma_2023',
        year: '2023-07-20',
        title: i18n.t('about.timeline.diplome.title'),
        description: i18n.t('about.timeline.diplome.description'),
        type: 'education',
        location: 'Sophia Antipolis, France',
        image: 'https://media.licdn.com/dms/image/v2/D4E22AQG6qtw_xE18Ig/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1702454765834?e=1761177600&v=beta&t=lWxM-2SVcAnKLaYjUsXRhakmW5xIgMPz1gWIWef866k'
      },
      {
        id: 'static_orange_internship_2023',
        year: '2023-02-01',
        title: i18n.t('about.timeline.stageOrange.title'),
        description: i18n.t('about.timeline.stageOrange.description'),
        type: 'work',
        location: 'Sophia Antipolis, France',
        image: 'https://ordinal.fr/images/2025/08/28/800x420_orange-business-logo.png'
      },
      {
        id: 'static_accenture_2022',
        year: '2022-06-15',
        title: i18n.t('about.timeline.stageAccenture.title'),
        description: i18n.t('about.timeline.stageAccenture.description'),
        type: 'work',
        location: 'Sophia Antipolis, France',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/1200px-Accenture.svg.png'
      },
      {
        id: 'static_challenge_2021',
        year: '2021-11-30',
        title: i18n.t('about.timeline.challengeJeunePousse.title'),
        description: i18n.t('about.timeline.challengeJeunePousse.description'),
        type: 'achievement',
        location: 'Sophia Antipolis, France',
        image: 'https://www.telecom-valley.fr/wp-content/uploads/2020/03/CJP-Actu.jpg'
      },
      {
        id: 'static_engineering_cycle_2020',
        year: '2020-09-01',
        title: i18n.t('about.timeline.cycleIngenieur.title'),
        description: i18n.t('about.timeline.cycleIngenieur.description'),
        type: 'education',
        location: 'Sophia Antipolis, France',
        image: 'https://polytech.univ-cotedazur.fr/medias/photo/logo-porte-polytech-quadri_1728290630763-png?ID_FICHE=1013668&INLINE=FALSE'
      },
      {
        id: 'static_prep_2018',
        year: '2018-09-01',
        title: i18n.t('about.timeline.prepIntegree.title'),
        description: i18n.t('about.timeline.prepIntegree.description'),
        type: 'education',
        location: 'Sophia Antipolis, France',
        image: 'https://polytech.univ-cotedazur.fr/medias/photo/logo-porte-polytech-quadri_1728290630763-png?ID_FICHE=1013668&INLINE=FALSE'
      }
    ];
  }

  // Récupération des événements dynamiques depuis localStorage
  private getDynamicEvents(): TimelineEvent[] {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      if (savedEvents) {
        return JSON.parse(savedEvents);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements dynamiques:', error);
    }
    return [];
  }

  // Sauvegarde des événements dynamiques
  private saveDynamicEvents(events: TimelineEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des événements:', error);
      throw new Error(i18n.t('errors.eventSaveError') || 'Erreur lors de la sauvegarde');
    }
  }

  // Récupération de tous les événements
  async getAllEvents(): Promise<TimelineEvent[]> {
    try {
      // Pour le moment, on simule avec des événements de mock + localStorage
      // Plus tard, ceci sera remplacé par un appel API
      const staticEvents = this.getStaticEvents();
      const dynamicEvents = this.getDynamicEvents();
      
      console.log('🔍 Debug getAllEvents:');
      console.log('📦 Mock events:', staticEvents.length, staticEvents);
      console.log('💾 LocalStorage events:', dynamicEvents.length, dynamicEvents);
      
      // Fusionner et trier par date (plus récent en premier)
      const allEvents = [...staticEvents, ...dynamicEvents];
      console.log('🔗 All events combined:', allEvents.length, allEvents);
      
      return allEvents.sort((a, b) => new Date(b.year).getTime() - new Date(a.year).getTime());
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw new Error(i18n.t('errors.eventsLoadError') || 'Erreur lors du chargement des événements');
    }
  }

  // Récupération uniquement des événements dynamiques
  async getDynamicEventsOnly(): Promise<TimelineEvent[]> {
    try {
      const dynamicEvents = this.getDynamicEvents();
      return dynamicEvents.sort((a, b) => new Date(b.year).getTime() - new Date(a.year).getTime());
    } catch (error) {
      console.error('Erreur lors de la récupération des événements dynamiques:', error);
      throw new Error(i18n.t('errors.eventsLoadError') || 'Erreur lors du chargement des événements');
    }
  }

  // Création d'un nouvel événement
  async createEvent(eventData: CreateTimelineEventData): Promise<TimelineEvent> {
    try {
      const newEvent: TimelineEvent = {
        ...eventData,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const dynamicEvents = this.getDynamicEvents();
      const updatedEvents = [...dynamicEvents, newEvent];
      this.saveDynamicEvents(updatedEvents);

      return newEvent;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw new Error(i18n.t('errors.eventCreateError') || 'Erreur lors de la création de l\'événement');
    }
  }

  // Suppression d'un événement
  async deleteEvent(id: string): Promise<void> {
    try {
      // Pour les événements de mock (ID commence par 'static_'), 
      // on ne peut pas les supprimer du code, mais on peut simuler
      if (id.startsWith('static_')) {
        console.log('⚠️ Tentative de suppression d\'un événement de mock:', id);
        // En production, ceci sera un appel API qui supprimera l'événement du backend
        throw new Error('Les événements de mock ne peuvent pas être supprimés (sera géré par l\'API)');
      }

      // Pour les événements du localStorage
      const dynamicEvents = this.getDynamicEvents();
      const eventToDelete = dynamicEvents.find(event => event.id === id);
      
      if (!eventToDelete) {
        throw new Error('Événement non trouvé');
      }

      const filteredEvents = dynamicEvents.filter(event => event.id !== id);
      this.saveDynamicEvents(filteredEvents);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw new Error(i18n.t('errors.eventDeleteError') || 'Erreur lors de la suppression de l\'événement');
    }
  }

  // Récupération d'un événement par ID
  async getEventById(id: string): Promise<TimelineEvent | null> {
    try {
      const allEvents = await this.getAllEvents();
      return allEvents.find(event => event.id === id) || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      throw new Error(i18n.t('errors.eventDetailError') || 'Erreur lors de la récupération de l\'événement');
    }
  }

  // Export des événements dynamiques
  exportEvents(): void {
    try {
      const dynamicEvents = this.getDynamicEvents();
      const dataStr = JSON.stringify(dynamicEvents, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `timeline-events-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw new Error(i18n.t('errors.exportError') || 'Erreur lors de l\'export');
    }
  }

  // Import des événements
  async importEvents(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedEvents = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedEvents)) {
            // Ajouter des IDs si manquants
            const eventsWithIds = importedEvents.map(event => ({
              ...event,
              id: event.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }));
            
            const currentDynamicEvents = this.getDynamicEvents();
            const mergedEvents = [...currentDynamicEvents, ...eventsWithIds];
            this.saveDynamicEvents(mergedEvents);
            resolve();
          } else {
            reject(new Error('Format de fichier invalide'));
          }
        } catch (error) {
          reject(new Error('Erreur lors du parsing du fichier JSON'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
    });
  }

  // Suppression de tous les événements dynamiques
  async clearAllDynamicEvents(): Promise<boolean> {
    try {
      this.saveDynamicEvents([]);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression des événements:', error);
      throw new Error(i18n.t('errors.clearEventsError') || 'Erreur lors de la suppression des événements');
    }
  }

  // Utilitaire pour extraire l'année d'une date
  getYearFromDate(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  // Statistiques des événements
  async getEventStats(): Promise<{
    total: number;
    education: number;
    work: number;
    achievement: number;
  }> {
    try {
      const allEvents = await this.getAllEvents();
      
      return {
        total: allEvents.length,
        education: allEvents.filter(e => e.type === 'education').length,
        work: allEvents.filter(e => e.type === 'work').length,
        achievement: allEvents.filter(e => e.type === 'achievement').length,
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw new Error('Erreur lors du calcul des statistiques');
    }
  }
}

// Instance unique du service Timeline
export const timelineService = new TimelineService();

// Types pour la gestion des erreurs
export interface TimelineApiError {
  message: string;
  type?: 'storage' | 'parsing' | 'validation';
}

// Hook d'état pour les composants (optionnel)
export interface TimelineApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}