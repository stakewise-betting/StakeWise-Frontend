import { useState } from "react";
import ProfilePicture from "@/components/ProfileCom/ProfilePicture";
import PersonalInfoForm from "@/components/ProfileCom/PersonalInfoForm";
import ContactInfoForm from "@/components/ProfileCom/ContactInfoForm";
import AccountPreferences from "@/components/ProfileCom/AccountPreferences";
import PrivacySettings from "@/components/ProfileCom/PrivacySettings";
import PasswordSecurity from "@/components/ProfileCom/PasswordSecurity";
import DangerZone from "@/components/ProfileCom/DangerZone";
import { motion } from "framer-motion";

export default function ProfileSettings() {
  // Shared state could be lifted here if needed across components
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Smith",
    username: "johnsmith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
  });

  const updateUserData = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-zinc-400 mt-1">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid gap-8">
            <ProfilePicture
              firstName={userData.firstName}
              lastName={userData.lastName}
            />
            <PersonalInfoForm
              userData={userData}
              updateUserData={updateUserData}
            />
            <ContactInfoForm
              userData={userData}
              updateUserData={updateUserData}
            />
            <AccountPreferences />
            <PrivacySettings />
            <PasswordSecurity />
            <DangerZone />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
