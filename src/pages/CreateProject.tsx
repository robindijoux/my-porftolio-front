import React from 'react';
import { useTranslation } from 'react-i18next';
import CreateProjectForm from '@/components/CreateProjectForm';

const CreateProject: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('project.createNew')}</h1>
          <p className="text-muted-foreground">
            Ajoutez un nouveau projet à votre portfolio avec des médias et des technologies
          </p>
        </div>
        
        <CreateProjectForm />
      </div>
    </div>
  );
};

export default CreateProject;