import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Shield,
  Phone,
  FileQuestion,
  Mail,
  AlertTriangle,
  Clock,
  Users,
  HeartHandshake,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import responsibleGamblingService from "@/services/responsibleGamblingApiService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResponsibleGamblingTabProps {
  isLoggedin: boolean;
}

const ResponsibleGamblingTab = ({
  isLoggedin,
}: ResponsibleGamblingTabProps) => {
  // State for deposit limit dialog
  const [isDepositLimitDialogOpen, setIsDepositLimitDialogOpen] =
    useState(false);
  const [limitType, setLimitType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [limitAmount, setLimitAmount] = useState<string>("");
  const [isLimitSubmitting, setIsLimitSubmitting] = useState(false);

  // Handle deposit limit submission
  const handleSetLimitSubmit = async () => {
    if (!isLoggedin) {
      toast.error("You must be logged in to set deposit limits");
      return;
    }

    try {
      setIsLimitSubmitting(true);

      // Create a properly formatted limit object
      const limitData = {
        [limitType]: Number.parseFloat(limitAmount),
      };

      const response = await responsibleGamblingService.setDepositLimits(
        limitData
      );

      if (response.success) {
        toast.success(
          `Your ${limitType} deposit limit has been set successfully`
        );
        setIsDepositLimitDialogOpen(false);
        setLimitAmount("");
      } else {
        toast.error(response.message || "Failed to set deposit limit");
      }
    } catch (error) {
      console.error("Deposit limit error:", error);
      const err = error as Error;
      toast.error(err.message || "Failed to set deposit limit");
    } finally {
      setIsLimitSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] rounded-2xl p-8 mb-10 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#EF4444]/10 to-[#F87171]/10 rounded-xl p-6 border border-[#EF4444]/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-[#EF4444] to-[#F87171] rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">
                Responsible Gambling
              </h1>
              <p className="text-zinc-400 mt-1">
                Your safety and wellbeing matter most to us
              </p>
            </div>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            We're committed to promoting responsible gambling practices and
            providing comprehensive tools to help you stay in control of your
            gaming experience.
          </p>
          {!isLoggedin && (
            <div className="flex items-center gap-3 mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 font-medium">
                Please log in to access responsible gambling features and set
                your personal limits.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Deposit Limits Card */}
        <div className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#60A5FA]/10 p-6 border-b border-[#333447]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">
                Deposit Limits
              </h3>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Take complete control of your gambling by setting personalized
              daily, weekly or monthly deposit limits that work for you.
            </p>
          </div>
          <div className="p-6">
            <Button
              className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              onClick={() => setIsDepositLimitDialogOpen(true)}
              disabled={!isLoggedin}
            >
              <Shield className="w-5 h-5 mr-2" />
              Set Your Limits
            </Button>
          </div>
        </div>

        {/* Self-Assessment Card */}
        <div className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#FBBF24]/10 p-6 border-b border-[#333447]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-xl shadow-lg">
                <FileQuestion className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">
                Self-Assessment
              </h3>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Not sure if your gambling habits are becoming concerning? Take our
              confidential self-assessment to get personalized insights.
            </p>
          </div>
          <div className="p-6">
            <Link
              to="/self-assessment"
              className="block"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Button
                className="w-full py-4 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#D97706] hover:to-[#F59E0B] disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                onClick={(e) => {
                  if (!isLoggedin) {
                    e.preventDefault();
                    toast.error(
                      "You must be logged in to take the self-assessment"
                    );
                    return;
                  }
                }}
                disabled={!isLoggedin}
              >
                <FileQuestion className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Support Card */}
        <div className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-[#10B981]/10 to-[#34D399]/10 p-6 border-b border-[#333447]">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-xl shadow-lg">
                <HeartHandshake className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">Get Support</h3>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Concerned about your gambling or someone else's? Our dedicated
              support team is here to help you every step of the way.
            </p>
          </div>
          <div className="p-6">
            <Link
              to="/contactus"
              className="block"
              onClick={() => {
                window.scrollTo(0, 0);
                window.location.assign("/contactus");
              }}
            >
              <Button
                className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] hover:to-[#10B981] disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                disabled={!isLoggedin}
              >
                <HeartHandshake className="w-5 h-5 mr-2" />
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gambling Helplines Section */}
      <div className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#A78BFA]/10 p-6 border-b border-[#333447]">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-xl shadow-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100">
              24/7 Gambling Helplines
            </h3>
          </div>
          <p className="text-zinc-400 text-lg ml-16">
            Professional help is available anytime you need it. These services
            are free and confidential.
          </p>
        </div>

        <div className="p-8">
          <div className="grid gap-4">
            <div className="group bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#EF4444]/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-12 bg-gradient-to-b from-[#EF4444] to-[#F87171] rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-lg">
                      National Problem Gambling Helpline
                    </h4>
                    <p className="text-zinc-400 text-sm">
                      24/7 confidential support and crisis intervention
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-zinc-100">
                    1-800-GAMBLER
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      Available 24/7
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#3B82F6]/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-12 bg-gradient-to-b from-[#3B82F6] to-[#60A5FA] rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-lg">
                      Gamblers Anonymous
                    </h4>
                    <p className="text-zinc-400 text-sm">
                      Peer support and recovery meetings nationwide
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-zinc-100">
                    1-626-960-3500
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">
                      Group Support
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] hover:border-[#10B981]/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-12 bg-gradient-to-b from-[#10B981] to-[#34D399] rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-lg">
                      StakeWise Support
                    </h4>
                    <p className="text-zinc-400 text-sm">
                      Direct platform support and account assistance
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-zinc-100">
                    0808 8020 133
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">
                      Platform Help
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Limit Dialog */}
      <Dialog
        open={isDepositLimitDialogOpen}
        onOpenChange={setIsDepositLimitDialogOpen}
      >
        <DialogContent className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] p-0 overflow-hidden w-full max-w-md rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#60A5FA]/10 p-6 border-b border-[#333447]">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-zinc-100">
                Set Deposit Limits
              </DialogTitle>
            </div>
            <DialogDescription className="text-zinc-400 text-lg ml-16">
              Create personalized limits to help you maintain control over your
              gambling spending.
            </DialogDescription>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              <div>
                <Label
                  htmlFor="limit-type"
                  className="text-zinc-200 font-medium flex items-center gap-3 mb-3"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full"></div>
                  Limit Period
                </Label>
                <Select
                  value={limitType}
                  onValueChange={(value) =>
                    setLimitType(value as "daily" | "weekly" | "monthly")
                  }
                >
                  <SelectTrigger
                    id="limit-type"
                    className="w-full py-4 px-4 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100"
                  >
                    <SelectValue placeholder="Select your preferred limit period" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl shadow-2xl">
                    <SelectItem
                      value="daily"
                      className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                    >
                      Daily Limit
                    </SelectItem>
                    <SelectItem
                      value="weekly"
                      className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                    >
                      Weekly Limit
                    </SelectItem>
                    <SelectItem
                      value="monthly"
                      className="hover:bg-[#3B82F6]/10 focus:bg-[#3B82F6]/10"
                    >
                      Monthly Limit
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="limit-amount"
                  className="text-zinc-200 font-medium flex items-center gap-3 mb-3"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full"></div>
                  Amount (ETH)
                </Label>
                <div className="relative">
                  <Input
                    id="limit-amount"
                    type="number"
                    value={limitAmount}
                    onChange={(e) => setLimitAmount(e.target.value)}
                    placeholder="Enter your limit amount"
                    className="w-full py-4 pl-16 pr-4 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] hover:border-[#3B82F6]/50 transition-all duration-200 text-zinc-100 placeholder-zinc-500"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full"></div>
                    <span className="text-zinc-400 font-medium">ETH</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] border border-[#333447] rounded-lg">
                  <p className="text-sm text-zinc-400">
                    {limitType === "daily" &&
                      "This is the maximum amount you can deposit within any 24-hour period"}
                    {limitType === "weekly" &&
                      "This is the maximum amount you can deposit within any 7-day period"}
                    {limitType === "monthly" &&
                      "This is the maximum amount you can deposit within any 30-day period"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#333447]">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDepositLimitDialogOpen(false)}
                  className="flex-1 py-3 bg-transparent border-2 border-[#333447] hover:border-[#555] hover:bg-[#2A2A3A] text-zinc-300 hover:text-white transition-all duration-200 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSetLimitSubmit}
                  disabled={!limitAmount || isLimitSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isLimitSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Setting Limit...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Set Limit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ResponsibleGamblingTab;
