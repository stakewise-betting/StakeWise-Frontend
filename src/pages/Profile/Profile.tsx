import ProfilePicture from "@/components/ProfileCom/ProfilePicture";
import PersonalInfoForm from "@/components/ProfileCom/PersonalInfoForm";
import ContactInfoForm from "@/components/ProfileCom/ContactInfoForm";
// import AccountPreferences from "@/components/ProfileCom/AccountPreferences";
// import PrivacySettings from "@/components/ProfileCom/PrivacySettings";
import PasswordSecurity from "@/components/ProfileCom/PasswordSecurity";
import DangerZone from "@/components/ProfileCom/DangerZone";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

export default function ProfileSettings() {
  const { userData } = useContext(AppContext)!;

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
              {userData?.isActive
                ? "Manage your account information and preferences"
                : "Your account is deactivated. You can reactivate or delete it below."}
            </p>
          </div>

          <div className="grid gap-8">
            {userData?.isActive ? (
              <>
                <ProfilePicture />
                <PersonalInfoForm />
                <ContactInfoForm />
                <PasswordSecurity />
              </>
            ) : null}
            
            {/* Always show DangerZone */}
            <DangerZone />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
