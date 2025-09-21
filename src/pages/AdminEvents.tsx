import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, MapPin, Trash2, Plus, ArrowLeft, Image, Download, Upload, RotateCcw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTimelineEvents } from '@/hooks/useTimelineEvents';
import { timelineService } from '@/services/timelineService';
import { useRef, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const AdminEvents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { events, deleteEvent, exportEvents, importEvents, loadAllEvents } = useTimelineEvents();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Trier les événements par date (plus récent en premier)
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400';
      case 'achievement':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400';
      case 'work':
        return 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'education':
        return t('timeline.education');
      case 'achievement':
        return t('timeline.achievement');
      case 'work':
        return t('timeline.work');
      default:
        return type;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      // Recharger tous les événements
      loadAllEvents();
      toast({
        title: t('timeline.deleteSuccess'),
        description: t('timeline.deleteSuccessDescription'),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errors.eventDeleteError');
      toast({
        title: t('errors.eventDeleteError'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    try {
      exportEvents();
      toast({
        title: t('timeline.exportSuccess'),
        description: t('timeline.exportSuccessDescription'),
      });
    } catch (error) {
      toast({
        title: t('errors.exportError'),
        description: error instanceof Error ? error.message : t('errors.unknown'),
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importEvents(file);
        toast({
          title: t('timeline.importSuccess'),
          description: t('timeline.importSuccessDescription'),
        });
      } catch (error) {
        toast({
          title: t('errors.eventImportError'),
          description: error instanceof Error ? error.message : t('errors.unknown'),
          variant: "destructive",
        });
      }
    }
    // Réinitialiser le input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = async () => {
    try {
      // Supprimer tous les événements un par un
      const deletePromises = events.map(async (event) => {
        try {
          await deleteEvent(event.id);
        } catch (error) {
          console.warn(`Impossible de supprimer l'événement ${event.id}:`, error);
        }
      });
      
      await Promise.allSettled(deletePromises);
      // Recharger tous les événements
      loadAllEvents();
      toast({
        title: t('timeline.clearAllSuccess'),
        description: t('timeline.clearAllSuccessDescription'),
      });
    } catch (error) {
      toast({
        title: t('errors.clearEventsError'),
        description: error instanceof Error ? error.message : t('errors.unknown'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('timeline.backButton')}
            </Button>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {t('timeline.adminTitle')}
              </span>
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('timeline.exportButton')}
            </Button>
            <Button variant="outline" onClick={handleImport} size="sm">
              <Upload className="h-4 w-4 mr-2" />
              {t('timeline.importButton')}
            </Button>
            {events.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('timeline.clearAllButton')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('timeline.clearAllConfirm')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('timeline.clearAllConfirmDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('timeline.clearAllButton')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button asChild>
              <Link to="/create-event">
                <Plus className="h-4 w-4 mr-2" />
                {t('timeline.newEvent')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Input file caché pour l'import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('timeline.totalEvents')}</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('timeline.education')}</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.type === 'education').length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">E</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('timeline.work')}</p>
                  <p className="text-2xl font-bold">{events.filter(e => e.type === 'work').length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">T</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des événements */}
        {sortedEvents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('timeline.noEvents')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('timeline.noEventsDesc')}
              </p>
              <Button asChild>
                <Link to="/create-event">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('timeline.createFirstEvent')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => (
              <Card key={event.id} className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-24 h-16 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Im0xNSAxMi0zLTMtMy4wMSAzTDEyIDEyeiIgZmlsbD0iIzk0YTNiOCIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`${getTypeColor(event.type)} font-medium text-xs`}>
                            {getTypeLabel(event.type)}
                          </Badge>
                          <span className="text-lg font-bold text-primary">
                            {timelineService.getYearFromTimestamp(event.timestamp)}
                          </span>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('timeline.deleteConfirm')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('timeline.deleteConfirmDescription', { title: event.title })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEvent(event.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t('common.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-foreground truncate">
                        {event.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.timestamp).toLocaleDateString('fr-FR')}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Image className="h-3 w-3" />
                          {t('timeline.image')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;