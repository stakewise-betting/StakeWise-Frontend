import { FiFacebook } from "react-icons/fi"
import { FaXTwitter } from "react-icons/fa6"
import { FaInstagram } from "react-icons/fa6"
import { FiYoutube } from "react-icons/fi"
import { Gift, Calendar, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const NewsLetter = () => {
  return (
    <div>
      <div className="mt-12">
        <Card className="bg-[#1C1C27] border-none shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
          <CardHeader>
            <CardTitle>Get BetWin Updates</CardTitle>
            <CardDescription>Subscribe for exclusive offers, betting tips, and promotions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold mb-4">Follow Our Socials</h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/50"
                  >
                    <FiFacebook className="text-[#1877F2]" />
                    <span className="sr-only">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/50"
                  >
                    <FaXTwitter className="text-[#1DA1F2]" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-gradient-to-br from-[#FEDA75]/10 via-[#D62976]/10 to-[#962FBF]/10 hover:bg-gradient-to-br hover:from-[#FEDA75]/20 hover:via-[#D62976]/20 hover:to-[#962FBF]/20 border-[#D62976]/50"
                  >
                    <FaInstagram className="text-[#D62976]" />
                    <span className="sr-only">Instagram</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/50"
                  >
                    <FiYoutube className="text-[#FF0000]" />
                    <span className="sr-only">YouTube</span>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Latest Promotions</h3>
                <div className="space-y-3">
                  <div className="group flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                    <div className="flex-shrink-0 p-1.5 bg-gradient-to-br bg-white rounded-full border-none">
                      <Gift className="h-4 w-4 text-[#E27625]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-amber-500/90 group-hover:text-amber-400">
                        100% Welcome Bonus
                      </p>
                      <p className="text-xs text-muted-foreground">Up to $500 on your first deposit</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="ml-auto text-xs border-amber-500/30 bg-amber-500/10 text-amber-400"
                    >
                      New
                    </Badge>
                  </div>

                  <div className="group flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                    <div className="flex-shrink-0 p-1.5 bg-gradient-to-br bg-white rounded-full border-none">
                      <Calendar className="h-4 w-4 text-[#E27625]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-blue-500/90 group-hover:text-blue-400">Free Bet Sunday</p>
                      <p className="text-xs text-muted-foreground">Place 5 bets, get 1 free</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                    <div className="flex-shrink-0 p-1.5 bg-gradient-to-br bg-white rounded-full border-none">
                      <Shield className="h-4 w-4 text-[#E27625]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-emerald-500/90 group-hover:text-emerald-400">
                        Accumulator Insurance
                      </p>
                      <p className="text-xs text-muted-foreground">Money back on 5+ folds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NewsLetter
