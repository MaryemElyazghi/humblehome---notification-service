import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Order {
  orderId: number;
  orderDate: Date;
  totalAmount: number;
  orderStatus: string;
  userId: number;
  items: OrderItem[];
}

export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  // Flag pour utiliser l'API ou les données mockées
  private useApi = false; // TODO: Le développeur devra activer cette option

  constructor(private http: HttpClient) {}

  /**
   * Créer une commande
   * 
   * TODO: Le développeur devra mapper les OrderItem vers le format backend
   * Le backend attend: [{ productId: number, quantity: number }]
   */
  createOrder(items: OrderItem[]): Observable<Order> {
    if (!this.useApi) {
      // Simulation temporaire
      const mockOrder: Order = {
        orderId: Date.now(),
        orderDate: new Date(),
        totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderStatus: 'PENDING',
        userId: 1,
        items: items
      };
      return of(mockOrder);
    }

    // Mapper les items pour le backend (seulement productId et quantity)
    const backendItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    return this.http.post<Order>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS.CREATE}`, backendItems).pipe(
      map(order => {
        // TODO: Mapper la réponse backend vers l'interface Order si nécessaire
        return order;
      }),
      catchError(error => {
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
      })
    );
  }

  /**
   * Récupérer une commande par ID
   */
  getOrderById(orderId: number): Observable<Order> {
    if (!this.useApi) {
      // Simulation temporaire
      return of({
        orderId: orderId,
        orderDate: new Date(),
        totalAmount: 0,
        orderStatus: 'PENDING',
        userId: 1,
        items: []
      });
    }

    return this.http.get<Order>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS.BY_ID(orderId)}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de la commande:', error);
        throw error;
      })
    );
  }

  /**
   * Récupérer toutes les commandes de l'utilisateur connecté
   */
  getMyOrders(): Observable<Order[]> {
    if (!this.useApi) {
      // Simulation temporaire
      return of([]);
    }

    return this.http.get<Order[]>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS.MY_ORDERS}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des commandes:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtenir le total final de toutes les commandes de l'utilisateur
   */
  getMyOrdersTotal(): Observable<number> {
    if (!this.useApi) {
      // Simulation temporaire : calculer depuis les commandes mockées
      return this.getMyOrders().pipe(
        map(orders => {
          return orders.reduce((total, order) => total + order.totalAmount, 0);
        })
      );
    }

    return this.http.get<{ totalAmount: number }>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS.MY_ORDERS_TOTAL}`).pipe(
      map(response => response.totalAmount || 0),
      catchError(error => {
        console.error('Erreur lors de la récupération du total:', error);
        return of(0);
      })
    );
  }

  /**
   * Mettre à jour le statut d'une commande
   * 
   * TODO: Le développeur devra implémenter cette méthode si le backend le supporte
   */
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    if (!this.useApi) {
      return of({ success: true });
    }

    // TODO: Implémenter l'appel API si disponible
    // return this.http.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS.BY_ID(orderId)}/status`, { status })
    //   .pipe(catchError(error => {
    //     console.error('Erreur lors de la mise à jour du statut:', error);
    //     throw error;
    //   }));

    return of({ success: true });
  }
}

