import React from "react";
import { TeamLogo } from "./TeamLogo";

export const PartnersSection: React.FC = () => {
  return (
    <section className="flex justify-between items-start px-0 py-10 max-md:flex-wrap max-md:gap-10 max-md:justify-center max-sm:flex-col max-sm:items-center">
      <div className="flex flex-col gap-5 items-center max-md:w-[45%] max-sm:w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/10aa9e1e059968d814c37ab21c635859122974ed"
          alt="Main partner"
          className="rounded-md max-h-[63px]"
        />
        <h3 className="text-xs font-bold text-center">MAIN PARTNER</h3>
      </div>
      <div className="flex flex-col gap-5 items-center mt-5 max-md:w-[45%] max-sm:mt-3.5 max-sm:w-full">
        <div className="flex gap-1.5 items-center">
          <TeamLogo />
          <div className="flex flex-col">
            <div className="font-saira-stencil text-base">STAKEWISE</div>
            <div className="text-xs font-bold">TEAM</div>
          </div>
        </div>
        <h3 className="text-xs font-bold text-center">
          EXCLUSIVE TITLE PARTNER
        </h3>
      </div>
      <div className="flex flex-col gap-2.5 items-center mt-1 max-md:w-[45%] max-sm:w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e1a5a3a68e7c90b892c997d639e9ca1e14e85395"
          alt="Compliance partner"
          className="rounded-md max-h-[63px]"
        />
        <h3 className="text-xs font-bold text-center">
          COMPLIANCE AND LICENSING PARTNER
        </h3>
      </div>
      <div className="flex flex-col gap-5 items-center pl-3 max-md:w-[45%] max-sm:w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fb40b4ea0d8864cf0ad13cb794b0bc414569795c"
          alt="Betting partner"
          className="rounded-md max-h-[63px]"
        />
        <h3 className="text-xs font-bold text-center">
          OFFICIAL BETTING PARTNER
        </h3>
      </div>
    </section>
  );
};
