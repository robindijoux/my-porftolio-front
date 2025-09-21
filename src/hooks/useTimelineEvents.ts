import { useState, useEffect } from 'react';
import { timelineService, TimelineEvent, CreateTimelineEventData, UpdateTimelineEventData } from '@/services/timelineService';
import { useAuthentication } from './useAuthentication';

export const useTimelineEvents = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthentication();

  // Charger tous les événements (statiques + dynamiques)
  const loadAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const allEvents = await timelineService.getAllEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error('Erreur lors du chargement des événements:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des événements');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger uniquement les événements dynamiques (pour l'admin)
  const loadDynamicEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const dynamicEvents = await timelineService.getDynamicEventsOnly();
      setEvents(dynamicEvents);
    } catch (err) {
      console.error('Erreur lors du chargement des événements dynamiques:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des événements');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel événement
  const createEvent = async (eventData: CreateTimelineEventData): Promise<TimelineEvent> => {
    try {
      setError(null);
      const newEvent = await timelineService.createEvent(eventData, accessToken);
      
      // Recharger tous les événements pour mettre à jour l'état
      await loadAllEvents();
      
      return newEvent;
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'événement';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Supprimer un événement
  const deleteEvent = async (id: string): Promise<void> => {
    try {
      setError(null);
      await timelineService.deleteEvent(id, accessToken);
      
      // Recharger tous les événements pour mettre à jour l'état
      await loadAllEvents();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'événement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'événement';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Mettre à jour un événement
  const updateEvent = async (id: string, eventData: UpdateTimelineEventData): Promise<TimelineEvent> => {
    try {
      setError(null);
      const updatedEvent = await timelineService.updateEvent(id, eventData, accessToken);
      
      // Recharger tous les événements pour mettre à jour l'état
      await loadAllEvents();
      
      return updatedEvent;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'événement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'événement';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Récupérer un événement par ID
  const getEventById = async (id: string): Promise<TimelineEvent | null> => {
    try {
      return await timelineService.getEventById(id);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'événement:', err);
      return null;
    }
  };

  // Export des événements
  const exportEvents = async () => {
    try {
      await timelineService.exportEvents();
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Import des événements (obsolète avec la vraie API)
  const importEvents = async (file: File): Promise<void> => {
    try {
      await timelineService.importEvents(file);
      
      // Recharger tous les événements pour mettre à jour l'état
      await loadAllEvents();
    } catch (err) {
      console.error('Erreur lors de l\'import:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'import';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Charger les événements dynamiques au montage du composant (par défaut pour l'admin)
  useEffect(() => {
    loadAllEvents();
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    exportEvents,
    importEvents,
    refreshEvents: loadAllEvents, // Pour recharger tous les événements
    loadAllEvents, // Pour charger tous les événements (utile pour About.tsx et Admin)
    loadDynamicEvents // Pour charger uniquement les événements dynamiques (si besoin spécifique)
  };
};