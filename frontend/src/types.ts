export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  vendorId: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'vendor' | 'admin';
  profileImage?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
}
