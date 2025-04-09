import React from "react";
import { Globe } from "lucide-react";
import { SocialIcons } from "./SocialIcons";
import { Link } from "react-router-dom";

export const FooterBottom: React.FC = () => {
  return (
    <div className="flex justify-between items-center pt-5 max-sm:flex-col max-sm:gap-5 max-sm:items-center max-sm:text-center">
      <p className="text-base">Stakewise @ 2024. All rights reserved.</p>
      <div className="flex gap-5 max-sm:flex-col max-sm:items-center">
        <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer">
        Privacy Policy
        </Link>
        <Link to="/terms-of-use" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer">
        Terms of Use
        </Link>
        
        <button className="flex items-center gap-1 box-border relative shrink-0 ml-5 h-auto">
          <Globe className="w-5 h-5 text-gray-500" />EN</button>
      </div>
    </div>
  );
};
