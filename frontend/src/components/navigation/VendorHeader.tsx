import { Settings } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const VendorHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="h-16 flex items-center justify-end px-4">
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader