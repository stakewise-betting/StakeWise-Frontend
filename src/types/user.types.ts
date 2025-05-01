// StakeWise-Frontend/src/types/user.types.ts (Create this file if it doesn't exist)
// Or add inside UserManagementPage.tsx temporarily

export interface IUser {
    _id: string; // From MongoDB
    fname?: string | null;
    lname?: string | null;
    username?: string; // Might be null for metamask/google initial signup
    email?: string | null;
    googleId?: string | null;
    picture?: string | null; // URL from Google or Cloudinary
    avatarSrc?: string | null; // Custom uploaded avatar
    walletAddress?: string | null;
    authProvider: "google" | "credentials" | "metamask";
    role: "user" | "admin" | "moderator";
    isAccountVerified: boolean;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    // Add other fields if needed for display
}