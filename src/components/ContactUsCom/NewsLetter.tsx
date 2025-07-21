import { FiFacebook } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { Gift, Calendar, Shield, Users, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NewsLetter = () => {
  return (
    <div className="mt-16">
      <Card className="bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#E27625]/10 to-[#F4A261]/10 border-b border-[#333447]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-[#E27625] to-[#F4A261] rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-zinc-100">
              Stay Connected with StakeWise
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-zinc-400">
            Join our community for exclusive offers, expert betting tips, and
            the latest platform updates.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Social Media Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  Follow Our Community
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-16 rounded-xl bg-gradient-to-br from-[#1877F2]/10 to-[#1877F2]/5 hover:from-[#1877F2]/20 hover:to-[#1877F2]/10 border-[#1877F2]/30 hover:border-[#1877F2]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FiFacebook className="text-[#1877F2] text-xl" />
                    <span className="text-xs font-medium text-zinc-300">
                      Facebook
                    </span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 rounded-xl bg-gradient-to-br from-[#1DA1F2]/10 to-[#1DA1F2]/5 hover:from-[#1DA1F2]/20 hover:to-[#1DA1F2]/10 border-[#1DA1F2]/30 hover:border-[#1DA1F2]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FaXTwitter className="text-[#1DA1F2] text-xl" />
                    <span className="text-xs font-medium text-zinc-300">
                      Twitter
                    </span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 rounded-xl bg-gradient-to-br from-[#D62976]/10 to-[#962FBF]/5 hover:from-[#D62976]/20 hover:to-[#962FBF]/10 border-[#D62976]/30 hover:border-[#D62976]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FaInstagram className="text-[#D62976] text-xl" />
                    <span className="text-xs font-medium text-zinc-300">
                      Instagram
                    </span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 rounded-xl bg-gradient-to-br from-[#FF0000]/10 to-[#FF0000]/5 hover:from-[#FF0000]/20 hover:to-[#FF0000]/10 border-[#FF0000]/30 hover:border-[#FF0000]/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FiYoutube className="text-[#FF0000] text-xl" />
                    <span className="text-xs font-medium text-zinc-300">
                      YouTube
                    </span>
                  </div>
                </Button>
              </div>

              <p className="text-sm text-zinc-400 text-center">
                Join thousands of bettors sharing tips and celebrating wins
                together
              </p>
            </div>

            {/* Promotions Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-lg">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  Latest Promotions
                </h3>
              </div>

              <div className="space-y-4">
                <div className="group bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#333447] hover:border-[#F59E0B]/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-lg">
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                          100% Welcome Bonus
                        </h4>
                        <Badge className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-white border-0 text-xs">
                          New
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mb-2">
                        Double your first deposit up to $500
                      </p>
                      <div className="text-xs text-amber-500/80">
                        Terms apply • 18+ only
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#333447] hover:border-[#3B82F6]/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-400 group-hover:text-blue-300 transition-colors mb-2">
                        Free Bet Sunday
                      </h4>
                      <p className="text-sm text-zinc-400 mb-2">
                        Place 5 qualifying bets and receive a free bet token
                      </p>
                      <div className="text-xs text-blue-500/80">
                        Every Sunday • Min odds apply
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#333447] hover:border-[#10B981]/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors mb-2">
                        Accumulator Insurance
                      </h4>
                      <p className="text-sm text-zinc-400 mb-2">
                        Get your stake back if one leg lets you down on 5+ fold
                        accas
                      </p>
                      <div className="text-xs text-emerald-500/80">
                        Max refund $50 • Selected markets
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsLetter;
