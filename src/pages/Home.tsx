import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowDown, Code, Palette, Zap, GraduationCap, Award, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { timelineService, TimelineEvent } from '@/services/timelineService';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import TimelineEventComponent from '@/components/TimelineEvent';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsCount, setProjectsCount] = useState(0);

  // Animation hooks
  const timelineAnimation = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les événements de timeline
        const timelineEvents = await timelineService.getAllEvents();
        setEvents(timelineEvents);
        
        // Pour le comptage de projets, on peut essayer de récupérer les projets
        try {
          const { apiService } = await import('@/services/api');
          const projects = await apiService.getProjects();
          setProjectsCount(projects.length);
        } catch {
          // Si on ne peut pas charger les projets, on met une valeur par défaut
          setProjectsCount(0);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
        return <GraduationCap className="h-5 w-5" />;
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
    if (!type || typeof type !== 'string') return t('about.types.education');
    return t(`about.types.${type.toLowerCase()}`);
  };

  const getEventYear = (timestamp: number): string => {
    return timelineService.getYearFromTimestamp(timestamp);
  };

  return (
    <div className="bg-background font-inter">
      {/* Section Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-10" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              💻 {t('home.subtitle')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                {t('home.title')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-inter font-light">
              {t('home.description')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="text-center p-6 rounded-xl bg-warm/30 border border-warm/40 shadow-warm-glow/20">
                <div className="flex items-center justify-center w-14 h-14 bg-foreground/10 rounded-xl mx-auto mb-4">
                  <Code className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground font-playfair">{projectsCount}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('home.stats.projects')}</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-primary/20 border border-primary/40 shadow-glow/20">
                <div className="flex items-center justify-center w-14 h-14 bg-foreground/10 rounded-xl mx-auto mb-4">
                  <Palette className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground font-playfair">3</div>
                <div className="text-sm text-muted-foreground font-medium">{t('home.stats.experience')}</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-secondary/30 border border-secondary/50 shadow-secondary-glow/20">
                <div className="flex items-center justify-center w-14 h-14 bg-foreground/10 rounded-xl mx-auto mb-4">
                  <Zap className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground font-playfair">2</div>
                <div className="text-sm text-muted-foreground font-medium">{t('home.stats.certifications')}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('home.cta.viewJourney')}
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
              >
                <Link to="/projects">
                  {t('home.cta.viewProjects')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section id="about-section" className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading && <LoadingSpinner size="lg" />}
          
          {!loading && (
            <>
              {/* Header */}
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 md:mb-6">
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {t('about.title')}
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                  {t('about.description')}
                </p>
              </div>

              {/* Timeline */}
              <div ref={timelineAnimation.ref} className="relative mb-16 md:mb-20">
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
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-6 md:mb-8">
                  {t('about.skills.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <Card className="p-4 md:p-6">
                    <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-blue-500 mx-auto mb-3 md:mb-4" />
                    <h4 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.education')}</h4>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {t('about.skills.educationDesc')}
                    </p>
                  </Card>
                  
                  <Card className="p-4 md:p-6">
                    <Briefcase className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
                    <h4 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.experience')}</h4>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {t('about.skills.experienceDesc')}
                    </p>
                  </Card>
                  
                  <Card className="p-4 md:p-6">
                    <Award className="h-10 w-10 md:h-12 md:w-12 text-yellow-500 mx-auto mb-3 md:mb-4" />
                    <h4 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.innovation')}</h4>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {t('about.skills.innovationDesc')}
                    </p>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;