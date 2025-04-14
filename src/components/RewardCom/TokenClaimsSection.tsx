// import {
//   CoinsIcon,
//   GiftIcon,
//   TrophyIcon,
//   ClockIcon,
//   StarIcon,
//   FlagIcon,
// } from 'lucide-react'
// const TokenClaimSection = () => {
//   const tokenCards = [
//     {
//       id: 1,
//       title: 'Daily Bonus',
//       description: 'Claim your daily tokens just for logging in!',
//       amount: '50 BET',
//       icon: <GiftIcon size={24} className="text-yellow-400" />,
//       status: 'Ready to claim',
//       buttonText: 'Claim Now',
//       active: true,
//     },
//     {
//       id: 2,
//       title: 'Weekly Reward',
//       description: 'Bonus tokens for your weekly activity',
//       amount: '250 BET',
//       icon: <TrophyIcon size={24} className="text-purple-400" />,
//       status: 'Available in 2 days',
//       buttonText: 'Coming Soon',
//       active: false,
//     },
//     {
//       id: 3,
//       title: 'Referral Bonus',
//       description: 'Tokens earned from referring friends',
//       amount: '125 BET',
//       icon: <CoinsIcon size={24} className="text-green-400" />,
//       status: '3 referrals pending',
//       buttonText: 'View Details',
//       active: true,
//     },
//     {
//       id: 4,
//       title: 'Tournament Reward',
//       description: 'First place in Crypto Crash Tournament',
//       amount: '1,000 BET',
//       icon: <StarIcon size={24} className="text-blue-400" />,
//       status: 'Ready to claim',
//       buttonText: 'Claim Now',
//       active: true,
//     },
//     {
//       id: 5,
//       title: 'Milestone Bonus',
//       description: 'Reached 100,000 BET wagered',
//       amount: '500 BET',
//       icon: <FlagIcon size={24} className="text-red-400" />,
//       status: 'Ready to claim',
//       buttonText: 'Claim Now',
//       active: true,
//     },
//   ]
//   return (
//     <section className="py-10">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold">Token Claims</h2>
//         <button className="flex items-center px-4 py-2 text-sm bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10 rounded-lg transition">
//           <ClockIcon size={16} className="mr-2" />
//           Claim History
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {tokenCards.map((card) => (
//           <div
//             key={card.id}
//             className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
//           >
//             <div className="p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-gray-700/50 rounded-lg">{card.icon}</div>
//                 <div className="text-right">
//                   <h3 className="font-bold text-lg">{card.title}</h3>
//                   <p
//                     className={`text-sm ${card.active ? 'text-green-400' : 'text-gray-400'}`}
//                   >
//                     {card.status}
//                   </p>
//                 </div>
//               </div>
//               <p className="text-gray-400 text-sm mb-4">{card.description}</p>
//               <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-400">Amount</span>
//                   <span className="text-lg font-bold text-white">
//                     {card.amount}
//                   </span>
//                 </div>
//               </div>
//               <button
//                 className={`w-full py-2.5 rounded-lg transition text-center ${card.active ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
//                 disabled={!card.active}
//               >
//                 {card.buttonText}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-blue-900/30">
//         <div className="flex flex-col md:flex-row items-center justify-between">
//           <div className="mb-4 md:mb-0">
//             <h3 className="text-xl font-bold mb-2">Token Balance</h3>
//             <p className="text-gray-400 mb-2">Your current BET token balance</p>
//             <div className="flex items-center">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-2">
//                 <CoinsIcon size={18} />
//               </div>
//               <span className="text-2xl font-bold">1,250 BET</span>
//             </div>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
//               Buy Tokens
//             </button>
//             <button className="px-6 py-3 bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10 rounded-lg transition">
//               Transfer
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
// export default TokenClaimSection



import {CoinsIcon,GiftIcon,TrophyIcon,ClockIcon,StarIcon,} from 'lucide-react'
const TokenClaimSection = () => {
  const tokenCards = [
    {
      id: 1,
      title: 'Daily Bonus',
      description: 'Claim your daily tokens just for logging in!',
      amount: '50 BET',
      icon: <GiftIcon size={24} className="text-yellow-400" />,
      status: 'Ready to claim',
      buttonText: 'Claim Now',
      active: true,
    },
    {
      id: 2,
      title: 'Weekly Reward',
      description: 'Bonus tokens for your weekly activity',
      amount: '250 BET',
      icon: <TrophyIcon size={24} className="text-purple-400" />,
      status: 'Available in 2 days',
      buttonText: 'Coming Soon',
      active: false,
    },
    {
      id: 3,
      title: 'Referral Bonus',
      description: 'Tokens earned from referring friends',
      amount: '125 BET',
      icon: <CoinsIcon size={24} className="text-green-400" />,
      status: '3 referrals pending',
      buttonText: 'View Details',
      active: true,
    },
    {
      id: 4,
      title: 'Tournament Reward',
      description: 'First place in Crypto Crash Tournament',
      amount: '1,000 BET',
      icon: <StarIcon size={24} className="text-blue-400" />,
      status: 'Ready to claim',
      buttonText: 'Claim Now',
      active: true,
    },
  ]
  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Token Claims</h2>
        <button className="flex items-center px-4 py-2 text-sm bg-transparent border border-[#E27625] text-[#ffffff] hover:bg-[#E27625] rounded-lg transition">
          <ClockIcon size={16} className="mr-2" />
          Claim History
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tokenCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#333447] rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#393A53] rounded-lg">{card.icon}</div>
                <div className="text-right">
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <p
                    className={`text-sm ${card.active ? 'text-[#00BD58]' : 'text-gray-400'}`}
                  >
                    {card.status}
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">{card.description}</p>
              <div className="bg-[#393A53] rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-lg font-bold text-white">
                    {card.amount}
                  </span>
                </div>
              </div>
              <button
                className={`w-full py-2.5 rounded-lg transition text-center ${card.active ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                disabled={!card.active}
              >
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-blue-900/30">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Token Balance</h3>
            <p className="text-gray-400 mb-2">Your current BET token balance</p>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-2">
                <CoinsIcon size={18} />
              </div>
              <span className="text-2xl font-bold">1,250 BET</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-[#E28625] hover:bg-[#E27625] rounded-lg transition">
              Buy Tokens
            </button>
            <button className="px-6 py-3 bg-transparent border border-[#E27625] text-[#ffffff] hover:bg-[#db833f] rounded-lg transition">
              Transfer
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
export default TokenClaimSection
