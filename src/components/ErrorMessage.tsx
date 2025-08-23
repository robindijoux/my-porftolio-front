import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage = ({ 
  title, 
  message, 
  onRetry, 
  className 
}: ErrorMessageProps) => {
  
  const { t } = useTranslation();
  const displayTitle = title || t('project.loadingError');
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Alert className="max-w-md border-destructive/20 bg-destructive/5">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive">{title || t('common.error')}</AlertTitle>
        <AlertTitle className="text-destructive">{displayTitle}</AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          {message}
        </AlertDescription>
        {onRetry && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
              {t('project.retry')}
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
};

export default ErrorMessage;