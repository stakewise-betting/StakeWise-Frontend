import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
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

function Layout() {
  const location = useLocation();
  const hideFooterRoutes = ["/login", "/reset-password", "/email-verify"];

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/bet/:eventId"
          element={<BetDetails onCancel={() => console.log("Bet canceled")} />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/politics" element={<Politics />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/news" element={<News />} />
      </Routes>

      {/* Hide footer on specific routes */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
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
