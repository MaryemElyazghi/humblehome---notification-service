/**
 * Configuration de l'API Backend
 * 
 * URL de base du Gateway Spring Cloud
 * Le développeur devra ajuster cette URL selon son environnement
 */
export const API_CONFIG = {
  // URL de base du Gateway (port 8888)
  BASE_URL: 'http://localhost:8888',
  
  // Endpoints de l'API
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/authh/controller/token',
      REGISTER: '/authh/controller/addNewUser',
      VALIDATE_TOKEN: '/authh/controller/validate',
      GET_USER_BY_USERNAME: '/authh/controller/find-by-username'
    },
    
    // Products
    PRODUCTS: {
      BASE: '/product',
      BY_ID: (id: number) => `/product/${id}`,
      ALL: '/product'
    },
    
    // Images
    IMAGES: {
      BASE: '/images',
      UPLOAD: '/images',
      UPLOAD_MULTIPLE: '/images/upload',
      BY_PRODUCT_ID: (productId: number) => `/images/product/${productId}`,
      DOWNLOAD: (fileName: string) => `/images/download/${fileName}`
    },
    
    // Cart
    CART: {
      MY_CART: '/cart/my-cart',
      CLEAR: '/cart/delet',
      TOTAL_PRICE: '/cart/cart/total-price',
      CREATE: '/cart/create'
    },
    
    // Orders
    ORDERS: {
      BASE: '/order',
      CREATE: '/order',
      BY_ID: (id: number) => `/order/${id}`,
      MY_ORDERS: '/order/my-orders',
      MY_ORDERS_TOTAL: '/order/my-orders/total'
    }
  }
};

