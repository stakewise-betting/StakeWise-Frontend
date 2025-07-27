// components/Achievements/DynamicAchievements.tsx
import { Card } from "@/components/ui/card";
import { CircularProgress } from "./circular-progress";
import { Trophy, Lock } from "lucide-react";
import userAchievementMain from "@/assets/images/userAchievementMain.png";
import { BiSolidBadge } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";
import { useLevelSystem } from "@/hooks/useLevelSystem";
import { useAchievements } from "@/hooks/useAchievements";
import { motion } from "framer-motion";

export default function DynamicAchievements() {
  const { userLevel, loading: levelLoading } = useLevelSystem();
  const {
    achievements,
    unlockedCount,
    totalCount,
    loading: achievementsLoading,
  } = useAchievements();

  const displayedAchievements = achievements.slice(0, 3);

  if (levelLoading || achievementsLoading) {
    return (
      <div className="flex items-center justify-center lg:mx-24 md:mx-16 mx-8 my-[96px]">
        <div className="w-full grid lg:grid-cols-3 gap-12">
          <Card className="min-h-[380px] lg:col-span-1 p-8 border-0 rounded-[20px] animate-pulse">
            <div className="bg-gray-600 h-full rounded-[20px]"></div>
          </Card>
          <Card className="lg:col-span-2 bg-[#333447] border-0 rounded-[20px] px-14 py-7 animate-pulse">
            <div className="h-64 bg-gray-600 rounded-[20px]"></div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center lg:mx-24 md:mx-16 mx-8 my-[96px]">
      <div className="w-full grid lg:grid-cols-3 gap-12">
        {/* Left Card */}
        <Card className="min-h-[380px] lg:col-span-1 p-8 border-0 rounded-[20px] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${userAchievementMain})` }}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-start p-4 rounded-[20px]">
            <motion.h2
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Unlock your success
            </motion.h2>
            <motion.p
              className="text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Earn badges for every milestone and achievement!
            </motion.p>
          </div>
        </Card>

        {/* Right Card */}
        <Card className="lg:col-span-2 bg-[#333447] border-0 rounded-[20px] px-14 py-7">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="flex flex-col justify-center items-center gap-9">
              <div>
                <h3 className="text-lg font-bold">Level Progress</h3>
                <p className="text-sm">
                  {unlockedCount}/{totalCount} achievements unlocked
                </p>
              </div>

              {/* Dynamic Level Progress */}
              <div className="">
                <CircularProgress
                  value={userLevel.progress}
                  size={185}
                  strokeWidth={12}
                >
                  <motion.div
                    className="text-center flex flex-col items-center gap-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <BiSolidBadge size={20} className="text-[#09AD8F]" />
                    <div className="text-4xl font-bold">
                      {userLevel.currentLevel}
                    </div>
                    <div className="text-[12px] text-[#A0AEC0]">
                      Current level
                    </div>
                  </motion.div>
                </CircularProgress>
              </div>

              <div className="text-sm text-center">
                <p className="font-bold text-[18px]">
                  {userLevel.xpToNextLevel} more
                </p>
                <p className="text-sm text-[#8F9BBA]">XP to next level</p>
              </div>
            </div>

            <div>
              {/* Dynamic Achievement Cards */}
              <div className="space-y-5">
                {displayedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AchievementCard
                      title={achievement.title}
                      description={achievement.description}
                      isUnlocked={achievement.isUnlocked}
                    />
                  </motion.div>
                ))}
              </div>

              <button className="font-bold text-gray-400 text-[12px] flex items-center justify-center space-x-1 hover:text-white transition-colors mt-3">
                <span>More Awards ({achievements.length - 3} more)</span>
                <FaArrowRight className="w-2 h-2" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AchievementCard({
  title,
  description,
  isUnlocked,
}: {
  title: string;
  description: string;
  isUnlocked: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-[18px] py-[14px] h-[85px] rounded-[20px] gap-3 transition-all duration-300 ${
        isUnlocked
          ? "bg-gradient-to-r from-[#060B26] to-[#1A1F37]"
          : "bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] opacity-60"
      }`}
    >
      <div className="space-y-1">
        <h4
          className={`font-medium text-[12px] ${
            isUnlocked ? "text-[#A0AEC0]" : "text-[#666]"
          }`}
        >
          {title}
        </h4>
        <p
          className={`text-sm font-bold ${
            isUnlocked ? "text-white" : "text-[#888]"
          }`}
        >
          {description}
        </p>
      </div>
      <div
        className={`h-14 w-14 rounded-[10px] flex items-center justify-center shadow-lg transition-all duration-300 ${
          isUnlocked
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
            : "bg-gradient-to-r from-gray-500 to-gray-600"
        }`}
      >
        {isUnlocked ? (
          <Trophy className="w-4 h-4 text-white" />
        ) : (
          <Lock className="w-4 h-4 text-white" />
        )}
      </div>
    </div>
  );
}
