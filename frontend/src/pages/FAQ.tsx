import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I become a vendor?',
      answer: 'To become a vendor, register for a vendor account and complete the verification process. Once approved by our admin team, you can start listing your products.'
    },
    {
      question: 'What are the platform fees?',
      answer: 'We charge a 10% commission on each successful sale. This covers platform maintenance, security, and customer service.'
    },
    {
      question: 'How do payments work?',
      answer: 'We support multiple payment methods including Stripe, PayPal, and bank transfers. Vendors receive payments after admin approval, minus the platform commission.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by vendor and location. Each product listing includes estimated delivery times.'
    },
    {
      question: 'What is your return policy?',
      answer: 'Return policies are set by individual vendors. Please check the product listing for specific return policy information.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
