import { useState, useMemo, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuthentication } from '@/hooks/useAuthentication';
import { apiService, CreateProjectData, MediaUploadResponse, Technology, Project } from '@/services/api';
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
  isPublished: boolean;
  featured: boolean;
  techStack?: string;
};

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  projectToEdit?: Project;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  onSuccess,
  onCancel,
  projectToEdit
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuthentication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaUploadResponse[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [currentTech, setCurrentTech] = useState('');
  const [currentTechIcon, setCurrentTechIcon] = useState('');

  const createProjectSchema = useMemo(() => z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    description: z.string().min(1, t('validation.descriptionRequired')),
    shortDescription: z.string().min(1, t('validation.shortDescriptionRequired')),
    repositoryLink: z.string().url(t('validation.invalidUrl')).optional().or(z.literal('')),
    projectLink: z.string().url(t('validation.invalidUrl')).optional().or(z.literal('')),
    isPublished: z.boolean(),
    featured: z.boolean(),
    techStack: z.string().optional(),
  }), [t]);

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: projectToEdit?.name || '',
      description: projectToEdit?.description || '',
      shortDescription: projectToEdit?.shortDescription || '',
      repositoryLink: projectToEdit?.repositoryLink || '',
      projectLink: projectToEdit?.projectLink || '',
      isPublished: projectToEdit?.isPublished ?? true,
      featured: projectToEdit?.featured ?? false,
      techStack: '',
    },
  });

  // Synchronize form values when projectToEdit changes
  useEffect(() => {
    if (projectToEdit) {
      form.reset({
        name: projectToEdit.name,
        description: projectToEdit.description,
        shortDescription: projectToEdit.shortDescription,
        repositoryLink: projectToEdit.repositoryLink || '',
        projectLink: projectToEdit.projectLink || '',
        isPublished: projectToEdit.isPublished,
        featured: projectToEdit.featured,
        techStack: '',
      });
      setUploadedMedia(projectToEdit.media?.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        alt: m.alt,
        filename: m.id
      })) || []);
      setTechnologies(projectToEdit.techStack || []);
      setCurrentTech('');
      setCurrentTechIcon('');
    }
  }, [projectToEdit, form]);

  const handleMediaUploaded = (media: MediaUploadResponse) => {
    setUploadedMedia(prev => [...prev, media]);
  };

  const handleRemoveMedia = (mediaId: string) => {
    setUploadedMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleAddTechnology = () => {
    if (currentTech.trim() && currentTechIcon.trim() && 
        !technologies.some(tech => tech.technology === currentTech.trim())) {
      setTechnologies(prev => [...prev, {
        technology: currentTech.trim(),
        iconUrl: currentTechIcon.trim()
      }]);
      setCurrentTech('');
      setCurrentTechIcon('');
    }
  };

  const handleRemoveTechnology = (techToRemove: Technology) => {
    setTechnologies(prev => prev.filter(tech => tech.technology !== techToRemove.technology));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  const onSubmit = async (data: CreateProjectFormData) => {
    if (!isAuthenticated || !accessToken) {
      toast({
        variant: "destructive",
        title: t('errors.authRequired'),
        description: t('errors.authRequiredDesc'),
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
        isPublished: data.isPublished,
        featured: data.featured,
        media: uploadedMedia.map(media => media.id),
        techStack: technologies,
      };

      if (projectToEdit) {
        // Update mode
        await apiService.updateProject(projectToEdit.id, projectData, accessToken);
        
        toast({
          title: t('success.projectUpdated'),
          description: t('success.projectUpdatedDesc', { name: data.name }),
        });
      } else {
        // Create mode
        const newProject = await apiService.createProject(projectData, accessToken);
        
        toast({
          title: t('success.projectCreated'),
          description: t('success.projectCreatedDesc', { name: newProject.name }),
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Project submission error:', error);
      toast({
        variant: "destructive",
        title: projectToEdit ? t('errors.projectUpdateError') : t('errors.projectCreationFailed'),
        description: error instanceof Error ? error.message : t('errors.genericError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!projectToEdit;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-playfair font-bold">
          {isEditing ? t('project.editProject') : t('project.createNew')}
        </CardTitle>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  placeholder={t('project.technologyPlaceholder')}
                  onKeyPress={handleKeyPress}
                />
                <Input
                  value={currentTechIcon}
                  onChange={(e) => setCurrentTechIcon(e.target.value)}
                  placeholder={t('project.iconUrlPlaceholder')}
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddTechnology}
                variant="outline"
                className="w-full"
              >
                {t('common.add')}
              </Button>
              
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech.technology}
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

            {/* Options de publication */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('project.publishingOptions')}</h3>
              
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('project.publishProject')}</FormLabel>
                      <FormDescription>
                        {t('project.publishProjectDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('project.featuredProject')}</FormLabel>
                      <FormDescription>
                        {t('project.featuredProjectDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                {isSubmitting ? (isEditing ? t('common.updating') : t('common.creating')) : (isEditing ? t('common.update') : t('common.create'))}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateProjectForm;