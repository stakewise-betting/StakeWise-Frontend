import { Link } from "react-router-dom";
import { useState } from "react";
import { Shield, Phone, FileQuestion, Mail } from "lucide-react";
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
      <div className="bg-[#333447] rounded-2xl p-6 mb-8 border-l-4 border-[#E27625] shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Responsible Gambling</h1>
        </div>
        <p className="text-gray-300 text-sm">
          We're committed to promoting responsible gambling practices and
          providing tools to help you stay in control.
        </p>
        {!isLoggedin && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mt-4">
            <p className="text-red-200 text-sm">
              Please log in to access responsible gambling features.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#333447] overflow-hidden shadow-lg rounded-xl border-0 transition-all hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-full">
                <Shield className="h-5 w-5 text-[#E27625]" />
              </div>
              <h3 className="font-semibold text-lg">Deposit Limits</h3>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Take control of your gambling by setting daily, weekly or monthly
              deposit limits.
            </p>
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setIsDepositLimitDialogOpen(true)}
              disabled={!isLoggedin}
            >
              Set Limits
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#333447] overflow-hidden shadow-lg rounded-xl border-0 transition-all hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-full">
                <FileQuestion className="h-5 w-5 text-[#E27625]" />
              </div>
              <h3 className="font-semibold text-lg">Self-Assessment</h3>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Not sure if your gambling habits are becoming a problem? Take our
              confidential self-assessment.
            </p>
            <Link
              to="/self-assessment"
              className="flex items-center cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {
                  if (!isLoggedin) {
                    toast.error(
                      "You must be logged in to take the self-assessment"
                    );
                    return;
                  }
                }}
                disabled={!isLoggedin}
              >
                Start Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#333447] overflow-hidden shadow-lg rounded-xl border-0 transition-all hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-full">
                <Mail className="h-5 w-5 text-[#E27625]" />
              </div>
              <h3 className="font-semibold text-lg">Contact Support</h3>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Worried about your gambling or someone else's? Reach out to our
              support team for help.
            </p>

            <Link
              to="/contactus"
              className="flex items-center cursor-pointer"
              onClick={() => {
                window.scrollTo(0, 0);
                window.location.assign("/contactus");
              }}
            >
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!isLoggedin}
              >
                Contact Team
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#333447] overflow-hidden rounded-xl border-0 mb-8  shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-full">
              <Phone className="h-5 w-5 text-[#E27625]" />
            </div>
            <h3 className="font-semibold text-lg">Gambling Helplines</h3>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 bg-[#1C1C27] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-[#E27625] rounded-full"></div>
                <span className="text-sm font-medium">
                  National Problem Gambling Helpline
                </span>
              </div>
              <span className="font-bold text-sm px-3 py-1 rounded-full">
                1-800-GAMBLER
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1C1C27] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-[#E27625] rounded-full"></div>
                <span className="text-sm font-medium">Gamblers Anonymous</span>
              </div>
              <span className="font-bold text-sm px-3 py-1 rounded-full">
                1-626-960-3500
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1C1C27] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-10 bg-[#E27625] rounded-full"></div>
                <span className="text-sm font-medium">Stakewise</span>
              </div>
              <span className="font-bold text-sm px-3 py-1 rounded-full">
                0808 8020 133
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Deposit Limit Dialog */}
      <Dialog
        open={isDepositLimitDialogOpen}
        onOpenChange={setIsDepositLimitDialogOpen}
      >
        <DialogContent className="bg-[#1C1C27] border-0 p-0 overflow-hidden w-full max-w-md rounded-xl">
          <div className="bg-[#333447] p-6 border-b border-[#E27625]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-full">
                <Shield className="h-5 w-5 text-[#E27625]" />
              </div>
              <DialogTitle className="text-xl font-bold">
                Set Deposit Limits
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-400 ml-11">
              Limit how much you can deposit in a given period to help manage
              your gambling.
            </DialogDescription>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="limit-type"
                  className="text-sm font-medium flex items-center gap-2 mb-2"
                >
                  <span className="inline-block w-2 h-2 rounded-full"></span>
                  Limit Type
                </Label>
                <Select
                  value={limitType}
                  onValueChange={(value) =>
                    setLimitType(value as "daily" | "weekly" | "monthly")
                  }
                >
                  <SelectTrigger
                    id="limit-type"
                    className="bg-[#333447] border border-[#444560] focus:border-[#1C1C27] focus:ring-1 focus:ring-[#1C1C27] rounded-lg"
                  >
                    <SelectValue placeholder="Select limit type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#333447] border-[#444560]">
                    <SelectItem value="daily">Daily Limit</SelectItem>
                    <SelectItem value="weekly">Weekly Limit</SelectItem>
                    <SelectItem value="monthly">Monthly Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="limit-amount"
                  className="text-sm font-medium flex items-center gap-2 mb-2"
                >
                  <span className="inline-block w-2 h-2 rounded-full"></span>
                  Amount ($)
                </Label>
                <div className="relative">
                  <Input
                    id="limit-amount"
                    type="number"
                    value={limitAmount}
                    onChange={(e) => setLimitAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-[#333447] border border-[#444560] focus:border-[#1C1C27] focus:ring-1 focus:ring-[#1C1C27] pl-16 rounded-lg"
                    min="0"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ETH
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-4">
                  {limitType === "daily" &&
                    "Maximum amount you can deposit in a 24-hour period"}
                  {limitType === "weekly" &&
                    "Maximum amount you can deposit in a 7-day period"}
                  {limitType === "monthly" &&
                    "Maximum amount you can deposit in a 30-day period"}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#333447]">
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDepositLimitDialogOpen(false)}
                  className="border-[#444560] hover:bg-[#333447] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSetLimitSubmit}
                  disabled={!limitAmount || isLimitSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isLimitSubmitting ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Setting...
                    </>
                  ) : (
                    "Set Limit"
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
