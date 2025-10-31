import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, FileImage, FileVideo, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuthentication } from '@/hooks/useAuthentication';
import { apiService, MediaUploadResponse } from '@/services/api';
import { isImage, isVideo, isDocument, getMediaTypeClass, getMediaTypeName } from '@/utils/media';

interface MediaUploadProps {
  onMediaUploaded: (media: MediaUploadResponse) => void;
  onRemoveMedia: (mediaId: string) => void;
  uploadedMedia: MediaUploadResponse[];
  maxFiles?: number;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  onMediaUploaded,
  onRemoveMedia,
  uploadedMedia,
  maxFiles = 10
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { accessToken, isAuthenticated } = useAuthentication();
  const [uploading, setUploading] = useState(false);
  const [altTexts, setAltTexts] = useState<Record<string, string>>({});

  const getFileIcon = (type: string) => {
    if (isImage(type)) return <FileImage className="h-4 w-4" />;
    if (isVideo(type)) return <FileVideo className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getFileTypeColor = (type: string) => {
    return getMediaTypeClass(type);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!isAuthenticated || !accessToken) {
      toast({
        variant: "destructive",
        title: t('errors.authRequired'),
        description: t('errors.authRequiredDesc'),
      });
      return;
    }

    if (uploadedMedia.length + acceptedFiles.length > maxFiles) {
      toast({
        variant: "destructive",
        title: t('errors.tooManyFiles'),
        description: t('errors.maxFilesLimit', { max: maxFiles }),
      });
      return;
    }

    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        // Validation taille (50MB max comme spécifié dans l'API)
        if (file.size > 50 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: t('errors.fileTooLarge'),
            description: t('errors.maxFileSize', { filename: file.name }),
          });
          continue;
        }

        const uploadedMedia = await apiService.uploadMedia(file, altTexts[file.name], accessToken);
        onMediaUploaded(uploadedMedia);
        
        toast({
          title: t('success.fileUploaded'),
          description: t('success.fileUploadedDesc', { filename: file.name }),
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          variant: "destructive",
          title: t('errors.uploadFailed'),
          description: t('errors.uploadFailedDesc', { filename: file.name }),
        });
      }
    }
    
    setUploading(false);
  }, [uploadedMedia.length, maxFiles, altTexts, onMediaUploaded, toast, t, isAuthenticated, accessToken]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.mpeg', '.webm'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: uploading
  });

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{t('project.media')}</Label>
      
      {/* Zone de drop */}
      <Card className={`border-2 border-dashed transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}>
        <CardContent className="p-6">
          <div {...getRootProps()} className="cursor-pointer text-center">
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive ? t('project.dropFilesHere') : t('project.dragDropFiles')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('project.supportedFormats')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('project.maxFileSize')} • {t('project.maxFiles', { max: maxFiles })}
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="mt-4"
              disabled={uploading}
            >
              {uploading ? t('common.uploading') : t('project.selectFiles')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fichiers uploadés */}
      {uploadedMedia.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t('project.uploadedFiles')}</Label>
          
          {/* Galerie de miniatures */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedMedia.map((media) => (
              <div key={media.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-primary/50 transition-colors">
                  {isImage(media.type) ? (
                    <img
                      src={media.url}
                      alt={media.alt || media.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : isVideo(media.type) ? (
                    <div className="relative w-full h-full bg-black/10">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onError={() => {
                          console.error('Erreur chargement vidéo');
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <FileVideo className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {/* Bouton de suppression au survol */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveMedia(media.id)}
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Détails des fichiers */}
          <div className="space-y-2 mt-4">
            <Label className="text-sm font-medium">{t('project.mediaDetails')}</Label>
            <div className="grid gap-2">
              {uploadedMedia.map((media) => (
                <Card key={media.id} className="p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getFileIcon(media.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{media.filename}</p>
                        <Badge variant="secondary" className={`${getFileTypeColor(media.type)} text-xs`}>
                          {getMediaTypeName(media.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 sm:flex-none">
                      <Input
                        placeholder={t('project.altText')}
                        value={altTexts[media.id] || media.alt || ''}
                        onChange={(e) => setAltTexts(prev => ({
                          ...prev,
                          [media.id]: e.target.value
                        }))}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;