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
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "@/schema/authSchema";

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
        toast.success(state === "Sign Up" ? "Registration successful!" : "Login successful!");
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
    <div className="flex items-center justify-center min-h-screen p-4 text-white">
      <div className="w-full max-w-md shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-center">{state}</h1>

        {/* Google Login Button */}
        <GoogleLoginButton />

        {/* MetaMask Login Button */}
        <MetaMaskLogin />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 text-gray-400 bg-[#1c1c27]">OR</span>
          </div>
        </div>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          {state === "Sign Up" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          {state === "Log In" && (
            <div
              onClick={() => navigate("/reset-password")}
              className="text-blue-500 hover:underline text-right mb-4 cursor-pointer"
            >
              Forgot Password?
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-blue-500 text-white rounded-lg transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Processing..." : state}
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={toggleAuthState}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {state === "Sign Up" ? "Log In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;