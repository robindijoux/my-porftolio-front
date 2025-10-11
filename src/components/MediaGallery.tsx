import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/services/api';
import { isImage, isVideo } from '@/utils/media';
import { 
  Play,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';

interface MediaGalleryProps {
  project: Project;
  selectedMediaIndex: number;
  onMediaIndexChange: (index: number) => void;
  onImageClick: (index: number) => void;
  className?: string;
}

const MediaGallery = ({ 
  project, 
  selectedMediaIndex, 
  onMediaIndexChange, 
  onImageClick,
  className = ""
}: MediaGalleryProps) => {
  const { t } = useTranslation();
  const [showHoverOverlay, setShowHoverOverlay] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyage du timeout au démontage
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMediaHover = () => {
    setShowHoverOverlay(true);
    
    // Nettoyer le timeout précédent s'il existe
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Programmer la disparition de l'overlay après 1 seconde
    hoverTimeoutRef.current = setTimeout(() => {
      setShowHoverOverlay(false);
    }, 1000);
  };

  const handleMediaMove = () => {
    // Réactiver l'effet hover si la souris bouge sur l'image
    if (!showHoverOverlay) {
      handleMediaHover();
    } else {
      // Si l'overlay est déjà visible, relancer le timer
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      
      hoverTimeoutRef.current = setTimeout(() => {
        setShowHoverOverlay(false);
      }, 1000);
    }
  };

  const handleMediaLeave = () => {
    setShowHoverOverlay(false);
    
    // Nettoyer le timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const nextMedia = () => {
    const nextIndex = (selectedMediaIndex + 1) % project.media.length;
    onMediaIndexChange(nextIndex);
  };

  const prevMedia = () => {
    const prevIndex = selectedMediaIndex === 0 ? project.media.length - 1 : selectedMediaIndex - 1;
    onMediaIndexChange(prevIndex);
  };

  if (project.media.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        {t('project.mediaGallery')}
      </h2>
      
      {/* Média principal */}
      <Card className="mb-6 overflow-hidden border-border/50 bg-card-gradient">
        <CardContent className="p-0">
          <div 
            className="aspect-video w-full overflow-hidden bg-muted/10 relative group cursor-pointer" 
            onClick={() => isImage(project.media[selectedMediaIndex].type) && onImageClick(selectedMediaIndex)}
            onMouseEnter={handleMediaHover}
            onMouseMove={handleMediaMove}
            onMouseLeave={handleMediaLeave}
          >
            {isImage(project.media[selectedMediaIndex].type) ? (
              <div className="relative w-full h-full">
                <img
                  src={project.media[selectedMediaIndex].url}
                  alt={project.media[selectedMediaIndex].alt || project.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className={`absolute inset-0 bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none ${
                  showHoverOverlay ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className={`bg-white/90 rounded-full p-3 transition-transform duration-300 ${
                    showHoverOverlay ? 'scale-100' : 'scale-0'
                  }`}>
                    <ZoomIn className="h-6 w-6 text-gray-800" />
                  </div>
                </div>
              </div>
            ) : isVideo(project.media[selectedMediaIndex].type) ? (
              <video
                src={project.media[selectedMediaIndex].url}
                className="w-full h-full object-contain"
                controls
                preload="metadata"
                onError={(e) => {
                  console.error('Erreur de chargement vidéo:', e);
                }}
              >
                {t('project.videoNotSupported')}
              </video>
            ) : (
              <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">{t('project.mediaLabel')} : {project.media[selectedMediaIndex].type}</p>
                </div>
              </div>
            )}

            {/* Flèches de navigation */}
            {project.media.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevMedia();
                  }}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10 ${
                    showHoverOverlay ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-label="Média précédent"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextMedia();
                  }}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10 ${
                    showHoverOverlay ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-label="Média suivant"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Barre de miniatures intégrée */}
            {project.media.length > 1 && (
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-lg p-2 transition-all duration-300 z-10 ${
                showHoverOverlay ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex gap-2 max-w-xs overflow-x-auto scrollbar-hide">
                  {project.media.map((media, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isImage(media.type)) {
                          if (selectedMediaIndex === index) {
                            onImageClick(index);
                          } else {
                            onMediaIndexChange(index);
                          }
                        } else {
                          onMediaIndexChange(index);
                        }
                      }}
                      className={`flex-shrink-0 w-12 h-8 rounded overflow-hidden border transition-all ${
                        selectedMediaIndex === index 
                          ? 'border-primary border-2 shadow-glow' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      {isImage(media.type) ? (
                        <img
                          src={media.url}
                          alt={media.alt || `Miniature ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : isVideo(media.type) ? (
                        <div className="relative w-full h-full bg-black/20">
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                          <Play className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaGallery;