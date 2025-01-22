export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'vendor' | 'admin';
  profileImage?: string;
  createdAt: string;
}

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

export interface Transaction {
  id: string;
  productId: string;
  buyerId: string;
  vendorId: string;
  amount: number;
  commission: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}