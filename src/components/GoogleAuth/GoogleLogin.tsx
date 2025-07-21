import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";

interface GoogleUser {
  sub: string;
  email: string;
  fname: string;
  lname: string;
  username: string;
  picture: string;
}

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { backendUrl, setIsLoggedin, getUserData } = appContext;

  // Handle Google Login Response
  const handleGoogleLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsSubmitting(true);

      try {
        const token = credentialResponse.credential;
        const decodedUser: any = jwtDecode(token);

        // Extract user details safely
        const fullName = decodedUser.name || "";
        const nameParts = fullName.split(" ");
        const fname = nameParts[0] || "Unknown";
        const lname = nameParts.slice(1).join(" ") || "User";

        const user: GoogleUser = {
          sub: decodedUser.sub,
          email: decodedUser.email,
          fname,
          lname,
          username: decodedUser.email.split("@")[0], // Generate username from email
          picture: decodedUser.picture,
        };

        console.log("Google User:", user);

        // Send Google token & user data to backend
        const response = await axios.post(
          `${backendUrl}/api/auth/google-login`,
          { token, user },
          { withCredentials: true }
        );

        if (response.data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(response.data.message || "Google login failed");
        }
      } catch (error: any) {
        console.error("Google login error:", error.response);
        toast.error(error.response?.data?.message || "Google login failed");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full mb-2 relative">
      {isSubmitting ? (
        <div className="w-full flex items-center justify-center py-3 px-5 bg-gray-800/40 border border-gray-600/50 rounded-xl text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
            <span className="text-sm">Connecting with Google...</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Custom styled overlay */}
          <div className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-gray-800/40 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/60 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-sm pointer-events-none absolute inset-0 z-10">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </div>

          {/* Actual Google button with custom styling */}
          <div className="relative z-0 opacity-0 hover:opacity-100">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google login failed")}
              theme="filled_blue"
              size="large"
              width="100%"
            />
          </div>

          {/* CSS to style the Google button */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .w-full [data-testid="google-login-button"] {
                width: 100% !important;
                height: 48px !important;
                border-radius: 0.75rem !important;
                border: none !important;
                box-shadow: none !important;
                background: transparent !important;
              }
              .w-full iframe {
                width: 100% !important;
                height: 48px !important;
                border-radius: 0.75rem !important;
              }
            `,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
