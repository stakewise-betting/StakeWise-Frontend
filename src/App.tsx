import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Upcoming from "./pages/Upcoming/Upcoming";
import Results from "./pages/Results/Results";
import Politics from "./pages/Politics/Politics";
import Sports from "./pages/Sports/Sports";
import Footer from "./components/Footer/Footer";
import ContactUs from "./pages/ContactUs/ContactUs";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/HomePage/home";
import AdminPanel from "./Admin/AdminPanel";
import BetDetails from "./pages/BetDetails/BetDetails";
import DepositPage from "./pages/DepositPage/Deposit";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/userAuth/Login";
import ResetPassword from "./pages/userAuth/ResetPassword";
import EmailVerify from "./pages/userAuth/EmailVerify";


function App() {

  return (
    <div>
      <ToastContainer />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />{" "}
          {/* kalin thibbe login kiyala */}
          <Route path="/admin" element={<AdminPanel />} />
          {/* <Route path="/bet/:id" element={<BetDetails />} /> */}
          <Route
            path="/bet/:eventId"
            element={
              <BetDetails onCancel={() => console.log("Bet canceled")} />
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/politics" element={<Politics />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/results" element={<Results />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-verify" element={<EmailVerify />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
