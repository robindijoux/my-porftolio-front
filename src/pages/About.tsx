import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Briefcase, MapPin, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { timelineService, TimelineEvent } from '@/services/timelineService';
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation';
import TimelineEventComponent from '@/components/TimelineEvent';

const About = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation hooks
  const headerAnimation = useScrollAnimation<HTMLHeadingElement>({ delay: 100 });
  const descriptionAnimation = useScrollAnimation<HTMLParagraphElement>({ delay: 200 });
  const timelineAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });
  const skillsAnimation = useStaggeredScrollAnimation<HTMLDivElement>(3, { threshold: 0.2 });

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
      case 'EDUCATION':
        return <GraduationCap className="h-5 w-5" />;
      case 'ACHIEVEMENT':
        return <Award className="h-5 w-5" />;
      case 'WORK':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EDUCATION':
        return 'bg-blue-50 text-blue-600 border-blue-500 dark:bg-blue-950 dark:text-blue-400';
      case 'ACHIEVEMENT':
        return 'bg-yellow-50 text-yellow-600 border-yellow-500 dark:bg-yellow-950 dark:text-yellow-400';
      case 'WORK':
        return 'bg-green-50 text-green-600 border-green-500 dark:bg-green-950 dark:text-green-400';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-500 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    return t(`about.types.${type.toLowerCase()}`);
  };

  const getEventYear = (timestamp: number): string => {
    return timelineService.getYearFromTimestamp(timestamp);
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
          <h1 
            ref={headerAnimation.ref}
            className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 md:mb-6"
            style={{ 
              opacity: 1, 
              transform: 'translateY(0)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('about.title')}
            </span>
          </h1>
          <p 
            ref={descriptionAnimation.ref}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4"
            style={{ 
              opacity: 1, 
              transform: 'translateY(0)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
            }}
          >
            {t('about.description')}
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineAnimation.ref} className="relative">
          {/* Ligne centrale - cachée sur mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>
          
          {/* Ligne verticale mobile - visible uniquement sur mobile */}
          <div className="md:hidden absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>
          
          {/* Événements */}
          <div className="space-y-8 md:space-y-12">
            {events.map((event, index) => (
              <TimelineEventComponent
                key={event.id}
                event={event}
                index={index}
                getIconForType={getIconForType}
                getTypeColor={getTypeColor}
                getTypeLabel={getTypeLabel}
                getEventYear={getEventYear}
              />
            ))}
          </div>
        </div>

        {/* Section compétences */}
        <div className="mt-16 md:mt-20 text-center">
          <h2 
            ref={skillsAnimation.containerRef}
            className="text-2xl md:text-3xl font-bold mb-6 md:mb-8"
            style={{ 
              opacity: 1, 
              transform: 'translateY(0)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {t('about.skills.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-4 md:p-6" style={{ opacity: 1, transform: 'translateY(0) scale(1)', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-blue-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.education')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {t('about.skills.educationDesc')}
              </p>
            </Card>
            
            <Card className="p-4 md:p-6" style={{ opacity: 1, transform: 'translateY(0) scale(1)', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s' }}>
              <Briefcase className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.experience')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {t('about.skills.experienceDesc')}
              </p>
            </Card>
            
            <Card className="p-4 md:p-6" style={{ opacity: 1, transform: 'translateY(0) scale(1)', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s' }}>
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