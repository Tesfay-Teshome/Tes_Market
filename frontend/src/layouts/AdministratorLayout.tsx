import { Outlet } from 'react-router-dom';
import AdministratorSidebar from '@/components/navigation/AdministratorSidebar';
import AdministratorHeader from '@/components/navigation/AdministratorHeader';

const AdministratorLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdministratorHeader />
      <div className="flex">
        <AdministratorSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdministratorLayout;