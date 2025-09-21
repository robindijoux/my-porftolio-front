import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Briefcase, MapPin, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { timelineService, TimelineEvent } from '@/services/timelineService';

const About: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimelineEvents = async () => {
      try {
        const allEvents = await timelineService.getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements de timeline:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadTimelineEvents();
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="h-5 w-5" />;
      case 'achievement':
        return <Award className="h-5 w-5" />;
      case 'work':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'education':
        return 'bg-blue-50 text-blue-600 border-blue-500 dark:bg-blue-950 dark:text-blue-400';
      case 'achievement':
        return 'bg-yellow-50 text-yellow-600 border-yellow-500 dark:bg-yellow-950 dark:text-yellow-400';
      case 'work':
        return 'bg-green-50 text-green-600 border-green-500 dark:bg-green-950 dark:text-green-400';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-500 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    return t(`about.types.${type}`);
  };

  const getEventYear = (dateString: string): string => {
    return timelineService.getYearFromDate(dateString);
  };

  if (loading) {
    return (
      <div className="bg-background py-8 md:py-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('about.title')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t('about.description')}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Ligne centrale - cachée sur mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>
          
          {/* Ligne verticale mobile - visible uniquement sur mobile */}
          <div className="md:hidden absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>
          
          {/* Événements */}
          <div className="space-y-8 md:space-y-12">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="relative"
              >
                {/* Point sur la timeline */}
                <div className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
                  // Position différente selon la taille d'écran
                  'left-6 md:left-1/2 md:-translate-x-1/2'
                }`}>
                  <div className={`flex flex-col items-center justify-center px-2 py-1 md:px-3 md:py-2 rounded-full border-2 border-background ${getTypeColor(event.type)} shadow-lg`}>
                    <span className="text-xs md:text-base mb-0.5">
                      {getIconForType(event.type)}
                    </span>
                    <span className="text-xs md:text-sm font-bold leading-none">
                      {getEventYear(event.year)}
                    </span>
                  </div>
                </div>

                {/* Layout desktop avec flexbox pour alignement vertical */}
                <div className="hidden md:flex md:items-center md:min-h-[120px]">
                  {index % 2 === 0 ? (
                    // Image à gauche, carte à droite
                    <>
                      <div className="flex-1 flex justify-end pr-8">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-48 h-32 object-contain rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=300&fit=crop&crop=center';
                          }}
                        />
                      </div>
                      
                      <div className="w-16 flex justify-center">
                        {/* Espace pour l'icône centrale */}
                      </div>
                      
                      <div className="flex-1 pl-8">
                        <Card>
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-start mb-3">
                              <Badge 
                                variant="outline" 
                                className={`${getTypeColor(event.type)} font-medium text-xs md:text-sm`}
                              >
                                {getTypeLabel(event.type)}
                              </Badge>
                            </div>
                            
                            <h3 className="text-base md:text-lg font-semibold mb-2 text-foreground">
                              {event.title}
                            </h3>
                            
                            <p className="text-sm md:text-base text-muted-foreground mb-3 leading-relaxed">
                              {event.description}
                            </p>
                            
                            {event.location && (
                              <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  ) : (
                    // Carte à gauche, image à droite
                    <>
                      <div className="flex-1 pr-8">
                        <Card>
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-start mb-3">
                              <Badge 
                                variant="outline" 
                                className={`${getTypeColor(event.type)} font-medium text-xs md:text-sm`}
                              >
                                {getTypeLabel(event.type)}
                              </Badge>
                            </div>
                            
                            <h3 className="text-base md:text-lg font-semibold mb-2 text-foreground">
                              {event.title}
                            </h3>
                            
                            <p className="text-sm md:text-base text-muted-foreground mb-3 leading-relaxed">
                              {event.description}
                            </p>
                            
                            {event.location && (
                              <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                {event.location}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="w-16 flex justify-center">
                        {/* Espace pour l'icône centrale */}
                      </div>
                      
                      <div className="flex-1 flex justify-start pl-8">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-48 h-32 object-contain rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=300&fit=crop&crop=center';
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Layout mobile */}
                <div className="md:hidden ml-16">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-start mb-3">
                        <Badge 
                          variant="outline" 
                          className={`${getTypeColor(event.type)} font-medium text-xs`}
                        >
                          {getTypeLabel(event.type)}
                        </Badge>
                      </div>
                      
                      <h3 className="text-base font-semibold mb-2 text-foreground">
                        {event.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {event.description}
                      </p>
                      
                      {event.location && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section compétences */}
        <div className="mt-16 md:mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t('about.skills.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-4 md:p-6">
              <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-blue-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.education')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {t('about.skills.educationDesc')}
              </p>
            </Card>
            
            <Card className="p-4 md:p-6">
              <Briefcase className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.experience')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {t('about.skills.experienceDesc')}
              </p>
            </Card>
            
            <Card className="p-4 md:p-6">
              <Award className="h-10 w-10 md:h-12 md:w-12 text-yellow-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.innovation')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {t('about.skills.innovationDesc')}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;