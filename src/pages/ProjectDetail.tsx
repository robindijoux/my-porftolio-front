import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Project, apiService } from '@/services/api';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Star,
  Play,
  Image as ImageIcon
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  const loadProject = async () => {
    if (!id) {
      setError('ID du projet manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProjectById(id);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={loadProject} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Projet non trouvé" />
      </div>
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
            Retour aux projets
          </Link>
        </div>

        {/* Header du projet */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {project.title}
                </h1>
                {project.featured && (
                  <Badge className="bg-secondary text-secondary-foreground shadow-secondary-glow">
                    <Star className="h-3 w-3 mr-1" />
                    En vedette
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                {project.shortDescription}
              </p>

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Créé le {formatDate(project.createdAt)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
              {project.liveUrl && (
                <Button asChild className="bg-primary hover:bg-primary/90 shadow-glow">
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir en live
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" asChild>
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Code source
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Stack technologique */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Technologies utilisées
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge 
                  key={tech} 
                  variant="outline" 
                  className="border-border/60 hover:border-primary/50 transition-colors"
                >
                  {tech}
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
                Aperçu du projet
              </h2>
              
              {/* Média principal */}
              <Card className="mb-6 overflow-hidden border-border/50 bg-card-gradient">
                <CardContent className="p-0">
                  <div className="aspect-video w-full overflow-hidden">
                    {project.media[selectedMediaIndex].type === 'image' ? (
                      <img
                        src={project.media[selectedMediaIndex].url}
                        alt={project.media[selectedMediaIndex].alt || project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Vidéo non disponible en mode développement</p>
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
                      onClick={() => setSelectedMediaIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedMediaIndex === index 
                          ? 'border-primary shadow-glow' 
                          : 'border-border/30 hover:border-border/60'
                      }`}
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.alt || `${project.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
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

          {/* Description détaillée */}
          <div className={project.media.length > 0 ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <h2 className="text-xl font-semibold mb-6 text-foreground">
              Description détaillée
            </h2>
            
            <Card className="border-border/50 bg-card-gradient">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Métadonnées supplémentaires */}
            <div className="mt-8 space-y-4">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type de projet</span>
                    <Badge variant="secondary">
                      {project.stack.includes('React Native') ? 'Mobile' : 
                       project.stack.includes('Spring Boot') ? 'Backend' : 'Web'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Nombre de technologies</span>
                    <span className="font-medium text-foreground">{project.stack.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Médias disponibles</span>
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
              Découvrez d'autres projets
            </h3>
            <Link to="/">
              <Button variant="outline">
                Voir tous les projets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;