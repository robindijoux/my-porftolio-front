import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Lock, LogIn, LogOut, User, Plus, Settings, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LanguageSelector from './LanguageSelector';
import { useAuthentication } from '@/hooks/useAuthentication';
import { signOutRedirect } from '@/config/auth';
import { useAuth } from "react-oidc-context";

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthentication();
  const auth = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    const logoutResult = signOutRedirect();
    
    // Si pas de domaine personnalisé configuré, utiliser la déconnexion locale
    if (logoutResult === 'LOCAL_LOGOUT') {
      auth.removeUser();
    }
    // Sinon, signOutRedirect() a déjà géré la redirection
  };

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

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={scrollToTop}
          >
            {t('nav.projects')}
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={scrollToTop}
          >
            {t('nav.about')}
          </Link>
          <a 
            href="#contact" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {t('nav.contact')}
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="transition-colors hover:text-primary"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link 
                  to="/create-project" 
                  className="flex items-center gap-2 cursor-pointer"
                  title={!isAuthenticated ? t('auth.loginRequired') : ""}
                >
                  <Plus className="h-4 w-4" />
                  {t('nav.newProject')}
                  {!isAuthenticated && <Lock className="h-3 w-3 ml-auto opacity-70" />}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {!isAuthenticated ? (
                <DropdownMenuItem 
                  onClick={() => auth.signinRedirect()}
                  className="cursor-pointer"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('auth.signIn')}
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem className="cursor-default hover:bg-transparent focus:bg-transparent">
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate text-muted-foreground">
                      {auth.user?.profile?.email || 'Utilisateur'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Liens sociaux Desktop & Button hamburger Mobile */}
        <div className="flex items-center space-x-2">
          {/* Liens sociaux - cachés sur mobile */}
          <div className="hidden md:flex items-center space-x-2">
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

          {/* Sélecteur de langue visible sur mobile */}
          <div className="md:hidden">
            <LanguageSelector />
          </div>

          {/* Bouton hamburger Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container px-4 py-4 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              <Link 
                to="/" 
                className={`block text-base font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                {t('nav.projects')}
              </Link>
              <Link 
                to="/about" 
                className={`block text-base font-medium transition-colors hover:text-primary ${
                  location.pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                {t('nav.about')}
              </Link>
              <a 
                href="#contact" 
                className="block text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </a>
              
              {/* Nouveau projet */}
              <Link 
                to="/create-project" 
                className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${
                  !isAuthenticated ? 'text-muted-foreground/50' : 'text-muted-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                title={!isAuthenticated ? t('auth.loginRequired') : ""}
              >
                <Plus className="h-4 w-4" />
                {t('nav.newProject')}
                {!isAuthenticated && <Lock className="h-3 w-3 ml-auto opacity-70" />}
              </Link>
            </div>

            {/* Séparateur */}
            <div className="border-t border-border/40 pt-4">
              {/* Authentification */}
              {!isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-base font-medium"
                  onClick={() => {
                    auth.signinRedirect();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('auth.signIn')}
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2 text-base text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">
                      {auth.user?.profile?.email || 'Utilisateur'}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-base font-medium"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.signOut')}
                  </Button>
                </div>
              )}
            </div>

            {/* Liens sociaux Mobile */}
            <div className="border-t border-border/40 pt-4">
              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                  <a 
                    href="https://github.com/robindijoux" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a 
                    href="https://www.linkedin.com/in/robindijoux" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a 
                    href="mailto:dr@ecomail.fr"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;