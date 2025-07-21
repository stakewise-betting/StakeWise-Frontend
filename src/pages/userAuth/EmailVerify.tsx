import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ShieldCheck, ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export default function EmailVerify() {
  const { userData, backendUrl, getUserData, isLoggedin } =
    useContext(AppContext)!;
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode);

      // Auto-focus next input after entering a digit
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Navigate backward on backspace if current field is empty
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Navigate with arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only process if we have a reasonable verification code
    if (pastedData.length >= 6) {
      const digits = pastedData.slice(0, 6).split("");
      setVerificationCode(digits);

      // Focus the last input after pasting
      inputRefs.current[5]?.focus();
    }
  };

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e?.value || "");
      const otp = otpArray.join("");

      if (otp.length !== 6) {
        toast.error("Please enter a 6-digit code");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verifyEmail`,
        { otp },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/profile");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify email");
    }
  }; // verify email by sending the otp to the server

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]); // Redirect to home if the user is already logged in and verified

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] flex items-center justify-center p-4">
      <Card className="w-full border-none max-w-md mx-auto bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-gray-700/60 shadow-2xl backdrop-blur-sm rounded-2xl p-6">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 shadow-lg">
                <Mail className="h-8 w-8 text-secondary" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-slate-400 leading-relaxed">
                Enter the 6-digit code sent to your email address
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={onSubmitHandler}>
          <CardContent className="px-6">
            <div
              className="flex justify-center gap-3 my-8"
              onPaste={handlePaste}
            >
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    value={verificationCode[i]}
                    onChange={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-14 h-14 text-center text-xl font-bold bg-gray-800/40 border border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary/70 transition-all duration-300 hover:border-gray-500/60 hover:bg-gray-800/60"
                    aria-label={`Digit ${i + 1} of verification code`}
                  />
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              disabled={verificationCode.join("").length !== 6}
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Verify Email
            </Button>
            <Button
              variant="ghost"
              type="button"
              className="text-sm text-slate-400 hover:text-white bg-gray-800/20 hover:bg-gray-700/40 border border-gray-600/30 hover:border-gray-500/50 rounded-xl py-2 transition-all duration-300"
              // onClick={handleResendOtp}
            >
              Didn't receive a code?{" "}
              <ArrowRight className="ml-2 h-4 w-4 inline transition-transform group-hover:translate-x-1" />
              Resend
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
