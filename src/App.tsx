import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Upcoming from "./pages/Upcoming/Upcoming";
import Results from "./pages/Results/Results";
import Politics from "./pages/Politics/Politics";
import Sports from "./pages/Sports/Sports";
import Footer from "./components/Footer/Footer";
import ContactUs from "./pages/ContactUs/ContactUs";

function App() {
  return (
    <div>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/politics" element={<Politics />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/results" element={<Results />} />
          <Route path="/contactus" element={<ContactUs />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
