import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  DollarSign,
  Home,
} from 'lucide-react';

const VendorSidebar = () => {
  const location = useLocation();

  const links = [
    {
      to: '/',
      icon: Home,
      label: 'Home',
    },
    {
      to: '/vendor',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/vendor/products',
      icon: ShoppingBag,
      label: 'Products',
    },
    {
      to: '/vendor/orders',
      icon: Package,
      label: 'Orders',
    },
    {
      to: '/vendor/earnings',
      icon: DollarSign,
      label: 'Earnings',
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Vendor Panel</h2>
      </div>
      <nav className="mt-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              location.pathname === link.to ? 'bg-gray-100' : ''
            }`}
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default VendorSidebar;