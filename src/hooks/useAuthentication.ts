import { useAuth } from "react-oidc-context";
import { User } from "oidc-client-ts";

// Hook personnalisé pour simplifier l'utilisation de l'authentification
export const useAuthentication = () => {
  const auth = useAuth();

  return {
    // État de l'authentification
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    
    // Informations utilisateur
    user: auth.user,
    userProfile: auth.user?.profile,
    email: auth.user?.profile?.email,
    
    // Tokens
    accessToken: auth.user?.access_token,
    idToken: auth.user?.id_token,
    refreshToken: auth.user?.refresh_token,
    
    // Actions
    signIn: () => auth.signinRedirect(),
    signOut: () => auth.removeUser(),
    
    // Permissions
    canCreateProjects: auth.isAuthenticated,
    canEditProjects: auth.isAuthenticated,
    
    // Vérifier si l'utilisateur a un rôle spécifique (si configuré dans Cognito)
    hasRole: (role: string) => {
      const roles = auth.user?.profile?.['cognito:groups'] as string[] || [];
      return roles.includes(role);
    },
    
    // Obtenir un header d'autorisation pour les requêtes API
    getAuthHeader: () => {
      if (auth.user?.access_token) {
        return {
          Authorization: `Bearer ${auth.user.access_token}`
        };
      }
      return {};
    }
  };
};