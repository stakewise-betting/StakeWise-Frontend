// login.tsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import MetaMaskLogin from "../../components/Metamask/MetaMaskLogin";
import GoogleLoginButton from "@/components/GoogleAuth/GoogleLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  LoginFormData,
  RegisterFormData,
} from "@/schema/authSchema";

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<"Sign Up" | "Log In">("Sign Up");

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { backendUrl, setIsLoggedin, getUserData } = appContext;

  // Initialize React Hook Form with Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(state === "Sign Up" ? registerSchema : loginSchema),
    mode: "onBlur",
  });

  // Toggle between login and signup
  const toggleAuthState = () => {
    setState(state === "Sign Up" ? "Log In" : "Sign Up");
    reset(); // Clear form fields when switching modes
  };

  // Handle form submission
  const onSubmit = async (data: RegisterFormData | LoginFormData) => {
    setIsSubmitting(true);

    try {
      let response;

      if (state === "Sign Up") {
        response = await axios.post(
          `${backendUrl}/api/auth/register`,
          data as RegisterFormData,
          { withCredentials: true }
        );
      } else {
        // For login, we only need email and password
        const { email, password } = data as LoginFormData;
        response = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
      }

      const responseData = response.data;

      if (responseData?.success) {
        toast.success(
          state === "Sign Up" ? "Registration successful!" : "Login successful!"
        );
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(responseData?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-gray-700/60 shadow-2xl backdrop-blur-sm rounded-2xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
            {state}
          </h1>
          <p className="text-slate-400 text-sm">
            {state === "Sign Up"
              ? "Create your account to get started"
              : "Welcome back! Please sign in to your account"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {state === "Sign Up" && (
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full p-3 bg-gray-800/40 border rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  errors.username
                    ? "border-red-500/50 focus:ring-red-400/50"
                    : "border-gray-600/50 focus:ring-secondary/50 hover:border-gray-500/60"
                }`}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.username.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 bg-gray-800/40 border rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                errors.email
                  ? "border-red-500/50 focus:ring-red-400/50"
                  : "border-gray-600/50 focus:ring-secondary/50 hover:border-gray-500/60"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 bg-gray-800/40 border rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                errors.password
                  ? "border-red-500/50 focus:ring-red-400/50"
                  : "border-gray-600/50 focus:ring-secondary/50 hover:border-gray-500/60"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.password.message}
              </p>
            )}
          </div>

          {state === "Log In" && (
            <div
              onClick={() => navigate("/reset-password")}
              className="text-secondary hover:text-secondary/80 text-right text-sm cursor-pointer transition-colors duration-300 hover:underline"
            >
              Forgot Password?
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isSubmitting ? "Processing..." : state}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 text-slate-400 bg-gradient-to-r from-[#1C1C27] to-[#252538] rounded-lg text-xs">
              OR
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton />

        {/* MetaMask Login Button */}
        <MetaMaskLogin />

        <div className="text-center mt-6 pt-4 border-t border-gray-700/30">
          <p className="text-slate-400 text-sm">
            {state === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              onClick={toggleAuthState}
              className="text-secondary hover:text-secondary/80 cursor-pointer hover:underline font-medium transition-colors duration-300"
            >
              {state === "Sign Up" ? "Log In" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
