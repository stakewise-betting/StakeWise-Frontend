import { Card } from "@/components/ui/card";
import { CircularProgress } from "./circular-progress";
import { Trophy } from "lucide-react";
import userAchievementMain from "@/assets/images/userAchievementMain.png";
import { BiSolidBadge } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";

export default function Achievements() {
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
            <h2 className="text-3xl font-bold">Unlock your success</h2>
            <p className="text-base">
              Earn badges for every milestone and achievement!
            </p>
          </div>
        </Card>

        {/* Right Card */}
        <Card className="lg:col-span-2 bg-[#333447] border-0 rounded-[20px] px-14 py-7">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="flex flex-col justify-center items-center gap-9">
              <div>
                <h3 className="text-lg font-bold">Award Informations</h3>
                <p className="text-sm ">Hello, Hiruna Warusawithana!</p>
              </div>

              {/* Level Progress */}
              <div className="">
                <CircularProgress value={60} size={185} strokeWidth={12}>
                  <div className="text-center flex flex-col items-center gap-2">
                    <BiSolidBadge size={20} className="text-[#09AD8F]" />
                    <div className="text-4xl font-bold">3</div>
                    <div className="text-[12px] text-[#A0AEC0]">
                      Current level
                    </div>
                  </div>
                </CircularProgress>
              </div>

              <div className="text-sm text-center">
                <p className="font-bold text-[18px]">58 more</p>
                <p className="text-sm text-[#8F9BBA]">Points to next level</p>
              </div>
            </div>

            <div>
              {/* Achievement Cards */}
              <div className="space-y-5">
                <AchievementCard
                  title="100 Bets Placed"
                  description="For users who've placed 100 bets."
                />
                <AchievementCard
                  title="10 Consecutive Wins"
                  description="For 10 straight wins."
                />
                <AchievementCard
                  title="Big Winner"
                  description="For a single payout exceeding $1000."
                />
              </div>

              <button className=" font-bold text-gray-400 text-[12px] flex items-center justify-center space-x-1 hover:text-white transition-colors mt-3">
                <span>More Awards</span>
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
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between px-[18px] py-[14px] bg-gradient-to-r from-[#060B26] to-[#1A1F37] h-[85px] rounded-[20px] gap-3">
      <div className="space-y-1">
        <h4 className="font-medium text-[#A0AEC0] text-[12px]">{title}</h4>
        <p className="text-sm font-bold">{description}</p>
      </div>
      <div className="h-14 w-14 rounded-[10px] bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
        <Trophy className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}
