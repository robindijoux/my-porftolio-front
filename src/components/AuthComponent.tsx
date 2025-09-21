import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signOutRedirect } from "@/config/auth";
import { LogIn, LogOut, User } from "lucide-react";

interface AuthComponentProps {
  children: React.ReactNode;
}

export const AuthComponent: React.FC<AuthComponentProps> = ({ children }) => {
  const auth = useAuth();

  // Si on est en train de charger lors de l'initialisation, on affiche un loader discret
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Si il y a une erreur, on l'affiche mais on permet quand même l'accès
  if (auth.error) {
    console.error('Erreur d\'authentification:', auth.error.message);
    // On continue à afficher l'application même s'il y a une erreur d'auth
  }

  // Toujours afficher l'application, authentifié ou non
  return <>{children}</>;
};

// Composant pour afficher les informations utilisateur ou bouton de connexion
export const UserInfo: React.FC = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  // Fonction de déconnexion
  const handleLogout = () => {
    const logoutResult = signOutRedirect();
    
    // Si pas de domaine personnalisé configuré, utiliser la déconnexion locale
    if (logoutResult === 'LOCAL_LOGOUT') {
      auth.removeUser();
    }
    // Sinon, signOutRedirect() a déjà géré la redirection
  };

  // Si on est en cours de chargement
  if (auth.isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t('auth.loading')}</span>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, afficher le bouton de connexion
  if (!auth.isAuthenticated) {
    return (
      <Button
        onClick={() => auth.signinRedirect()}
        variant="default"
        size="sm"
      >
        <LogIn className="mr-2 h-4 w-4" />
        {t('auth.signIn')}
      </Button>
    );
  }

  // Si l'utilisateur est authentifié, afficher ses informations
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 cursor-default">
            <User className="h-4 w-4 text-primary" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('auth.loggedInAs', { email: auth.user?.profile?.email || 'Utilisateur' })}</p>
        </TooltipContent>
      </Tooltip>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">{t('auth.signOut')}</span>
        <span className="sm:hidden">{t('auth.signOutShort')}</span>
      </Button>
    </div>
  );
};