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
import {
  Trophy,
  Medal,
  Award,
  Target,
  TrendingUp,
  Dice6,
  Crown,
  RefreshCw,
} from "lucide-react";

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
        return (
          <div className="p-2 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40">
            <Crown className="h-6 w-6 text-yellow-500" />
          </div>
        );
      case 2:
        return (
          <div className="p-2 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/40">
            <Medal className="h-6 w-6 text-gray-400" />
          </div>
        );
      case 3:
        return (
          <div className="p-2 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-700/20 border border-amber-600/40">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-secondary/20 border border-gray-700/60 min-w-[40px] flex items-center justify-center">
            <span className="text-sm font-bold text-dark-primary">#{rank}</span>
          </div>
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

  // Enhanced IconWrapper component matching Dashboard style
  const IconWrapper = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`p-2 rounded-full flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = "text-dark-primary",
  }: any) => (
    <div className="bg-card text-dark-primary rounded-xl shadow-lg border border-gray-700/60 p-4 md:p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-secondary/40 hover:-translate-y-1">
      <div className="flex justify-center mb-3">
        <IconWrapper className="bg-secondary/20">{icon}</IconWrapper>
      </div>
      <h3 className="text-dark-secondary text-xs sm:text-sm font-medium mb-2">
        {title}
      </h3>
      <p className={`text-lg sm:text-xl md:text-2xl font-bold ${color} mb-1`}>
        {value}
      </p>
      <p className="text-dark-secondary text-xs">{subtitle}</p>
    </div>
  );

  const LeaderboardTable = ({ data, loading, title }: any) => (
    <div className="bg-card text-dark-primary rounded-xl shadow-lg border border-gray-700/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-secondary/40 mb-6">
      <div className="p-6 border-b border-gray-700/60 bg-gradient-to-r from-secondary/5 to-transparent">
        <h3 className="text-xl sm:text-2xl font-bold text-dark-primary flex items-center gap-3">
          <IconWrapper className="bg-secondary/20">
            <Trophy className="h-6 w-6 text-secondary" />
          </IconWrapper>
          {title}
        </h3>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 bg-primary/30 rounded-lg animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-600/50 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-600/50 rounded w-1/2"></div>
                </div>
                <div className="w-24 h-8 bg-gray-600/50 rounded"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <IconWrapper className="bg-secondary/10 mx-auto mb-4">
              <Trophy className="h-8 w-8 text-secondary/50" />
            </IconWrapper>
            <p className="text-dark-secondary text-lg font-medium mb-2">
              No leaderboard data available yet.
            </p>
            <p className="text-dark-secondary/70 text-sm">
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
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg transition-all duration-300 hover:bg-secondary/5 hover:border hover:border-secondary/20 ${
                  user.userAddress === userAddress
                    ? "bg-secondary/10 border border-secondary/30 shadow-lg"
                    : "bg-primary/30"
                }`}
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="flex items-center justify-center flex-shrink-0">
                    {getRankIcon(user.rank)}
                  </div>

                  <Avatar className="h-12 w-12 border-2 border-gray-700/60 flex-shrink-0">
                    <AvatarImage
                      src={user.userData?.picture}
                      alt={getUserDisplayName(user)}
                    />
                    <AvatarFallback className="bg-secondary/20 text-secondary font-bold text-lg">
                      {getUserDisplayName(user)[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-dark-primary text-lg truncate">
                      {getUserDisplayName(user)}
                    </div>
                    <div className="text-sm text-dark-secondary truncate font-mono">
                      {formatAddress(user.userAddress)}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right w-full sm:w-auto mt-3 sm:mt-0">
                  <div
                    className={`font-bold text-xl ${
                      user.netProfit >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.netProfit >= 0 ? "+" : ""}
                    {formatNumber(user.netProfit)} ETH
                  </div>
                  <div className="text-sm text-dark-secondary">
                    {user.winRate.toFixed(1)}% Win Rate • {user.totalBetsPlaced}{" "}
                    Bets
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-card rounded-xl shadow-lg border border-gray-700/60 p-6 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-dark-primary mb-4 flex items-center justify-center gap-3">
                <IconWrapper className="bg-secondary/20">
                  <Trophy className="h-8 w-8 text-secondary" />
                </IconWrapper>
                Leaderboard
              </h1>
              <p className="text-dark-secondary text-lg max-w-2xl mx-auto">
                Compete with other players and climb the ranks based on your
                betting success
              </p>
            </div>
          </div>

          {/* User's Current Rank */}
          {userAddress && (
            <div className="bg-card rounded-xl shadow-lg border border-gray-700/60 p-6 mb-8">
              <h3 className="text-dark-primary text-xl font-bold mb-4 flex items-center gap-3">
                <IconWrapper className="bg-secondary/20">
                  <Target className="h-6 w-6 text-secondary" />
                </IconWrapper>
                Your Current Position
              </h3>
              {rankLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-primary/20 rounded-lg p-4"
                    >
                      <div className="h-8 bg-gray-600/50 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-600/50 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : rankError ? (
                <div className="text-red-400 text-center py-6 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-base sm:text-lg">{rankError}</p>
                </div>
              ) : userRank ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    title="Your Rank"
                    value={`#${userRank.rank}`}
                    subtitle="Current Position"
                    icon={<Crown className="h-6 w-6" />}
                    color="text-secondary"
                  />
                  <StatCard
                    title="Net Profit"
                    value={`${userRank.netProfit >= 0 ? "+" : ""}${formatNumber(
                      userRank.netProfit
                    )} ETH`}
                    subtitle="Total Earnings"
                    icon={<TrendingUp className="h-6 w-6" />}
                    color={
                      userRank.netProfit >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                  <StatCard
                    title="Win Rate"
                    value={`${userRank.winRate.toFixed(1)}%`}
                    subtitle="Success Rate"
                    icon={<Target className="h-6 w-6" />}
                    color="text-blue-400"
                  />
                  <StatCard
                    title="Total Bets"
                    value={userRank.totalBetsPlaced}
                    subtitle="Bets Placed"
                    icon={<Dice6 className="h-6 w-6" />}
                    color="text-purple-400"
                  />
                </div>
              ) : (
                <div className="text-center py-8 bg-secondary/5 rounded-lg border border-secondary/20">
                  <IconWrapper className="bg-secondary/10 mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-secondary/50" />
                  </IconWrapper>
                  <p className="text-dark-secondary text-lg font-medium mb-2">
                    No ranking data available yet.
                  </p>
                  <p className="text-dark-secondary/70 text-sm">
                    Place some bets to get ranked!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-card rounded-xl shadow-lg border border-gray-700/60 p-2 flex space-x-2 w-full max-w-md">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTab("leaderboard")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedTab === "leaderboard"
                    ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                    : "text-dark-secondary hover:text-dark-primary hover:bg-secondary/10"
                }`}
              >
                <Trophy className="h-4 w-4" />
                Overall
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTab("profits")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedTab === "profits"
                    ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                    : "text-dark-secondary hover:text-dark-primary hover:bg-secondary/10"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Top Earners
              </motion.button>
            </div>
          </div>

          {/* Leaderboard Content */}
          {selectedTab === "leaderboard" && (
            <>
              <LeaderboardTable
                data={leaderboard}
                loading={leaderboardLoading}
                title="Overall Leaderboard"
              />

              {pagination.hasMore && (
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    disabled={leaderboardLoading}
                    className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {leaderboardLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-5 w-5" />
                        Load More
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </>
          )}

          {selectedTab === "profits" && (
            <LeaderboardTable
              data={topProfits}
              loading={topProfitsLoading}
              title="Top Profit Makers"
            />
          )}

          {/* Error States */}
          {leaderboardError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center shadow-lg">
              <div className="text-red-400 mb-4">
                <IconWrapper className="bg-red-500/20 mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-red-400" />
                </IconWrapper>
                <p className="text-lg font-medium">{leaderboardError}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshLeaderboard}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
