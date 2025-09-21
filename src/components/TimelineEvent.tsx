import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { TimelineEvent as TimelineEventType } from '@/services/timelineService';

interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
  getIconForType: (type: string) => React.ReactNode;
  getTypeColor: (type: string) => string;
  getTypeLabel: (type: string) => string;
  getEventYear: (dateString: string) => string;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  index,
  getIconForType,
  getTypeColor,
  getTypeLabel,
  getEventYear,
}) => {
  const eventAnimation = useScrollAnimation<HTMLDivElement>({ 
    delay: index * 50, 
    threshold: 0.2 
  });

  return (
    <div
      ref={eventAnimation.ref}
      className={`relative timeline-item ${
        eventAnimation.isVisible ? 'animate-visible' : ''
      }`}
    >
      {/* Point sur la timeline */}
      <div className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
        // Position différente selon la taille d'écran
        'left-6 md:left-1/2 md:-translate-x-1/2'
      }`}>
        <div className={`flex flex-col items-center justify-center px-2 py-1 md:px-3 md:py-2 rounded-full border-2 border-background ${getTypeColor(event.type)} shadow-lg timeline-point ${
          eventAnimation.isVisible ? 'animate-visible' : ''
        }`}>
          <span className="text-xs md:text-base mb-0.5">
            {getIconForType(event.type)}
          </span>
          <span className="text-xs md:text-sm font-bold leading-none">
            {getEventYear(event.year)}
          </span>
        </div>
      </div>

      {/* Layout desktop avec flexbox pour alignement vertical */}
      <div className="hidden md:flex md:items-center md:min-h-[160px]">
        {index % 2 === 0 ? (
          // Image à gauche, carte à droite
          <>
            <div className="flex-1 flex justify-end pr-8">
              <img
                src={event.image}
                alt={event.title}
                className={`w-64 h-40 object-contain rounded-lg slide-left ${
                  eventAnimation.isVisible ? 'animate-visible' : ''
                }`}
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
              <Card className={`slide-right ${
                eventAnimation.isVisible ? 'animate-visible' : ''
              }`}>
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
              <Card className={`slide-left ${
                eventAnimation.isVisible ? 'animate-visible' : ''
              }`}>
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
                className={`w-64 h-40 object-contain rounded-lg slide-right ${
                  eventAnimation.isVisible ? 'animate-visible' : ''
                }`}
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
        <Card className={`slide-up ${
          eventAnimation.isVisible ? 'animate-visible' : ''
        }`}>
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
  );
};

export default TimelineEvent;