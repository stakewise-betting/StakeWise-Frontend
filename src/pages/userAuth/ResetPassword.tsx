import { useNavigate } from "react-router-dom";
import { useRef, useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResetPassword = () => {
  const appContext = useContext(AppContext);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  if (!appContext) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { backendUrl } = appContext;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: any, i: any) => {
    if (e.target.value.length > 0 && i < inputRefs.current.length - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, i: any) => {
    if (e.key === "Backspace" && i > 0 && e.target.value.length === 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: any) => {
    const paste = e.clipboardData.getData("Text").split("");
    paste.forEach((char: any, i: any) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });
  };

  const onSubmitEmail = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/sendResetOtp`,
        { email },
        { withCredentials: true }
      );
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send Reset OTP");
    } finally {
      setIsSubmitting(false); // Re-enable button after request
    }
  };

  const onSubmitOtp = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Directly get OTP from input refs instead of state
    const otpArray = inputRefs.current.map((input) => input?.value || "");
    const currentOtp = otpArray.join("");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verifyResetOtp`,
        { email, otp: currentOtp },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      setIsOtpSubmitted(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsSubmitting(false); // Re-enable button after request
    }
  };

  const onSubmitNewPassword = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/resetPassword`,
        { email, newPassword },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false); // Re-enable button after request
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="bg-[#1C1C27] border-none w-full max-w-md shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isEmailSent ? (
            <form onSubmit={onSubmitEmail} className="space-y-4">
              <input
                className="w-full border-none p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 bg-blue-500 text-white rounded-lg transition ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : !isOtpSubmitted ? (
            <form onSubmit={onSubmitOtp} className="space-y-4">
              <div
                className="flex justify-center space-x-2 text-black"
                onPaste={handlePaste}
              >
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      onInput={(e) => handleInput(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      type="text"
                      maxLength={1}
                      className="w-10 h-10 text-center text-lg font-semibold border rounded-md"
                    />
                  ))}
              </div>
              <Button
                type="submit"
                className={`w-full py-3 bg-blue-500 text-white rounded-lg transition ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={onSubmitNewPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border-none p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 bg-blue-500 text-white rounded-lg transition ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
