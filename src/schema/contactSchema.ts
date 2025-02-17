import { z } from "zod";

const contactFormSchema = z.object({
  fname: z.string().min(1),
  lname: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10, "Message must be at least 10 characters"),
   subject: z.enum(["normal", "general", "support", "feedback"], {
    required_error: "Please select a subject",
  }),
});

export default contactFormSchema;
