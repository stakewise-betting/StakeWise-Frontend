// StakeWise-Frontend/src/services/userService.ts
import axios from 'axios';
import { IUser } from '@/types/user.types'; // Adjust path if necessary

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const userApiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Define the expected structure from the /user/data endpoint
interface UserDataApiResponse {
    success: boolean;
    userData: IUser;
    message?: string;
}

// Define the expected structure for the profile update response (assuming backend sends this)
interface UpdateProfileApiResponse {
    success: boolean;
    message: string;
    user: IUser; // Expect the updated user object
}


// --- Function to fetch current logged-in user's data --- (Keep as corrected before)
export const fetchCurrentUserData = async (): Promise<IUser> => {
    try {
        const response = await userApiClient.get<UserDataApiResponse>('/user/data');
        if (response.data && response.data.success && response.data.userData) {
            return response.data.userData;
        } else {
            console.error("Unexpected response format from /user/data:", response.data);
            throw new Error(response.data?.message || "User data not found or invalid format in response");
        }
    } catch (error: any) {
        console.error("API Error fetching current user data:", error.response?.data || error.message || error);
        const message = error.response?.data?.message || error.message || "Failed to fetch profile data";
        throw new Error(message);
    }
};

// --- Function to update the current user's profile --- *** CORRECTED DEFINITION ***
// Accepts only ONE argument: the data object to send for update
export const updateCurrentUserProfile = async (
    data: { fname?: string | null; lname?: string | null; username: string }
): Promise<IUser> => {
    try {
        console.log("Sending PUT request to /user-update/profile with data:", data);
        // Make a single PUT request to the '/profile' endpoint
        const response = await userApiClient.put<UpdateProfileApiResponse>( // Expect UpdateProfileApiResponse
            '/user-update/profile', // The correct endpoint
            data // Send the data object directly
        );

        // Check if the backend response includes the updated user object
        if (response.data && response.data.success && response.data.user) {
             console.log("Profile update successful, received updated user:", response.data.user);
             return response.data.user; // Return the updated user object
        } else {
             // Handle cases where the backend might not return the user object as expected
             console.error("Update response missing user data or success flag:", response.data);
             throw new Error(response.data?.message || "Updated user data not found in response");
        }
    } catch (error: any) {
        console.error("API Error updating user profile:", error.response?.data || error.message || error);
        // Construct a meaningful error message for the frontend
        const message = error.response?.data?.message || // Message from backend
                        (error.response?.status === 404 ? "Profile update endpoint not found" : error.message) || // Specific 404 or generic Axios error
                        "Failed to update profile"; // Fallback
        throw new Error(message);
    }
};

// --- Optional: Keep other service functions if needed (e.g., update password, avatar) ---