// StakeWise-Frontend/src/services/adminService.ts
import axios from 'axios';
import Cookies from 'js-cookie'; // Keep import if used elsewhere, but maybe not for reading authToken
import { toast } from 'sonner'; // Or your preferred toast library

// Ensure this points to your backend API base URL (e.g., http://localhost:5000/api)
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// --- Function to get Auth Token ---
// IMPORTANT: This function will return `undefined` if the 'authToken' cookie is HttpOnly.
// Keep it only if your cookie is NOT HttpOnly OR if you need it for other non-HttpOnly cookies.
const getAuthToken = (): string | undefined => {
    const token = Cookies.get('authToken');
    // console.log("getAuthToken() found:", token); // Debugging: Check if it reads anything
    return token;
};

// Configure Axios instance specifically for admin routes
const adminApiClient = axios.create({
    baseURL: `${API_URL}/admin`, // Base path for admin routes
    // *** THIS IS THE MOST LIKELY FIX ***
    // Ensures cookies (including HttpOnly auth tokens) are sent with requests
    withCredentials: true,
});

// --- Interceptor ---
// CONSIDER REMOVING/COMMENTING OUT if using HttpOnly cookies for 'authToken',
// as getAuthToken() will fail and this interceptor becomes useless for adding the auth header.
// Rely SOLELY on `withCredentials: true` above to send the HttpOnly cookie.
// If your cookie is NOT HttpOnly, you can keep this.
adminApiClient.interceptors.request.use(
    (config) => {
        // This part only works for non-HttpOnly cookies
        const token = getAuthToken();
        if (token) {
             // If we found a non-HttpOnly token, add it as a header.
             // The backend should ideally check header first, then cookie.
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log("AdminService Interceptor: Added Authorization header from non-HttpOnly cookie.");
        } else {
            console.log("AdminService Interceptor: No token found by getAuthToken (likely HttpOnly or not set). Relying on browser sending cookie via withCredentials.");
        }
        // `withCredentials: true` ensures the browser sends ANY relevant cookies
        // regardless of whether the header was added above.
        return config;
    },
    (error) => {
        // Handle request setup errors (rare)
        console.error("Axios request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Optional: Add response interceptor for handling 401s globally if needed
adminApiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized errors globally, e.g., redirect to login
            console.error("Admin API request Unauthorized (401):", error.response.data?.message || error.message);
            toast.error("Session expired or unauthorized. Please log in again.");
            // Potentially redirect: window.location.href = '/login';
        }
        // Important: Still reject the promise so individual calls can catch it
        return Promise.reject(error);
    }
);


// --- Function to fetch all users ---
export const fetchAllUsers = async () => {
    try {
        console.log("Attempting to fetch users via adminApiClient..."); // Log before call
        const response = await adminApiClient.get('/users');
        console.log("Fetch users response status:", response.status); // Log success
        return response.data; // Should be an array of IUser
    } catch (error: any) {
        // Error is likely handled by the response interceptor, but log specific context
        console.error("fetchAllUsers API Error:", error.response?.data || error.message);
        // Re-throw the error so the calling component (UserManagementPage) knows it failed
        throw error;
    }
};

// --- Function to delete a user ---
export const deleteUserById = async (userId: string) => {
    try {
        console.log(`Attempting to delete user ${userId} via adminApiClient...`); // Log before call
        const response = await adminApiClient.delete(`/users/${userId}`);
        console.log("Delete user response status:", response.status); // Log success
        return response.data; // Should contain { message: "...", userId: "..." }
    } catch (error: any) {
        console.error(`deleteUserById API Error for ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

// --- Function to fetch user count ---
// Ensure this uses the configured client as well for consistency
export const fetchUserCount = async () => {
    try {
        console.log("Attempting to fetch user count via adminApiClient..."); // Log before call
        const response = await adminApiClient.get('/user-count');
        console.log("Fetch user count response status:", response.status); // Log success

        // Validate response structure before returning
        if (typeof response.data?.count === 'number') {
            return response.data; // { count: number }
        } else {
            console.error("Unexpected format for user count response:", response.data);
            throw new Error("Unexpected format for user count response");
        }
    } catch (error: any) {
        console.error("fetchUserCount API Error:", error.response?.data || error.message);
        throw error;
    }
}