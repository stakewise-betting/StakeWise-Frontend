import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/NewFooter/Footer";
import Upcoming from "./pages/Upcoming/Upcoming";
import Results from "./pages/Results/Results";
import Politics from "./pages/Politics/Politics";
import Sports from "./pages/Sports/Sports";
import ContactUs from "./pages/ContactUs/ContactUs";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/HomePage/home";
import AdminPanel from "./Admin/AdminPanel";
import BetDetails from "./pages/BetDetails/BetDetails";
import DepositPage from "./pages/DepositPage/Deposit";
import Profile from "./pages/Profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/userAuth/Login";
import ResetPassword from "./pages/userAuth/ResetPassword";
import EmailVerify from "./pages/userAuth/EmailVerify";
import News from "./pages/News/News";
import Reward from "./pages/Reward/Reward";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse/TermsOfUse";
import WatchList from "./pages/WatchList/WatchList";
import SelfAssessmentPage from "./pages/SelfAssessment/SelfAssessmentPage";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import RoleRoute from "./components/RouteGuard/RoleRoute";
import NotFound from "./pages/NotFound/NotFound";

function Layout() {
  const location = useLocation();
  const hideFooterRoutes = [
    "/login",
    "/reset-password",
    "/email-verify",
    "/unauthorized",
    "/admin",
  ];

  // Define all valid routes
  const validRoutes = [
    "/",
    "/upcoming",
    "/results",
    "/politics",
    "/sports",
    "/news",
    "/contactus",
    "/reward",
    "/privacy-policy",
    "/terms-of-use",
    "/login",
    "/reset-password",
    "/email-verify",
    "/unauthorized",
    "/dashboard",
    "/profile",
    "/deposit",
    "/self-assessment",
    "/watchlist",
    "/admin",
  ];

  // Check if current path matches any valid route (ignoring dynamic routes)
  const isValidRoute =
    validRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/bet/");

  // Hide footer if path is in hideFooterRoutes OR if it's not a valid route (404)
  const shouldHideFooter =
    hideFooterRoutes.includes(location.pathname) || !isValidRoute;
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/results" element={<Results />} />
        <Route path="/politics" element={<Politics />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/news" element={<News />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verify" element={<EmailVerify />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Authenticated: user + admin */}
        <Route element={<RoleRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/bet/:eventId"
            element={
              <BetDetails onCancel={() => console.log("Bet canceled")} />
            }
          />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/self-assessment" element={<SelfAssessmentPage />} />
          <Route path="/watchlist" element={<WatchList />} />
        </Route>

        {/* Admin only */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
