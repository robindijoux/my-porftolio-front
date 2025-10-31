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
import MediaGallery from '@/components/MediaGallery';
import ImageZoomViewer from '@/components/ImageZoomViewer';
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
  const [isMediaSectionVisible, setIsMediaSectionVisible] = useState(true);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const mediaSectionRef = useRef<HTMLDivElement>(null);

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

  // Nettoyage du timeout au démontage
  useEffect(() => {
    return () => {
      // Nettoyage géré dans MediaGallery
    };
  }, []);

  // Observer pour détecter la visibilité de la section des médias
  useEffect(() => {
    if (!mediaSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMediaSectionVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Déclenche quand 10% de la section est visible
        rootMargin: '-20px 0px -20px 0px' // Marge pour déclencher un peu avant/après
      }
    );

    observer.observe(mediaSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [project]);

  // Fonctions pour la navigation dans le modal
  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setIsImageModalOpen(true);
  };

  const openGalleryModal = () => {
    setIsGalleryModalOpen(true);
    setModalImageIndex(selectedMediaIndex);
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
      // Navigation dans les modals
      if (isImageModalOpen || isGalleryModalOpen) {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'Escape') {
          setIsImageModalOpen(false);
          setIsGalleryModalOpen(false);
        }
      } 
      // Navigation dans la galerie principale gérée dans MediaGallery
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isImageModalOpen, isGalleryModalOpen, modalImageIndex, selectedMediaIndex, project]);

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
            to="/projects" 
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
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground">
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

        </div>

        <div className="space-y-6">
          {/* Section Technologies et Galerie sur la même ligne */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Stack technologique - largeur fixe réduite */}
            <div className="lg:w-44 lg:flex-shrink-0 flex flex-col">
              <h3 className="text-xl font-playfair font-semibold mb-6 text-foreground">
                {t('project.technologies')}
              </h3>
              <div className="flex flex-col gap-3 lg:justify-center lg:flex-1 lg:max-h-[400px]">
                {project.techStack.map((tech) => (
                  <Badge
                    key={tech.technology}
                    variant="outline"
                    className="border-border/60 hover:border-primary/50 transition-colors py-2 px-3 text-sm justify-center bg-card-gradient"
                  >
                    <img src={tech.iconUrl} alt={tech.technology} className="h-5 w-5 mr-2" />
                    {tech.technology}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Galerie de médias - prend tout l'espace restant */}
            {project.media.length > 0 && (
              <div ref={mediaSectionRef} className="lg:flex-1">
                <MediaGallery
                  project={project}
                  selectedMediaIndex={selectedMediaIndex}
                  onMediaIndexChange={setSelectedMediaIndex}
                  onImageClick={openImageModal}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Modal pour agrandir les images avec zoom avancé */}
          {isImageModalOpen && project && isImage(project.media[modalImageIndex]?.type) && (
            <ImageZoomViewer
              src={project.media[modalImageIndex]?.url}
              alt={project.media[modalImageIndex]?.alt || project.name}
              onClose={() => setIsImageModalOpen(false)}
              onPrevious={project.media.filter(media => isImage(media.type)).length > 1 ? prevImage : undefined}
              onNext={project.media.filter(media => isImage(media.type)).length > 1 ? nextImage : undefined}
              hasMultiple={project.media.filter(media => isImage(media.type)).length > 1}
              currentIndex={modalImageIndex + 1}
              totalImages={project.media.filter(media => isImage(media.type)).length}
            />
          )}

          {/* Modal de galerie complète */}
          <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-4 bg-background border border-border">
              <div className="w-full h-full">
                {/* Contenu de la galerie */}
                {project && (
                  <MediaGallery
                    project={project}
                    selectedMediaIndex={selectedMediaIndex}
                    onMediaIndexChange={setSelectedMediaIndex}
                    onImageClick={(index) => {
                      setIsGalleryModalOpen(false);
                      openImageModal(index);
                    }}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Description détaillée */}
          <div className="w-full">
            <h2 className="text-xl font-playfair font-semibold mb-6 text-foreground">
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
              <Card className="border-border/50 bg-card-gradient">
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

              <Card className="border-border/50 bg-card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('project.techCount')}</span>
                    <span className="font-medium text-foreground">{project.techStack.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card-gradient">
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
            <Link to="/projects">
              <Button variant="outline">
                {t('project.backToProjects')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Bouton flottant pour afficher la galerie quand les médias ne sont plus visibles */}
        {project && project.media.length > 0 && !isMediaSectionVisible && (
          <button
            onClick={openGalleryModal}
            className="fixed bottom-6 right-6 w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 z-40 border-2 border-primary/20 hover:border-primary/40 group"
            aria-label={t('project.viewGallery')}
          >
            {/* Miniature de l'image actuelle */}
            <div className="relative w-full h-full">
              {isImage(project.media[selectedMediaIndex].type) ? (
                <img
                  src={project.media[selectedMediaIndex].url}
                  alt={project.media[selectedMediaIndex].alt || project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              ) : isVideo(project.media[selectedMediaIndex].type) ? (
                <div className="relative w-full h-full">
                  <video
                    src={project.media[selectedMediaIndex].url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <ZoomIn className="h-7 w-7 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;