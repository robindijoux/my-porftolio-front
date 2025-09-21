import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="py-20 bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 text-foreground">
            {t('home.sections.contact')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('home.sections.contactDescription')}
          </p>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-secondary-glow"
            asChild
          >
            <a href="mailto:dr@ecomail.fr">
              {t('home.sections.collaborate')}
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;