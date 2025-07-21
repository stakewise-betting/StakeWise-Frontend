import Achievements from "@/components/Achievements/Achievements";
import OngoingTable from "@/components/dashboardCom/OngoingTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { GiCardRandom } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import BetHistory from "@/components/dashboardCom/BetHistory";
import TransactionTable from "@/components/dashboardCom/TransactionTable";
import { motion } from "framer-motion";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg";
import StatCard from "@/components/dashboardCom/StatCard";
import OnlineUsersWS from "@/components/OnlineUsersWS/OnlineUsersWS";
import { useUserStats } from "@/hooks/useUserStats";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";

const Dashboard = () => {
  const { userData } = useContext(AppContext)!;
  const userId = userData?.id;
  const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/?userId=${userId}`;

  // Get user statistics
  const {
    totalEarned,
    totalLoss,
    netProfit,
    totalBetsPlaced,
    totalAmountWagered,
    winRate,
    loading: statsLoading,
    error: statsError,
  } = useUserStats();

  // Format numbers for display
  const formatNumber = (num: number, decimals: number = 4) => {
    if (num === 0) return "0";
    return num.toFixed(decimals);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen"
    >
      {/* Profile Section */}
      <div className="lg:mx-24 md:mx-16 mx-8 py-12">
        <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-[#333447] shadow-xl">
                  <AvatarImage alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-[#2A2A3A] to-[#1C1C27] text-zinc-100 text-4xl font-bold">
                    {userData?.picture ? (
                      <img
                        src={userData.picture}
                        alt="User profile"
                        width={128}
                        height={128}
                        className="object-cover rounded-full"
                      />
                    ) : userData?.fname ? (
                      userData.fname[0].toUpperCase()
                    ) : userData?.walletAddress ? (
                      <img
                        src={MetamaskLogo}
                        alt="MetaMask Logo"
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-zinc-400" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full shadow-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h2 className="text-2xl font-bold text-zinc-100">
                    {userData?.fname ||
                      (userData?.walletAddress
                        ? "MetaMask User"
                        : "Welcome Back")}
                  </h2>
                  <OnlineUsersWS wsUrl={wsUrl} />
                </div>

                <p className="text-lg text-zinc-400 font-medium">
                  {userData?.email ||
                    (userData?.walletAddress
                      ? userData.walletAddress.slice(0, 8) +
                        "..." +
                        userData.walletAddress.slice(-6)
                      : "Betting Dashboard")}
                </p>

                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="px-4 py-2 bg-gradient-to-r from-[#3B82F6]/20 to-[#60A5FA]/20 border border-[#3B82F6]/30 rounded-full">
                    <span className="text-[#3B82F6] font-medium text-sm">
                      Premium Member
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-[#10B981]/20 to-[#34D399]/20 border border-[#10B981]/30 rounded-full">
                    <span className="text-emerald-400 font-medium text-sm">
                      Verified Account
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="lg:mx-24 md:mx-16 mx-8 mb-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] p-8 rounded-2xl animate-pulse"
              >
                <div className="h-4 bg-zinc-600 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-zinc-600 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-zinc-600 rounded w-1/3"></div>
              </div>
            ))
          ) : statsError ? (
            // Error state
            <div className="col-span-full">
              <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl">
                <CardContent className="p-16">
                  <div className="text-center">
                    <div className="text-red-500 mb-4">⚠️</div>
                    <p className="text-red-400 text-lg font-medium">
                      Error loading statistics
                    </p>
                    <p className="text-zinc-500 text-sm">{statsError}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Real statistics
            <>
              <StatCard
                title="Total Earned"
                value={`${formatNumber(totalEarned)} ETH`}
                percentage={
                  totalEarned > 0 ? `+${formatNumber(totalEarned)}` : "0%"
                }
                icon={<GiReceiveMoney className="h-7 w-7" />}
                iconColor="#10B981"
              />

              <StatCard
                title="Total Loss"
                value={`${formatNumber(totalLoss)} ETH`}
                percentage={
                  totalLoss > 0 ? `-${formatNumber(totalLoss)}` : "0%"
                }
                icon={<BsGraphDownArrow className="h-7 w-7" />}
                iconColor="#EF4444"
              />

              <StatCard
                title="Net Profit"
                value={`${netProfit >= 0 ? "+" : ""}${formatNumber(
                  netProfit
                )} ETH`}
                percentage={`${winRate.toFixed(1)}% Win Rate`}
                icon={
                  netProfit >= 0 ? (
                    <BsGraphUpArrow className="h-7 w-7" />
                  ) : (
                    <BsGraphDownArrow className="h-7 w-7" />
                  )
                }
                iconColor={netProfit >= 0 ? "#10B981" : "#EF4444"}
              />

              <StatCard
                title="Total Bets Placed"
                value={totalBetsPlaced.toString()}
                percentage={
                  totalAmountWagered > 0
                    ? `${formatNumber(totalAmountWagered)} ETH Wagered`
                    : "No bets"
                }
                icon={<GiCardRandom className="h-7 w-7" />}
                iconColor="#3B82F6"
              />
            </>
          )}
        </div>
      </div>

      {/* Dashboard Components */}
      <OngoingTable />
      <Achievements />
      <BetHistory />
      <TransactionTable />
    </motion.div>
  );
};

export default Dashboard;
