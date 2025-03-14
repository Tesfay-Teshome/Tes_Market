import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { Transaction } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const ManageTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions', searchTerm],
    queryFn: async () => {
      const response = await adminAPI.getTransactions(searchTerm);
      return response.data;
    },
  });

  const approveTransactionMutation = useMutation({
    mutationFn: (transactionId: string) => adminAPI.approveTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      toast({
        title: 'Success',
        description: 'Transaction approved successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to approve transaction.',
        variant: 'destructive',
      });
    },
  });

  const rejectTransactionMutation = useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: string; reason: string }) => adminAPI.rejectTransaction(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      toast({
        title: 'Success',
        description: 'Transaction rejected successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to reject transaction.',
        variant: 'destructive',
      });
    },
  });

  const handleApproveTransaction = (transactionId: string) => {
    approveTransactionMutation.mutate(transactionId);
  };

  const handleRejectTransaction = (transactionId: string, reason: string) => {
    rejectTransactionMutation.mutate({ transactionId, reason });
  };

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Transactions</h1>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions?.map((transaction: Transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {transaction.transaction_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {transaction.payment_method}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openTransactionDetails(transaction)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleApproveTransaction(transaction.id)}
                    className="text-green-600 hover:text-green-900 mr-2"
                    title="Approve"
                    disabled={transaction.admin_approved}
                  >
                    <CheckCircle className={`h-5 w-5 ${transaction.admin_approved ? 'opacity-50' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Please enter the reason for rejection:');
                      if (reason) {
                        handleRejectTransaction(transaction.id, reason);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                    title="Reject"
                    disabled={transaction.status === 'failed'}
                  >
                    <XCircle className={`h-5 w-5 ${transaction.status === 'failed' ? 'opacity-50' : ''}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium">{selectedTransaction.transaction_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">${selectedTransaction.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{selectedTransaction.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{selectedTransaction.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(selectedTransaction.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Admin Approved</p>
                <p className="font-medium">{selectedTransaction.admin_approved ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Payment Details</p>
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(selectedTransaction.payment_details, null, 2)}
              </pre>
            </div>

            {selectedTransaction.admin_note && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Admin Note</p>
                <p className="bg-gray-50 p-4 rounded-md">{selectedTransaction.admin_note}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {!selectedTransaction.admin_approved && (
                <button
                  onClick={() => {
                    handleApproveTransaction(selectedTransaction.id);
                    setSelectedTransaction(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve Transaction
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTransactions;