import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProjectCard from '@/components/ProjectCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Project, apiService } from '@/services/api';
import { ArrowDown, Code, Palette, Zap } from 'lucide-react';

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Section Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-10" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              💻 Développeur Full-Stack
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                Créateur d'expériences
              </span>
              <br />
              <span className="text-foreground">numériques raffinées</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-inter font-light">
              Passionné par le développement web moderne, je conçois des 
              applications élégantes et performantes avec une attention particulière 
              aux détails et à l'expérience utilisateur.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
              <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{projects.length}+</div>
                <div className="text-sm text-muted-foreground">Projets réalisés</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-3">
                  <Palette className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-foreground">3+</div>
                <div className="text-sm text-muted-foreground">Années d'expérience</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-3">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div className="text-2xl font-bold text-foreground">15+</div>
                <div className="text-sm text-muted-foreground">Technologies maîtrisées</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Voir mes projets
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
              >
                <a href="#contact">Me contacter</a>
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
                    <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
                      <span className="bg-hero-gradient bg-clip-text text-transparent">
                        Projets sélectionnés
                      </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-inter">
                      Découvrez mes réalisations les plus abouties et représentatives 
                      de mon expertise technique
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {featuredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {/* Autres projets */}
              {otherProjects.length > 0 && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                      Autres réalisations
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Explorez l'ensemble de mes projets et expérimentations
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {otherProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {projects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun projet trouvé.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Section Contact rapide */}
      <section id="contact" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discutons de vos idées et voyons comment je peux vous aider à les concrétiser
            </p>
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-secondary-glow"
              asChild
            >
              <a href="mailto:contact@exemple.com">
                Commençons à collaborer
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;