import axios from '../utils/axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    full_name: string;
    user_type: 'buyer' | 'vendor';
}

export interface User {
    id: number;
    email: string;
    full_name: string;
    user_type: string;
    is_verified: boolean;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
}


export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post('/auth/login/', credentials);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to login. Please check your credentials and try again.');
    }
};

export const registerUser = async (data: RegisterData): Promise<void> => { // Update Return Type
    try {
        await axios.post('/auth/register/', data);

    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.response?.data?.email) {
            throw new Error(error.response.data.email[0]);
        }
        throw new Error('Failed to register. Please try again later.');
    }
};

export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
    try {
        const response = await axios.post('/token/refresh/', { refresh });
        return response.data;
    } catch (error) {
        throw new Error('Failed to refresh token');
    }
};

export const forgotPassword = async (email: string): Promise<void> => {
    try {
        await axios.post('/auth/password/reset/', { email });
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to send password reset email. Please try again later.');
    }
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
        await axios.post('/auth/password/reset/confirm/', {
            token,
            password,
        });
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to reset password. Please try again later.');
    }
};

export const verifyToken = async (token: string): Promise<boolean> => {
    try {
        await axios.post('/auth/token/verify/', { token });
        return true;
    } catch (error) {
        return false;
    }
};

export const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await axios.get('/users/me/');
        return response.data;
    } catch (error: any) {
        console.error("Error fetching current user in getCurrentUser:", error);
        throw new Error('Failed to fetch current user');
    }
};

export const updateProfile = async (profileData: any): Promise<void> => {
    try {
        await axios.patch('/users/update_profile/', profileData);
    } catch (error: any) {
        console.error("Error updating profile in updateProfile:", error);
        throw new Error('Failed to update profile');
    }
};