import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ExternalLink, Github, Calendar, Trash2, Play } from 'lucide-react';
import { Project, apiService } from '@/services/api';
import { formatShortDate } from '@/utils/date';
import { isImage, isVideo } from '@/utils/media';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useToast } from '@/hooks/use-toast';

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, getAuthHeader } = useAuthentication();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const authHeaders = getAuthHeader();
      if (!authHeaders.Authorization) {
        toast({
          title: t('errors.authRequired'),
          description: t('errors.authRequiredDescription'),
          variant: "destructive",
        });
        return;
      }

      await apiService.deleteProject(project.id, authHeaders.Authorization.replace('Bearer ', ''));
      
      toast({
        title: t('project.deleteSuccess'),
        description: t('project.deleteSuccessDescription'),
      });
      
      // Appeler la callback si fournie pour rafraîchir la liste
      onDelete?.();
    } catch (error) {
      toast({
        title: t('errors.projectDeleteError'),
        description: error instanceof Error ? error.message : t('errors.unknown'),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card-gradient hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      {/* Image du projet */}
      <div className="relative overflow-hidden">
        {project.media.length > 0 && (
          <div className="aspect-video w-full overflow-hidden">
            {isImage(project.media[0].type) ? (
              <img
                src={project.media[0].url}
                alt={project.media[0].alt || project.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            ) : isVideo(project.media[0].type) ? (
              <div className="relative w-full h-full">
                <video
                  src={project.media[0].url}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
        
        {/* Badge "En vedette" */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-secondary text-secondary-foreground shadow-secondary-glow">
              ⭐ {t('project.featured')}
            </Badge>
          </div>
        )}

        {/* Bouton de suppression pour les utilisateurs connectés */}
        {isAuthenticated && (
          <div className="absolute top-4 right-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-background/80 hover:bg-destructive hover:text-destructive-foreground backdrop-blur-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('project.confirmDelete')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('project.confirmDeleteDescription', { name: project.name })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t('common.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground line-clamp-2 mt-1">
              {project.shortDescription}
            </CardDescription>
          </div>
        </div>

        {/* Date de création */}
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Calendar className="h-3 w-3 mr-1" />
          {formatShortDate(project.createdAt, i18n.language)}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stack technologique */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge
              key={tech.technology}
              variant="outline"
              className="text-xs border-border/60"
            >
              <img src={tech.iconUrl} alt={tech.technology} className="h-3 w-3 mr-1" />
              {tech.technology}
            </Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge variant="outline" className="text-xs border-border/60">
              +{project.techStack.length - 4}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link to={`/project/${project.id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {t('project.details')}
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            {project.projectLink && (
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('project.viewLive')}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.repositoryLink && (
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={project.repositoryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('project.viewCode')}
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;