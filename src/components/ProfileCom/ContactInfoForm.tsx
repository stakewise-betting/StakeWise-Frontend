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
import { Mail, Phone, Wallet } from "lucide-react";
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
      description="Update your contact details"
      form
      onSubmit={handleSubmit}
      footer={
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <div className="space-y-6">
        {userData?.walletAddress ? (
          <WalletSection userData={userData} />
        ) : (
          <EmailSection
            userData={userData}
            handleVerification={handleVerification}
          />
        )}

        <PhoneSection phone={phone} setPhone={setPhone} />
        <Separator className="bg-zinc-800" />
        <LanguageSection language={language} setLanguage={setLanguage} />
      </div>
    </SettingsCard>
  );
};

// Sub-components for better readability
const WalletSection = ({ userData }: { userData: any }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label>Wallet Address</Label>
    </div>
    <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2">
      <Wallet className="h-4 w-4 text-zinc-400" />
      <div className="w-full text-sm px-2 py-1">{userData?.walletAddress}</div>
    </div>
    <p className="text-sm text-zinc-400">
      You are using this wallet address to log in
    </p>
  </div>
);

const EmailSection = ({
  userData,
  handleVerification,
}: {
  userData: any;
  handleVerification: () => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label>Email Address</Label>
      {userData?.isAccountVerified ? (
        <VerifiedBadge />
      ) : userData ? (
        <UnverifiedBadge />
      ) : (
        <LoadingBadge />
      )}
    </div>
    <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2">
      <Mail className="h-4 w-4 text-zinc-400" />
      <div className="w-full text-sm px-2 py-1">{userData?.email}</div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-sm text-zinc-400">Your account login email</p>
      {!userData?.isAccountVerified && (
        <Button
          variant="link"
          className="text-emerald-500 p-0 h-auto"
          onClick={handleVerification}
        >
          Verify now
        </Button>
      )}
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
  <div className="space-y-2">
    <Label htmlFor="phone">Phone Number</Label>
    <div className="flex items-center bg-[#333447] rounded-lg px-3 py-2">
      <Phone className="h-4 w-4 text-zinc-400" />
      <input
        id="phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number (optional)"
        className="w-full bg-transparent text-sm px-2 py-1 focus:outline-none"
      />
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
  <div className="space-y-2">
    <Label htmlFor="language">Preferred Language</Label>
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="bg-[#333447] border-none rounded-lg">
        {["en", "es", "fr", "de", "it", "pt"].map((lang) => (
          <SelectItem key={lang} value={lang}>
            {languageNames[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const VerifiedBadge = () => (
  <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded">
    Verified
  </span>
);

const UnverifiedBadge = () => (
  <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">
    Unverified
  </span>
);

const LoadingBadge = () => (
  <span className="text-xs bg-gray-500/20 text-gray-500 px-2 py-1 rounded">
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
