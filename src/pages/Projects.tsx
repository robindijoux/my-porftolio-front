import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import ProjectCard from '@/components/ProjectCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Project, apiService } from '@/services/api';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProjects();
      // Vérifier et nettoyer les données pour éviter les erreurs
      const cleanedData = data.map(project => ({
        ...project,
        media: project.media || [],
        techStack: project.techStack || [],
        name: project.name || '',
        description: project.description || '',
        shortDescription: project.shortDescription || ''
      }));
      setProjects(cleanedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <div className="bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            💻 {t('projects.title')}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('projects.title')}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t('projects.description')}
          </p>
        </div>

        {/* Contenu des projets */}
        {loading && <LoadingSpinner size="lg" />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={loadProjects}
          />
        )}

        {!loading && !error && (
          <>
            {/* Projets en vedette */}
            {featuredProjects.length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4 text-foreground">
                    {t('home.sections.featuredProjects')}
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
                    {t('home.sections.featuredProjectsDescription')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} onDelete={loadProjects} />
                  ))}
                </div>
              </div>
            )}

            {/* Autres projets */}
            {otherProjects.length > 0 && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {t('home.sections.otherProjects')}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('home.sections.otherProjectsDescription')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {otherProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} onDelete={loadProjects} />
                  ))}
                </div>
              </div>
            )}

            {projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('home.noProjects')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;