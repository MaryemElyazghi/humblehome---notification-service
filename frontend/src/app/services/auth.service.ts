import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  private currentRolesSubject = new BehaviorSubject<string[]>([]);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentRoles$ = this.currentRolesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Charger les données utilisateur depuis localStorage au démarrage
    this.loadUserFromStorage();
  }

  /**
   * Connexion via l'API backend
   * 
   * TODO: Le développeur devra implémenter la logique complète :
   * 1. Appeler l'API /authh/controller/token avec username et password
   * 2. Stocker le token reçu
   * 3. Récupérer les informations utilisateur
   * 4. Déterminer les rôles de l'utilisateur
   */
  login(username: string, password: string): Promise<boolean> {
    // TODO: Implémenter l'appel API réel
    // return this.http.post<string>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
    //   username: username,
    //   password: password
    // }).pipe(
    //   map(token => {
    //     this.setToken(token);
    //     // Récupérer les infos utilisateur
    //     this.getUserInfo(username);
    //     return true;
    //   }),
    //   catchError(error => {
    //     console.error('Erreur de connexion:', error);
    //     return of(false);
    //   })
    // ).toPromise();

    // Simulation temporaire (à remplacer par l'API réelle)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Vérifier si c'est un email/username admin
        const isAdmin = this.isAdminEmailOrUsername(username);
        
        // Extraire le nom d'utilisateur depuis l'email si nécessaire
        const cleanUsername = username.includes('@') 
          ? username.split('@')[0] 
          : username;
        
        const user = {
          id: 1,
          username: cleanUsername,
          email: username.includes('@') ? username : `${username}@example.com`,
          name: isAdmin ? 'Admin User' : 'Marie Dupont'
        };
        
        const roles = isAdmin ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER'];
        
        this.setCurrentUser(user, roles);
        // Simuler un token
        this.setToken('mock-token-' + Date.now());
        resolve(true);
      }, 1000);
    });
  }

  /**
   * Vérifier si l'email ou username correspond à un admin
   */
  private isAdminEmailOrUsername(identifier: string): boolean {
    const adminEmails = [
      'admin@humblehome.com',
      'admin@example.com',
      'administrator@humblehome.com'
    ];
    
    const adminUsernames = ['admin', 'administrator'];
    
    const lowerIdentifier = identifier.toLowerCase().trim();
    
    // Vérifier si c'est un email admin
    if (adminEmails.includes(lowerIdentifier)) {
      return true;
    }
    
    // Vérifier si c'est un username admin
    if (adminUsernames.includes(lowerIdentifier)) {
      return true;
    }
    
    // Vérifier si l'email commence par admin
    if (lowerIdentifier.includes('@') && lowerIdentifier.startsWith('admin@')) {
      return true;
    }
    
    return false;
  }

  /**
   * Récupérer les informations utilisateur depuis l'API
   * 
   * TODO: Implémenter l'appel API réel
   */
  getUserInfo(username: string): void {
    // TODO: Implémenter l'appel API réel
    // this.http.get<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GET_USER_BY_USERNAME}/${username}`)
    //   .subscribe(user => {
    //     this.setCurrentUser(user, user.roles || ['ROLE_USER']);
    //   });
  }

  /**
   * Enregistrer un nouvel utilisateur
   * 
   * TODO: Implémenter l'appel API réel
   */
  register(userData: any): Observable<any> {
    // TODO: Implémenter l'appel API réel
    // return this.http.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, userData);
    
    // Simulation temporaire
    return of({ success: true, message: 'User registered successfully' });
  }

  /**
   * Valider un token
   * 
   * TODO: Implémenter l'appel API réel
   */
  validateToken(token: string): Observable<boolean> {
    // TODO: Implémenter l'appel API réel
    // return this.http.post<string>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VALIDATE_TOKEN}`, null, {
    //   params: { token }
    // }).pipe(
    //   map(() => true),
    //   catchError(() => of(false))
    // );
    
    // Simulation temporaire
    return of(true);
  }

  /**
   * Gestion du token JWT
   */
  setToken(token: string): void {
    this.tokenSubject.next(token);
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    const token = this.tokenSubject.value || localStorage.getItem('authToken');
    return token;
  }

  removeToken(): void {
    this.tokenSubject.next(null);
    localStorage.removeItem('authToken');
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.currentRolesSubject.next([]);
    this.removeToken();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRoles');
  }

  setCurrentUser(user: any, roles: string[]): void {
    this.currentUserSubject.next(user);
    this.currentRolesSubject.next(roles);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRoles', JSON.stringify(roles));
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getCurrentRoles(): string[] {
    return this.currentRolesSubject.value;
  }

  hasRole(role: string): boolean {
    return this.getCurrentRoles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    const roles = localStorage.getItem('userRoles');
    
    if (user && roles) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
        this.currentRolesSubject.next(JSON.parse(roles));
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        this.logout();
      }
    }
  }

  // Méthodes pour simuler différents scénarios de test
  loginAsAdmin(): void {
    this.login('admin@humblehome.com', 'password').then(() => {
      console.log('Connecté en tant qu\'admin');
    });
  }

  loginAsUser(): void {
    this.login('user@example.com', 'password').then(() => {
      console.log('Connecté en tant qu\'utilisateur');
    });
  }
}
