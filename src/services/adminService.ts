// StakeWise-Frontend/src/services/adminService.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthToken = (): string | undefined => {
    const token = Cookies.get('authToken');
    return token;
};

const adminApiClient = axios.create({
    baseURL: `${API_URL}/admin`,
    withCredentials: true,
});

adminApiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log("AdminService Interceptor: Added Authorization header from non-HttpOnly cookie.");
        } else {
            console.log("AdminService Interceptor: No token found by getAuthToken (likely HttpOnly or not set). Relying on browser sending cookie via withCredentials.");
        }
        return config;
    },
    (error) => {
        console.error("Axios request interceptor error:", error);
        return Promise.reject(error);
    }
);

adminApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Admin API request Unauthorized (401):", error.response.data?.message || error.message);
            toast.error("Session expired or unauthorized. Please log in again.");
        }
        return Promise.reject(error);
    }
);

// --- Function to fetch all users ---
export const fetchAllUsers = async () => {
    try {
        console.log("Attempting to fetch users via adminApiClient...");
        const response = await adminApiClient.get('/users');
        console.log("Fetch users response status:", response.status);
        return response.data;
    } catch (error: any) {
        console.error("fetchAllUsers API Error:", error.response?.data || error.message);
        throw error;
    }
};

// --- Function to delete a user ---
export const deleteUserById = async (userId: string) => {
    try {
        console.log(`Attempting to delete user ${userId} via adminApiClient...`);
        const response = await adminApiClient.delete(`/users/${userId}`);
        console.log("Delete user response status:", response.status);
        return response.data;
    } catch (error: any) {
        console.error(`deleteUserById API Error for ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

// --- Function to change user role ---
export const changeUserRole = async (userId: string, newRole: string) => {
    try {
        console.log(`Attempting to change user ${userId} role to ${newRole} via adminApiClient...`);
        const response = await adminApiClient.put(`/users/${userId}/role`, { newRole });
        console.log("Change user role response status:", response.status);
        return response.data;
    } catch (error: any) {
        console.error(`changeUserRole API Error for ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

// --- Function to fetch user count ---
export const fetchUserCount = async () => {
    try {
        console.log("Attempting to fetch user count via adminApiClient...");
        const response = await adminApiClient.get('/user-count');
        console.log("Fetch user count response status:", response.status);

        if (typeof response.data?.count === 'number') {
            return response.data;
        } else {
            console.error("Unexpected format for user count response:", response.data);
            throw new Error("Unexpected format for user count response");
        }
    } catch (error: any) {
        console.error("fetchUserCount API Error:", error.response?.data || error.message);
        throw error;
    }
};