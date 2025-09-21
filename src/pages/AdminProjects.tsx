import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, Eye, Trash2, Plus, ArrowLeft, ExternalLink, Github, Star, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService, Project } from '@/services/api';
import { useState } from 'react';
import { useAuth } from 'react-oidc-context';

const AdminProjects = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Récupération des projets
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiService.getProjects(),
  });

  // Trier les projets par date de création (plus récent en premier)
  const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getProjectTypeColor = (project: Project) => {
    if (project.featured) {
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400';
    }
    if (project.isPublished) {
      return 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400';
    }
    return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400';
  };

  const getProjectTypeLabel = (project: Project) => {
    if (project.featured) {
      return t('project.featured');
    }
    if (project.isPublished) {
      return 'Publié';
    }
    return 'Brouillon';
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (window.confirm(t('project.confirmDelete', { name }))) {
      if (!auth.user?.access_token) {
        alert(t('errors.authRequired'));
        return;
      }

      try {
        setDeletingId(id);
        await apiService.deleteProject(id, auth.user.access_token);
        
        // Invalidate and refetch projects
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        
        alert(t('project.deleteSuccess'));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(t('errors.projectDeleteError'));
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen py-8 md:py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen py-8 md:py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{t('errors.projectsLoadError')}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['projects'] })}>
            {t('common.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('timeline.backButton')}
            </Button>
            <h1 className="text-2xl md:text-3xl font-playfair font-bold">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Administration des projets
              </span>
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/create-project">
                <Plus className="h-4 w-4 mr-2" />
                {t('project.createNew')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total projets</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <Folder className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Publiés</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.isPublished).length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mis en avant</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.featured).length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total vues</p>
                  <p className="text-2xl font-bold">{projects.reduce((total, p) => total + p.views, 0)}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des projets */}
        {sortedProjects.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun projet</h3>
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore créé de projets dans votre portfolio.
              </p>
              <Button asChild>
                <Link to="/create-project">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier projet
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <Card key={project.id} className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {project.media?.[0] ? (
                        <img
                          src={project.media[0].url}
                          alt={project.media[0].alt || project.name}
                          className="w-24 h-16 object-cover rounded-lg border border-border"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Im0xNSAxMi0zLTMtMy4wMSAzTDEyIDEyeiIgZmlsbD0iIzk0YTNiOCIvPgo8L3N2Zz4K';
                          }}
                        />
                      ) : (
                        <div className="w-24 h-16 bg-muted rounded-lg border border-border flex items-center justify-center">
                          <Folder className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`${getProjectTypeColor(project)} font-medium text-xs`}>
                            {getProjectTypeLabel(project)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {project.views}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          disabled={deletingId === project.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingId === project.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-foreground">
                        <Link 
                          to={`/project/${project.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {project.name}
                        </Link>
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.shortDescription}
                      </p>

                      {/* Technologies */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.techStack.slice(0, 4).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tech.technology}
                            </Badge>
                          ))}
                          {project.techStack.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.techStack.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-primary" />
                          {formatDate(project.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Folder className="h-3 w-3" />
                          {project.media?.length || 0} médias
                        </div>
                        {project.repositoryLink && (
                          <a 
                            href={project.repositoryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <Github className="h-3 w-3" />
                            Code
                          </a>
                        )}
                        {project.projectLink && (
                          <a 
                            href={project.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;