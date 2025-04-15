import { TermsHeader } from "@/components/Terms/TermsHeader";
import { TermsSection } from "@/components/Terms/TermsSection";
import { TermsList } from "@/components/Terms/TermsList";

export default function TermsTerms() {
  return (
    <main className="w-full bg-[#1C1C27] min-h-[screen]">
      <TermsHeader />
      <article className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 2xl:px-80 py-8 md:py-12 text-base text-white">
        <TermsSection
          title="Introduction"
          content="Welcome to StakeWise, an innovative blockchain-based betting platform developed by Team Paradox. By accessing or using the platform, you agree to comply with these Terms of Use (the “Terms”). If you do not agree with these Terms, you must not access or use StakeWise."
        />
        
        <TermsSection
          title="Acceptance of terms"
          content="By creating an account, clicking “I Agree”, or using the platform, you confirm your acceptance of these Terms, including any additional rules or policies referenced herein."
        />


        <TermsSection
          title="Eligibility"
          content="To use StakeWise, you must:"
        >
          <TermsList
            items={[
              "Be of legal gambling age in your jurisdiction (18 or older, depending on local laws).",
              "Not reside in or access the platform from restricted territories or jurisdictions where online betting is prohibited.",
              "Comply with all applicable laws and regulations related to your activities on the platform.",
            ]}
          />
        </TermsSection>

        <TermsSection
          title="Services Provided"
          content="StakeWise utilizes blockchain technology to offer decentralized betting services, ensuring transparency, security, and fairness through the use of Ethereum smart contracts. Features include:"
        >
          <TermsList
            items={[
              "Automated betting processes.",
              "Integration with cryptocurrency wallets such as MetaMask.",
              "Real-time notifications via WebSocket technology.",
              "A user-friendly interface for managing bets and outcomes.",
            ]}
          />
        </TermsSection>

        <TermsSection
          title="User Responsibilities"
          content="When using StakeWise, you agree to:"
        >
          <TermsList
            items={[
              "Provide accurate and up-to-date information.",
              "Secure your account credentials, including private keys for your wallet.",
              "Refrain from engaging in illegal activities, including but not limited to money laundering, fraud, or any prohibited forms of betting.",
            ]}
          />
        </TermsSection>

        <TermsSection
          title="Restricted Activities"
          content="You may not:"
        >
            <TermsList
            items={[
              "Use the platform to conduct unauthorized or fraudulent transactions.",
              "Circumvent geographical restrictions via VPNs or other anonymization tools",
              "Exploit vulnerabilities in the platform for personal gain.",
            ]}
          />
        </TermsSection>

        <TermsSection
          title="Licensing and Compliance"
          content="StakeWise operates under the regulatory guidelines of recognized gambling authorities, including the Malta Gaming Authority (MGA) and the UK Gambling Commission. The platform is designed to adhere to fair play and responsible gambling standards."
        />

        <TermsSection
          title="Responsible Gambling"
          content="StakeWise encourages responsible gambling by offering:"
        >
          <TermsList
            items={[
              "Tools for setting deposit limits and self-exclusion.",
              "Access to educational resources and partnerships with organizations like GambleAware.",
            ]}
          />
        </TermsSection>

        <TermsSection
          title="Fees and Transactions"
          content="You are responsible for any transaction fees, including blockchain gas fees. StakeWise provides estimated fees for reference but does not guarantee exact amounts."
        />

        <TermsSection
          title="Intellectual Property"
          content="All content on the platform, including software, logos, and trademarks, is owned or licensed by StakeWise. Users may not reproduce or distribute any proprietary content without explicit permission."
        />
        
        <TermsSection
          title="Assumption of Risks"
          content="Using StakeWise involves inherent risks, including:"
        >
          <TermsList
            items={[
              "Loss of private keys resulting in inaccessible funds.",
              "Market volatility affecting cryptocurrency values.",
              "Possible technical issues due to blockchain limitations.",
              "By using the platform, you acknowledge and accept these risks.",
            ]}
          />
        </TermsSection>

        <TermsSection
          title="Liability and Indemnification"
          content="StakeWise is not liable for:"
        >
          <TermsList
            items={[
              "Losses resulting from user errors, server outages, or unauthorized access.",
              "Consequences arising from the use of third-party services integrated with the platform.",
              "You agree to indemnify and hold harmless Team Paradox, its developers, and affiliates from any claims or liabilities related to your use of the platform..",
            ]}
          />
        </TermsSection>

        <TermsSection
          title="Dispute Resolution"
          content="Any disputes arising from these Terms will be resolved through binding arbitration under applicable laws. Both parties waive the right to pursue claims through class actions."
        />

        <TermsSection
          title="Modifications to Terms"
          content="StakeWise reserves the right to update these Terms at any time. Changes will be communicated through the platform, and continued use indicates acceptance of the updated Terms."
        />

        <TermsSection
          title="Governing Law"
          content="These Terms are governed by the laws of [Insert Jurisdiction], excluding its conflict of laws principles."
        />
        
      </article>
    </main>
  );
}
