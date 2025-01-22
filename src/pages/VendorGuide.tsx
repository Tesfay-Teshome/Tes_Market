import React from 'react';
import { Link } from 'react-router-dom';

const VendorGuide = () => {
  const steps = [
    {
      title: '1. Register as a Vendor',
      content: 'Create your account and select "Vendor" as your role. Provide necessary business information and documentation.'
    },
    {
      title: '2. Complete Verification',
      content: 'Submit required documents for verification. This may include business registration, tax documents, and identity proof.'
    },
    {
      title: '3. Set Up Your Store',
      content: 'Once approved, customize your store profile with your brand information, logo, and business description.'
    },
    {
      title: '4. Add Products',
      content: 'Start listing your products with high-quality images, detailed descriptions, and competitive pricing.'
    },
    {
      title: '5. Configure Payment Settings',
      content: 'Set up your payment information to receive payments from sales. We support multiple payment methods.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Registration Guide</h1>
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Ready to Start?</h3>
        <p className="text-blue-700 mb-4">
          Join our marketplace and start selling your products to customers worldwide.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Register as Vendor
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Important Information</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Platform commission is 10% per sale</li>
          <li>Payments are processed after admin approval</li>
          <li>24/7 vendor support available</li>
          <li>Access to sales analytics and reporting tools</li>
        </ul>
      </div>
    </div>
  );
};

export default VendorGuide;
