import React from "react";

export const LegalSection: React.FC = () => {
  return (
    <section className="py-8">
      <div className="bg-[#1C1C27] border border-gray-700/60 rounded-xl p-8">
        <div className="text-center space-y-6 max-w-6xl mx-auto">
          {/* Responsible Betting Notice */}
          <p className="text-dark-secondary leading-relaxed">
            <span className="text-secondary font-semibold">StakeWise</span> is
            committed to promoting responsible betting. If you or someone you
            know needs support, visit{" "}
            <a
              href="https://gamblingtherapy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 underline transition-colors duration-300"
            >
              GamblingTherapy.org
            </a>{" "}
            for resources.
          </p>

          {/* Company Information */}
          <p className="text-dark-secondary leading-relaxed text-sm">
            StakeWise is owned and operated by{" "}
            <span className="text-white font-medium">
              SecureChain Technologies Ltd.
            </span>
            , registration number: 2145789, with its registered address at 12
            Innovation Street, TechCity, Gibraltar. For inquiries, contact us at
            support@stakewise.com. Payment processing services are managed by{" "}
            <span className="text-white font-medium">
              SecurePay Solutions Ltd.
            </span>
            , located at 45 Commerce Road, Larnaca, Cyprus, registration number:
            HE 508742.
          </p>

          {/* Responsibility Badges */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span className="bg-secondary/20 px-4 py-2 rounded-full text-secondary font-medium">
              Bet responsibly
            </span>
            <span className="bg-secondary/20 px-4 py-2 rounded-full text-secondary font-medium">
              18+ only
            </span>
            <span className="bg-secondary/20 px-4 py-2 rounded-full text-secondary font-medium">
              T&Cs apply
            </span>
          </div>

          {/* Contact Information */}
          <div className="pt-4 border-t border-gray-700/30">
            <p className="text-dark-secondary text-sm">
              <span className="text-secondary font-medium">Support:</span>{" "}
              support@stakewise.com |{" "}
              <span className="text-secondary font-medium">Partners:</span>{" "}
              partners@stakewise.com |{" "}
              <span className="text-secondary font-medium">Press:</span>{" "}
              press@stakewise.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
