// import React from "react";
import Achievements from "@/components/Achievements/Achievements";
import OngoingTable from "../../components/Tables/OngoingTable";
import Image from "@/assets/images/userProfile.png";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { GiCardRandom } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import BetHistory from "@/components/Tables/BetHistory";
import TransactionTable from "@/components/Tables/TransactionTable";

const Dashboard = () => {
  return (
    <div>
      <div className="min-h-[200px] py-10 lg:mx-24 md:mx-16 mx-8">
        {/* Profile Section */}

        <div className="mb-4 flex items-center justify-center gap-5">
          <img
            src={Image}
            alt=""
            width={115}
            height={115}
            className="rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold text-white">John Doe</h2>
            <p className="text-sm text-slate-400">johndoe23@gmail.com</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-4 py-10 ">
          {/* Total Earned */}

          <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b from-[#2E4156] to-[#4e6c8f] px-5 py-4 backdrop-blur-sm">
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
          <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b from-[#2E4156] to-[#4e6c8f] px-5 py-4 backdrop-blur-sm">
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
          <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b from-[#2E4156] to-[#4e6c8f] px-5 py-4 backdrop-blur-sm">
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
          <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b from-[#2E4156] to-[#4e6c8f] px-5 py-4 backdrop-blur-sm">
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
        <Achievements/>
        <BetHistory/>
        <TransactionTable/>
      
    </div>
  );
};

export default Dashboard;
