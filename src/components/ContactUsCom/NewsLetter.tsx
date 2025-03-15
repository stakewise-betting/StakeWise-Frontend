import { FiFacebook } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

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

import SuccessPopup from "@/components/popup/SuccessPopup";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // to connect zod with react-hook-form
import contactSchema from "@/schema/contactSchema";
import { z } from "zod";

type ContactFormInputs = z.infer<typeof contactSchema>;

const NewsLetter = () => {
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
    <div>
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
                <h3 className="text-lg font-bold mb-4">Follow Our Socials</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/50"
                  >
                    <FiFacebook className="text-[#1877F2]" />
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/50"
                  >
                    <FaXTwitter className="text-[#1DA1F2]" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-gradient-to-br from-[#FEDA75]/10 via-[#D62976]/10 to-[#962FBF]/10 hover:bg-gradient-to-br hover:from-[#FEDA75]/20 hover:via-[#D62976]/20 hover:to-[#962FBF]/20 border-[#D62976]/50"
                  >
                    <FaInstagram className="text-[#D62976]" />
                    <span className="sr-only">Instagram</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/50"
                  >
                    <FiYoutube className="text-[#FF0000]" />
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
                <h3 className="text-lg font-bold mb-4">Join Our Community</h3>
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-2">
                    <Label htmlFor="newsletter-email">Email</Label>
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email")}
                      className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email && (
                      <p className="text-red text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
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
                          <SelectItem value="sports">Sports Betting</SelectItem>
                          <SelectItem value="casino">Casino Games</SelectItem>
                          <SelectItem value="poker">Poker</SelectItem>
                          <SelectItem value="horses">Horse Racing</SelectItem>
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
                  {showSuccessPopup && (
                    <SuccessPopup
                      message="Message sent successfully!"
                      onConfirm={onConfirm}
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    By subscribing you confirm that you are over 18 years of age
                    and agree to our Privacy Policy. You can unsubscribe at any
                    time.
                  </p>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsLetter;
