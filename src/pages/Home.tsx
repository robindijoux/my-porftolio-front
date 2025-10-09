import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProjectCard from '@/components/ProjectCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Project, apiService } from '@/services/api';
import { ArrowDown, Code, Palette, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home = () => {
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
    <div className="bg-background font-inter">
      {/* Section Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-10" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              💻 {t('home.subtitle')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                {t('home.title')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-inter font-light">
              {t('home.description')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="text-center p-6 rounded-xl bg-warm/30 border border-warm/40 shadow-warm-glow/20">
                <div className="flex items-center justify-center w-14 h-14 bg-foreground/10 rounded-xl mx-auto mb-4">
                  <Code className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground font-playfair">{projects.length}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('home.stats.projects')}</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-primary/20 border border-primary/40 shadow-glow/20">
                <div className="flex items-center justify-center w-14 h-14 bg-foreground/10 rounded-xl mx-auto mb-4">
                  <Palette className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground font-playfair">3</div>
                <div className="text-sm text-muted-foreground font-medium">{t('home.stats.experience')}</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-secondary/30 border border-secondary/50 shadow-secondary-glow/20">
                <div className="flex items-center justify-center w-14 h-14 bg-foreground/10 rounded-xl mx-auto mb-4">
                  <Zap className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground font-playfair">2</div>
                <div className="text-sm text-muted-foreground font-medium">{t('home.stats.certifications')}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('home.cta.viewProjects')}
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
              >
                <a href="#contact">{t('home.cta.contact')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Projets */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
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
      </section>
    </div>
  );
};

export default Home;