import logo from "@/assets/images/logo.png";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import { Mail, Users, Award, Shield } from "lucide-react";
import footer01 from "@/assets/images/footer01.png";
import footer02 from "@/assets/images/footer02.png";
import footer03 from "@/assets/images/footer03.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] text-white mt-20 border-t border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          {/* Brand and Navigation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={logo}
                    alt="StakeWise Logo"
                    className="h-12 w-12 drop-shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                </div>
                <h2 className="font-saira-stencil text-3xl font-bold text-white bg-gradient-to-r from-white via-secondary to-white bg-clip-text text-transparent">
                  STAKEWISE
                </h2>
              </div>
              <p className="text-dark-secondary text-center lg:text-left max-w-md leading-relaxed">
                The future of decentralized betting. Transparent, secure, and
                community-driven platform for all your prediction markets.
              </p>
              <div className="flex items-center space-x-2 text-sm text-secondary">
                <Shield className="h-4 w-4" />
                <span>Licensed & Regulated</span>
              </div>
            </div>

            {/* Markets Section */}
            <div className="text-center lg:text-left">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center justify-center lg:justify-start">
                <Award className="h-5 w-5 mr-2 text-secondary" />
                Markets
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="#"
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    Politics
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    Sports
                  </Link>
                </li>
                <li>
                  <Link
                    to="/upcoming"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    All Markets
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="text-center lg:text-left">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center justify-center lg:justify-start">
                <Users className="h-5 w-5 mr-2 text-secondary" />
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/contactus"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/results"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    Results
                  </Link>
                </li>
                <li>
                  <Link
                    to="/leaderboard"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
                  >
                    News
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community Section */}
            <div className="text-center lg:text-left">
              <h3 className="text-white font-bold text-lg mb-4">
                Join the Community
              </h3>
              <div className="flex justify-center lg:justify-start space-x-4 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors duration-300 group"
                >
                  <FaXTwitter
                    className="text-secondary group-hover:scale-110 transition-transform duration-300"
                    size={18}
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors duration-300 group"
                >
                  <FaInstagram
                    className="text-secondary group-hover:scale-110 transition-transform duration-300"
                    size={18}
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors duration-300 group"
                >
                  <FaYoutube
                    className="text-secondary group-hover:scale-110 transition-transform duration-300"
                    size={18}
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors duration-300 group"
                >
                  <FaDiscord
                    className="text-secondary group-hover:scale-110 transition-transform duration-300"
                    size={18}
                  />
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-dark-secondary">
                <Mail className="h-4 w-4" />
                <span>support@stakewise.com</span>
              </div>
            </div>
          </div>

          {/* Partnership Section */}
          <div className="border-t border-gray-700/30 pt-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-colors duration-300">
                <div className="mb-4">
                  <img
                    src={footer01}
                    alt="Main Partner"
                    className="h-12 mx-auto opacity-80"
                  />
                </div>
                <span className="text-xs font-semibold text-dark-secondary uppercase tracking-wide">
                  Main Partner
                </span>
              </div>
              <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-colors duration-300">
                <div className="mb-4">
                  <img
                    src={footer03}
                    alt="Title Partner"
                    className="h-12 mx-auto opacity-80"
                  />
                </div>
                <span className="text-xs font-semibold text-dark-secondary uppercase tracking-wide">
                  Exclusive Title Partner
                </span>
              </div>
              <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-colors duration-300">
                <div className="mb-4">
                  <img
                    src={footer01}
                    alt="Compliance Partner"
                    className="h-12 mx-auto opacity-80"
                  />
                </div>
                <span className="text-xs font-semibold text-dark-secondary uppercase tracking-wide">
                  Compliance Partner
                </span>
              </div>
              <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-colors duration-300">
                <div className="mb-4">
                  <img
                    src={footer02}
                    alt="Betting Partner"
                    className="h-12 mx-auto opacity-80"
                  />
                </div>
                <span className="text-xs font-semibold text-dark-secondary uppercase tracking-wide">
                  Official Betting Partner
                </span>
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div className="border-t border-gray-700/30 pt-8 mb-8">
            <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6">
              <div className="text-center space-y-4 text-sm text-dark-secondary leading-relaxed">
                <p>
                  <span className="text-secondary font-semibold">
                    StakeWise
                  </span>{" "}
                  is committed to promoting responsible betting. If you or
                  someone you know needs support, visit{" "}
                  <a
                    href="https://gamblingtherapy.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-secondary/80 underline transition-colors duration-300"
                  >
                    GamblingTherapy.org
                  </a>{" "}
                  for resources.
                </p>
                <p>
                  StakeWise is owned and operated by{" "}
                  <span className="text-white font-medium">
                    SecureChain Technologies Ltd.
                  </span>
                  , registration number: 2145789, with its registered address at
                  12 Innovation Street, TechCity, Gibraltar. Payment processing
                  services are managed by
                  <span className="text-white font-medium">
                    {" "}
                    SecurePay Solutions Ltd.
                  </span>
                  , located at 45 Commerce Road, Larnaca, Cyprus, registration
                  number: HE 508742.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <span className="bg-secondary/20 px-3 py-1 rounded-full text-secondary">
                    Bet responsibly
                  </span>
                  <span className="bg-secondary/20 px-3 py-1 rounded-full text-secondary">
                    18+ only
                  </span>
                  <span className="bg-secondary/20 px-3 py-1 rounded-full text-secondary">
                    T&Cs apply
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700/30 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-dark-secondary text-sm">
              © 2024 <span className="text-white font-medium">StakeWise</span>.
              All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link
                to="/privacy-policy"
                onClick={() => window.scrollTo(0, 0)}
                className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-use"
                onClick={() => window.scrollTo(0, 0)}
                className="text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
              >
                Terms of Service
              </Link>
              <button className="flex items-center space-x-2 text-dark-secondary hover:text-secondary transition-colors duration-300">
                <TbWorld className="h-4 w-4" />
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
