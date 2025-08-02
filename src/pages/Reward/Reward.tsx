//StakeWise-Frontend/src/pages/Reward/Reward.tsx
import RaffleSection from '@/components/RewardCom/RaffleSection'


// import TokenClaimSection from '@/components/RewardCom/TokenClaimsSection'
// import RedeemSection from '@/components/RewardCom/RedeemSection'



const RewardPage = () => {
  return (
    <div className="min-h-screen bg-[#1C1C27] text-white">
      
      <main className="container mx-auto px-[50px] py-12">
        <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent mb-2 text-center sm:text-left">
                        Active Raffles
                    </h1>
                    <p className="text-[#A1A1AA] text-sm sm:text-base lg:text-lg text-center sm:text-left leading-relaxed">
                        Join exciting raffles and win amazing prizes! 🪄🎲💫
                    </p>
                </div>
            </div>    
        <RaffleSection />     
      </main>  
    </div>
  )
}
export default RewardPage