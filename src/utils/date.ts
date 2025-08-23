import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export const formatDate = (date: string | Date, language: string = 'fr') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'fr' ? fr : enUS;
  
  return format(dateObj, 'PPP', { locale });
};

export const formatShortDate = (date: string | Date, language: string = 'fr') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = language === 'fr' ? fr : enUS;
  
  return format(dateObj, 'PP', { locale });
};