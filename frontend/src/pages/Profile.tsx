import React, { useEffect, useState } from 'react';
import { getCurrentUser, updateProfile } from '../api/auth';
import { useAuth } from '../contexts/AuthProvider';

const Profile = () => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <div>Not authenticated. Please <a href="/auth/login">login</a>.</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        full_name: user.full_name || '',
        email: user.email || '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setFormData({
                    full_name: userData.full_name,
                    email: userData.email,
                });
                setError(null);
            } catch (err: any) {
                console.error("Error fetching user data:", err);
                setError(`Failed to fetch user data: ${err.message || err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            alert('Profile updated successfully');
        } catch (err: any) {
            console.error("Error updating profile:", err);
            setError(`Failed to update profile: ${err.message || err}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-xl font-bold text-indigo-600">
                                {formData.full_name?.[0] || 'U'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{formData.full_name}</h2>
                            <p className="text-gray-600">{formData.email}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label>
                            <strong>Full Name:</strong>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </label>
                        <label>
                            <strong>Email:</strong>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </label>
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            Update Profile
                        </button>
                    </div>
                </form>
                <div className="space-y-2 mt-4">
                    <p><strong>Role:</strong> {user.user_type}</p>
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;