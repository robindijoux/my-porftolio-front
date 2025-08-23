import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar } from 'lucide-react';
import { Project } from '@/services/api';
import { formatShortDate } from '@/utils/date';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Card className="group overflow-hidden border-border/50 bg-card-gradient hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      {/* Image du projet */}
      <div className="relative overflow-hidden">
        {project.media.length > 0 && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={project.media[0].url}
              alt={project.media[0].alt || project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
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
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
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
          {project.stack.slice(0, 4).map((tech) => (
            <Badge 
              key={tech} 
              variant="outline" 
              className="text-xs border-border/60 hover:border-primary/50 transition-colors"
            >
              {tech}
            </Badge>
          ))}
          {project.stack.length > 4 && (
            <Badge variant="outline" className="text-xs border-border/60">
              +{project.stack.length - 4}
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
            {project.liveUrl && (
              <Button variant="ghost" size="icon" asChild>
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={t('project.viewLive')}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="ghost" size="icon" asChild>
                <a 
                  href={project.githubUrl} 
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