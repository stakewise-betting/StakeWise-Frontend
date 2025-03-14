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
  name: string;
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
      const token = credentialResponse.credential;
      const user: GoogleUser = jwtDecode<GoogleUser>(token);

      console.log("Google User:", user);

      try {
        // Send Google token to backend for verification
        const response = await axios.post(
          `${backendUrl}/api/auth/google-login`,
          { token },
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
    <div className="flex justify-center my-4">
      {isSubmitting ? (
        <div>Connecting...</div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error("Google login failed")}
          theme="filled_blue" // or "outline"
          size="large" // or "medium"
          shape="rectangular" // or "circle"
          logo_alignment="left"
          text="continue_with" // or "signin_with"
          width="300px" // custom width
        />
      )}
    </div>
  );
};

export default GoogleLoginButton;
