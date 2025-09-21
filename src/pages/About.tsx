import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Award, Briefcase, MapPin, Calendar } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'achievement' | 'work';
  location?: string;
}

const About: React.FC = () => {
  const { t } = useTranslation();

  const timelineEvents: TimelineEvent[] = [
    {
      year: '2024',
      title: t('about.timeline.certificationDevOps.title'),
      description: t('about.timeline.certificationDevOps.description'),
      type: 'achievement',
      location: 'Online'
    },
    {
      year: '2023',
      title: t('about.timeline.ingenieurOrange.title'),
      description: t('about.timeline.ingenieurOrange.description'),
      type: 'work',
      location: 'Sophia Antipolis, France'
    },
    {
      year: '2023',
      title: t('about.timeline.certificationAWS.title'),
      description: t('about.timeline.certificationAWS.description'),
      type: 'achievement',
      location: 'Online'
    },
    {
      year: '2023',
      title: t('about.timeline.diplome.title'),
      description: t('about.timeline.diplome.description'),
      type: 'education',
      location: 'Sophia Antipolis, France'
    },
    {
      year: '2023',
      title: t('about.timeline.stageOrange.title'),
      description: t('about.timeline.stageOrange.description'),
      type: 'work',
      location: 'Sophia Antipolis, France'
    },
    {
      year: '2022',
      title: t('about.timeline.stageAccenture.title'),
      description: t('about.timeline.stageAccenture.description'),
      type: 'work',
      location: 'Sophia Antipolis, France'
    },
    {
      year: '2021',
      title: t('about.timeline.challengeJeunePousse.title'),
      description: t('about.timeline.challengeJeunePousse.description'),
      type: 'achievement',
      location: 'Sophia Antipolis, France'
    },
    {
      year: '2020',
      title: t('about.timeline.cycleIngenieur.title'),
      description: t('about.timeline.cycleIngenieur.description'),
      type: 'education',
      location: 'Sophia Antipolis, France'
    },
    {
      year: '2018',
      title: t('about.timeline.prepIntegree.title'),
      description: t('about.timeline.prepIntegree.description'),
      type: 'education',
      location: 'Sophia Antipolis, France'
    }
  ];

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
        return t('about.types.education');
      case 'achievement':
        return t('about.types.achievement');
      case 'work':
        return t('about.types.work');
      default:
        return type;
    }
  };

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
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  // Sur desktop: alternance gauche/droite, sur mobile: toujours à gauche
                  'md:' + (index % 2 === 0 ? 'justify-start' : 'justify-end')
                } justify-start`}
              >
                {/* Point sur la timeline */}
                <div className={`absolute z-10 ${
                  // Position différente selon la taille d'écran
                  'left-6 md:left-1/2 md:transform md:-translate-x-1/2'
                }`}>
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-background ${getTypeColor(event.type)} flex items-center justify-center shadow-lg`}>
                    <span className="text-xs md:text-base">
                      {getIconForType(event.type)}
                    </span>
                  </div>
                </div>

                {/* Carte de l'événement */}
                <Card className={`w-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  // Sur mobile: marge à gauche pour éviter l'icône
                  'ml-16 md:ml-0 ' +
                  // Sur desktop: alternance avec padding
                  'md:max-w-md ' +
                  (index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8')
                }`}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="outline" 
                        className={`${getTypeColor(event.type)} font-medium text-xs md:text-sm`}
                      >
                        {getTypeLabel(event.type)}
                      </Badge>
                      <span className="text-xl md:text-2xl font-bold text-primary">{event.year}</span>
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
            ))}
          </div>
        </div>

        {/* Section compétences */}
        <div className="mt-16 md:mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t('about.skills.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
              <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-blue-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.education')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {t('about.skills.educationDesc')}
              </p>
            </Card>
            
            <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
              <Briefcase className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">{t('about.skills.experience')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                {t('about.skills.experienceDesc')}
              </p>
            </Card>
            
            <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
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