import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import CreateProjectForm from '@/components/CreateProjectForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EditProject = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => id ? apiService.getProjectById(id) : Promise.reject('No ID'),
    enabled: !!id,
  });

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

  if (error || !project) {
    return (
      <div className="bg-background min-h-screen py-8 md:py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{t('errors.projectDetailError')}</p>
          <Button onClick={() => navigate('/admin/projects')}>
            {t('timeline.backButton')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/projects')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('timeline.backButton')}
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-playfair font-bold mb-2">{t('project.editProject')}</h1>
            <p className="text-muted-foreground">
              {t('project.editProjectDescription', { name: project.name })}
            </p>
          </div>
        </div>
        
        <CreateProjectForm 
          projectToEdit={project}
          onSuccess={() => navigate('/admin/projects')}
          onCancel={() => navigate('/admin/projects')}
        />
      </div>
    </div>
  );
};

export default EditProject;
