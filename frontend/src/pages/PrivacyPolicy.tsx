import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Name and contact information</li>
            <li>Payment and transaction information</li>
            <li>Account credentials</li>
            <li>Profile information</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Process your transactions</li>
            <li>Maintain and improve our platform</li>
            <li>Communicate with you</li>
            <li>Prevent fraud and enhance security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
          <p>We share information with:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Vendors to fulfill orders</li>
            <li>Payment processors to complete transactions</li>
            <li>Service providers who assist our operations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information, including encryption and secure server infrastructure.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
