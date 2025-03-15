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

import SuccessPopup from "@/components/popup/SuccessPopup";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // to connect zod with react-hook-form
import contactSchema from "@/schema/contactSchema";
import { z } from "zod";
import { useState } from "react";

type ContactFormInputs = z.infer<typeof contactSchema>; // define the type of the form inputs(typescript part)

export default function ContactUs() {
  // using react-hook-form to handle form state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  // using SubmitHandler from react-hook-form to handle form submission
  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowSuccessPopup(true);
    console.log("Form submitted:", data);
    reset({
      fullname: "",
      email: "",
      queryCategory: undefined, // or set to a valid default value like "general"
      message: "",
    }); // reset the form after submission
  };

  //popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const onConfirm = () => {
    setShowSuccessPopup(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Contact Support
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Our team is available 24/7 to help with any betting queries or
              account issues.
            </p>
          </div>

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
                  <Card className="bg-[#1C1C27] border-l-4 border-[#1C1C27] border-l-[#E27625] shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)] ">
                    <CardHeader>
                      <CardTitle>Contact Support</CardTitle>
                      <CardDescription>
                        Let us know what you need help with and we'll respond
                        promptly.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        className="grid gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <input
                            id="fullname"
                            placeholder="Enter your name"
                            type="text"
                            className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            {...register("fullname")}
                          />
                          {errors.fullname && (
                            <p className="text-red text-xs mt-1">
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
                            <p className="text-red text-xs mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="grid gap-2 ">
                          <Label htmlFor="category">Query Category</Label>
                          <Select
                            onValueChange={(value) => {
                              // Manually update the subject field in react-hook-form
                              register("queryCategory").onChange({
                                target: { value, name: "queryCategory" },
                              });
                            }}
                          >
                            <SelectTrigger
                              id="category"
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
                                <SelectItem id="account" value="account">
                                  Account Issues
                                </SelectItem>
                                <SelectItem id="payments" value="payments">
                                  Deposits & Withdrawals
                                </SelectItem>
                                <SelectItem id="bets" value="bets">
                                  Betting Questions
                                </SelectItem>
                                <SelectItem id="bonuses" value="bonuses">
                                  Bonuses & Promotions
                                </SelectItem>
                                <SelectItem id="technical" value="technical">
                                  Technical Support
                                </SelectItem>
                                <SelectItem id="other" value="other">
                                  Other
                                </SelectItem>
                              </motion.div>
                            </SelectContent>
                          </Select>
                          {errors.queryCategory && (
                            <p className="text-red text-xs mt-1">
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
                            <p className="text-red text-xs mt-1">
                              {errors.message.message}
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-3 bg-blue-500 text-white rounded-lg transition ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-blue-600"
                          }`}
                        >
                          {isSubmitting ? "Sending..." : "Submit Ticket"}
                        </Button>
                      </form>
                      {showSuccessPopup && (
                        <SuccessPopup
                          message="Message sent successfully!"
                          onConfirm={onConfirm}
                        />
                      )}
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
                        >
                          How do I withdraw my winnings?
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start font-normal h-auto py-2"
                        >
                          Why was my bet rejected?
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start font-normal h-auto py-2"
                        >
                          How do I verify my account?
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start font-normal h-auto py-2"
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
                <Card className="bg-[#1C1C27] border-l-4 border-[#1C1C27] border-l-[#E27625] shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]" >
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
                        <Button variant="outline" size="sm">
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
                        <Button variant="outline" size="sm">
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
                      <Button className={`w-[20%] py-3 text-xs bg-blue-500 text-white rounded-lg transition ${
                          isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600"
                        }`} >Start Assessment</Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex flex-col items-start">
                    <p className="text-sm text-muted-foreground mb-2">
                      If you're concerned about your gambling or affected by
                      someone else's gambling, please contact our responsible
                      gambling team.
                    </p>
                    <Button className={`w-1/3 py-3 text-xs bg-blue-500 text-white rounded-lg transition ${
                          isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600"
                        }`}>
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
                          className=" mt-2 w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vip-email">Email Address</Label>
                        <input
                          id="vip-email"
                          type="email"
                          placeholder="Enter your email"
                          className=" mt-2 w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="vip-message">How can we help?</Label>
                      <Textarea
                        id="vip-message"
                        placeholder="Please describe what you need assistance with..."
                        className="mt-2 min-h-[120px] border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <Button className={`w-[20%] py-3 text-xs bg-blue-500 text-white rounded-lg transition ${
                          isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600"
                        }`}>
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

          <div className="mt-12">
            <Card className="bg-[#1C1C27] border-none shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
              <CardHeader>
                <CardTitle>Get BetWin Updates</CardTitle>
                <CardDescription>
                  Subscribe for exclusive offers, betting tips, and promotions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-bold mb-4">
                      Follow Our Socials
                    </h3>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1877F2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        <span className="sr-only">Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1DA1F2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                        <span className="sr-only">Twitter</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-gradient-to-br from-[#FEDA75]/10 via-[#D62976]/10 to-[#962FBF]/10 hover:bg-gradient-to-br hover:from-[#FEDA75]/20 hover:via-[#D62976]/20 hover:to-[#962FBF]/20 border-[#D62976]/50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#D62976"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <rect
                            width="20"
                            height="20"
                            x="2"
                            y="2"
                            rx="5"
                            ry="5"
                          ></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                        </svg>
                        <span className="sr-only">Instagram</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FF0000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                          <path d="m10 15 5-3-5-3z"></path>
                        </svg>
                        <span className="sr-only">YouTube</span>
                      </Button>
                    </div>
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-medium mb-2">Latest Promotions</h4>
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-2">• 100% Welcome Bonus up to $500</p>
                        <p className="mb-2">
                          • Free Bet Sunday: Place 5 bets, get 1 free
                        </p>
                        <p>• Accumulator Insurance: Money back on 5+ folds</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">
                      Join Our Community
                    </h3>
                    <form className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="newsletter-email">Email</Label>
                        <input
                          id="newsletter-email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="interests">Betting Interests</Label>
                        <Select>
                          <SelectTrigger
                            id="interests"
                            className="w-full py-3 px-4 border-none text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#9ca3af]"
                          >
                            <SelectValue placeholder="Select interests" />
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
                              <SelectItem value="sports">
                                Sports Betting
                              </SelectItem>
                              <SelectItem value="casino">
                                Casino Games
                              </SelectItem>
                              <SelectItem value="poker">Poker</SelectItem>
                              <SelectItem value="horses">
                                Horse Racing
                              </SelectItem>
                              <SelectItem value="all">
                                All Betting Options
                              </SelectItem>
                            </motion.div>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`sm:w-1/3 py-3 text-xs bg-blue-500 text-white rounded-lg transition ${
                          isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600"
                        }`}
                      > 
                        {isSubmitting ? "Processing..." : "Subscribe for Updates"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        By subscribing you confirm that you are over 18 years of
                        age and agree to our Privacy Policy. You can unsubscribe
                        at any time.
                      </p>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
