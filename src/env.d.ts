/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Configuration API
  readonly VITE_API_URL: string
  
  // Configuration AWS Cognito
  readonly VITE_AWS_COGNITO_REGION: string
  readonly VITE_AWS_COGNITO_USER_POOL_ID: string
  readonly VITE_AWS_COGNITO_CLIENT_ID: string
  readonly VITE_AWS_COGNITO_DOMAIN: string
  readonly VITE_AWS_COGNITO_LOGOUT_DOMAIN: string
  
  // URL de redirection
  readonly VITE_REDIRECT_URI: string
  
  // Scopes d'authentification
  readonly VITE_AUTH_SCOPE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}