// Utilitaires pour la gestion des médias
import i18n from '@/i18n/config';

/**
 * Détermine si un média est une image basé sur son type MIME
 */
export const isImage = (type: string): boolean => {
  return type.toLowerCase().includes('image') || type === 'PHOTO';
};

/**
 * Détermine si un média est une vidéo basé sur son type MIME
 */
export const isVideo = (type: string): boolean => {
  return type.toLowerCase().includes('video') || type === 'VIDEO';
};

/**
 * Détermine si un média est un document basé sur son type MIME
 */
export const isDocument = (type: string): boolean => {
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'application', 'text'];
  return documentTypes.some(docType => type.toLowerCase().includes(docType));
};

/**
 * Obtient une classe CSS appropriée pour le type de média
 */
export const getMediaTypeClass = (type: string): string => {
  if (isImage(type)) return 'bg-blue-100 text-blue-800';
  if (isVideo(type)) return 'bg-purple-100 text-purple-800';
  if (isDocument(type)) return 'bg-gray-100 text-gray-800';
  return 'bg-gray-100 text-gray-800';
};

/**
 * Obtient le nom d'affichage du type de média
 */
export const getMediaTypeName = (type: string): string => {
  if (isImage(type)) return i18n.t('media.image');
  if (isVideo(type)) return i18n.t('media.video');
  if (isDocument(type)) return i18n.t('media.document');
  return i18n.t('media.file');
};