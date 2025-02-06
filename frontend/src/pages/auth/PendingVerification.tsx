import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Clock, CheckCircle } from 'lucide-react';

const PendingVerification: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Store className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verification Pending
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your vendor account is currently under review
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Clock className="h-16 w-16 text-yellow-500" />
              <p className="text-center text-gray-700">
                Our team is reviewing your vendor application. This process usually takes 1-2 business days.
              </p>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900">What happens next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Once approved, you'll receive an email notification
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    You'll be able to access your vendor dashboard
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Start listing your products and managing your store
                  </p>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
