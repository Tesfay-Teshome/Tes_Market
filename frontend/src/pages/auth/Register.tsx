import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, UserType } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CameraIcon } from 'lucide-react';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  user_type: z.enum(['buyer', 'vendor']),
  store_name: z.string().optional(),
  store_description: z.string().optional(),
  profile_image: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.user_type === 'vendor' && !data.store_name) {
    return false;
  }
  return true;
}, {
  message: 'Store name is required for vendors',
  path: ['store_name'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user_type: 'buyer',
    },
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { register: authRegister } = useAuth();
  const { toast } = useToast();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('user_type', data.user_type);
      
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      if (data.user_type === 'vendor') {
        formData.append('store_name', data.store_name || '');
        formData.append('store_description', data.store_description || '');
      }

      await authRegister(formData);
      toast({
        title: "Success",
        description: "Account created successfully. Please login.",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to register. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setProfileImage(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="user_type">Account Type</Label>
              <select
                id="user_type"
                {...register('user_type')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="buyer">Buyer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            {profileImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
            )}

            <div>
              <Label htmlFor="profile_image">Profile Image</Label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="profile_image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a photo</span>
                  <input
                    id="profile_image"
                    name="profile_image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1 text-sm text-gray-600">(Optional)</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                JPEG, PNG or GIF up to 5MB
              </p>
            </div>

            {register('user_type').value === 'vendor' && (
              <div>
                <Label htmlFor="store_name">Store Name</Label>
                <Input
                  id="store_name"
                  {...register('store_name')}
                  placeholder="Enter your store name"
                />
                {errors.store_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.store_name.message}</p>
                )}
              </div>
            )}

            {register('user_type').value === 'vendor' && (
              <div>
                <Label htmlFor="store_description">Store Description</Label>
                <Textarea
                  id="store_description"
                  {...register('store_description')}
                  placeholder="Describe your store"
                />
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;