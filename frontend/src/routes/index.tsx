import { createBrowserRouter, RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AdministratorLayout from '@/layouts/AdministratorLayout';
import VendorLayout from '@/layouts/VendorLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import Categories from '@/pages/Categories';
import Vendors from '@/pages/Vendors';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import ProductDetails from '@/pages/ProductDetails';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Cart from '@/pages/buyer/Cart';
import Checkout from '@/pages/buyer/Checkout';
import Orders from '@/pages/buyer/Orders';
import Profile from '@/pages/buyer/Profile';
import Wishlist from '@/pages/buyer/Wishlist';

// Administrator Pages
import AdminDashboard from '@/pages/administrator/Dashboard';
import ManageUsers from '@/pages/administrator/ManageUsers';
import ManageProducts from '@/pages/administrator/ManageProducts';
import ManageCategories from '@/pages/administrator/ManageCategories';
import ManageTransactions from '@/pages/administrator/ManageTransactions';

// Vendor Pages
import VendorDashboard from '@/pages/vendor/Dashboard';
import VendorProducts from '@/pages/vendor/Products';
import VendorOrders from '@/pages/vendor/Orders';
import VendorEarnings from '@/pages/vendor/Earnings';

const routes: RouteObject[] = [
  // Public Routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:slug', element: <ProductDetails /> },
      { path: 'categories', element: <Categories /> },
      { path: 'vendors', element: <Vendors /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // Protected Buyer Routes
      {
        element: <ProtectedRoute children={undefined} />,
        children: [
          { path: 'cart', element: <Cart /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'orders', element: <Orders /> },
          { path: 'profile', element: <Profile /> },
          { path: 'wishlist', element: <Wishlist /> },
        ],
      },
    ],
  },

  // Administrator Routes
  {
    path: 'administrator',
    element: (
      <ProtectedRoute requiredRole="administrator">
        <AdministratorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'products', element: <ManageProducts /> },
      { path: 'categories', element: <ManageCategories /> },
      { path: 'transactions', element: <ManageTransactions /> },
    ],
  },

  // Vendor Routes
  {
    path: 'vendor',
    element: (
      <ProtectedRoute requiredRole="vendor">
        <VendorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <VendorDashboard /> },
      { path: 'products', element: <VendorProducts /> },
      { path: 'orders', element: <VendorOrders /> },
      { path: 'earnings', element: <VendorEarnings /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;