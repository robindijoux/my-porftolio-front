import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Project, apiService } from '@/services/api';
import { formatDate } from '@/utils/date';
import { isImage, isVideo } from '@/utils/media';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Star,
  Play,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const loadProject = useCallback(async () => {
    if (!id) {
      setError(t('project.notFound'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProjectById(id);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Fonctions pour la navigation dans le modal
  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setIsImageModalOpen(true);
  };

  const nextImage = () => {
    if (!project) return;
    const images = project.media.filter(media => isImage(media.type));
    const currentImageIndex = images.findIndex((_, idx) => idx === modalImageIndex);
    const nextIndex = (currentImageIndex + 1) % images.length;
    setModalImageIndex(nextIndex);
  };

  const prevImage = () => {
    if (!project) return;
    const images = project.media.filter(media => isImage(media.type));
    const currentImageIndex = images.findIndex((_, idx) => idx === modalImageIndex);
    const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setModalImageIndex(prevIndex);
  };

  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isImageModalOpen) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isImageModalOpen, modalImageIndex, project]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadProject}
      />
    );
  }

  if (!project) {
    return (
      <ErrorMessage 
        message={t('project.notFound')} 
        onRetry={loadProject}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('project.backToProjects')}
          </Link>
        </div>

        {/* Header du projet */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {project.name}
                </h1>
                {project.featured && (
                  <Badge className="bg-secondary text-secondary-foreground shadow-secondary-glow">
                    <Star className="h-3 w-3 mr-1" />
                    {t('project.featured')}
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                {project.shortDescription}
              </p>

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {t('project.createdOn')} {formatDate(project.createdAt, i18n.language)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
              {project.projectLink && (
                <Button asChild className="bg-primary hover:bg-primary/90 shadow-glow">
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('project.viewLive')}
                  </a>
                </Button>
              )}
              {project.repositoryLink && (
                <Button variant="outline" asChild>
                  <a 
                    href={project.repositoryLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    {t('project.viewCode')}
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Stack technologique */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              {t('project.technologies')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech.technology}
                  variant="outline"
                  className="border-border/60 hover:border-primary/50 transition-colors"
                >
                  <img src={tech.iconUrl} alt={tech.technology} className="h-4 w-4 mr-2" />
                  {tech.technology}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Galerie de médias */}
          {project.media.length > 0 && (
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                {t('project.mediaGallery')}
              </h2>
              
              {/* Média principal */}
              <Card className="mb-6 overflow-hidden border-border/50 bg-card-gradient">
                <CardContent className="p-0">
                  <div className="aspect-video w-full overflow-hidden bg-muted/10 relative group cursor-pointer" 
                       onClick={() => isImage(project.media[selectedMediaIndex].type) && openImageModal(selectedMediaIndex)}>
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
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                          <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
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
                  </div>
                </CardContent>
              </Card>

              {/* Miniatures */}
              {project.media.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {project.media.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (isImage(media.type)) {
                          // Si c'est la même image sélectionnée, ouvrir le modal
                          if (selectedMediaIndex === index) {
                            openImageModal(index);
                          } else {
                            // Sinon, juste changer la sélection
                            setSelectedMediaIndex(index);
                          }
                        } else {
                          // Pour les vidéos, juste changer la sélection
                          setSelectedMediaIndex(index);
                        }
                      }}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all relative ${
                        selectedMediaIndex === index 
                          ? 'border-primary shadow-glow' 
                          : 'border-border/30 hover:border-border/60'
                      }`}
                    >
                      {isImage(media.type) ? (
                        <div className="relative w-full h-full group">
                          <img
                            src={media.url}
                            alt={media.alt || `${project.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ZoomIn className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      ) : isVideo(media.type) ? (
                        <div className="relative w-full h-full">
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                          <Play className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modal pour agrandir les images */}
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
              <div className="relative w-full h-full flex items-center justify-center">
                {project && isImage(project.media[modalImageIndex]?.type) && (
                  <>
                    {/* Image agrandie */}
                    <img
                      src={project.media[modalImageIndex]?.url}
                      alt={project.media[modalImageIndex]?.alt || project.name}
                      className="max-w-full max-h-[90vh] object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Bouton fermer */}
                    <button
                      onClick={() => setIsImageModalOpen(false)}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                    >
                      <X className="h-6 w-6" />
                    </button>

                    {/* Navigation précédent/suivant si plusieurs images */}
                    {project.media.filter(media => isImage(media.type)).length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}

                    {/* Indicateur de position */}
                    {project.media.filter(media => isImage(media.type)).length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {modalImageIndex + 1} / {project.media.filter(media => isImage(media.type)).length}
                      </div>
                    )}
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Description détaillée */}
          <div className={project.media.length > 0 ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <h2 className="text-xl font-semibold mb-6 text-foreground">
              {t('project.details')}
            </h2>
            
            <Card className="border-border/50 bg-card-gradient">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none prose-sm md:prose-base text-muted-foreground leading-relaxed prose-headings:text-foreground prose-strong:text-foreground">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                  >
                    {project.description}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Métadonnées supplémentaires */}
            <div className="mt-8 space-y-4">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('project.projectType')}</span>
                    <Badge variant="secondary">
                      {project.techStack.map((tech) => tech.technology).includes('React Native') ? t('project.mobile') : 
                       project.techStack.map((tech) => tech.technology).includes('Spring Boot') ? t('project.backend') : t('project.web')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('project.techCount')}</span>
                    <span className="font-medium text-foreground">{project.techStack.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('project.mediaCount')}</span>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{project.media.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Navigation vers d'autres projets */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4 text-foreground">
              {t('project.discoverOtherProjects')}
            </h3>
            <Link to="/">
              <Button variant="outline">
                {t('project.backToProjects')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;