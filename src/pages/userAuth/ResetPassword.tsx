import { useNavigate } from "react-router-dom";
import { useRef, useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Shield, Lock } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-gray-700/60 shadow-2xl backdrop-blur-sm rounded-2xl p-6">
        <CardHeader className="text-center space-y-4">
          <div className="relative mx-auto">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 shadow-lg w-fit">
              {!isEmailSent ? (
                <Mail className="h-8 w-8 text-secondary" />
              ) : !isOtpSubmitted ? (
                <Shield className="h-8 w-8 text-secondary" />
              ) : (
                <Lock className="h-8 w-8 text-secondary" />
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {!isEmailSent
                ? "Reset Password"
                : !isOtpSubmitted
                ? "Verify Code"
                : "New Password"}
            </CardTitle>
            <p className="text-slate-400 leading-relaxed">
              {!isEmailSent
                ? "Enter your email to receive a reset code"
                : !isOtpSubmitted
                ? "Enter the 6-digit code sent to your email"
                : "Create your new secure password"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          {!isEmailSent ? (
            <form onSubmit={onSubmitEmail} className="space-y-6">
              <input
                className="w-full p-4 bg-gray-800/40 border border-gray-600/50 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent hover:border-gray-500/60 transition-all duration-300"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? "Sending OTP..." : "Send Reset Code"}
              </Button>
            </form>
          ) : !isOtpSubmitted ? (
            <form onSubmit={onSubmitOtp} className="space-y-6">
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
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
                      className="w-14 h-14 text-center text-xl font-bold bg-gray-800/40 border border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary/50 focus:border-secondary/70 transition-all duration-300 hover:border-gray-500/60 hover:bg-gray-800/60"
                    />
                  ))}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={onSubmitNewPassword} className="space-y-6">
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-4 bg-gray-800/40 border border-gray-600/50 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent hover:border-gray-500/60 transition-all duration-300"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? "Updating Password..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
