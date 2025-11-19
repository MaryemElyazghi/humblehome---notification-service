# 🔐 Guide d'Accès à l'Espace Admin - Frontend

## 🚀 Méthodes d'Accès Rapide

### Méthode 1 : Via la Page de Login (Recommandé)

1. **Ouvrir le navigateur** et aller sur :
   ```
   http://localhost:4200/login
   ```

2. **Entrer les identifiants admin :**
   - **Email :** `admin@humblehome.com` ou `admin@example.com`
   - **Mot de passe :** n'importe quel mot de passe (en mode simulation actuel)

3. **Cliquer sur "Se connecter"**
   - Redirection automatique vers `/admin/dashboard`

### Méthode 2 : Via le Composant de Test

1. **Aller sur :**
   ```
   http://localhost:4200/auth-test
   ```

2. **Cliquer sur "Se connecter en tant qu'admin"**
   - Connexion automatique avec le rôle `ROLE_ADMIN`

3. **Naviguer vers :**
   ```
   http://localhost:4200/admin
   ```

### Méthode 3 : URL Directe (Si déjà connecté)

Si vous êtes déjà connecté en tant qu'admin :
```
http://localhost:4200/admin
```

## 📋 Routes Admin Disponibles

Une fois connecté en tant qu'admin, vous avez accès à :

- `/admin` ou `/admin/dashboard` - Tableau de bord admin
- `/admin/products` - Gestion des produits
- `/admin/users` - Gestion des utilisateurs
- `/admin/promotions` - Gestion des promotions

## 🛡️ Protection des Routes

La route `/admin` est protégée par le `RoleGuard` qui vérifie :
- ✅ Authentification : L'utilisateur doit être connecté
- ✅ Rôle : L'utilisateur doit avoir le rôle `ROLE_ADMIN`

**Si non autorisé :** Redirection vers `/login` ou `/`

## 🔧 Configuration Actuelle

### Emails Admin (Mode Simulation)

Les emails suivants donnent automatiquement le rôle admin :
- `admin@humblehome.com`
- `admin@example.com`
- `administrator@humblehome.com`

### Rôles Assignés

Quand vous vous connectez avec un email admin :
```typescript
roles: ['ROLE_ADMIN', 'ROLE_USER']
```

## 🔄 Adaptation pour le Backend

### Étape 1 : Créer un Utilisateur Admin dans le Backend

Dans Postman ou via l'API :
```http
POST http://localhost:8888/authh/controller/addNewUser
Content-Type: application/json

{
  "email": "admin@humblehome.com",
  "password": "Admin123!",
  "prenom": "Admin",
  "actif": true
}
```

**Note :** Vous devrez aussi assigner le rôle `ROLE_ADMIN` à cet utilisateur dans votre backend.

### Étape 2 : Adapter le Login Component

Le `login.component.ts` doit être modifié pour :
1. Appeler l'API backend `/authh/controller/token`
2. Stocker le token JWT
3. Récupérer les informations utilisateur et ses rôles
4. Déterminer si l'utilisateur est admin

**Exemple d'implémentation :**
```typescript
private async performLogin() {
  try {
    // Appeler l'API backend
    const success = await this.authService.login(
      this.loginForm.email, 
      this.loginForm.password
    );
    
    if (success) {
      // Récupérer les rôles depuis AuthService
      const roles = this.authService.getCurrentRoles();
      
      // Rediriger selon le rôle
      if (roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }
    } else {
      this.errorMessage = 'Email ou mot de passe incorrect';
    }
  } catch (error) {
    this.errorMessage = 'Erreur de connexion';
  }
  this.isLoading = false;
}
```

### Étape 3 : Récupérer les Rôles depuis le Backend

Dans `AuthService.getUserInfo()`, vous devrez :
1. Appeler l'API pour obtenir les infos utilisateur
2. Extraire les rôles depuis la réponse backend
3. Mapper les rôles backend vers les rôles frontend

**Exemple :**
```typescript
getUserInfo(username: string): void {
  this.http.get<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GET_USER_BY_USERNAME}/${username}`)
    .subscribe(user => {
      // Extraire les rôles depuis la réponse backend
      const roles = user.roles || ['ROLE_USER'];
      
      // Mapper si nécessaire (ex: 'ADMIN' -> 'ROLE_ADMIN')
      const mappedRoles = roles.map((role: string) => {
        if (role === 'ADMIN' || role === 'admin') {
          return 'ROLE_ADMIN';
        }
        return role.startsWith('ROLE_') ? role : `ROLE_${role}`;
      });
      
      this.setCurrentUser(user, mappedRoles);
    });
}
```

## 🧪 Test de l'Accès Admin

### Test 1 : Mode Simulation (Actuel)

1. Démarrer le frontend : `ng serve`
2. Aller sur `http://localhost:4200/login`
3. Email : `admin@humblehome.com`
4. Mot de passe : `password` (ou n'importe quoi)
5. Cliquer sur "Se connecter"
6. ✅ Vous devriez être redirigé vers `/admin/dashboard`

### Test 2 : Via Auth Test Component

1. Aller sur `http://localhost:4200/auth-test`
2. Cliquer sur "Se connecter en tant qu'admin"
3. Naviguer vers `/admin`
4. ✅ Vous devriez avoir accès à l'espace admin

### Test 3 : Vérification des Rôles

Dans la console du navigateur (F12), vous pouvez vérifier :
```typescript
// Dans la console
const authService = inject(AuthService);
console.log('Is Admin:', authService.isAdmin());
console.log('Roles:', authService.getCurrentRoles());
```

## 📝 Checklist pour le Développeur

- [ ] Créer un utilisateur admin dans le backend
- [ ] Assigner le rôle `ROLE_ADMIN` à cet utilisateur
- [ ] Adapter `login.component.ts` pour utiliser l'API backend
- [ ] Implémenter `AuthService.getUserInfo()` pour récupérer les rôles
- [ ] Mapper les rôles backend vers les rôles frontend
- [ ] Tester la connexion avec un compte admin réel
- [ ] Vérifier que la redirection vers `/admin` fonctionne
- [ ] Vérifier que le `RoleGuard` bloque les utilisateurs non-admin

## ⚠️ Notes Importantes

1. **Mode Actuel :** Le système utilise des données mockées
2. **Backend :** Pour utiliser le backend, adaptez le `login.component.ts`
3. **Rôles :** Vérifiez comment les rôles sont stockés dans votre backend
4. **Token :** Le token JWT est automatiquement ajouté aux requêtes via l'intercepteur HTTP
5. **Sécurité :** En production, ne jamais utiliser de mots de passe par défaut

## 🔗 Liens Utiles

- **Route Admin :** `/admin`
- **Route Login :** `/login`
- **Route Test Auth :** `/auth-test`
- **Documentation Rôles :** `ROLES_SYSTEM.md`
- **Guide Intégration Backend :** `BACKEND_INTEGRATION_GUIDE.md`

