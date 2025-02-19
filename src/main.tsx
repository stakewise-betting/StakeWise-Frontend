import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const clientId =
  "647631632534-rad76diikcn50k9tc347l1l3a4bn7sko.apps.googleusercontent.com";

createRoot(document.getElementById("root") as HTMLElement).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
  // </StrictMode>
);
