import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Image, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTimelineEvents } from '@/hooks/useTimelineEvents';
import { CreateTimelineEventData } from '@/services/timelineService';

const CreateEvent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createEvent } = useTimelineEvents();

  const [formData, setFormData] = useState<CreateTimelineEventData>({
    year: '',
    title: '',
    description: '',
    type: 'work',
    location: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateTimelineEventData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Créer l'événement via le hook
      const newEvent = await createEvent(formData);
      console.log('Nouvel événement créé:', newEvent);
      
      alert(t('success.eventCreated'));
      
      // Proposer d'aller vers la page d'administration
      if (window.confirm(t('success.eventCreatedConfirm'))) {
        navigate('/admin/events');
        return;
      }
      
      // Réinitialiser le formulaire
      setFormData({
        year: '',
        title: '',
        description: '',
        type: 'work',
        location: '',
        image: ''
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      alert(t('errors.eventCreateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
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
              {t('timeline.createEvent')}
            </span>
          </h1>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('timeline.newEventTimeline')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium">
                  {t('timeline.eventDate')}
                </Label>
                <Input
                  id="year"
                  type="date"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  {t('timeline.eventTitle')}
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder={t('timeline.eventTitlePlaceholder')}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  {t('timeline.eventType')}
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'education' | 'achievement' | 'work') => handleInputChange('type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('timeline.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">{t('timeline.typeLabels.education')}</SelectItem>
                    <SelectItem value="work">{t('timeline.typeLabels.work')}</SelectItem>
                    <SelectItem value="achievement">{t('timeline.typeLabels.achievement')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t('timeline.eventDescription')}
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('timeline.eventDescriptionPlaceholder')}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              {/* Localisation */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('timeline.eventLocation')}
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder={t('timeline.eventLocationPlaceholder')}
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* URL de l'image */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  {t('timeline.eventImage')}
                </Label>
                <Input
                  id="image"
                  type="url"
                  placeholder={t('timeline.eventImagePlaceholder')}
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  required
                  className="w-full"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt={t('timeline.imagePreview')}
                      className="w-32 h-24 object-cover rounded-lg border border-border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  {t('timeline.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? t('timeline.creating') : t('timeline.createButton')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Aperçu des données (mode debug) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">{t('timeline.dataPreview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;

  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Créer un événement
            </span>
          </h1>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Nouvel événement timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium">
                  Date de l'événement
                </Label>
                <Input
                  id="year"
                  type="date"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Titre de l'événement
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ex: Diplôme d'ingénieur..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Type d'événement
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'education' | 'achievement' | 'work') => handleInputChange('type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">🎓 Éducation</SelectItem>
                    <SelectItem value="work">💼 Travail</SelectItem>
                    <SelectItem value="achievement">🏆 Réalisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez l'événement en détail..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              {/* Localisation */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation (optionnel)
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Ex: Sophia Antipolis, France"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* URL de l'image */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  URL de l'image
                </Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  required
                  className="w-full"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-32 h-24 object-cover rounded-lg border border-border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Création...' : 'Créer l\'événement'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Aperçu des données (mode debug) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Aperçu des données (Dev Mode)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;