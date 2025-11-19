# 🔐 Guide d'Accès à l'Espace Admin

## 📋 Méthodes d'Accès

### Méthode 1 : Via la Page de Login (Mode Actuel - Simulation)

1. **Aller sur la page de login :**
   - URL : `http://localhost:4200/login`

2. **Utiliser un email admin :**
   - Email : `admin@humblehome.com` ou `admin@example.com`
   - Mot de passe : n'importe quel mot de passe (en mode simulation)

3. **Cliquer sur "Se connecter"**
   - Vous serez automatiquement redirigé vers `/admin`

### Méthode 2 : Via l'URL Directe (Si déjà connecté en tant qu'admin)

1. **Se connecter d'abord avec un compte admin** (Méthode 1)
2. **Accéder directement à :**
   - URL : `http://localhost:4200/admin`

### Méthode 3 : Via le Composant de Test

1. **Aller sur la page de test :**
   - URL : `http://localhost:4200/auth-test`

2. **Cliquer sur "Se connecter en tant qu'admin"**
   - Vous serez automatiquement connecté avec le rôle `ROLE_ADMIN`

3. **Naviguer vers `/admin`**

## 🛡️ Protection de la Route Admin

La route `/admin` est protégée par le `RoleGuard` qui vérifie :
- ✅ L'utilisateur est authentifié
- ✅ L'utilisateur a le rôle `ROLE_ADMIN`

Si ces conditions ne sont pas remplies, vous serez redirigé vers `/login` ou `/`.

## 🔧 Configuration Actuelle

### Emails Admin Configurés

Dans `login.component.ts`, les emails suivants donnent accès à l'espace admin :
- `admin@humblehome.com`
- `admin@example.com`
- `administrator@humblehome.com`

### Rôles Assignés

Quand vous vous connectez avec un email admin, le système assigne automatiquement :
- `ROLE_ADMIN`
- `ROLE_USER`

## 🚀 Adaptation pour le Backend

### Étape 1 : Modifier le Login pour utiliser l'API

Le `login.component.ts` doit être adapté pour :
1. Appeler l'API `/authh/controller/token` avec username/password
2. Récupérer le token JWT
3. Appeler l'API pour obtenir les informations utilisateur et ses rôles
4. Stocker le token et les rôles dans `AuthService`

### Étape 2 : Vérifier les Rôles depuis le Backend

Le backend doit retourner les rôles de l'utilisateur. Vous devrez :
1. Mapper les rôles backend vers les rôles frontend (`ROLE_ADMIN`, `ROLE_USER`)
2. Stocker ces rôles dans `AuthService.setCurrentUser(user, roles)`

### Étape 3 : Créer un Utilisateur Admin dans le Backend

Pour avoir un vrai compte admin :
1. Créer un utilisateur avec le rôle admin dans le backend
2. Utiliser cet utilisateur pour se connecter via l'API

## 📝 Exemple de Code pour Adapter le Login

```typescript
// Dans login.component.ts
private async performLogin() {
  try {
    // Appeler l'API backend
    const token = await this.authService.login(
      this.loginForm.email, 
      this.loginForm.password
    ).toPromise();
    
    if (token) {
      // Récupérer les infos utilisateur depuis le backend
      const user = await this.authService.getUserInfo(this.loginForm.email);
      
      // Vérifier les rôles (à adapter selon votre backend)
      if (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ADMIN')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }
    }
  } catch (error) {
    this.errorMessage = 'Erreur de connexion';
  }
}
```

## ⚠️ Notes Importantes

1. **Mode Simulation Actuel :** Le système actuel utilise des données mockées
2. **Backend Integration :** Pour utiliser le backend, vous devrez adapter le `login.component.ts`
3. **Rôles Backend :** Vérifiez comment les rôles sont stockés dans votre backend
4. **Token JWT :** Le token sera automatiquement ajouté aux requêtes via l'intercepteur HTTP

## 🧪 Test Rapide

1. Démarrer le frontend : `ng serve`
2. Aller sur `http://localhost:4200/login`
3. Entrer : `admin@humblehome.com` / `password`
4. Cliquer sur "Se connecter"
5. Vous devriez être redirigé vers `/admin/dashboard`

