import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  title?: string;
  description?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = "/",
  title = "Connexion requise",
  description = "Vous devez être connecté pour accéder à cette fonctionnalité."
}) => {
  const auth = useAuth();

  // Si l'utilisateur n'est pas authentifié, afficher l'écran de connexion
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-[500px] mx-4">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {auth.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  Une erreur s'est produite lors de l'authentification : {auth.error.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={() => auth.signinRedirect()} 
                className="w-full"
                size="lg"
                disabled={auth.isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {auth.isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <Link to={fallbackPath}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si l'utilisateur est authentifié, afficher le contenu protégé
  return <>{children}</>;
};