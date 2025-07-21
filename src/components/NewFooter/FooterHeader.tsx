import React from "react";
import { Link } from "react-router-dom";
import { Award, Users, Building, MessageCircle } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import TeamLogo from "../../assets/team-logo.svg";

export const FooterHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-start py-8 max-lg:flex-col max-lg:gap-12">
      {/* Brand Section */}
      <div className="flex flex-col items-center lg:items-start space-y-6 max-w-md">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={TeamLogo}
              alt="StakeWise Logo"
              className="logo-icon w-12 h-10 drop-shadow-lg"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
          </div>
          <h1 className="font-saira-stencil text-3xl font-bold text-white bg-gradient-to-r from-white via-secondary to-white bg-clip-text text-transparent">
            STAKEWISE
          </h1>
        </div>
        <p className="text-dark-secondary text-center lg:text-left leading-relaxed">
          The future of decentralized betting. Transparent, secure, and
          community-driven platform.
        </p>
      </div>

      {/* Navigation Sections */}
      <nav className="flex gap-16 lg:gap-20 max-md:gap-12 max-sm:flex-col max-sm:gap-8 max-sm:text-center">
        {/* Markets Section */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center justify-center sm:justify-start">
            <Award className="h-5 w-5 mr-2 text-secondary" />
            Markets
          </h2>
          <div className="space-y-3">
            <Link
              to="/politics"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Politics
            </Link>
            <Link
              to="/sports"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Sports
            </Link>
            <Link
              to="/upcoming"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Upcoming Events
            </Link>
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              All Markets
            </Link>
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center justify-center sm:justify-start">
            <Users className="h-5 w-5 mr-2 text-secondary" />
            Resources
          </h2>
          <div className="space-y-3">
            <Link
              to="/reward"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Rewards
            </Link>
            <Link
              to="/results"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Results
            </Link>
            <Link
              to="/news"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              News
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Leaderboard
            </Link>
          </div>
        </div>

        {/* Company Section */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center justify-center sm:justify-start">
            <Building className="h-5 w-5 mr-2 text-secondary" />
            Company
          </h2>
          <div className="space-y-3">
            <Link
              to="/#"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              About Us
            </Link>
            <Link
              to="/contactus"
              onClick={() => window.scrollTo(0, 0)}
              className="block text-dark-secondary hover:text-secondary transition-colors duration-300 hover:underline"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Community Section */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center justify-center sm:justify-start">
            <MessageCircle className="h-5 w-5 mr-2 text-secondary" />
            Community
          </h2>
          <SocialIcons />
        </div>
      </nav>
    </div>
  );
};
