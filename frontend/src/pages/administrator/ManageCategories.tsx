import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { Category } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  parent_id: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const ManageCategories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await adminAPI.getCategories();
      return response.data;
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.parent_id) formData.append('parent_id', data.parent_id);
      return adminAPI.createCategory(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: 'Success',
        description: 'Category added successfully.',
      });
      setIsAddModalOpen(false);
      reset();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add category.',
        variant: 'destructive',
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.parent_id) formData.append('parent_id', data.parent_id);
      return adminAPI.updateCategory(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: 'Success',
        description: 'Category updated successfully.',
      });
      setEditingCategory(null);
      reset();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update category.',
        variant: 'destructive',
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete category.',
        variant: 'destructive',
      });
    },
  });

  const openAddModal = () => {
    reset();
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('description', category.description || '');
    setValue('parent_id', category.parent?.id || '');
    setIsAddModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(categories) ? categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {category.description || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {category.parent?.name || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>

      {/* Category Form Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category (Optional)
                </label>
                <select
                  {...register('parent_id')}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None</option>
                  {Array.isArray(categories) ? categories.map((category) => (
                    <option 
                      key={category.id} 
                      value={category.id}
                      disabled={editingCategory?.id === category.id}
                    >
                      {category.name}
                    </option>
                  )) : null}
                </select>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCategory(null);
                    reset();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;