import Achievements from "@/components/Achievements/Achievements";
import OngoingTable from "../../components/Tables/OngoingTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { GiCardRandom } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import BetHistory from "@/components/Tables/BetHistory";
import TransactionTable from "@/components/Tables/TransactionTable";
import { motion } from "framer-motion";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import MetamaskLogo from "@/assets/images/MetaMask-icon-fox.svg";

import OnlineUsersWS from "@/components/OnlineUsersWS/OnlineUsersWS";

const Dashboard = () => {
  const { userData } = useContext(AppContext)!;
  const userId = userData?.id;
  const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/?userId=${userId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div>
        <OnlineUsersWS wsUrl={wsUrl} />
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

            <div>
              <h2 className="text-lg font-semibold text-white">
                {userData?.fname ||
                  (userData?.walletAddress ? "MetaMask User" : "User")}
              </h2>
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
          <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-4 py-10 ">
            {/* Total Earned */}

            <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b bg-[#333447] px-5 py-4 backdrop-blur-sm">
              <div>
                <p className="text-sm text-[#A0AEC0]">Total Earned</p>
                <p className="text-2xl font-bold text-white">$53,000</p>
                <p className="text-xs font-bold text-[#01B574]">+25%</p>
              </div>
              <div className="rounded-lg bg-[#E27625] p-2">
                <GiReceiveMoney className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Total Loss */}
            <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b bg-[#333447] px-5 py-4 backdrop-blur-sm">
              <div>
                <p className="text-sm text-[#A0AEC0]">Total Loss</p>
                <p className="text-2xl font-bold text-white">$53,000</p>
                <p className="text-xs font-bold text-[#01B574]">+25%</p>
              </div>
              <div className="rounded-lg bg-[#E27625] p-2">
                <BsGraphDownArrow className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Net Profit */}
            <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b bg-[#333447] px-5 py-4 backdrop-blur-sm">
              <div>
                <p className="text-sm text-[#A0AEC0]">Net Profit</p>
                <p className="text-2xl font-bold text-white">$53,000</p>
                <p className="text-xs font-bold text-[#01B574]">+25%</p>
              </div>
              <div className="rounded-lg bg-[#E27625] p-2">
                <BsGraphUpArrow className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Total Bets Placed */}
            <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b bg-[#333447] px-5 py-4 backdrop-blur-sm">
              <div>
                <p className="text-sm text-[#A0AEC0]">Total Bets Placed</p>
                <p className="text-2xl font-bold text-white">46</p>
              </div>
              <div className="rounded-lg bg-[#E27625] p-2">
                <GiCardRandom className="h-6 w-6 text-white" />
              </div>
            </div>
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
