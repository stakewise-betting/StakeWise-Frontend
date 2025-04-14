"use client";
import React from "react";
import { FooterHeader } from "./FooterHeader";
import { PartnersSection } from "./PartnersSection";
import { LegalSection } from "./LegalSection";
import { FooterBottom } from "./FooterBottom";

export const Footer: React.FC = () => {
  return (
    <footer className="px-10 py-8 text-white bg-[#1C1C27]">
      <hr className="mx-0 my-5 h-px bg-slate-400" />
      <FooterHeader />
      <hr className="mx-0 my-5 h-px bg-slate-400" />
      <PartnersSection />
      <hr className="mx-0 my-5 h-px bg-slate-400" />
      <LegalSection />
      <FooterBottom />
    </footer>
  );
};

export default Footer;