import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiService, CreateProjectData, MediaUploadResponse } from '@/services/api';
import MediaUpload from './MediaUpload';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type CreateProjectFormData = {
  name: string;
  description: string;
  shortDescription: string;
  repositoryLink?: string;
  projectLink?: string;
  techStack?: string;
};

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaUploadResponse[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState('');

  const createProjectSchema = useMemo(() => z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    description: z.string().min(10, t('validation.descriptionMinLength')),
    shortDescription: z.string().min(5, t('validation.shortDescriptionMinLength')),
    repositoryLink: z.string().url(t('validation.invalidUrl')).optional().or(z.literal('')),
    projectLink: z.string().url(t('validation.invalidUrl')).optional().or(z.literal('')),
    techStack: z.string().optional(),
  }), [t]);

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      shortDescription: '',
      repositoryLink: '',
      projectLink: '',
      techStack: '',
    },
  });

  const handleMediaUploaded = (media: MediaUploadResponse) => {
    setUploadedMedia(prev => [...prev, media]);
  };

  const handleRemoveMedia = (mediaId: string) => {
    setUploadedMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleAddTechnology = () => {
    if (currentTech.trim() && !technologies.includes(currentTech.trim())) {
      setTechnologies(prev => [...prev, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(prev => prev.filter(t => t !== tech));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  const onSubmit = async (data: CreateProjectFormData) => {
    if (uploadedMedia.length === 0) {
      toast({
        variant: "destructive",
        title: t('errors.noMedia'),
        description: t('errors.noMediaDesc'),
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const projectData: CreateProjectData = {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        repositoryLink: data.repositoryLink || '',
        projectLink: data.projectLink || '',
        mediaIds: uploadedMedia.map(media => media.id),
        techStack: technologies,
      };

      const newProject = await apiService.createProject(projectData);
      
      toast({
        title: t('success.projectCreated'),
        description: t('success.projectCreatedDesc', { name: newProject.name }),
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Project creation error:', error);
      toast({
        variant: "destructive",
        title: t('errors.projectCreationFailed'),
        description: error instanceof Error ? error.message : t('errors.genericError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t('project.createNew')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('project.generalInfo')}</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('project.namePlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project.shortDescription')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('project.shortDescPlaceholder')} />
                    </FormControl>
                    <FormDescription>{t('project.shortDescHelper')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project.description')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder={t('project.descPlaceholder')} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Liens */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('project.links')}</h3>
              
              <FormField
                control={form.control}
                name="repositoryLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project.repositoryLink')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('placeholders.githubUrl')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('project.projectLink')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('placeholders.projectUrl')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Technologies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('project.technologies')}</h3>
              
              <div className="flex space-x-2">
                <Input
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  placeholder={t('project.technologyPlaceholder')}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTechnology}
                  variant="outline"
                >
                  {t('common.add')}
                </Button>
              </div>
              
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleRemoveTechnology(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Upload de médias */}
            <MediaUpload
              onMediaUploaded={handleMediaUploaded}
              onRemoveMedia={handleRemoveMedia}
              uploadedMedia={uploadedMedia}
              maxFiles={10}
            />

            <Separator />

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel || (() => navigate('/'))}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.creating') : t('common.create')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateProjectForm;