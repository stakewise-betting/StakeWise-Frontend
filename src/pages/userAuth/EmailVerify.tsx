import { useRef, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { userData, backendUrl, isLoggedin, getUserData } = appContext;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Create a ref to store the input elements
  const navigate = useNavigate();

  const handleInput = (e: any, i: any) => {
    if (e.target.value.length > 0 && i < inputRefs.current.length - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  }; // add otp by focusing on the next input field

  const handleKetDown = (e: any, i: any) => {
    if (e.key === "Backspace" && i > 0 && e.target.value.length === 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }; // remove otp by focusing on the previous input field

  const handlePaste = (e: any) => {
    const paste = e.clipboardData.getData("Text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char: any, i: any) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });
  }; // paste otp by filling the input fields

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((e) => e?.value || "");
      const otp = otpArray.join("");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verifyEmail`,
        { otp },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify email");
    }
  }; // verify email by sending the otp to the server

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]); // Redirect to home if the user is already logged in and verified

  return (
    <div>
      <h1>EmailVerify</h1>
      <div>
        <form
          className="bg-slate-900 w-96 p-8 "
          onSubmit={onSubmitHandler}
          action=""
        >
          <div className="flex justify-center m-4" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  key={i}
                  ref={(e) => (inputRefs.current[i] = e)}
                  onInput={(e) => handleInput(e, i)}
                  onKeyDown={(e) => handleKetDown(e, i)}
                  type="text"
                  maxLength={1}
                  className="w-8 h-8 mx-1 text-center"
                />
              ))}
          </div>
          <button
            className="w-full py-3 rounded bg-black text-white"
            type="submit"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
