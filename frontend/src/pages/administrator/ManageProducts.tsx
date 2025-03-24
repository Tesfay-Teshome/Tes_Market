import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingProductId, setRejectingProductId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products', searchTerm],
    queryFn: async () => {
      const response = await adminAPI.getPendingProducts();
      if (searchTerm) {
        return response.data.filter((product: Product) => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.vendor.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return response.data;
    },
  });

  const approveProductMutation = useMutation({
    mutationFn: (productId: string) => adminAPI.approveProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: 'Success',
        description: 'Product approved successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to approve product.',
        variant: 'destructive',
      });
    },
  });

  const rejectProductMutation = useMutation({
    mutationFn: ({ productId, note }: { productId: string; note: string }) => 
      adminAPI.rejectProduct(productId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: 'Success',
        description: 'Product rejected successfully.',
      });
      setRejectingProductId(null);
      setRejectReason('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to reject product.',
        variant: 'destructive',
      });
    },
  });

  const handleApproveProduct = (productId: string) => {
    approveProductMutation.mutate(productId);
  };

  const openRejectModal = (productId: string) => {
    setRejectingProductId(productId);
  };

  const handleRejectProduct = () => {
    if (!rejectingProductId) return;
    
    if (!rejectReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }
    
    rejectProductMutation.mutate({ 
      productId: rejectingProductId, 
      note: rejectReason 
    });
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
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products or vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Vendor: {product.vendor.username}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.approval_status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : product.approval_status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {product.approval_status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleApproveProduct(product.id)}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(product.id)}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending products</h3>
          <p className="text-gray-500">There are no products waiting for approval.</p>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Reject Product</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this product. This will be visible to the vendor.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setRejectingProductId(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;