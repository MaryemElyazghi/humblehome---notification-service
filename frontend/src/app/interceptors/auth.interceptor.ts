import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Intercepteur HTTP pour ajouter automatiquement le token JWT
 * à toutes les requêtes vers l'API backend
 * 
 * Le développeur devra s'assurer que le token est stocké correctement
 * dans le AuthService après la connexion
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Récupérer le token depuis le service d'authentification
  const token = authService.getToken();
  
  // Si un token existe, l'ajouter dans le header Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  // Si pas de token, envoyer la requête telle quelle
  return next(req);
};

