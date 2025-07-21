import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Wallet,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader,
  Save,
} from "lucide-react";
import SettingsCard from "./SettingsCard";

import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";

const ContactInfoForm = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, getUserData } = useContext(AppContext)!;

  const [phone, setPhone] = useState(userData?.phone || "");
  const [language, setLanguage] = useState(userData?.language || "en");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updates = [];

      // Phone update (only if modified)
      if (phone.trim() !== "" && phone !== userData?.phone) {
        updates.push({
          field: "updatePhone",
          key: "phone",
          value: phone,
        });
      }

      // Language update (always send if modified)
      if (language !== userData?.language) {
        updates.push({
          field: "updateLanguage",
          key: "language",
          value: language,
        });
      }

      // Return early if no changes
      if (updates.length === 0) {
        toast.info("No changes to save");
        return;
      }

      const requests = updates.map(({ field, key, value }) =>
        axios.post(
          `${backendUrl}/api/user-update/${field}`,
          { [key]: value },
          { withCredentials: true }
        )
      );

      const responses = await Promise.all(requests);

      if (responses.every((res) => res.data.success)) {
        toast.success("Profile updated successfully");
        getUserData(); // Refresh user data
      } else {
        toast.error("Some updates failed. Please try again.");
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/sendVerifyOtp`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    if (userData) {
      setPhone(userData.phone || "");
      setLanguage(userData.language || "en");
    }
  }, [userData]);

  return (
    <SettingsCard
      title="Contact Information"
      description="Manage your contact details and communication preferences"
      form
      onSubmit={handleSubmit}
      footer={
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Authentication Method Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Authentication Method
            </h3>
          </div>

          {userData?.walletAddress ? (
            <WalletSection userData={userData} />
          ) : (
            <EmailSection
              userData={userData}
              handleVerification={handleVerification}
            />
          )}
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-[#333447] to-transparent" />

        {/* Contact Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Contact Details
            </h3>
          </div>

          <PhoneSection phone={phone} setPhone={setPhone} />
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-[#333447] to-transparent" />

        {/* Language Preferences Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">
              Language Preferences
            </h3>
          </div>

          <LanguageSection language={language} setLanguage={setLanguage} />
        </div>
      </div>
    </SettingsCard>
  );
};

// Sub-components for better readability
const WalletSection = ({ userData }: { userData: any }) => (
  <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#8B5CF6]/30 transition-all duration-300">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-200 font-medium flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[#8B5CF6]" />
          Wallet Address
        </Label>
        <span className="text-xs bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white px-3 py-1 rounded-full font-medium">
          Connected
        </span>
      </div>
      <div className="flex items-center bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg px-4 py-3">
        <Wallet className="h-4 w-4 text-[#8B5CF6] mr-3" />
        <div className="w-full text-sm font-mono text-zinc-200 break-all">
          {userData?.walletAddress}
        </div>
      </div>
      <p className="text-sm text-zinc-400 flex items-center gap-2">
        <Shield className="w-4 h-4 text-[#8B5CF6]" />
        This wallet address is used for secure authentication and transactions
      </p>
    </div>
  </div>
);

const EmailSection = ({
  userData,
  handleVerification,
}: {
  userData: any;
  handleVerification: () => void;
}) => (
  <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#8B5CF6]/30 transition-all duration-300">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-200 font-medium flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#8B5CF6]" />
          Email Address
        </Label>
        {userData?.isAccountVerified ? (
          <VerifiedBadge />
        ) : userData ? (
          <UnverifiedBadge />
        ) : (
          <LoadingBadge />
        )}
      </div>
      <div className="flex items-center bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg px-4 py-3">
        <Mail className="h-4 w-4 text-[#8B5CF6] mr-3" />
        <div className="w-full text-sm text-zinc-200">{userData?.email}</div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#8B5CF6]" />
          Primary authentication method for your account
        </p>
        {!userData?.isAccountVerified && (
          <Button
            variant="link"
            className="text-[#10B981] hover:text-[#059669] p-0 h-auto font-medium"
            onClick={handleVerification}
          >
            Verify Email
          </Button>
        )}
      </div>
    </div>
  </div>
);

const PhoneSection = ({
  phone,
  setPhone,
}: {
  phone: string;
  setPhone: (value: string) => void;
}) => (
  <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#10B981]/30 transition-all duration-300">
    <div className="space-y-4">
      <Label
        htmlFor="phone"
        className="text-zinc-200 font-medium flex items-center gap-2"
      >
        <Phone className="h-4 w-4 text-[#10B981]" />
        Phone Number
      </Label>
      <div className="flex items-center bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#10B981] focus-within:border-transparent hover:border-[#10B981]/50 transition-all duration-200">
        <Phone className="h-4 w-4 text-[#10B981] mr-3" />
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number (optional)"
          className="w-full bg-transparent text-sm text-zinc-100 focus:outline-none placeholder-zinc-500"
        />
      </div>
      <p className="text-sm text-zinc-400">
        Optional: Add a phone number for account recovery and notifications
      </p>
    </div>
  </div>
);

const LanguageSection = ({
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: (value: string) => void;
}) => (
  <div className="bg-gradient-to-br from-[#1C1C27] to-[#252538] p-6 rounded-xl border border-[#333447] hover:border-[#F59E0B]/30 transition-all duration-300">
    <div className="space-y-4">
      <Label
        htmlFor="language"
        className="text-zinc-200 font-medium flex items-center gap-2"
      >
        <Globe className="h-4 w-4 text-[#F59E0B]" />
        Preferred Language
      </Label>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="border border-[#333447] w-full py-3 px-4 text-sm bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B] hover:border-[#F59E0B]/50 transition-all duration-200">
          <SelectValue placeholder="Select your preferred language" />
        </SelectTrigger>
        <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg shadow-2xl">
          {["en", "es", "fr", "de", "it", "pt"].map((lang) => (
            <SelectItem
              key={lang}
              value={lang}
              className="hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10"
            >
              {languageNames[lang]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-zinc-400">
        Select your preferred language for the platform interface
      </p>
    </div>
  </div>
);

const VerifiedBadge = () => (
  <span className="text-xs bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
    <CheckCircle className="h-3 w-3" />
    Verified
  </span>
);

const UnverifiedBadge = () => (
  <span className="text-xs bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    Unverified
  </span>
);

const LoadingBadge = () => (
  <span className="text-xs bg-gradient-to-r from-[#6B7280] to-[#9CA3AF] text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
    <Loader className="h-3 w-3 animate-spin" />
    Loading...
  </span>
);

const languageNames: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
};

export default ContactInfoForm;
