import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PiPhoneCallFill } from "react-icons/pi";
import { IoMailSharp } from "react-icons/io5";

import SuccessPopup from "@/components/popup/SuccessPopup";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // to connect zod with react-hook-form
import contactSchema from "@/schema/contactSchema";
import { z } from "zod";
import { useState } from "react";

type ContactFormInputs = z.infer<typeof contactSchema>; // define the type of the form inputs(typescript part)

const ContactForm = () => {
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
      fname: "",
      lname: "",
      email: "",
      subject: undefined, // or set to a valid default value like "general"
      message: "",
    }); // reset the form after submission
  };

  //popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const onConfirm = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="my-10 flex items-center justify-center text-base ">
      <div className="w-3/4 grid grid-cols-1 lg:grid-cols-7 gap-14">
        {/* Contact Information */}
        <div className="bg-card p-9 lg:col-span-3 rounded-xl">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <p className="mt-3">Say something to start a live chat!</p>
          <div className="flex flex-col gap-12 mt-20">
            <p className="flex items-center">
              <span className="mr-6">
                <PiPhoneCallFill size={24} />
              </span>
              +1012 3456 789
            </p>
            <p className="flex items-center">
              <span className="mr-6">
                <IoMailSharp size={24} />
              </span>
              demo@gmail.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:col-span-4 flex flex-col gap-3"
        >
          {/* First and Last Name */}
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                type="text"
                className="bg-card border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("fname")}
              />
              {errors.fname && (
                <p className="text-red text-xs mt-1">{errors.fname.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                type="text"
                className="bg-card border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("lname")}
              />
              {errors.lname && (
                <p className="text-red text-xs mt-1">{errors.lname.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              className="bg-card border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Select Subject */}
          <div>
            <Label>Select Subject?</Label>
            <RadioGroup
              className="mt-2 flex gap-8"
              onValueChange={(value) => {
                // Manually update the subject field in react-hook-form
                register("subject").onChange({
                  target: { value, name: "subject" },
                });
              }}
            >
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  id="general"
                  value="general"
                  className="bg-card"
                />
                <Label htmlFor="general" className="ml-2">
                  General Inquiry
                </Label>
              </div>
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  id="normal"
                  value="normal"
                  className="bg-card"
                />
                <Label htmlFor="normal" className="ml-2">
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  id="support"
                  value="support"
                  className="bg-card"
                />
                <Label htmlFor="support" className="ml-2">
                  Support
                </Label>
              </div>
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  id="feedback"
                  value="feedback"
                  className="bg-card"
                />
                <Label htmlFor="feedback" className="ml-2">
                  Feedback
                </Label>
              </div>
            </RadioGroup>
            {errors.subject && (
              <p className="text-red text-xs mt-1">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              className="bg-card border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            disabled={isSubmitting}
            type="submit"
            className="px-8 py-4 w-1/3 bg-orange500 hover:bg-orange600"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {showSuccessPopup && (
          <SuccessPopup
            message="Message sent successfully!"
            onConfirm={onConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default ContactForm;
