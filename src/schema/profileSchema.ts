// StakeWise-Frontend/src/schema/profileSchema.ts (Create this new file)
import { z } from 'zod';

export const profileSchema = z.object({
    fname: z.string().max(50, "First name too long").nullable().optional(), // Optional, can be empty string or null
    lname: z.string().max(50, "Last name too long").nullable().optional(), // Optional
    // Username: required, alphanumeric + underscore/hyphen, 3-20 chars
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    // Add other fields here if you allow editing them (use optional() or nullable() as needed)
    // email: z.string().email("Invalid email address").optional(), // Example if editing email (usually not done here)
});

// Define the type based on the schema
export type ProfileFormData = z.infer<typeof profileSchema>;