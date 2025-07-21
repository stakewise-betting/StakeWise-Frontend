import React from "react";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

export const FooterBottom: React.FC = () => {
  return (
    <div className="border-t border-gray-700/30 pt-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Copyright */}
        <p className="text-dark-secondary text-sm">
          © 2025 <span className="text-white font-medium">StakeWise</span>. All
          rights reserved.
        </p>

        {/* Links and Language Selector */}
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
            Terms of Use
          </Link>

          {/* Language Selector */}
          <button className="flex items-center space-x-2 text-dark-secondary hover:text-secondary transition-colors duration-300 bg-[#1C1C27] border border-gray-700/60 px-3 py-2 rounded-lg hover:border-secondary/40">
            <Globe className="w-4 h-4" />
            <span className="font-medium">EN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
