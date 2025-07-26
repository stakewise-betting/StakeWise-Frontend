//StakeWise-Frontend/src/pages/Reward/Reward.tsx
import RaffleSection from '@/components/RewardCom/RaffleSection'
import TokenClaimSection from '@/components/RewardCom/TokenClaimsSection'
import RedeemSection from '@/components/RewardCom/RedeemSection'


const RewardPage = () => {
  return (
    <div className="min-h-screen bg-[#1C1C27] text-white">
      
      <main className="container mx-auto px-[50px] py-0">
        {/* Section 1 */}
        <RaffleSection />

        {/* Section 2 */}
        
      </main>
     
    </div>
  )
}
export default RewardPage
