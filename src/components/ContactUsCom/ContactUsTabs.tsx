import { useState, useContext } from "react";
import {
  Mail,
  Phone,
  HelpCircle,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { submitContactForm, ContactFormData } from "@/services/contactService";
import { AppContext } from "@/context/AppContext";
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

const ContactUsTabs = () => {
  // Using react-hook-form to handle form state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  const { isLoggedin } = useContext(AppContext)!;
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
      toast.error(error.message || "Failed to submit the form. Please try again.");
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
    <div>
      <Tabs defaultValue="support" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="responsible">
            Responsible Gambling
          </TabsTrigger>
          <TabsTrigger value="vip">VIP Support</TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-[#1C1C27] border-l-4 border-[#1C1C27] border-l-[#E27625] shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Let us know what you need help with and we'll respond
                    promptly.
                    {!isLoggedin && (
                      <p className="text-red-500 text-sm mt-2">
                        Please log in to send a support message.
                      </p>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <input
                        id="fullname"
                        placeholder="Enter your name"
                        type="text"
                        className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("fullname")}
                      />
                      {errors.fullname && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.fullname.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="queryCategory">Query Category</Label>
                      <Select
                        onValueChange={(value) => {
                          // Manually update the queryCategory field in react-hook-form
                          register("queryCategory").onChange({
                            target: { value, name: "queryCategory" },
                          });
                        }}
                      >
                        <SelectTrigger
                          id="queryCategory"
                          className="w-full py-3 px-4 border-none text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#9ca3af]"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent className="bg-[#333447] border-none rounded-lg text-white">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                          >
                            <SelectItem value="Account Issues">
                              Account Issues
                            </SelectItem>
                            <SelectItem value="Deposits & Withdrawals">
                              Deposits & Withdrawals
                            </SelectItem>
                            <SelectItem value="Betting Questions">
                              Betting Questions
                            </SelectItem>
                            <SelectItem value="Bonuses & Promotions">
                              Bonuses & Promotions
                            </SelectItem>
                            <SelectItem value="Technical Support">
                              Technical Support
                            </SelectItem>
                            <SelectItem value="Other">
                              Other
                            </SelectItem>
                          </motion.div>
                        </SelectContent>
                      </Select>
                      {errors.queryCategory && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.queryCategory.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        placeholder="Please describe your issue in detail..."
                        {...register("message")}
                        className="min-h-[120px] py-3 px-4 text-sm bg-[#333447] rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {errors.message && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      onClick={handleSubmitClick}
                      disabled={isSubmitting || !isLoggedin}
                      className={`w-full py-3 bg-blue-500 text-white rounded-lg transition ${
                        isSubmitting || !isLoggedin
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                      }`}
                    >
                      {isSubmitting ? "Sending..." : "Submit Ticket"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-6 content-start">
                <Card className="bg-[#333447] border-none shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      24/7 Support
                    </CardTitle>
                    <CardDescription>
                      Our team is available round the clock to assist you
                      with any questions.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-[#1C1C27] border-none shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
                  <CardHeader>
                    <CardTitle>Quick Contact Options</CardTitle>
                    <CardDescription>
                      Reach us through these channels for faster support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#333447] rounded-lg">
                      <Phone className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-sm text-muted-foreground text-[#9ca3af]">
                          +1 (888) 123-4567
                        </p>
                        <p className="text-xs text-muted-foreground text-[#9ca3af]">
                          Available 24/7
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#333447] rounded-lg">
                      <Mail className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-sm text-muted-foreground text-[#9ca3af]">
                          support@betwin.com
                        </p>
                        <p className="text-xs text-muted-foreground text-[#9ca3af]">
                          Response within 2 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#333447] rounded-lg">
                      <HelpCircle className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-muted-foreground text-[#9ca3af]">
                          Available on desktop and mobile
                        </p>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs text-white"
                          onClick={() => toast.info("Live chat will be available soon")}
                        >
                          Launch Live Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1C1C27] border-none shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
                  <CardHeader>
                    <CardTitle>Common Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal h-auto py-2"
                      onClick={() => toast.info("This FAQ section will be expanded soon")}
                    >
                      How do I withdraw my winnings?
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal h-auto py-2"
                      onClick={() => toast.info("This FAQ section will be expanded soon")}
                    >
                      Why was my bet rejected?
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal h-auto py-2"
                      onClick={() => toast.info("This FAQ section will be expanded soon")}
                    >
                      How do I verify my account?
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal h-auto py-2"
                      onClick={() => toast.info("This FAQ section will be expanded soon")}
                    >
                      Where can I find my bonus terms?
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="responsible" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="bg-[#1C1C27] border-l-4 border-[#1C1C27] border-l-[#E27625] shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <CardHeader>
                <CardTitle>Responsible Gambling Support</CardTitle>
                <CardDescription>
                  We're committed to promoting responsible gambling
                  practices.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-[#333447] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Set Deposit Limits
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Take control of your gambling by setting daily, weekly
                      or monthly deposit limits.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (!isLoggedin) {
                          toast.error("You must be logged in to set deposit limits");
                          return;
                        }
                        toast.info("Deposit limit setting feature coming soon");
                      }}
                    >
                      Set Limits
                    </Button>
                  </div>

                  <div className="bg-[#333447] p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Take a Time-Out
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Need a break? Set a time-out period from 24 hours up
                      to 6 weeks.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (!isLoggedin) {
                          toast.error("You must be logged in to request a time-out");
                          return;
                        }
                        toast.info("Time-out feature coming soon");
                      }}
                    >
                      Request Time-Out
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Gambling Helplines
                  </h3>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex justify-between">
                      <span>National Problem Gambling Helpline:</span>
                      <span className="font-medium">1-800-522-4700</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Gamblers Anonymous:</span>
                      <span className="font-medium">1-626-960-3500</span>
                    </li>
                    <li className="flex justify-between">
                      <span>GamCare:</span>
                      <span className="font-medium">0808 8020 133</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Take a Self-Assessment
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 text-[#9ca3af]">
                    Not sure if your gambling habits are becoming a problem?
                    Take our confidential self-assessment.
                  </p>
                  <Button 
                    className="py-3 text-xs bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 w-auto"
                    onClick={() => toast.info("Self-assessment tool coming soon")}
                  >
                    Start Assessment
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-2">
                  If you're concerned about your gambling or affected by
                  someone else's gambling, please contact our responsible
                  gambling team.
                </p>
                <Button 
                  className="py-3 text-xs bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 w-auto"
                  onClick={() => {
                    if (!isLoggedin) {
                      toast.error("You must be logged in to contact the responsible gambling team");
                      return;
                    }
                    toast.info("Responsible gambling team contact form will be available soon");
                  }}
                >
                  Contact Responsible Gambling Team
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="vip" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="bg-[#1C1C27] border-l-4 border-[#1C1C27] border-l-[#E27625] shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <CardHeader className="bg-gradient-to-r from-[#333447] to-transparent">
                <CardTitle>VIP Customer Support</CardTitle>
                <CardDescription>
                  Premium support for our VIP members. Fast-track assistance
                  for all your needs.
                  {!isLoggedin && (
                    <p className="text-red-500 text-sm mt-2">
                      Please log in to access VIP support.
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Dedicated VIP Manager</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct line to your personal account manager
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="vip-code">VIP Membership Code</Label>
                    <input
                      id="vip-code"
                      placeholder="Enter your VIP code"
                      className="mt-2 w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={!isLoggedin}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vip-email">Email Address</Label>
                    <input
                      id="vip-email"
                      type="email"
                      placeholder="Enter your email"
                      className="mt-2 w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={!isLoggedin}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="vip-message">How can we help?</Label>
                  <Textarea
                    id="vip-message"
                    placeholder="Please describe what you need assistance with..."
                    className="mt-2 min-h-[120px] border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={!isLoggedin}
                  />
                </div>

                <div className="flex flex-col items-start">
                  <Button 
                    className={`py-3 text-xs bg-blue-500 text-white rounded-lg transition w-auto ${
                      !isLoggedin ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                    }`}
                    disabled={!isLoggedin}
                    onClick={() => {
                      if (!isLoggedin) {
                        toast.error("You must be logged in to send a VIP request");
                        return;
                      }
                      toast.info("VIP request feature coming soon");
                    }}
                  >
                    Submit VIP Request
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Priority response within 30 minutes, 24/7
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactUsTabs;