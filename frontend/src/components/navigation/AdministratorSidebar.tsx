import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FolderTree,
  CreditCard,
  Home,
} from 'lucide-react';

const AdministratorSidebar = () => {
  const location = useLocation();

  const links = [
    {
      to: '/',
      icon: Home,
      label: 'Home',
    },
    {
      to: '/administrator',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/administrator/users',
      icon: Users,
      label: 'Users',
    },
    {
      to: '/administrator/products',
      icon: ShoppingBag,
      label: 'Products',
    },
    {
      to: '/administrator/categories',
      icon: FolderTree,
      label: 'Categories',
    },
    {
      to: '/administrator/transactions',
      icon: CreditCard,
      label: 'Transactions',
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
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

export default AdministratorSidebar;