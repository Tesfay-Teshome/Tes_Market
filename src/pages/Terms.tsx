import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-indigo max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Welcome to MarketPlace. By accessing or using our platform, you agree to be bound by these terms and conditions.
            Please read these terms carefully before using our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>"Platform" refers to the MarketPlace website and services</li>
            <li>"User" refers to any person who accesses or uses the Platform</li>
            <li>"Vendor" refers to sellers who list products on the Platform</li>
            <li>"Buyer" refers to users who purchase products through the Platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Account Registration</h2>
          <p className="text-gray-600 mb-4">
            To use certain features of the Platform, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update any changes to your information</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Vendor Terms</h2>
          <p className="text-gray-600 mb-4">
            Vendors on our platform must adhere to the following terms:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Accurately represent products and services</li>
            <li>Maintain sufficient inventory</li>
            <li>Process orders in a timely manner</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Maintain professional communication with buyers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Buyer Terms</h2>
          <p className="text-gray-600 mb-4">
            Buyers using our platform agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Provide accurate payment information</li>
            <li>Complete authorized purchases</li>
            <li>Respect vendor policies and terms</li>
            <li>Communicate professionally with vendors</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Prohibited Activities</h2>
          <p className="text-gray-600 mb-4">
            The following activities are strictly prohibited:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Fraudulent transactions or activities</li>
            <li>Harassment or abuse of other users</li>
            <li>Violation of intellectual property rights</li>
            <li>Manipulation of platform features or systems</li>
            <li>Distribution of malware or harmful content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Privacy and Data Protection</h2>
          <p className="text-gray-600 mb-4">
            We are committed to protecting your privacy. Our collection and use of personal data is governed by our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            All content on the Platform, unless user-generated, is owned by MarketPlace and protected by copyright laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            MarketPlace is not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these terms at any time. Continued use of the Platform constitutes acceptance of updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
          <p className="text-gray-600">
            For questions about these terms, please contact us at:<br />
            Email: legal@marketplace.com<br />
            Phone: +1 (234) 567-8900
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;