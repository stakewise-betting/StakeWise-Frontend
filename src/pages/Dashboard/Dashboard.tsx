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
    >
      <div>
        <div className="min-h-[200px] py-10 lg:mx-24 md:mx-16 mx-8">
          {/* Profile Section */}
          <div className="mb-4 flex items-center justify-center gap-5">
            <Avatar className="h-32 w-32 border-2 border-zinc-800">
              <AvatarImage alt="Profile" />
              <AvatarFallback className="bg-zinc-800 text-zinc-100 text-4xl">
                {userData?.picture ? (
                  <img
                    src={userData.picture}
                    alt="User profile"
                    width={115}
                    height={115}
                    className="bject-cover rounded-full"
                  />
                ) : userData?.fname ? (
                  userData.fname[0].toUpperCase()
                ) : userData?.walletAddress ? (
                  <img
                    src={MetamaskLogo}
                    alt="MetaMask Logo"
                    width={115}
                    height={115}
                    className="object-contain rounded-full"
                  />
                ) : (
                  ""
                )}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">
                  {userData?.fname ||
                    (userData?.walletAddress ? "MetaMask User" : "User")}
                </h2>
                <OnlineUsersWS wsUrl={wsUrl} />
              </div>

              <p className="text-sm text-slate-400">
                {userData?.email ||
                  (userData?.walletAddress
                    ? userData.walletAddress.slice(0, 6) +
                      "..." +
                      userData.walletAddress.slice(-4)
                    : "")}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-4 py-10">
            {statsLoading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-[#333447] p-6 rounded-[20px] animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                </div>
              ))
            ) : statsError ? (
              // Error state
              <div className="col-span-full text-center text-red-500 py-8">
                Error loading statistics: {statsError}
              </div>
            ) : (
              // Real statistics
              <>
                <StatCard
                  title="Total Earned"
                  value={`${formatNumber(totalEarned)} ETH`}
                  percentage={totalEarned > 0 ? `+${formatNumber(totalEarned)}` : "0%"}
                  icon={<GiReceiveMoney className="h-6 w-6 text-white" />}
                />

                <StatCard
                  title="Total Loss"
                  value={`${formatNumber(totalLoss)} ETH`}
                  percentage={totalLoss > 0 ? `-${formatNumber(totalLoss)}` : "0%"}
                  icon={<BsGraphDownArrow className="h-6 w-6 text-white" />}
                />

                <StatCard
                  title="Net Profit"
                  value={`${netProfit >= 0 ? '+' : ''}${formatNumber(netProfit)} ETH`}
                  percentage={`${winRate.toFixed(1)}% Win Rate`}
                  icon={
                    netProfit >= 0 ? (
                      <BsGraphUpArrow className="h-6 w-6 text-white" />
                    ) : (
                      <BsGraphDownArrow className="h-6 w-6 text-white" />
                    )
                  }
                />

                <StatCard
                  title="Total Bets Placed"
                  value={totalBetsPlaced.toString()}
                  percentage={totalAmountWagered > 0 ? `${formatNumber(totalAmountWagered)} ETH Wagered` : "No bets"}
                  icon={<GiCardRandom className="h-6 w-6 text-white" />}
                />
              </>
            )}
          </div>

        </div>

        <OngoingTable />
        <Achievements />
        <BetHistory />
        <TransactionTable />
      </div>
    </motion.div>
  );
};

export default Dashboard;