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
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full border-none max-w-md mx-auto shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-2xl p-6">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 rounded-full bg-white">
              <Mail className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-2xl text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code sent to your email
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={onSubmitHandler}>
          <CardContent>
            <div
              className="flex justify-center gap-2 my-6 text-black"
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
                    className="w-12 h-12 text-center text-lg font-medium"
                    aria-label={`Digit ${i + 1} of verification code`}
                  />
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={verificationCode.join("").length !== 6}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify Email
            </Button>
            <Button
              variant="link"
              type="button"
              className="text-sm text-white"
              // onClick={handleResendOtp}
            >
              Didn't receive a code?{" "}
              <ArrowRight className="ml-1 h-3 w-3 inline" /> Resend
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
