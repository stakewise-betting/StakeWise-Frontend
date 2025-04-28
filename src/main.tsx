import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.tsx";
import { WatchlistProvider } from '@/context/WatchlistContext'; // The WatchlistProvider


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Store Client ID in .env file

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AppContextProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </AppContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
