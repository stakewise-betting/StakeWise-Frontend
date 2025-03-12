import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleAuthProps {
  onLogin: (user: GoogleUser, token: string) => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onLogin }) => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          const token = credentialResponse.credential;
          const user: GoogleUser = jwtDecode<GoogleUser>(token);
          
          console.log("Google User:", user);
          onLogin(user, token);
        }
      }}
      onError={() => {
        console.error("Login Failed");
      }}
    />
  );
};

export default GoogleAuth;
