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
    <div className="flex justify-center my-4">
      {isSubmitting ? (
        <div>Connecting...</div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error("Google login failed")}
        />
      )}
    </div>
  );
};

export default GoogleLoginButton;
