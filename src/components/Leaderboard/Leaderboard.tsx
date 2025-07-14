import { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  useLeaderboard,
  useUserRank,
  useTopPerformers,
} from "../../hooks/useLeaderboard";
import { AppContext } from "../../context/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Leaderboard = () => {
  const { userData } = useContext(AppContext)!;
  const userAddress = userData?.walletAddress || "";

  const {
    leaderboard,
    loading: leaderboardLoading,
    error: leaderboardError,
    pagination,
    refreshLeaderboard,
    loadMore,
  } = useLeaderboard(50);

  const {
    userRank,
    loading: rankLoading,
    error: rankError,
  } = useUserRank(userAddress);

  const { topPerformers: topProfits, loading: topProfitsLoading } =
    useTopPerformers("netProfit", 10);

  const [selectedTab, setSelectedTab] = useState("leaderboard");

  const formatNumber = (num: number, decimals: number = 4) => {
    if (num === 0) return "0";
    return num.toFixed(decimals);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-yellow-500 text-xl sm:text-2xl">🏆</span>;
      case 2:
        return <span className="text-gray-400 text-xl sm:text-2xl">🥈</span>;
      case 3:
        return <span className="text-amber-600 text-xl sm:text-2xl">🥉</span>;
      default:
        return (
          <span className="text-sm sm:text-lg font-bold text-white">
            #{rank}
          </span>
        );
    }
  };

  const getUserDisplayName = (user: any) => {
    if (user?.userData?.fname) {
      return (
        user.userData.fname +
        (user.userData.lname ? ` ${user.userData.lname}` : "")
      );
    }
    if (user?.userData?.username) {
      return user.userData.username;
    }
    return formatAddress(user.userAddress);
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = "text-white",
  }: any) => (
    <div className="bg-[#333447] p-3 sm:p-4 md:p-6 rounded-[15px] sm:rounded-[20px] text-center">
      <div className="flex justify-center mb-2 sm:mb-3">{icon}</div>
      <h3 className="text-slate-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
        {title}
      </h3>
      <p className={`text-lg sm:text-xl md:text-2xl font-bold ${color} mb-1`}>
        {value}
      </p>
      <p className="text-slate-400 text-xs">{subtitle}</p>
    </div>
  );

  const LeaderboardTable = ({ data, loading, title }: any) => (
    <div className="bg-[#333447] rounded-[15px] sm:rounded-[20px] p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
        {title}
      </h3>
      {loading ? (
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-[#2a2d3e] rounded-[12px] sm:rounded-[15px] animate-pulse"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 sm:h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-400 text-base sm:text-lg">
            No leaderboard data available yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Start betting to see rankings!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((user: any, index: number) => (
            <motion.div
              key={user.userAddress}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-[12px] sm:rounded-[15px] bg-[#2a2d3e] hover:bg-[#373a4d] transition-all duration-300 ${
                user.userAddress === userAddress
                  ? "ring-2 ring-blue-500 bg-blue-900/20"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>

                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-gray-600 flex-shrink-0">
                  <AvatarImage
                    src={user.userData?.picture}
                    alt={getUserDisplayName(user)}
                  />
                  <AvatarFallback className="bg-gray-600 text-white font-bold text-sm sm:text-lg">
                    {getUserDisplayName(user)[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm sm:text-lg truncate">
                    {getUserDisplayName(user)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 truncate">
                    {formatAddress(user.userAddress)}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                <div
                  className={`font-bold text-lg sm:text-xl ${
                    user.netProfit >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {user.netProfit >= 0 ? "+" : ""}
                  {formatNumber(user.netProfit)} ETH
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  {user.winRate.toFixed(1)}% Win Rate • {user.totalBetsPlaced}{" "}
                  Bets
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              🏆 Leaderboard
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Compete with other players and climb the ranks
            </p>
          </div>

          {/* User's Current Rank */}
          {userAddress && (
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-[15px] sm:rounded-[20px] p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-700">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                🎯 Your Current Position
              </h3>
              {rankLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-6 sm:h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : rankError ? (
                <div className="text-red-400 text-center py-4 text-sm sm:text-base">
                  {rankError}
                </div>
              ) : userRank ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    title="Your Rank"
                    value={`#${userRank.rank}`}
                    subtitle="Current Position"
                    icon={<span className="text-2xl sm:text-3xl">🏅</span>}
                    color="text-yellow-400"
                  />
                  <StatCard
                    title="Net Profit"
                    value={`${userRank.netProfit >= 0 ? "+" : ""}${formatNumber(
                      userRank.netProfit
                    )} ETH`}
                    subtitle="Total Earnings"
                    icon={<span className="text-2xl sm:text-3xl">💰</span>}
                    color={
                      userRank.netProfit >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  />
                  <StatCard
                    title="Win Rate"
                    value={`${userRank.winRate.toFixed(1)}%`}
                    subtitle="Success Rate"
                    icon={<span className="text-2xl sm:text-3xl">🎯</span>}
                    color="text-blue-400"
                  />
                  <StatCard
                    title="Total Bets"
                    value={userRank.totalBetsPlaced}
                    subtitle="Bets Placed"
                    icon={<span className="text-2xl sm:text-3xl">🎲</span>}
                    color="text-purple-400"
                  />
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-400 text-base sm:text-lg">
                    No ranking data available yet.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Place some bets to get ranked!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-[#333447] rounded-[12px] sm:rounded-[15px] p-1 flex space-x-1 w-full max-w-md">
              <button
                onClick={() => setSelectedTab("leaderboard")}
                className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-[8px] sm:rounded-[10px] font-medium text-xs sm:text-sm transition-all duration-300 ${
                  selectedTab === "leaderboard"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-600"
                }`}
              >
                🏆 Overall
              </button>
              <button
                onClick={() => setSelectedTab("profits")}
                className={`px-6 py-3 rounded-[10px] font-medium transition-all duration-300 ${
                  selectedTab === "profits"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-600"
                }`}
              >
                � Top Earners
              </button>
            </div>
          </div>

          {/* Leaderboard Content */}
          {selectedTab === "leaderboard" && (
            <>
              <LeaderboardTable
                data={leaderboard}
                loading={leaderboardLoading}
                title="🏆 Overall Leaderboard"
              />

              {pagination.hasMore && (
                <div className="flex justify-center">
                  <Button
                    onClick={loadMore}
                    disabled={leaderboardLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-[12px] sm:rounded-[15px] font-medium text-sm sm:text-base transition-all duration-300 w-full sm:w-auto"
                  >
                    {leaderboardLoading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}

          {selectedTab === "profits" && (
            <LeaderboardTable
              data={topProfits}
              loading={topProfitsLoading}
              title="💎 Top Profit Makers"
            />
          )}

          {/* Error States */}
          {leaderboardError && (
            <div className="bg-red-900/20 border border-red-500 rounded-[12px] sm:rounded-[15px] p-4 sm:p-6 text-center">
              <div className="text-red-400 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl mb-2 block">⚠️</span>
                <p className="text-sm sm:text-lg">{leaderboardError}</p>
              </div>
              <Button
                onClick={refreshLeaderboard}
                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-[8px] sm:rounded-[10px] font-medium text-sm sm:text-base transition-all duration-300 w-full sm:w-auto"
              >
                Try Again
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
