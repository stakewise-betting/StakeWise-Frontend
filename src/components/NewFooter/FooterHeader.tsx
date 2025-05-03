import React from "react";
import { Link } from "react-router-dom";
// import { StakewiseLogo } from "./StakewiseLogo";
import { SocialIcons } from "./SocialIcons";
import TeamLogo from "../../assets/team-logo.svg";

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
          <Link to="/politics" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            Politics
          </Link>
          <Link to="/sports" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            Sports
          </Link>
          <Link to="/upcoming" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            Upcoming Events
          </Link>
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            All
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="mb-2.5 text-base font-bold">Resources</h2>
          <Link
            to="/reward" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            Rewards
          </Link>
          <Link to="/results" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            Results
          </Link>
          <Link to="/news" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            News
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="mb-2.5 text-base font-bold">Company</h2>
          <Link to="/#" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            About STAKEWISE
          </Link>
          <Link to="/contactus" onClick={() => window.scrollTo(0, 0)} className="text-base text-white cursor-pointer hover:underline">
            Contact Us
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
