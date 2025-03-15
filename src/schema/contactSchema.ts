import { z } from "zod";

const contactFormSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(500, { message: "Message cannot exceed 500 characters" }),
  queryCategory: z.enum(["Account Issues", "Deposits & Withdrawals", "Betting Questions", "Bonuses & Promotions", "Technical Support", "Other"], {
    required_error: "Please select a query category",
  }),
});

export default contactFormSchema;
