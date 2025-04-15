import * as React from "react";
import { PrivacyHeader } from "@/components/Privacy/PrivacyHeader";
import { PolicySection } from "@/components/Privacy/PolicySection";
import { PolicyList } from "@/components/Privacy/PolicyList";

export default function PrivacyPolicy() {
  return (
    <main className="w-full bg-[#1C1C27] min-h-screen">
      <PrivacyHeader />
      <article className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 2xl:px-80 py-8 md:py-12 text-base text-white">
        <PolicySection
          title="Introduction"
          content="Welcome to StakeWise! This Privacy Policy explains how we collect, use, and protect your information when you use our decentralized betting platform. Your privacy and data security are our top priorities. By using StakeWise, you agree to this Privacy Policy and our Terms of Use. If you do not agree, please refrain from using our platform."
        />

        <PolicySection
          title="Information We Collect"
          content="We collect the following categories of information:"
        >
          <PolicyList
            items={[
              "Personal Information: Name, email address, and country (if voluntarily provided).",
              "Financial Information: Cryptocurrency wallet addresses for transactions (via MetaMask or similar integrations). Transaction data (amounts, timestamps, and outcomes) recorded on the Ethereum blockchain.",
              "Technical Information: IP addresses, device information, browser type, and operating system for system integrity and fraud prevention.",
              "Usage Data: Interaction with the platform, including bets placed, wins, and losses, collected anonymously for analysis and improvements.",
            ]}
          />
        </PolicySection>

        <PolicySection
          title="How We Use Your Information"
          content="We use the information we collect for the following purposes:"
        >
          <PolicyList
            items={[
              "Ensuring secure and transparent betting processes via smart contracts.",
              "Verifying user identity and age to comply with regulatory requirements.",
              "Preventing fraud, hacking, or unauthorized access.",
              "Enhancing the user experience through analytics and feature improvements.",
              "Complying with legal obligations, such as licensing and responsible gambling practices.",
            ]}
          />
        </PolicySection>

        <PolicySection
          title="Sharing Your Information"
          content="We share your information only under these circumstances:"
        >
          <PolicyList
            items={[
              "With Regulatory Authorities: To comply with gambling laws and licensing requirements.",
              "For Security: With auditors or security firms to ensure platform integrity and transparency.",
              "Public Blockchain: Transaction details may be visible on the Ethereum blockchain.",
              "With Consent: If you opt to link your account with external services or share information explicitly.",
            ]}
          />
        </PolicySection>

        <PolicySection
          title="Data Security"
          content="We implement robust measures, including data encryption, smart contract audits, and secure hosting, to safeguard your data. However, decentralized systems involve inherent transparency, so ensure you manage your private keys securely."
        />

        <PolicySection
          title="Cookies and Tracking"
          content="StakeWise does not use traditional cookies but relies on blockchain and smart contract logs for transaction data. You can control browser settings to manage tracking mechanisms on external resources."
        />

        <PolicySection
          title="Rights and Choices"
          content="As a user, you have the following rights:"
        >
          <PolicyList
            items={[
              "Access: View personal information stored on the platform.",
              "Correction: Update incorrect details in your profile.",
              "Erasure: Request deletion of personal information, excluding blockchain records that are immutable.",
              "Restriction: Limit processing of your information for specific purposes.",
            ]}
          />
        </PolicySection>

        <PolicySection
          title="Third Party Services"
          content="Our platform integrates with MetaMask and Ethereum for transaction processing. Review the privacy policies of these third parties for details about their data handling practices."
        />

        <PolicySection
          title="Updates to the Policy"
          content="We may update this policy as needed to reflect changes in legal requirements or platform enhancements. We encourage you to review it periodically."
        />

        <PolicySection
          title="Contact Us"
          content={
            <>
              <p>
                For any questions or concerns about this Privacy Policy, please
                contact us at:
              </p>
              <p>Email: demo@gmail.com</p>
            </>
          }
        />
      </article>
    </main>
  );
}