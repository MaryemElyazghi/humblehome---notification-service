import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  badge?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  
  // Flag pour utiliser l'API ou les données mockées
  private useApi = false; // TODO: Le développeur devra activer cette option

  constructor(private http: HttpClient) {
    // Charger le panier depuis l'API au démarrage si activé
    if (this.useApi) {
      this.loadCartFromApi();
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }

  /**
   * Charger le panier depuis l'API
   * 
   * TODO: Le développeur devra mapper les données du backend vers CartItem
   */
  loadCartFromApi(): void {
    if (!this.useApi) {
      return;
    }

    this.http.get<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.MY_CART}`).pipe(
      map(cart => {
        // TODO: Mapper les items du panier backend vers CartItem[]
        // return cart.items.map((item: any) => this.mapBackendCartItemToFrontend(item));
        return this.cartItems$.value; // Temporaire
      }),
      catchError(error => {
        console.error('Erreur lors du chargement du panier:', error);
        return of([]);
      })
    ).subscribe(items => {
      this.cartItems$.next(items);
    });
  }

  /**
   * Ajouter un produit au panier
   * 
   * TODO: Le développeur devra implémenter l'appel API pour ajouter au panier backend
   */
  addToCart(product: any): void {
    const currentItems = this.cartItems$.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        description: product.description,
        badge: product.badge
      };
      currentItems.push(cartItem);
    }

    this.cartItems$.next(currentItems);

    // TODO: Si useApi est activé, synchroniser avec le backend
    // if (this.useApi) {
    //   this.syncCartToApi();
    // }
  }

  /**
   * Synchroniser le panier avec l'API backend
   * 
   * TODO: Le développeur devra implémenter cette méthode
   */
  private syncCartToApi(): void {
    // TODO: Implémenter la synchronisation avec le backend
    // const items = this.cartItems$.value;
    // this.http.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.ADD_ITEM}`, items)
    //   .subscribe();
  }

  updateQuantity(productId: number, change: number): void {
    const currentItems = this.cartItems$.value;
    const item = currentItems.find(i => i.id === productId);

    if (item) {
      item.quantity += change;
      if (item.quantity < 1) {
        this.removeFromCart(productId);
      } else {
        this.cartItems$.next(currentItems);
      }
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems$.value;
    const filteredItems = currentItems.filter(item => item.id !== productId);
    this.cartItems$.next(filteredItems);
  }

  /**
   * Vider le panier
   * 
   * TODO: Le développeur devra implémenter l'appel API pour vider le panier backend
   */
  clearCart(): void {
    this.cartItems$.next([]);
    
    // TODO: Si useApi est activé, appeler l'API pour vider le panier
    // if (this.useApi) {
    //   this.http.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.CLEAR}`)
    //     .subscribe();
    // }
  }

  /**
   * Obtenir le total du panier depuis l'API
   * 
   * TODO: Le développeur devra implémenter cette méthode
   */
  getTotalFromApi(): Observable<number> {
    if (!this.useApi) {
      return of(this.getTotal()); // Fallback sur le calcul local
    }

    return this.http.get<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.TOTAL_PRICE}`).pipe(
      map(response => {
        // TODO: Extraire le total depuis la réponse backend
        // return response.totalAmount || 0;
        return this.getTotal(); // Temporaire
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du total:', error);
        return of(this.getTotal()); // Fallback sur le calcul local
      })
    );
  }

  getTotal(): number {
    return this.cartItems$.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemsValue(): CartItem[] {
    return this.cartItems$.value;
  }
}
