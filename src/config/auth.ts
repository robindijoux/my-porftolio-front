// Configuration pour l'authentification AWS Cognito basée sur les variables d'environnement

// Validation des variables d'environnement requises
const requiredEnvVars = {
  region: import.meta.env.VITE_AWS_COGNITO_REGION,
  userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
  domain: import.meta.env.VITE_AWS_COGNITO_DOMAIN,
  logoutDomain: import.meta.env.VITE_AWS_COGNITO_LOGOUT_DOMAIN,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  scope: import.meta.env.VITE_AUTH_SCOPE,
};

// Vérification que toutes les variables essentielles sont définies
const essentialVars = ['region', 'userPoolId', 'clientId', 'domain', 'redirectUri', 'scope'];
essentialVars.forEach((key) => {
  const value = requiredEnvVars[key as keyof typeof requiredEnvVars];
  if (!value) {
    throw new Error(`Variable d'environnement manquante: VITE_${key.toUpperCase()}`);
  }
});

// Configuration Cognito
export const cognitoAuthConfig = {
  authority: requiredEnvVars.domain,
  client_id: requiredEnvVars.clientId,
  redirect_uri: requiredEnvVars.redirectUri,
  response_type: "code",
  scope: requiredEnvVars.scope,
  // Configuration additionnelle pour améliorer l'expérience utilisateur
  post_logout_redirect_uri: requiredEnvVars.redirectUri,
  automaticSilentRenew: true,
  loadUserInfo: true,
};

// Debug en développement uniquement
if (import.meta.env.DEV) {
  console.log('🔐 Auth Configuration:', {
    environment: import.meta.env.PROD ? 'production' : 'development',
    redirectUri: requiredEnvVars.redirectUri,
    authority: requiredEnvVars.domain,
    clientId: requiredEnvVars.clientId,
    scope: requiredEnvVars.scope,
    hasLogoutDomain: !!requiredEnvVars.logoutDomain,
  });
}

// Fonction utilitaire pour la déconnexion avec redirection
export const signOutRedirect = () => {
  // Si un domaine de logout personnalisé est configuré, l'utiliser
  if (requiredEnvVars.logoutDomain) {
    const logoutUrl = `${requiredEnvVars.logoutDomain}/logout?client_id=${requiredEnvVars.clientId}&logout_uri=${encodeURIComponent(requiredEnvVars.redirectUri)}`;
    
    if (import.meta.env.DEV) {
      console.log('🚪 Logout redirect (custom domain):', logoutUrl);
    }
    
    window.location.href = logoutUrl;
  } else {
    // Sinon, utiliser la déconnexion locale de react-oidc-context
    if (import.meta.env.DEV) {
      console.log('🚪 Local logout (no custom domain configured)');
    }
    
    // Cette fonction sera appelée par le composant qui a accès au hook useAuth
    // On retourne une fonction qui peut être appelée avec l'objet auth
    return 'LOCAL_LOGOUT';
  }
};