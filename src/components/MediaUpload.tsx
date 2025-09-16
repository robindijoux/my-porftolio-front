import React, { useCallback, useState } from 'react';
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
    if (type.startsWith('image/')) return <FileImage className="h-4 w-4" />;
    if (type.startsWith('video/')) return <FileVideo className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) return 'bg-blue-100 text-blue-800';
    if (type.startsWith('video/')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
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
          <div className="grid gap-3">
            {uploadedMedia.map((media) => (
              <Card key={media.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(media.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{media.filename}</p>
                      <Badge variant="secondary" className={getFileTypeColor(media.type)}>
                        {media.type.split('/')[0]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32">
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveMedia(media.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;