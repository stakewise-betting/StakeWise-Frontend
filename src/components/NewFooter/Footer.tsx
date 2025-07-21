"use client";
import React from "react";
import { FooterHeader } from "./FooterHeader";
import { PartnersSection } from "./PartnersSection";
import { LegalSection } from "./LegalSection";
import { FooterBottom } from "./FooterBottom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0F0F15] via-[#1C1C27] to-[#0F0F15] text-white border-t border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent my-8"></div>
        <FooterHeader />
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent my-8"></div>
        <PartnersSection />
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent my-8"></div>
        <LegalSection />
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
