import React from "react";
import { Link } from "react-router-dom";
// import { StakewiseLogo } from "./StakewiseLogo";
import { SocialIcons } from "./SocialIcons";
import TeamLogo from '../../assets/team-logo.svg';

export const FooterHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-start pb-8 max-sm:flex-col max-sm:gap-8">
      <div className="flex gap-2.5 items-center">
        <img
        src={TeamLogo}
        alt="Team Logo"
        className="logo-icon w-[51px] h-[42px]"
        />
        <h1 className="font-saira-stencil text-3xl text-white">STAKEWISE</h1>
      </div>
      <nav className="flex gap-24 max-md:gap-12 max-sm:flex-col max-sm:gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="mb-2.5 text-base font-bold">Market</h2>
          <a href="#" className="text-base text-white cursor-pointer">
            Politics
          </a>
          <a href="#" className="text-base text-white cursor-pointer">
            Sports
          </a>
          <a href="#" className="text-base text-white cursor-pointer">
            Upcoming Events
          </a>
          <a href="#" className="text-base text-white cursor-pointer">
            All
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="mb-2.5 text-base font-bold">Resources</h2>
          <Link to="/contactus" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer">
            Contact Us
          </Link>
          <Link to="/results" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer">
            Results
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="mb-2.5 text-base font-bold">Join the community</h2>
          <SocialIcons />
        </div>
      </nav>
    </div>
  );
};