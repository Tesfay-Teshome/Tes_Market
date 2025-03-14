import { Routes, Route } from 'react-router-dom';
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Buyer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* Administrator Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="administrator">
            <AdministratorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="administrator">
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="transactions" element={<ManageTransactions />} />
        </Route>
      </Route>

      {/* Vendor Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="vendor">
          <Route index element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="earnings" element={<VendorEarnings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;