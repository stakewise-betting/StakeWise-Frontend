import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { backendUrl, setIsLoggedin, getUserData } = appContext;

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Handle login using email and password
  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let data;
      if (state === "Sign Up") {
        const response = await axios.post(
          `${backendUrl}/api/auth/register`,
          { name, email, password },
          { withCredentials: true }
        );
        data = response.data;
      } else {
        const response = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        data = response.data;
      }

      if (data?.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-white">
      <div className="w-full max-w-md shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)] rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-center">{state}</h1>
        
        {/* Google Login Button */}
        <div className="flex justify-center my-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
          />
        </div>

        <form className="mt-6" onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Full Name"
                  className="w-full p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Email"
                  className="w-full p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </>
          )}
          {state === "Log In" && (
            <div className="mb-4">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="w-full p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              className="w-full p-3 bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {state === "Log In" && (
            <div
              onClick={() => navigate("/reset-password")}
              className="text-blue-500 hover:underline text-right mb-4"
            >
              Forgot Password?
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-blue-500 text-white rounded-lg transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Processing..." : state}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => setState(state === "Sign Up" ? "Log In" : "Sign Up")}
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
