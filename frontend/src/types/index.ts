export interface User {
  id: string;
  email: string;
  username: string;
  user_type: 'vendor' | 'buyer' | 'administrator';
  phone?: string;
  address?: string;
  profile_image?: string;
  store_name?: string;
  store_description?: string;
  created_at:string;
  is_verified: boolean;
}

export interface Product {
  id: string;
  vendor: User;
  category: Category;
  name: string;
  image: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  is_active: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  approval_note?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: Category;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  subtotal: number;
}

export interface Cart {
  id: string;
  user: User;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price_adjustment: number;
  stock: number;
}

export interface Order {
  id: string;
  user: User;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order: Order;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  vendor_earning: number;
  platform_fee: number;
}

export interface Transaction {
  id: string;
  order: Order;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: 'stripe' | 'paypal' | 'bank_transfer';
  payment_details: Record<string, any>;
  admin_approved: boolean;
  admin_note?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user: User;
  product: Product;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user: User;
  items: WishlistItem[];
  created_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist: Wishlist;
  product: Product;
  created_at: string;
}

export interface VendorAnalytics {
  id: string;
  vendor: User;
  date: string;
  total_sales: number;
  total_orders: number;
  total_products_sold: number;
  total_earnings: number;
  platform_fees: number;
}

export interface AdminDashboardMetrics {
  id: string;
  date: string;
  total_sales: number;
  total_orders: number;
  total_users: number;
  total_vendors: number;
  total_products: number;
  total_commission: number;
  pending_approvals: number;
  pending_payouts: number;
}

export interface Testimonial {
  id: string;
  user: User;
  name: string;
  role: string;
  image?: string;
  content: string;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}