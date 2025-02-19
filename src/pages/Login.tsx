import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Fix incorrect import
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // function handleLogout(){
  // googleLogout();
  // navigate("/home");
  // }

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          navigate("/home");
          console.log(credentialResponse);
          if (credentialResponse.credential) {
            console.log(jwtDecode(credentialResponse.credential));
          } else {
            console.log("Credential is undefined");
          }
        }}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
};

export default Login;
