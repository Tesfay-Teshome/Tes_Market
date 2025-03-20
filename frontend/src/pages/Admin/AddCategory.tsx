import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { categoriesAPI } from '@/services/api';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mutation = useMutation({
    mutationFn: categoriesAPI.create,
    onSuccess: () => {
      // Handle success (e.g., show a success message, clear form, etc.)
      setCategoryName('');
      setError('');
      setSuccess('Category added successfully!');
    },
    onError: (error: any) => {
      // Handle error (e.g., show an error message)
      setError(error.response?.data?.message || 'Failed to add category');
      setSuccess('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', categoryName);
    mutation.mutate(formData);
  };

  return (
    <div>
      <h1>Add Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          required
        />
        <button type="submit">Add Category</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AddCategory;
