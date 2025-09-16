import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo / Nom */}
        <Link 
          to="/" 
          className="text-xl font-playfair font-semibold text-foreground hover:text-primary transition-colors"
        >
          {t('home.title')}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {t('nav.projects')}
          </Link>
          <Link 
            to="/create-project" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/create-project' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {t('nav.newProject')}
          </Link>
          <a 
            href="#about" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('nav.about')}
          </a>
          <a 
            href="#contact" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('nav.contact')}
          </a>
        </nav>

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { UserInfo } from './AuthComponent';

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo / Nom */}
        <Link 
          to="/" 
          className="text-xl font-playfair font-semibold text-foreground hover:text-primary transition-colors"
        >
          {t('home.title')}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {t('nav.projects')}
          </Link>
          <Link 
            to="/create-project" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/create-project' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {t('nav.newProject')}
          </Link>
          <a 
            href="#about" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('nav.about')}
          </a>
          <a 
            href="#contact" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('nav.contact')}
          </a>
        </nav>

        {/* Informations utilisateur et liens sociaux */}
        <div className="flex items-center space-x-4">
          <UserInfo />
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <Button variant="ghost" size="icon" asChild>
              <a 
                href="https://github.com/robindijoux" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a 
                href="https://www.linkedin.com/in/robindijoux" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a 
                href="mailto:dr@ecomail.fr"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
      </div>
    </header>
  );
};

export default Header;