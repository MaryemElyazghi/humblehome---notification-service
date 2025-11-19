import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  badge: string | null;
  sales: number;
  image: string;
  category: string;
  description?: string;
  variants?: ProductVariant[];
  offers?: ProductOffer[];
  delivery?: string;
  warranty?: string;
  security?: string;
}

export interface ProductVariant {
  type: string;
  options: string[];
}

export interface ProductOffer {
  quantity: number;
  discount: number;
  price: number;
}

export interface Category {
  name: string;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private selectedProductSubject = new BehaviorSubject<Product | null>(null);
  public selectedProduct$ = this.selectedProductSubject.asObservable();
  
  private recentlyViewedProducts: Product[] = [];
  
  // Flag pour utiliser l'API ou les données mockées
  private useApi = false; // TODO: Le développeur devra activer cette option
  
  constructor(private http: HttpClient) {
    this.loadRecentlyViewedFromStorage();
  }

  /**
   * Récupérer tous les produits depuis l'API
   * 
   * TODO: Le développeur devra mapper les données du backend vers l'interface Product
   */
  getAllProductsFromApi(): Observable<Product[]> {
    if (!this.useApi) {
      return of(this.getAllProducts()); // Fallback sur les données mockées
    }

    return this.http.get<any[]>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.ALL}`).pipe(
      map(products => {
        // TODO: Mapper les produits du backend vers l'interface Product
        // return products.map(p => this.mapBackendProductToFrontend(p));
        return this.getAllProducts(); // Temporaire
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des produits:', error);
        return of(this.getAllProducts()); // Fallback sur les données mockées
      })
    );
  }

  /**
   * Récupérer un produit par ID depuis l'API
   * 
   * TODO: Le développeur devra mapper les données du backend vers l'interface Product
   */
  getProductByIdFromApi(id: number): Observable<Product | undefined> {
    if (!this.useApi) {
      return of(this.getProductById(id)); // Fallback sur les données mockées
    }

    return this.http.get<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id)}`).pipe(
      map(product => {
        // TODO: Mapper le produit du backend vers l'interface Product
        // return this.mapBackendProductToFrontend(product);
        return this.getProductById(id); // Temporaire
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du produit:', error);
        return of(this.getProductById(id)); // Fallback sur les données mockées
      })
    );
  }

  /**
   * Créer un nouveau produit
   * 
   * TODO: Le développeur devra mapper l'interface Product vers le format backend
   */
  createProduct(product: any): Observable<any> {
    if (!this.useApi) {
      return of({ success: true, id: Date.now() }); // Simulation
    }

    // TODO: Mapper le produit frontend vers le format backend
    const backendProduct = {
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      inventory: product.inventory || 0,
      description: product.description || '',
      category: product.category || ''
    };

    return this.http.post<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.BASE}`, backendProduct).pipe(
      catchError(error => {
        console.error('Erreur lors de la création du produit:', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Mettre à jour un produit
   * 
   * TODO: Le développeur devra mapper l'interface Product vers le format backend
   */
  updateProduct(id: number, product: any): Observable<any> {
    if (!this.useApi) {
      return of({ success: true }); // Simulation
    }

    // TODO: Mapper le produit frontend vers le format backend
    const backendProduct = {
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      inventory: product.inventory || 0,
      description: product.description || '',
      category: product.category || ''
    };

    return this.http.put<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id)}`, backendProduct).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour du produit:', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Supprimer un produit
   */
  deleteProduct(id: number): Observable<any> {
    if (!this.useApi) {
      return of({ success: true }); // Simulation
    }

    return this.http.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.BY_ID(id)}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression du produit:', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Uploader une image pour un produit
   */
  uploadProductImage(productId: number, file: File): Observable<any> {
    if (!this.useApi) {
      return of({ success: true }); // Simulation
    }

    const formData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('file', file);

    return this.http.post<any>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGES.BASE}`, formData).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        return of({ success: false, error });
      })
    );
  }

  /**
   * Récupérer les images d'un produit
   */
  getProductImages(productId: number): Observable<any[]> {
    if (!this.useApi) {
      return of([]); // Simulation
    }

    return this.http.get<any[]>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGES.BY_PRODUCT_ID(productId)}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des images:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtenir l'URL de téléchargement d'une image
   */
  getImageUrl(fileName: string): string {
    if (!this.useApi) {
      return ''; // Pas d'image en mode mock
    }
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGES.DOWNLOAD(fileName)}`;
  }

  private mockProducts: Product[] = [
    // Sacs & Housses
    { 
      id: 1, 
      name: "SÁBANA AJUSTABLE CON F...", 
      price: 19.99, 
      oldPrice: 30.75, 
      discount: 35, 
      rating: 4.8, 
      reviews: 70, 
      badge: "TOP VENTE", 
      sales: 880, 
      image: "🛏️", 
      category: "Sacs & Housses",
      description: "Sábana ajustable de alta calidad con diseño moderno y materiales premium.",
      variants: [
        { type: "Taille", options: ["Simple", "Double", "Queen", "King"] },
        { type: "Couleur", options: ["Blanc", "Beige", "Gris", "Bleu"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 19.99 },
        { quantity: 2, discount: 10, price: 17.99 },
        { quantity: 3, discount: 15, price: 16.99 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 2, 
      name: "SERTA SIMPLY CLEAN SOL...", 
      price: 29.99, 
      oldPrice: 28.97, 
      discount: 31, 
      rating: 4.7, 
      reviews: 102, 
      badge: "LIMITED OFFER", 
      sales: 344, 
      image: "🛏️", 
      category: "Sacs & Housses",
      description: "Protection de matelas Serta avec technologie Simply Clean.",
      variants: [
        { type: "Taille", options: ["Twin", "Full", "Queen", "King"] },
        { type: "Matériau", options: ["Coton", "Microfibre", "Bambou"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 29.99 },
        { quantity: 2, discount: 12, price: 26.39 },
        { quantity: 3, discount: 18, price: 24.59 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 3 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 3, 
      name: "FUNDA NÓRDICA NEGRA PREMIUM", 
      price: 9.99, 
      oldPrice: 41.08, 
      discount: 27, 
      rating: 4.9, 
      reviews: 45, 
      badge: null, 
      sales: 51, 
      image: "🛏️", 
      category: "Sacs & Housses",
      description: "Funda nórdica premium en couleur noire élégante.",
      variants: [
        { type: "Taille", options: ["140x200", "160x200", "200x200"] },
        { type: "Style", options: ["Moderne", "Classique", "Minimaliste"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 9.99 },
        { quantity: 2, discount: 8, price: 9.19 },
        { quantity: 3, discount: 12, price: 8.79 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 4, 
      name: "COJÍN CUADRADO TAPIZADO MARRÓN", 
      price: 14.99, 
      oldPrice: 14.94, 
      discount: 33, 
      rating: 4.6, 
      reviews: 28, 
      badge: null, 
      sales: 392, 
      image: "🛏️", 
      category: "Sacs & Housses",
      description: "Coussin carré tapissé en couleur marron chaleureuse.",
      variants: [
        { type: "Taille", options: ["40x40", "50x50", "60x60"] },
        { type: "Remplissage", options: ["Plumes", "Fibre", "Mémoire"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 14.99 },
        { quantity: 2, discount: 10, price: 13.49 },
        { quantity: 3, discount: 15, price: 12.74 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 5, 
      name: "PROTECTOR COLCHÓN DIAMANTE BEIGE", 
      price: 24.99, 
      oldPrice: 35.00, 
      discount: 29, 
      rating: 4.5, 
      reviews: 156, 
      badge: "TOP VENTE", 
      sales: 623, 
      image: "🛏️", 
      category: "Sacs & Housses",
      description: "Protecteur de matelas avec motif diamant en beige.",
      variants: [
        { type: "Taille", options: ["90x190", "140x190", "160x200", "180x200"] },
        { type: "Épaisseur", options: ["2cm", "4cm", "6cm"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 24.99 },
        { quantity: 2, discount: 12, price: 21.99 },
        { quantity: 3, discount: 18, price: 20.49 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 6, 
      name: "FUNDA ALMOHADA ANTI-ÁCAROS", 
      price: 7.99, 
      oldPrice: 12.50, 
      discount: 36, 
      rating: 4.7, 
      reviews: 89, 
      badge: null, 
      sales: 234, 
      image: "🛏️", 
      category: "Sacs & Housses",
      description: "Funda d'oreiller anti-acariens pour un sommeil sain.",
      variants: [
        { type: "Taille", options: ["50x70", "60x60", "65x65"] },
        { type: "Protection", options: ["Anti-acariens", "Anti-allergènes", "Hypoallergénique"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 7.99 },
        { quantity: 2, discount: 8, price: 7.35 },
        { quantity: 3, discount: 12, price: 7.03 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    
    // Serviettes & Peignoirs
    { 
      id: 7, 
      name: "SERVIETTE ÉPONGE MICROFIBRE", 
      price: 12.99, 
      oldPrice: 18.99, 
      discount: 32, 
      rating: 4.6, 
      reviews: 78, 
      badge: "TOP VENTE", 
      sales: 445, 
      image: "🛁", 
      category: "Serviettes & Peignoirs",
      description: "Serviette éponge en microfibre ultra-absorbante et douce.",
      variants: [
        { type: "Taille", options: ["50x100", "70x140", "100x150"] },
        { type: "Couleur", options: ["Blanc", "Bleu", "Gris", "Rose"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 12.99 },
        { quantity: 2, discount: 8, price: 11.95 },
        { quantity: 3, discount: 12, price: 11.43 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 8, 
      name: "PEIGNOIR CAPUCHON COTON", 
      price: 39.99, 
      oldPrice: 55.00, 
      discount: 27, 
      rating: 4.8, 
      reviews: 92, 
      badge: null, 
      sales: 167, 
      image: "🛁", 
      category: "Serviettes & Peignoirs",
      description: "Peignoir en coton avec capuche pour un confort optimal.",
      variants: [
        { type: "Taille", options: ["S", "M", "L", "XL"] },
        { type: "Couleur", options: ["Blanc", "Beige", "Bleu marine", "Gris"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 39.99 },
        { quantity: 2, discount: 10, price: 35.99 },
        { quantity: 3, discount: 15, price: 33.99 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 9, 
      name: "SERVIETTE BORDÉE BAMBOU", 
      price: 15.99, 
      oldPrice: 22.50, 
      discount: 29, 
      rating: 4.7, 
      reviews: 54, 
      badge: "LIMITED OFFER", 
      sales: 298, 
      image: "🛁", 
      category: "Serviettes & Peignoirs",
      description: "Serviette en bambou écologique avec bordure décorative.",
      variants: [
        { type: "Taille", options: ["60x120", "80x150", "100x180"] },
        { type: "Style", options: ["Rayé", "Uni", "Motif"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 15.99 },
        { quantity: 2, discount: 8, price: 14.71 },
        { quantity: 3, discount: 12, price: 14.07 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 10, 
      name: "PEIGNOIR COURT VELOURS", 
      price: 29.99, 
      oldPrice: 42.00, 
      discount: 29, 
      rating: 4.5, 
      reviews: 67, 
      badge: null, 
      sales: 189, 
      image: "🛁", 
      category: "Serviettes & Peignoirs",
      description: "Peignoir court en velours doux et confortable.",
      variants: [
        { type: "Taille", options: ["S", "M", "L", "XL"] },
        { type: "Couleur", options: ["Rouge", "Bleu", "Vert", "Rose"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 29.99 },
        { quantity: 2, discount: 10, price: 26.99 },
        { quantity: 3, discount: 15, price: 25.49 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 11, 
      name: "SERVIETTE SPORT ANTI-BACTÉRIENNE", 
      price: 18.99, 
      oldPrice: 25.99, 
      discount: 27, 
      rating: 4.8, 
      reviews: 123, 
      badge: "TOP VENTE", 
      sales: 356, 
      image: "🛁", 
      category: "Serviettes & Peignoirs",
      description: "Serviette sport avec traitement anti-bactérien.",
      variants: [
        { type: "Taille", options: ["30x60", "50x100", "70x140"] },
        { type: "Traitement", options: ["Anti-bactérien", "Anti-odeur", "Rapide séchage"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 18.99 },
        { quantity: 2, discount: 8, price: 17.47 },
        { quantity: 3, discount: 12, price: 16.71 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 12, 
      name: "PEIGNOIR LONG SOIE NATURELLE", 
      price: 79.99, 
      oldPrice: 120.00, 
      discount: 33, 
      rating: 4.9, 
      reviews: 45, 
      badge: null, 
      sales: 78, 
      image: "🛁", 
      category: "Serviettes & Peignoirs",
      description: "Peignoir long en soie naturelle de luxe.",
      variants: [
        { type: "Taille", options: ["S", "M", "L", "XL"] },
        { type: "Couleur", options: ["Champagne", "Rose", "Crème", "Ivoire"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 79.99 },
        { quantity: 2, discount: 12, price: 70.39 },
        { quantity: 3, discount: 18, price: 65.59 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 3 ans",
      security: "Paiement sécurisé SSL"
    },
    
    // Organisation & Décoration
    { 
      id: 13, 
      name: "PANIERS RATTAN ORGANISATION", 
      price: 22.99, 
      oldPrice: 32.99, 
      discount: 30, 
      rating: 4.7, 
      reviews: 89, 
      badge: "TOP VENTE", 
      sales: 234, 
      image: "🏠", 
      category: "Organisation & Décoration",
      description: "Paniers en rattan naturel pour l'organisation de votre maison.",
      variants: [
        { type: "Taille", options: ["Petit", "Moyen", "Grand"] },
        { type: "Couleur", options: ["Naturel", "Blanc", "Beige"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 22.99 },
        { quantity: 2, discount: 10, price: 20.69 },
        { quantity: 3, discount: 15, price: 19.54 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 14, 
      name: "VASE CÉRAMIQUE MODERNE", 
      price: 34.99, 
      oldPrice: 49.99, 
      discount: 30, 
      rating: 4.6, 
      reviews: 56, 
      badge: null, 
      sales: 145, 
      image: "🏠", 
      category: "Organisation & Décoration",
      description: "Vase en céramique moderne pour décorer votre intérieur.",
      variants: [
        { type: "Taille", options: ["15cm", "25cm", "35cm"] },
        { type: "Couleur", options: ["Blanc", "Noir", "Gris", "Beige"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 34.99 },
        { quantity: 2, discount: 12, price: 30.79 },
        { quantity: 3, discount: 18, price: 28.69 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 15, 
      name: "BOÎTES STOCKAGE TRANSPARENTES", 
      price: 16.99, 
      oldPrice: 24.99, 
      discount: 32, 
      rating: 4.8, 
      reviews: 112, 
      badge: "LIMITED OFFER", 
      sales: 378, 
      image: "🏠", 
      category: "Organisation & Décoration",
      description: "Boîtes de stockage transparentes pour une organisation parfaite.",
      variants: [
        { type: "Taille", options: ["Petit", "Moyen", "Grand"] },
        { type: "Quantité", options: ["Lot de 3", "Lot de 6", "Lot de 12"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 16.99 },
        { quantity: 2, discount: 8, price: 15.63 },
        { quantity: 3, discount: 12, price: 14.95 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 16, 
      name: "MIRROIR DÉCORATIF ROND", 
      price: 45.99, 
      oldPrice: 65.00, 
      discount: 29, 
      rating: 4.5, 
      reviews: 73, 
      badge: null, 
      sales: 198, 
      image: "🏠", 
      category: "Organisation & Décoration",
      description: "Miroir décoratif rond avec cadre élégant.",
      variants: [
        { type: "Diamètre", options: ["40cm", "60cm", "80cm"] },
        { type: "Cadre", options: ["Bois", "Métal", "Plastique"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 45.99 },
        { quantity: 2, discount: 10, price: 41.39 },
        { quantity: 3, discount: 15, price: 39.09 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 17, 
      name: "ÉTAGÈRE FLOTTANTE BOIS", 
      price: 28.99, 
      oldPrice: 39.99, 
      discount: 28, 
      rating: 4.7, 
      reviews: 94, 
      badge: "TOP VENTE", 
      sales: 267, 
      image: "🏠", 
      category: "Organisation & Décoration",
      description: "Étagère flottante en bois massif pour décorer vos murs.",
      variants: [
        { type: "Longueur", options: ["60cm", "80cm", "100cm"] },
        { type: "Bois", options: ["Chêne", "Pin", "Hêtre"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 28.99 },
        { quantity: 2, discount: 8, price: 26.67 },
        { quantity: 3, discount: 12, price: 25.51 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 18, 
      name: "PLANTE ARTIFICIELLE SUCCULENTE", 
      price: 12.99, 
      oldPrice: 18.99, 
      discount: 32, 
      rating: 4.6, 
      reviews: 67, 
      badge: null, 
      sales: 189, 
      image: "🏠", 
      category: "Organisation & Décoration",
      description: "Plante artificielle succulente pour décorer sans entretien.",
      variants: [
        { type: "Taille", options: ["Petite", "Moyenne", "Grande"] },
        { type: "Variété", options: ["Echeveria", "Aloe", "Cactus"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 12.99 },
        { quantity: 2, discount: 8, price: 11.95 },
        { quantity: 3, discount: 12, price: 11.43 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    
    // Salle de Bain & Hygiène
    { 
      id: 19, 
      name: "TAPIS DE BAIN ANTI-DÉRAPANT", 
      price: 19.99, 
      oldPrice: 28.99, 
      discount: 31, 
      rating: 4.7, 
      reviews: 134, 
      badge: "TOP VENTE", 
      sales: 456, 
      image: "🚿", 
      category: "Salle de Bain & Hygiène",
      description: "Tapis de bain anti-dérapant pour votre sécurité.",
      variants: [
        { type: "Taille", options: ["50x80", "60x90", "70x120"] },
        { type: "Couleur", options: ["Blanc", "Gris", "Beige", "Bleu"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 19.99 },
        { quantity: 2, discount: 10, price: 17.99 },
        { quantity: 3, discount: 15, price: 16.99 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 20, 
      name: "PORTE-SAVON INOX ACRYLIQUE", 
      price: 14.99, 
      oldPrice: 21.99, 
      discount: 32, 
      rating: 4.6, 
      reviews: 87, 
      badge: null, 
      sales: 223, 
      image: "🚿", 
      category: "Salle de Bain & Hygiène",
      description: "Porte-savon en inox avec support acrylique transparent.",
      variants: [
        { type: "Matériau", options: ["Inox", "Chrome", "Acier"] },
        { type: "Style", options: ["Moderne", "Classique", "Minimaliste"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 14.99 },
        { quantity: 2, discount: 8, price: 13.79 },
        { quantity: 3, discount: 12, price: 13.19 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 21, 
      name: "ROBE DE CHAMBRE COTON BIO", 
      price: 32.99, 
      oldPrice: 45.99, 
      discount: 28, 
      rating: 4.8, 
      reviews: 76, 
      badge: "LIMITED OFFER", 
      sales: 189, 
      image: "🚿", 
      category: "Salle de Bain & Hygiène",
      description: "Robe de chambre en coton biologique confortable.",
      variants: [
        { type: "Taille", options: ["S", "M", "L", "XL"] },
        { type: "Couleur", options: ["Blanc", "Beige", "Gris", "Rose"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 32.99 },
        { quantity: 2, discount: 10, price: 29.69 },
        { quantity: 3, discount: 15, price: 28.04 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 2 ans",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 22, 
      name: "SERVIETTE DE BAIN ÉPAISSE", 
      price: 24.99, 
      oldPrice: 35.99, 
      discount: 31, 
      rating: 4.7, 
      reviews: 98, 
      badge: null, 
      sales: 312, 
      image: "🚿", 
      category: "Salle de Bain & Hygiène",
      description: "Serviette de bain épaisse et absorbante.",
      variants: [
        { type: "Taille", options: ["50x100", "70x140", "100x150"] },
        { type: "Épaisseur", options: ["Standard", "Épaisse", "Extra épaisse"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 24.99 },
        { quantity: 2, discount: 8, price: 22.99 },
        { quantity: 3, discount: 12, price: 21.99 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 23, 
      name: "ORGANISATEUR DOUCHE SUSPENDU", 
      price: 18.99, 
      oldPrice: 26.99, 
      discount: 30, 
      rating: 4.5, 
      reviews: 65, 
      badge: "TOP VENTE", 
      sales: 178, 
      image: "🚿", 
      category: "Salle de Bain & Hygiène",
      description: "Organisateur de douche suspendu pour ranger vos produits.",
      variants: [
        { type: "Capacité", options: ["3 compartiments", "5 compartiments", "7 compartiments"] },
        { type: "Matériau", options: ["Plastique", "Acier", "Bambou"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 18.99 },
        { quantity: 2, discount: 8, price: 17.47 },
        { quantity: 3, discount: 12, price: 16.71 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 1 an",
      security: "Paiement sécurisé SSL"
    },
    { 
      id: 24, 
      name: "BROUSSE DE BAIN NATURELLE", 
      price: 8.99, 
      oldPrice: 12.99, 
      discount: 31, 
      rating: 4.6, 
      reviews: 43, 
      badge: null, 
      sales: 145, 
      image: "🚿", 
      category: "Salle de Bain & Hygiène",
      description: "Brosse de bain en fibres naturelles pour exfolier la peau.",
      variants: [
        { type: "Dureté", options: ["Doux", "Moyen", "Dur"] },
        { type: "Fibres", options: ["Agave", "Luffa", "Coco"] }
      ],
      offers: [
        { quantity: 1, discount: 0, price: 8.99 },
        { quantity: 2, discount: 8, price: 8.27 },
        { quantity: 3, discount: 12, price: 7.91 }
      ],
      delivery: "Livraison gratuite sous 24-48h",
      warranty: "Garantie 6 mois",
      security: "Paiement sécurisé SSL"
    }
  ];

  getCategories(): Category[] {
    const categories = ['Sacs & Housses', 'Serviettes & Peignoirs', 'Organisation & Décoration', 'Salle de Bain & Hygiène'];
    
    return categories.map(categoryName => ({
      name: categoryName,
      products: this.mockProducts
        .filter(product => product.category === categoryName)
        .slice(0, 4) // Limiter à 4 produits par catégorie
    }));
  }

  getAllProducts(): Product[] {
    return this.mockProducts;
  }

  getProductById(id: number): Product | undefined {
    return this.mockProducts.find(product => product.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.mockProducts.filter(product => product.category === category);
  }

  // Nouvelles méthodes pour la gestion des produits sélectionnés
  setSelectedProduct(product: Product): void {
    this.selectedProductSubject.next(product);
    this.addToRecentlyViewed(product);
  }

  getSelectedProduct(): Product | null {
    return this.selectedProductSubject.value;
  }

  // Méthodes pour l'historique des produits vus
  private addToRecentlyViewed(product: Product): void {
    // Supprimer le produit s'il existe déjà
    this.recentlyViewedProducts = this.recentlyViewedProducts.filter(p => p.id !== product.id);
    // Ajouter en début de liste
    this.recentlyViewedProducts.unshift(product);
    // Limiter à 10 produits
    this.recentlyViewedProducts = this.recentlyViewedProducts.slice(0, 10);
    // Sauvegarder dans localStorage
    localStorage.setItem('recentlyViewedProducts', JSON.stringify(this.recentlyViewedProducts));
  }

  getRecentlyViewedProducts(): Product[] {
    // Charger depuis localStorage si disponible
    const stored = localStorage.getItem('recentlyViewedProducts');
    if (stored) {
      this.recentlyViewedProducts = JSON.parse(stored);
    }
    return this.recentlyViewedProducts;
  }

  private loadRecentlyViewedFromStorage(): void {
    const stored = localStorage.getItem('recentlyViewedProducts');
    if (stored) {
      try {
        this.recentlyViewedProducts = JSON.parse(stored);
      } catch (error) {
        console.error('Erreur lors du chargement des produits récemment consultés:', error);
        this.recentlyViewedProducts = [];
      }
    }
  }

  // Méthode pour calculer l'économie réalisée
  calculateSavings(product: Product): number {
    return product.oldPrice - product.price;
  }

  // Méthode pour obtenir le prix avec offre
  getOfferPrice(product: Product, quantity: number): number {
    const offer = product.offers?.find(o => o.quantity === quantity);
    return offer ? offer.price : product.price;
  }
}
