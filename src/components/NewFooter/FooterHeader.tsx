import React from "react";
import { Link } from "react-router-dom";
import { Award, Users, Building, MessageCircle } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import TeamLogo from "../../assets/team-logo.svg";

export const FooterHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-start py-6 sm:py-8 flex-col lg:flex-row gap-8 sm:gap-12">
      {/* Brand Section */}
      <div className="flex flex-col items-center lg:items-start space-y-4 sm:space-y-6 max-w-md w-full lg:w-auto">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={TeamLogo}
              alt="StakeWise Logo"
              className="logo-icon w-10 h-8 sm:w-12 sm:h-10 drop-shadow-lg"
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-secondary rounded-full animate-pulse"></div>
          </div>
          <h1 className="font-saira-stencil text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-white via-secondary to-white bg-clip-text text-transparent">
            STAKEWISE
          </h1>
        </div>
        <p className="text-dark-secondary text-center lg:text-left leading-relaxed text-sm sm:text-base px-4 sm:px-0">
          The future of decentralized betting. Transparent, secure, and
          community-driven platform.
        </p>
      </div>

      {/* Navigation Sections */}
      <nav className="w-full lg:w-auto">
        {/* Mobile: 2x2 Grid, Tablet: 4 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:gap-12 xl:gap-16 gap-6 sm:gap-8 text-center sm:text-left">
          {/* Markets Section */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-secondary flex-shrink-0" />
              <span className="text-sm sm:text-base">Markets</span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <Link
                to="/politics"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                Politics
              </Link>
              <Link
                to="/sports"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                Sports
              </Link>
              <Link
                to="/upcoming"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                Upcoming Events
              </Link>
              <Link
                to="/"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                All Markets
              </Link>
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-secondary flex-shrink-0" />
              <span className="text-sm sm:text-base">Resources</span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <Link
                to="/reward"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                Rewards
              </Link>
              <Link
                to="/results"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                Results
              </Link>
              <Link
                to="/news"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                News
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Company Section */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-secondary flex-shrink-0" />
              <span className="text-sm sm:text-base">Company</span>
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <Link
                to="/#"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                About Us
              </Link>
              <Link
                to="/contactus"
                onClick={() => window.scrollTo(0, 0)}
                className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline text-xs sm:text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-secondary flex-shrink-0" />
              <span className="text-sm sm:text-base">Community</span>
            </h2>
            <div className="flex justify-center sm:justify-start">
              <SocialIcons />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
