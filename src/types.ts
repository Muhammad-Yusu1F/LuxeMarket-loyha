export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  description: string;
  specs: {
    battery?: string;
    isolation?: string;
    range?: string;
    latency?: string;
    avgRating?: string;
    weight?: string;
    frequencyResponse?: string;
    driverDiameter?: string;
    charging?: string;
  };
  additionalImages?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type ScreenState = 'HOME' | 'CATALOG' | 'PRODUCT_DETAIL' | 'CART' | 'PROFILE' | 'ADMIN';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: CartItem[];
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  notes?: string;
}

