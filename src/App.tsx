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

function App() {
  return (
    <div>
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
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
