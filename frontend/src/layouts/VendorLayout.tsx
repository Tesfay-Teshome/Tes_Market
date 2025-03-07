import { Outlet } from 'react-router-dom';
import VendorSidebar from '@/components/navigation/VendorSidebar';
import VendorHeader from '@/components/navigation/VendorHeader';

const VendorLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <VendorHeader />
      <div className="flex">
        <VendorSidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;