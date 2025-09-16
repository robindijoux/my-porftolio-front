# Intégration de l'authentification AWS Cognito

## Config# Intégration de l'authentification AWS Cognito (Optionnelle)

# Intégration de l'authentification AWS Cognito (Optionnelle)

## Configuration

L'authentification AWS Cognito a été intégrée dans l'application avec une approche **optionnelle** et utilise des **variables d'environnement** pour une meilleure sécurité et flexibilité.

### Variables d'environnement requises :

Copiez `.env.example` vers `.env` et configurez les variables suivantes :

```bash
# Configuration de l'API
VITE_API_URL=http://localhost:3002/api

# Configuration AWS Cognito
VITE_AWS_COGNITO_REGION=eu-west-3
VITE_AWS_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_AWS_COGNITO_CLIENT_ID=your-client-id
VITE_AWS_COGNITO_DOMAIN=https://cognito-idp.region.amazonaws.com/user-pool-id

# Domaine Cognito pour logout (optionnel)
VITE_AWS_COGNITO_LOGOUT_DOMAIN=

# URL de redirection (à adapter selon l'environnement)
VITE_REDIRECT_URI=http://localhost:8080  # Dev: localhost:8080, Prod: https://your-domain.com

# Scopes d'authentification
VITE_AUTH_SCOPE=phone openid email
```

### Configuration simplifiée par environnement :

- **Développement** : `VITE_REDIRECT_URI=http://localhost:8080`
- **Production** : `VITE_REDIRECT_URI=https://your-domain.com`

Plus besoin de variables séparées pour dev/prod ! 🎯

### Sécurité des variables d'environnement :

⚠️ **Important** :
- Le fichier `.env` ne doit **jamais** être commité dans Git
- Utilisez `.env.example` comme template
- Les variables `VITE_*` sont exposées côté client (c'est normal pour Vite)
- Les secrets sensibles doivent rester côté backend uniquement

### Fichiers créés/modifiés :

1. **`.env`** - Variables d'environnement locales (non commité)
2. **`.env.example`** - Template des variables d'environnement
3. **`src/env.d.ts`** - Typage TypeScript des variables d'environnement
4. **`src/config/auth.ts`** - Configuration Cognito basée sur les variables d'env
5. **`src/components/AuthComponent.tsx`** - Composant wrapper pour l'authentification
6. **`src/components/ProtectedRoute.tsx`** - Protection spécifique de certaines routes
7. **`src/hooks/useAuthentication.ts`** - Hook personnalisé
8. **`src/main.tsx`** - AuthProvider configuré
9. **`src/App.tsx`** - Protection de la création de projets
10. **`src/components/Header.tsx`** - Bouton connexion/déconnexion

### Configuration automatique par environnement :

```typescript
// Détection automatique de l'environnement
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const redirectUri = isProduction ? 
  import.meta.env.VITE_REDIRECT_URI_PROD : 
  import.meta.env.VITE_REDIRECT_URI_DEV;
```

- **Développement** : Utilise `VITE_REDIRECT_URI_DEV`
- **Production** : Utilise `VITE_REDIRECT_URI_PROD`

## Fonctionnalités

### 🔓 **Accès Public**
- ✅ **Page d'accueil** : Accessible sans connexion
- ✅ **Liste des projets** : Visible par tous
- ✅ **Détails des projets** : Consultation libre
- ✅ **Navigation générale** : Libre accès

### 🔐 **Accès Protégé**
- 🔒 **Création de projets** : Connexion obligatoire
- 🔒 **Édition de projets** : Connexion obligatoire (si implémenté)

### 🎨 **Interface utilisateur**
- **Bouton de connexion** : Affiché dans le header quand non connecté
- **Informations utilisateur** : Email + bouton de déconnexion quand connecté
- **Indication visuelle** : Icône de cadenas sur les liens nécessitant une connexion
- **Page de connexion dédiée** : Pour les routes protégées
- **Gestion d'erreurs** : Affichage des erreurs avec possibilité de réessayer

### 🛠️ **Hook personnalisé `useAuthentication()`**

```typescript
const {
  isAuthenticated,
  isLoading,
  error,
  user,
  email,
  accessToken,
  signIn,
  signOut,
  canCreateProjects,
  canEditProjects,
  hasRole,
  getAuthHeader
} = useAuthentication();
```

## Configuration AWS Cognito

### URLs de callback à configurer :

Dans votre AWS Cognito User Pool, ajoutez ces URLs :

**Allowed callback URLs :**
- `https://your-domain.com` (production)
- `http://localhost:8080` (développement)

**Allowed sign-out URLs :**
- `https://your-domain.com` (production)  
- `http://localhost:8080` (développement)

### Étapes de configuration :

1. **Console AWS Cognito** → Votre User Pool
2. **App integration** → **App clients** → Votre client
3. **Modifier les "Allowed callback URLs"**
4. **Modifier les "Allowed sign-out URLs"**
5. **Sauvegarder**

## Déploiement

### Variables d'environnement de production :

Sur votre plateforme de déploiement (Vercel, Netlify, etc.), configurez :

```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_AWS_COGNITO_REGION=eu-west-3
VITE_AWS_COGNITO_USER_POOL_ID=eu-west-3_xxxxxxxxx
VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
VITE_AWS_COGNITO_DOMAIN=https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_xxxxxxxxx
VITE_REDIRECT_URI_DEV=http://localhost:8080
VITE_REDIRECT_URI_PROD=https://your-domain.com
VITE_AUTH_SCOPE=phone openid email
```

### Validation automatique :

Le système valide automatiquement la présence de toutes les variables requises au démarrage et affiche des erreurs explicites si une variable manque.

## Avantages de cette approche

✅ **Sécurité** : Variables sensibles externalisées  
✅ **Flexibilité** : Configuration par environnement  
✅ **Maintenabilité** : Un seul endroit pour la configuration  
✅ **Typage** : Variables d'environnement typées avec TypeScript  
✅ **Validation** : Vérification automatique des variables requises  
✅ **Debug** : Logs en développement uniquement  

Cette approche suit les **meilleures pratiques** pour la gestion des configurations dans les applications modernes ! 🔐

## Fonctionnalités

### 🔓 **Accès Public**
- ✅ **Page d'accueil** : Accessible sans connexion
- ✅ **Liste des projets** : Visible par tous
- ✅ **Détails des projets** : Consultation libre
- ✅ **Navigation générale** : Libre accès

### 🔐 **Accès Protégé**
- 🔒 **Création de projets** : Connexion obligatoire
- 🔒 **Édition de projets** : Connexion obligatoire (si implémenté)

### 🎨 **Interface utilisateur**
- **Bouton de connexion** : Affiché dans le header quand non connecté
- **Informations utilisateur** : Email + bouton de déconnexion quand connecté
- **Indication visuelle** : Icône de cadenas sur les liens nécessitant une connexion
- **Page de connexion dédiée** : Pour les routes protégées
- **Gestion d'erreurs** : Affichage des erreurs avec possibilité de réessayer

### 🛠️ **Hook personnalisé `useAuthentication()`**

```typescript
const {
  isAuthenticated,
  isLoading,
  error,
  user,
  email,
  accessToken,
  signIn,
  signOut,
  canCreateProjects,  // ✨ Nouveau
  canEditProjects,    // ✨ Nouveau
  hasRole,
  getAuthHeader
} = useAuthentication();
```

### 📱 **Expérience utilisateur :**

#### 👤 **Utilisateur non connecté :**
- Accès à toute l'application sauf création de projets
- Bouton "Se connecter" visible dans le header
- Icône de cadenas sur "Nouveau projet" avec tooltip explicatif
- Page d'invitation à la connexion pour les fonctionnalités protégées

#### ✅ **Utilisateur connecté :**
- Accès complet à toutes les fonctionnalités
- Email affiché dans le header
- Bouton de déconnexion disponible
- Accès direct à la création de projets

## Routes et Protection

### 🌐 **Routes publiques :**
```typescript
/ -----------------> Accueil (libre)
/project/:id ------> Détail projet (libre)
* -----------------> Page 404 (libre)
```

### 🔒 **Routes protégées :**
```typescript
/create-project ---> Création projet (connexion requise)
```

### 🛡️ **Composant ProtectedRoute :**
```typescript
<ProtectedRoute 
  title="Connexion requise pour créer un projet"
  description="Vous devez être connecté pour créer et gérer vos projets."
>
  <CreateProject />
</ProtectedRoute>
```

## Utilisation

### Dans un composant pour vérifier les permissions :

```typescript
import { useAuthentication } from '@/hooks/useAuthentication';

function MonComposant() {
  const { isAuthenticated, canCreateProjects, signIn } = useAuthentication();
  
  return (
    <div>
      {canCreateProjects ? (
        <Button>Créer un projet</Button>
      ) : (
        <Button onClick={signIn}>
          Se connecter pour créer un projet
        </Button>
      )}
    </div>
  );
}
```

### Pour conditionner l'affichage :

```typescript
const { isAuthenticated, email } = useAuthentication();

return (
  <div>
    {isAuthenticated ? (
      <p>Connecté en tant que {email}</p>
    ) : (
      <p>Navigation en mode invité</p>
    )}
  </div>
);
```

## Avantages de cette approche

✅ **UX améliorée** : Pas de barrière à l'entrée  
✅ **Découverte libre** : Les visiteurs peuvent explorer le portfolio  
✅ **Incitation douce** : Connexion proposée pour les fonctionnalités avancées  
✅ **Sécurité ciblée** : Protection uniquement des actions sensibles  
✅ **SEO-friendly** : Contenu accessible aux moteurs de recherche  

## Configuration pour la production

⚠️ **Important** : Pour la production, vous devrez :

1. **Mettre à jour l'URL de redirection** dans `src/config/auth.ts`
2. **Configurer le domaine Cognito** approprié
3. **Vérifier les paramètres CORS** dans AWS Cognito
4. **Configurer les URLs de callback** dans la console AWS Cognito
5. **Ajouter d'autres routes protégées** si nécessaire

## Extensibilité

Pour ajouter de nouvelles routes protégées :

```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute title="Zone administrateur">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```
L'authentification AWS Cognito a été intégrée dans l'application avec les fichiers suivants :

### Fichiers créés/modifiés :

1. **`src/config/auth.ts`** - Configuration des paramètres Cognito
2. **`src/components/AuthComponent.tsx`** - Composant wrapper pour l'authentification
3. **`src/hooks/useAuthentication.ts`** - Hook personnalisé pour faciliter l'utilisation
4. **`src/main.tsx`** - Modifié pour ajouter l'AuthProvider
5. **`src/App.tsx`** - Modifié pour intégrer le composant d'authentification
6. **`src/components/Header.tsx`** - Modifié pour afficher les informations utilisateur

### Configuration Cognito actuelle :

```typescript
{
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_2XXlaqkHE",
  client_id: "7ejr2h8p4hb9j65crvf9c8b720",
  redirect_uri: "https://robindijoux.fr",
  response_type: "code",
  scope: "phone openid email"
}
```

## Fonctionnalités

### 🔐 Authentification
- **Connexion automatique** : Redirection vers AWS Cognito pour l'authentification
- **Gestion des états** : Loading, erreurs, et authentification réussie
- **Déconnexion** : Bouton de déconnexion avec redirection propre
- **Interface utilisateur** : Composants UI élégants avec Shadcn/ui

### 🎨 Interface utilisateur
- **Écran de connexion** : Interface moderne avec cartes et boutons stylisés
- **Affichage utilisateur** : Email affiché dans le header avec bouton de déconnexion
- **États de chargement** : Spinner de chargement pendant l'authentification
- **Gestion d'erreurs** : Affichage des erreurs avec possibilité de réessayer

### 🛠️ Hook personnalisé `useAuthentication()`

```typescript
const {
  isAuthenticated,
  isLoading,
  error,
  user,
  email,
  accessToken,
  signIn,
  signOut,
  hasRole,
  getAuthHeader
} = useAuthentication();
```

### 📱 Fonctionnalités disponibles :
- ✅ Connexion/Déconnexion
- ✅ Affichage des informations utilisateur
- ✅ Protection des routes (l'app entière nécessite une authentification)
- ✅ Gestion des tokens d'accès
- ✅ Interface responsive
- ✅ Gestion des erreurs
- ✅ Hook personnalisé pour l'utilisation dans les composants

## Utilisation

### Dans un composant :

```typescript
import { useAuthentication } from '@/hooks/useAuthentication';

function MonComposant() {
  const { isAuthenticated, email, getAuthHeader } = useAuthentication();
  
  // Faire des appels API avec authentification
  const headers = getAuthHeader();
  
  return (
    <div>
      {isAuthenticated && <p>Connecté en tant que {email}</p>}
    </div>
  );
}
```

### Pour les appels API :

```typescript
const { getAuthHeader } = useAuthentication();

fetch('/api/data', {
  headers: {
    ...getAuthHeader(),
    'Content-Type': 'application/json'
  }
});
```

## Configuration pour la production

⚠️ **Important** : Pour la production, vous devrez :

1. **Mettre à jour l'URL de redirection** dans `src/config/auth.ts`
2. **Configurer le domaine Cognito** approprié
3. **Vérifier les paramètres CORS** dans AWS Cognito
4. **Configurer les URLs de callback** dans la console AWS Cognito

## Sécurité

- ✅ Les tokens sont gérés automatiquement par `react-oidc-context`
- ✅ Renouvellement automatique des tokens configuré
- ✅ Déconnexion sécurisée avec redirection
- ✅ Protection contre les attaques CSRF avec le flow "authorization code"