import React from "react";
import { TeamLogo } from "./TeamLogo";

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Partner */}
        <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
          <div className="mb-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/10aa9e1e059968d814c37ab21c635859122974ed"
              alt="Main partner"
              className="rounded-md max-h-[63px] mx-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <h3 className="text-xs font-bold text-dark-secondary uppercase tracking-wide">
            Main Partner
          </h3>
        </div>

        {/* Exclusive Title Partner */}
        <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
          <div className="mb-4">
            <div className="flex justify-center items-center space-x-2">
              <TeamLogo />
              <div className="text-left">
                <div className="font-saira-stencil text-base text-white">
                  STAKEWISE
                </div>
                <div className="text-xs font-bold text-secondary">TEAM</div>
              </div>
            </div>
          </div>
          <h3 className="text-xs font-bold text-dark-secondary uppercase tracking-wide">
            Exclusive Title Partner
          </h3>
        </div>

        {/* Compliance Partner */}
        <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
          <div className="mb-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e1a5a3a68e7c90b892c997d639e9ca1e14e85395"
              alt="Compliance partner"
              className="rounded-md max-h-[63px] mx-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <h3 className="text-xs font-bold text-dark-secondary uppercase tracking-wide">
            Compliance and Licensing Partner
          </h3>
        </div>

        {/* Official Betting Partner */}
        <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-6 text-center hover:border-secondary/40 transition-all duration-300 hover:shadow-lg">
          <div className="mb-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fb40b4ea0d8864cf0ad13cb794b0bc414569795c"
              alt="Betting partner"
              className="rounded-md max-h-[63px] mx-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <h3 className="text-xs font-bold text-dark-secondary uppercase tracking-wide">
            Official Betting Partner
          </h3>
        </div>
      </div>
    </section>
  );
};
