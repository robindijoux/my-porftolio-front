import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Lock, LogIn, LogOut, User, Plus, Settings } from 'lucide-react';
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Administration
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link 
                  to="/create-project" 
                  className="flex items-center gap-2 cursor-pointer"
                  title={!isAuthenticated ? "Connexion requise pour créer un projet" : ""}
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
                  <DropdownMenuItem className="cursor-default">
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">
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

        {/* Liens sociaux */}
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
    </header>
  );
};

export default Header;