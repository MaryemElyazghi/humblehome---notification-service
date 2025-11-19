# 🔌 Guide d'Intégration API Backend

## ✅ Ce qui a été fait

Le frontend a été préparé pour être connecté au backend sans modifier le style ni finaliser la liaison complète.

### 📁 Fichiers créés/modifiés

1. **`src/app/config/api.config.ts`** - Configuration centralisée de l'API
   - URL de base du Gateway : `http://localhost:8888`
   - Tous les endpoints documentés

2. **`src/app/interceptors/auth.interceptor.ts`** - Intercepteur HTTP
   - Ajoute automatiquement le token JWT dans le header `Authorization`
   - Fonctionne pour toutes les requêtes HTTP

3. **`src/app/services/auth.service.ts`** - Service d'authentification adapté
   - Méthodes prêtes pour l'API (commentées avec TODO)
   - Gestion du token JWT
   - Fallback sur données mockées

4. **`src/app/services/product.service.ts`** - Service produits adapté
   - Méthodes API prêtes (avec flag `useApi`)
   - Fallback sur données mockées
   - Gestion des images

5. **`src/app/services/cart.service.ts`** - Service panier adapté
   - Méthodes API prêtes (avec flag `useApi`)
   - Fallback sur données locales

6. **`src/app/services/order.service.ts`** - Nouveau service commandes
   - Toutes les méthodes pour gérer les commandes
   - Prêt pour l'API backend

7. **`src/app/app.config.ts`** - Configuration mise à jour
   - Intercepteur HTTP activé

## 🚀 Comment activer l'API

### Étape 1 : Activer les services

Dans chaque service, changez `useApi = false` en `useApi = true` :

**ProductService :**
```typescript
private useApi = true; // Activer l'API
```

**CartService :**
```typescript
private useApi = true; // Activer l'API
```

**OrderService :**
```typescript
private useApi = true; // Activer l'API
```

### Étape 2 : Implémenter les méthodes API

#### AuthService - Login

Décommentez et adaptez la méthode `login()` :

```typescript
login(username: string, password: string): Promise<boolean> {
  return this.http.post<string>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
    { username, password }
  ).pipe(
    map(token => {
      this.setToken(token);
      this.getUserInfo(username);
      return true;
    }),
    catchError(error => {
      console.error('Erreur de connexion:', error);
      return of(false);
    })
  ).toPromise();
}
```

#### ProductService - Mapping des données

Créez une méthode pour mapper les produits backend vers frontend :

```typescript
private mapBackendProductToFrontend(backendProduct: any): Product {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price: backendProduct.price,
    oldPrice: backendProduct.price * 1.2, // À calculer selon votre logique
    discount: 20, // À calculer
    rating: 4.5, // Valeur par défaut si non disponible
    reviews: 0, // Valeur par défaut
    badge: null,
    sales: 0, // Valeur par défaut
    image: backendProduct.images?.[0]?.downloadUrl || '',
    category: backendProduct.category || '',
    description: backendProduct.description || ''
  };
}
```

## 📋 Endpoints Backend Disponibles

### Authentification
- `POST /authh/controller/token` - Obtenir un token JWT
- `POST /authh/controller/addNewUser` - Créer un utilisateur
- `GET /authh/controller/find-by-username/{username}` - Trouver un utilisateur

### Produits
- `GET /product` - Liste tous les produits
- `GET /product/{id}` - Obtenir un produit par ID
- `POST /product` - Créer un produit
- `PUT /product/{id}` - Mettre à jour un produit
- `DELETE /product/{id}` - Supprimer un produit

### Images
- `POST /images` - Uploader une image (form-data: productId, file)
- `GET /images/product/{productId}` - Images d'un produit
- `GET /images/download/{fileName}` - Télécharger une image

### Panier
- `GET /cart/my-cart` - Obtenir le panier de l'utilisateur
- `DELETE /cart/delet` - Vider le panier
- `GET /cart/cart/total-price` - Obtenir le total

### Commandes
- `POST /order` - Créer une commande
- `GET /order/{id}` - Obtenir une commande par ID
- `GET /order/my-orders` - Obtenir toutes les commandes de l'utilisateur

## 🔑 Authentification

Toutes les requêtes (sauf `/authh/controller/**`) nécessitent un token JWT.

Le token est automatiquement ajouté via l'intercepteur HTTP dans le header :
```
Authorization: Bearer <token>
```

## 📝 Format des Données

### Créer une commande

**Frontend → Backend :**
```typescript
[
  { productId: 2, quantity: 2 },
  { productId: 3, quantity: 1 }
]
```

**Backend → Frontend :**
```typescript
{
  orderId: 1,
  orderDate: "2025-11-19T17:30:00.000+00:00",
  totalAmount: 4500.50,
  orderStatus: "PENDING",
  userId: 1,
  items: [
    { id: 1, productId: 2, quantity: 2, price: 2200.50 },
    { id: 2, productId: 3, quantity: 1, price: 99.50 }
  ]
}
```

## ⚠️ Points Importants

1. **Style non modifié** : Aucun fichier CSS/SCSS n'a été modifié
2. **Données mockées conservées** : Les données mockées servent de fallback
3. **Flag useApi** : Activez/désactivez l'API facilement
4. **Mapping nécessaire** : Vous devrez mapper les formats backend ↔ frontend
5. **Gestion d'erreurs** : Les erreurs sont catchées et retournent des données mockées

## 🧪 Test

1. Démarrer le backend (Gateway + services)
2. Démarrer le frontend : `ng serve`
3. Tester la connexion dans le navigateur
4. Vérifier les appels API dans la console du navigateur (F12 → Network)

## 📚 Documentation Complète

Voir `BACKEND_INTEGRATION_GUIDE.md` pour plus de détails.

