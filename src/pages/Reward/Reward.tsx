import RaffleSection from '@/components/RewardCom/RaffleSection'
import TokenClaimSection from '@/components/RewardCom/TokenClaimsSection'
import RedeemSection from '@/components/RewardCom/RedeemSection'


const RewardPage = () => {
  return (
    <div className="min-h-screen bg-[#1C1C27] text-white">
      
      <main className="container mx-auto px-[50px] py-0">
        <RaffleSection />
        <TokenClaimSection />
        <RedeemSection />
      </main>
      
    </div>
  )
}

export default RewardPage
