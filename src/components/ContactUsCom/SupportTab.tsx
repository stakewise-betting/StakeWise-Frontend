import { useState } from "react";
import {
  Mail,
  Phone,
  HelpCircle,
  Clock,
  Send,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitContactForm, ContactFormData } from "@/services/contactService";
import { toast } from "react-toastify";

// Define the contact form schema
const contactSchema = z.object({
  fullname: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  queryCategory: z.string({
    required_error: "Please select a category",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

interface SupportTabProps {
  isLoggedin: boolean;
}

const SupportTab = ({ isLoggedin }: SupportTabProps) => {
  // Using react-hook-form to handle form state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const onSubmit = async (data: ContactFormInputs) => {
    // Check if the user is logged in before submitting
    if (!isLoggedin) {
      toast.error("You must be logged in to send a support message");
      return;
    }

    try {
      setIsSubmitting(true);

      // Map the form data to match the API expectations
      const contactData: ContactFormData = {
        name: data.fullname,
        email: data.email,
        subject: data.queryCategory,
        message: data.message,
        category: data.queryCategory,
      };

      // Call the API to submit the form
      const result = await submitContactForm(contactData);

      // Show success toast
      toast.success("Your message has been sent successfully!");

      // Reset the form
      reset();

      console.log("Form submitted successfully:", result);
    } catch (error: any) {
      console.error("Failed to submit form:", error);

      // Show error toast
      toast.error(
        error.message || "Failed to submit the form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle submit button click - checks login before form validation
  const handleSubmitClick = () => {
    if (!isLoggedin) {
      toast.error("You must be logged in to send a support message");
      return;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="grid gap-10 lg:grid-cols-5">
        {/* Contact Form - Takes more space */}
        <div className="lg:col-span-3">
          <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#3B82F6]/10 to-[#60A5FA]/10 border-b border-[#333447]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-zinc-100">
                  Contact Support
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-zinc-400">
                Let us know what you need help with and we'll respond promptly.
                {!isLoggedin && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm font-medium">
                      Please log in to send a support message.
                    </p>
                  </div>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Full Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="fullname"
                    className="text-zinc-200 font-medium flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#3B82F6]" />
                    Full Name
                  </Label>
                  <input
                    id="fullname"
                    placeholder="Enter your full name"
                    type="text"
                    className="w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100 placeholder-zinc-500"
                    {...register("fullname")}
                  />
                  {errors.fullname && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-zinc-200 font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-[#3B82F6]" />
                    Email Address
                  </Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100 placeholder-zinc-500"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Query Category Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="queryCategory"
                    className="text-zinc-200 font-medium flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-[#3B82F6]" />
                    Query Category
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      register("queryCategory").onChange({
                        target: { value, name: "queryCategory" },
                      });
                    }}
                  >
                    <SelectTrigger className="w-full py-3 px-4 border border-[#333447] text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200">
                      <SelectValue placeholder="Select a category for your query" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl">
                      <SelectItem
                        value="Account Issues"
                        className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                      >
                        Account Issues
                      </SelectItem>
                      <SelectItem
                        value="Deposits & Withdrawals"
                        className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                      >
                        Deposits & Withdrawals
                      </SelectItem>
                      <SelectItem
                        value="Betting Questions"
                        className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                      >
                        Betting Questions
                      </SelectItem>
                      <SelectItem
                        value="Bonuses & Promotions"
                        className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                      >
                        Bonuses & Promotions
                      </SelectItem>
                      <SelectItem
                        value="Technical Support"
                        className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                      >
                        Technical Support
                      </SelectItem>
                      <SelectItem
                        value="Other"
                        className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.queryCategory && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.queryCategory.message}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="message"
                    className="text-zinc-200 font-medium flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
                    Message Details
                  </Label>
                  <textarea
                    id="message"
                    placeholder="Please describe your issue in detail. Include any relevant information that might help us assist you better..."
                    {...register("message")}
                    className="min-h-[140px] py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100 placeholder-zinc-500"
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  onClick={handleSubmitClick}
                  disabled={isSubmitting || !isLoggedin}
                  className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Support Ticket
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Support Information - Takes less space */}
        <div className="lg:col-span-2 space-y-6">
          {/* 24/7 Support Card */}
          <Card className="bg-gradient-to-br from-[#10B981] to-[#34D399] border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">24/7 Support</h3>
              </div>
              <p className="text-green-100 text-sm leading-relaxed">
                Our dedicated support team is available around the clock to
                assist you with any questions or concerns.
              </p>
            </CardContent>
          </Card>

          {/* Quick Contact Options */}
          <Card className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-zinc-100">
                Quick Contact
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Reach us through these channels for faster support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#3B82F6]/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">
                      Phone Support
                    </h4>
                    <p className="text-zinc-300 text-sm font-mono">
                      +1 (888) 123-4567
                    </p>
                    <p className="text-zinc-400 text-xs">Available 24/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#10B981]/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-lg">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">
                      Email Support
                    </h4>
                    <p className="text-zinc-300 text-sm">
                      support@stakewise.com
                    </p>
                    <p className="text-zinc-400 text-xs">
                      Response within 2 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#8B5CF6]/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-lg">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-zinc-100 text-sm">
                      Live Chat
                    </h4>
                    <p className="text-zinc-400 text-xs mb-2">
                      Instant support available
                    </p>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white text-xs px-3 py-1"
                      onClick={() =>
                        toast.info("Live chat will be available soon")
                      }
                    >
                      Launch Chat
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Questions */}
          <Card className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-zinc-100">
                Frequently Asked
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "How do I withdraw my winnings?",
                "Why was my bet rejected?",
                "How do I verify my account?",
                "Where can I find bonus terms?",
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start font-normal text-left h-auto py-3 px-4 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#E27625]/50 rounded-lg text-zinc-300 hover:text-white transition-all duration-300"
                  onClick={() =>
                    toast.info("This FAQ section will be expanded soon")
                  }
                >
                  <HelpCircle className="w-4 h-4 mr-3 text-[#E27625]" />
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportTab;
