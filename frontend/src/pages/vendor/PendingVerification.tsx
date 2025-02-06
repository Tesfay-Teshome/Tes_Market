export default function PendingVerification() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg
            className="w-full h-full text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Pending Verification</h1>

        <p className="text-gray-600 mb-6">
          Your vendor account is currently under review. This process typically takes 1-2 business days.
          We'll notify you via email once your account has been verified.
        </p>

        <div className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-4">
            <h2 className="font-medium text-yellow-800 mb-2">While you wait:</h2>
            <ul className="list-disc list-inside text-yellow-700 space-y-2">
              <li>Make sure your store information is complete</li>
              <li>Prepare product descriptions and images</li>
              <li>Review our seller guidelines</li>
              <li>Set up your payment information</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="font-medium text-blue-800 mb-2">Need help?</h2>
            <p className="text-blue-700">
              Contact our support team at{' '}
              <a href="mailto:support@example.com" className="underline">
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
