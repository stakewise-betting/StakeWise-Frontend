// import { TicketIcon, ClockIcon, UsersIcon, CoinsIcon } from 'lucide-react'
// const RaffleSection = () => {
//   const raffles = [
//     {
//       id: 1,
//       name: 'Weekly Crypto Jackpot',
//       prize: '5,000 USDT',
//       endTime: '23:59:42',
//       participants: 1243,
//       ticketPrice: '50 BTC',
//       image:
//         'https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop',
//     },
//     {
//       id: 2,
//       name: 'NFT Collection Giveaway',
//       prize: 'Rare Crypto Punk NFT',
//       endTime: '47:22:13',
//       participants: 876,
//       ticketPrice: '25 ETH',
//       image:
//         'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
//     },
//     {
//       id: 3,
//       name: 'Gaming Console Bundle',
//       prize: 'PS5 + Gaming Bundle',
//       endTime: '11:45:30',
//       participants: 2154,
//       ticketPrice: '100 USDT',
//       image:
//         'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2819&auto=format&fit=crop',
//     },
//     {
//       id: 4,
//       name: 'Ultimate Tech Bundle',
//       prize: 'MacBook Pro + iPhone 15 Pro',
//       endTime: '35:12:09',
//       participants: 3102,
//       ticketPrice: '200 USDT',
//       image:
//         'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2940&auto=format&fit=crop',
//     },
//     {
//       id: 5,
//       name: 'Luxury Timepiece',
//       prize: 'Rolex Submariner',
//       endTime: '72:00:00',
//       participants: 5431,
//       ticketPrice: '500 ETH',
//       image:
//         'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2787&auto=format&fit=crop',
//     },
//   ]
//   return (
//     <section className="py-10">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold">Active Raffles</h2>
//         <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition">
//           View All
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {raffles.map((raffle) => (
//           <div
//             key={raffle.id}
//             className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition group"
//           >
//             <div className="relative h-48 overflow-hidden">
//               <img
//                 src={raffle.image}
//                 alt={raffle.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//               />
//               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
//               <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                 Hot Deal
//               </div>
//             </div>
//             <div className="p-5">
//               <h3 className="text-xl font-bold mb-2">{raffle.name}</h3>
//               <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
//                 <div className="text-center">
//                   <p className="text-sm text-gray-400">Prize Pool</p>
//                   <p className="text-xl font-bold text-green-400">
//                     {raffle.prize}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex justify-between mb-4">
//                 <div className="flex items-center">
//                   <ClockIcon size={16} className="text-gray-400 mr-1" />
//                   <span className="text-sm">Ends in {raffle.endTime}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <UsersIcon size={16} className="text-gray-400 mr-1" />
//                   <span className="text-sm">{raffle.participants} players</span>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <TicketIcon size={16} className="text-gray-400 mr-1" />
//                   <span className="text-sm">{raffle.ticketPrice}</span>
//                 </div>
//                 <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition">
//                   <CoinsIcon size={16} className="mr-1" />
//                   <span>Buy Ticket</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   )
// }
// export default RaffleSection


import { TicketIcon, ClockIcon, UsersIcon, CoinsIcon } from 'lucide-react'
const RaffleSection = () => {
  const raffles = [
    {
      id: 1,
      name: 'Weekly Crypto Jackpot',
      prize: '5,000 USDT',
      endTime: '23:59:42',
      participants: 1243,
      ticketPrice: '50 BTC',
      image:
        'https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Gaming Console Bundle',
      prize: 'PS5 + Gaming Bundle',
      endTime: '11:45:30',
      participants: 2154,
      ticketPrice: '100 USDT',
      image:
        'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2819&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Ultimate Tech Bundle',
      prize: 'MacBook Pro + iPhone 15 Pro',
      endTime: '35:12:09',
      participants: 3102,
      ticketPrice: '200 USDT',
      image:
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2940&auto=format&fit=crop',
    },
    {
      id: 5,
      name: 'Luxury Timepiece',
      prize: 'Rolex Submariner',
      endTime: '72:00:00',
      participants: 5431,
      ticketPrice: '500 ETH',
      image:
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2787&auto=format&fit=crop',
    },
  ]
  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Active Raffles</h2>
        <button className="px-4 py-2 text-sm bg-transparent border border-[#E27625] text-[#ffffff] hover:bg-[#E27625] rounded-lg transition">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {raffles.map((raffle) => (
          <div
            key={raffle.id}
            className="bg-[#333447] rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={raffle.image}
                alt={raffle.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 bg-[#E27625] text-white px-3 py-1 rounded-full text-sm font-medium">
                Hot Deal
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">{raffle.name}</h3>
              <div className="bg-[#505279] rounded-lg p-3 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Prize Pool</p>
                  <p className="text-xl font-bold text-[#00BD58]">
                    {raffle.prize}
                  </p>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <ClockIcon size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm">Ends in {raffle.endTime}</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm">{raffle.participants} players</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TicketIcon size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm">{raffle.ticketPrice}</span>
                </div>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition">
                  <CoinsIcon size={16} className="mr-1" />
                  <span>Buy Ticket</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
export default RaffleSection
