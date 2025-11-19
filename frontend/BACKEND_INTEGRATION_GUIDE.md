# Guide d'Intégration Backend - Frontend Angular

Ce guide explique comment connecter le frontend Angular au backend Spring Cloud Gateway.

## 📋 Configuration

### 1. URL de Base de l'API

L'URL de base de l'API est configurée dans `src/app/config/api.config.ts` :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8888', // Port du Gateway
  // ...
};
```

**⚠️ Important :** Ajustez cette URL selon votre environnement (développement, production, etc.)

### 2. Intercepteur HTTP

Un intercepteur HTTP (`auth.interceptor.ts`) est configuré pour ajouter automatiquement le token JWT à toutes les requêtes vers l'API.

Le token est récupéré depuis `AuthService.getToken()` et ajouté dans le header `Authorization: Bearer <token>`.

## 🔐 Authentification

### Service AuthService

Le service `AuthService` a été adapté pour utiliser l'API backend. Les méthodes suivantes sont prêtes à être implémentées :

#### Login
```typescript
login(username: string, password: string): Promise<boolean>
```

**TODO à implémenter :**
1. Appeler `POST /authh/controller/token` avec `{ username, password }`
2. Stocker le token reçu avec `this.setToken(token)`
3. Récupérer les informations utilisateur avec `getUserInfo(username)`
4. Déterminer les rôles de l'utilisateur

**Exemple d'implémentation :**
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

#### Register
```typescript
register(userData: any): Observable<any>
```

**TODO à implémenter :**
- Appeler `POST /authh/controller/addNewUser` avec les données utilisateur

#### Validate Token
```typescript
validateToken(token: string): Observable<boolean>
```

**TODO à implémenter :**
- Appeler `POST /authh/controller/validate?token=<token>`

## 📦 Produits

### Service ProductService

Le service `ProductService` a été adapté avec des méthodes pour l'API backend :

#### Méthodes disponibles :

- `getAllProductsFromApi()` : Récupérer tous les produits
- `getProductByIdFromApi(id)` : Récupérer un produit par ID
- `createProduct(product)` : Créer un nouveau produit
- `updateProduct(id, product)` : Mettre à jour un produit
- `deleteProduct(id)` : Supprimer un produit
- `uploadProductImage(productId, file)` : Uploader une image
- `getProductImages(productId)` : Récupérer les images d'un produit

**⚠️ Important :** 
- Actuellement, `useApi = false` : les méthodes utilisent les données mockées
- Pour activer l'API, changez `useApi = true` dans le service
- Vous devrez mapper les données backend vers l'interface `Product` frontend

**Mapping Backend → Frontend :**

Le backend retourne :
```json
{
  "id": 1,
  "name": "iPhone 17",
  "brand": "Apple",
  "price": 2200.50,
  "inventory": 10,
  "description": "...",
  "category": "Smartphone",
  "images": [...]
}
```

L'interface frontend `Product` attend :
```typescript
{
  id: number;
  name: string;
  price: number;
  oldPrice: number;  // À calculer ou récupérer
  discount: number;  // À calculer
  rating: number;    // Non disponible dans le backend
  reviews: number;   // Non disponible dans le backend
  badge: string | null;
  sales: number;     // Non disponible dans le backend
  image: string;     // À extraire depuis images[0]
  category: string;
  description?: string;
  // ...
}
```

**TODO :** Créer une méthode `mapBackendProductToFrontend(backendProduct)` pour mapper les données.

## 🛒 Panier

### Service CartService

Le service `CartService` a été adapté avec des méthodes pour l'API backend :

#### Méthodes disponibles :

- `loadCartFromApi()` : Charger le panier depuis l'API
- `getTotalFromApi()` : Obtenir le total depuis l'API
- `clearCart()` : Vider le panier (appel API à implémenter)

**⚠️ Important :**
- Actuellement, `useApi = false` : les méthodes utilisent les données locales
- Pour activer l'API, changez `useApi = true` dans le service
- Vous devrez mapper les données backend vers l'interface `CartItem` frontend

**Endpoints Backend :**
- `GET /cart/my-cart` : Récupérer le panier de l'utilisateur
- `DELETE /cart/delet` : Vider le panier
- `GET /cart/cart/total-price` : Obtenir le total

## 📝 Commandes

### Service OrderService (Nouveau)

Un nouveau service `OrderService` a été créé pour gérer les commandes :

#### Méthodes disponibles :

- `createOrder(items: OrderItem[])` : Créer une commande
- `getOrderById(orderId)` : Récupérer une commande par ID
- `getMyOrders()` : Récupérer toutes les commandes de l'utilisateur
- `updateOrderStatus(orderId, status)` : Mettre à jour le statut (à implémenter)

**⚠️ Important :**
- Actuellement, `useApi = false` : les méthodes retournent des données mockées
- Pour activer l'API, changez `useApi = true` dans le service

**Format des données pour créer une commande :**

Le backend attend :
```json
[
  {
    "productId": 2,
    "quantity": 2
  },
  {
    "productId": 3,
    "quantity": 1
  }
]
```

Le service mappe automatiquement les `OrderItem[]` vers ce format.

## 🔧 Activation de l'API

Pour activer les appels API dans les services :

1. **AuthService** : Décommentez les appels API dans les méthodes
2. **ProductService** : Changez `useApi = true`
3. **CartService** : Changez `useApi = true`
4. **OrderService** : Changez `useApi = true`

## 📝 Checklist d'Intégration

- [ ] Configurer l'URL de base de l'API dans `api.config.ts`
- [ ] Implémenter la méthode `login()` dans `AuthService`
- [ ] Implémenter la méthode `getUserInfo()` dans `AuthService`
- [ ] Créer la méthode de mapping `mapBackendProductToFrontend()` dans `ProductService`
- [ ] Activer `useApi = true` dans `ProductService`
- [ ] Créer la méthode de mapping `mapBackendCartItemToFrontend()` dans `CartService`
- [ ] Activer `useApi = true` dans `CartService`
- [ ] Activer `useApi = true` dans `OrderService`
- [ ] Tester tous les endpoints dans Postman
- [ ] Gérer les erreurs HTTP (401, 403, 404, 500)
- [ ] Ajouter des messages d'erreur utilisateur appropriés

## 🚨 Gestion des Erreurs

Tous les services utilisent `catchError` pour gérer les erreurs. Actuellement, ils retournent des données mockées en cas d'erreur.

**TODO :** Implémenter une gestion d'erreur appropriée :
- Afficher des messages d'erreur à l'utilisateur
- Rediriger vers la page de login en cas de 401
- Logger les erreurs pour le débogage

## 🔄 Synchronisation des Données

Les services utilisent des `BehaviorSubject` pour la gestion d'état réactive. Les données sont automatiquement mises à jour lorsque les observables changent.

**Note :** Les données mockées sont conservées comme fallback pour le développement et les tests.

## 📚 Ressources

- **Configuration API :** `src/app/config/api.config.ts`
- **Intercepteur HTTP :** `src/app/interceptors/auth.interceptor.ts`
- **Services :**
  - `src/app/services/auth.service.ts`
  - `src/app/services/product.service.ts`
  - `src/app/services/cart.service.ts`
  - `src/app/services/order.service.ts`

## ⚠️ Notes Importantes

1. **Token JWT :** Le token est automatiquement ajouté à toutes les requêtes via l'intercepteur HTTP
2. **CORS :** Assurez-vous que le Gateway autorise les requêtes depuis `http://localhost:4200`
3. **Headers :** L'intercepteur ajoute automatiquement `Authorization: Bearer <token>`
4. **Format des données :** Vous devrez mapper les formats backend vers les interfaces frontend
5. **Fallback :** Les données mockées sont conservées pour le développement sans backend

