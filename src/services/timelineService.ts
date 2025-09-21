// Service pour la gestion des événements de timeline
import i18n from '@/i18n/config';
import { apiService, type TimelineEvent, type CreateTimelineEventData, type UpdateTimelineEventData } from './api';

export type { TimelineEvent, CreateTimelineEventData, UpdateTimelineEventData };

const STORAGE_KEY = 'portfolio_timeline_events';

class TimelineService {
  // Récupération de tous les événements
  async getAllEvents(): Promise<TimelineEvent[]> {
    try {
      console.log('🌐 Fetching timeline events from API...');
      const events = await apiService.getTimelineEvents();
      console.log('📦 Received events from API:', events.length, events);
      
      // Trier par date (plus récent en premier) - timestamp est maintenant un number
      return events.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw new Error(i18n.t('errors.eventsLoadError') || 'Erreur lors du chargement des événements');
    }
  }

  // Récupération uniquement des événements dynamiques (conservé pour compatibilité)
  async getDynamicEventsOnly(): Promise<TimelineEvent[]> {
    try {
      // Avec la vraie API, tous les événements sont "dynamiques" car ils viennent du backend
      return this.getAllEvents();
    } catch (error) {
      console.error('Erreur lors de la récupération des événements dynamiques:', error);
      throw new Error(i18n.t('errors.eventsLoadError') || 'Erreur lors du chargement des événements');
    }
  }

  // Création d'un nouvel événement
  async createEvent(eventData: CreateTimelineEventData, accessToken?: string): Promise<TimelineEvent> {
    try {
      console.log('🆕 Creating new timeline event:', eventData);
      const newEvent = await apiService.createTimelineEvent(eventData, accessToken);
      console.log('✅ Event created successfully:', newEvent);
      return newEvent;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw new Error(i18n.t('errors.eventCreateError') || 'Erreur lors de la création de l\'événement');
    }
  }

  // Suppression d'un événement
  async deleteEvent(id: string, accessToken?: string): Promise<void> {
    try {
      console.log('🗑️ Deleting timeline event:', id);
      await apiService.deleteTimelineEvent(id, accessToken);
      console.log('✅ Event deleted successfully');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw new Error(i18n.t('errors.eventDeleteError') || 'Erreur lors de la suppression de l\'événement');
    }
  }

  // Récupération d'un événement par ID
  async getEventById(id: string): Promise<TimelineEvent | null> {
    try {
      console.log('🔍 Fetching timeline event by ID:', id);
      const event = await apiService.getTimelineEventById(id);
      console.log('📦 Received event:', event);
      return event;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      // Si l'événement n'est pas trouvé, retourner null au lieu de throw
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error(i18n.t('errors.eventDetailError') || 'Erreur lors de la récupération de l\'événement');
    }
  }

  // Mise à jour d'un événement
  async updateEvent(id: string, eventData: UpdateTimelineEventData, accessToken?: string): Promise<TimelineEvent> {
    try {
      console.log('📝 Updating timeline event:', id, eventData);
      const updatedEvent = await apiService.updateTimelineEvent(id, eventData, accessToken);
      console.log('✅ Event updated successfully:', updatedEvent);
      return updatedEvent;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw new Error(i18n.t('errors.eventUpdateError') || 'Erreur lors de la mise à jour de l\'événement');
    }
  }

  // Export des événements (utilise maintenant les données du backend)
  async exportEvents(): Promise<void> {
    try {
      const events = await this.getAllEvents();
      const dataStr = JSON.stringify(events, null, 2);
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

  // Import des événements (obsolète avec la vraie API - cette fonction n'est plus appropriée)
  async importEvents(file: File): Promise<void> {
    console.warn('⚠️ Import function is deprecated when using real API. Use the admin interface instead.');
    throw new Error('Import function is not available when using real API. Please use the admin interface to create events individually.');
  }

  // Suppression de tous les événements (obsolète avec la vraie API - risqué)
  async clearAllDynamicEvents(): Promise<boolean> {
    console.warn('⚠️ clearAllDynamicEvents is not available when using real API for safety reasons.');
    throw new Error('Bulk deletion is not available when using real API for safety reasons. Please delete events individually.');
  }

  // Utilitaire pour extraire l'année d'un timestamp numérique
  getYearFromTimestamp(timestamp: number): string {
    return new Date(timestamp).getFullYear().toString();
  }

  // Méthode obsolète conservée pour compatibilité
  getYearFromDate(dateString: string): string {
    console.warn('⚠️ getYearFromDate is deprecated, use getYearFromTimestamp instead');
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

  // ========== MÉTHODES OBSOLÈTES (COMPATIBILITÉ) ==========
  // Ces méthodes sont conservées pour la compatibilité mais ne sont plus utilisées

  // Événements statiques de base (obsolète - maintenant dans le backend)
  private getStaticEvents(): TimelineEvent[] {
    console.warn('⚠️ getStaticEvents is deprecated - events are now managed by the backend API');
    return [];
  }

  // Récupération des événements dynamiques depuis localStorage (obsolète)
  private getDynamicEvents(): TimelineEvent[] {
    console.warn('⚠️ getDynamicEvents is deprecated - events are now managed by the backend API');
    return [];
  }

  // Sauvegarde des événements dynamiques (obsolète)
  private saveDynamicEvents(events: TimelineEvent[]): void {
    console.warn('⚠️ saveDynamicEvents is deprecated - events are now managed by the backend API');
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