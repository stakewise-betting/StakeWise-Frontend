// import {
//   ShoppingBagIcon,
//   TagIcon,
//   CoinsIcon,
//   ArrowRightIcon,
// } from 'lucide-react'
// const RedeemSection = () => {
//   const redeemItems = [
//     {
//       id: 1,
//       name: 'Premium Membership',
//       description: '1 Month of Premium benefits and exclusive access',
//       price: '500 BET',
//       image:
//         'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=2940&auto=format&fit=crop',
//       discount: '20% OFF',
//     },
//     {
//       id: 2,
//       name: 'Gaming Voucher',
//       description: '$50 voucher for Steam, Epic Games or PlayStation',
//       price: '750 BET',
//       image:
//         'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2942&auto=format&fit=crop',
//     },
//     {
//       id: 3,
//       name: 'Exclusive NFT',
//       description: 'Limited edition platform NFT with special benefits',
//       price: '1,200 BET',
//       image:
//         'https://images.unsplash.com/photo-1646471820603-c2a7fbac6cb1?q=80&w=2874&auto=format&fit=crop',
//       discount: 'NEW',
//     },
//     {
//       id: 4,
//       name: 'Crypto Cashback',
//       description: 'Get USDT directly to your wallet',
//       price: '2,000 BET',
//       image:
//         'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2815&auto=format&fit=crop',
//     },
//     {
//       id: 5,
//       name: 'Hardware Wallet',
//       description: 'Ledger Nano X - Secure your crypto assets',
//       price: '800 BET',
//       image:
//         'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2942&auto=format&fit=crop',
//       discount: 'Limited Stock',
//     },
//     {
//       id: 6,
//       name: 'Luxury Getaway',
//       description: '3 nights at a 5-star resort in Maldives',
//       price: '5,000 BET',
//       image:
//         'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2942&auto=format&fit=crop',
//       discount: 'VIP Only',
//     },
//   ]
//   return (
//     <section className="py-10">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold">Redeem Rewards</h2>
//         <button className="flex items-center px-4 py-2 text-sm bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10 rounded-lg transition">
//           <ShoppingBagIcon size={16} className="mr-2" />
//           View All Rewards
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {redeemItems.map((item) => (
//           <div
//             key={item.id}
//             className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition group"
//           >
//             <div className="relative h-48 overflow-hidden">
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//               />
//               {item.discount && (
//                 <div
//                   className={`absolute top-3 right-3 ${item.discount === 'NEW' ? 'bg-green-600' : 'bg-purple-600'} text-white px-2 py-1 rounded-md text-xs font-medium`}
//                 >
//                   {item.discount}
//                 </div>
//               )}
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-bold mb-1">{item.name}</h3>
//               <p className="text-gray-400 text-sm mb-4 line-clamp-2">
//                 {item.description}
//               </p>
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <CoinsIcon size={16} className="text-yellow-400 mr-1" />
//                   <span className="font-medium">{item.price}</span>
//                 </div>
//                 <button className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm">
//                   Redeem
//                   <ArrowRightIcon size={16} className="ml-1" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-8">
//         <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl overflow-hidden">
//           <div className="grid md:grid-cols-2">
//             <div className="p-6 md:p-8">
//               <div className="inline-block p-3 bg-blue-600/20 rounded-lg mb-4">
//                 <TagIcon size={24} className="text-blue-400" />
//               </div>
//               <h3 className="text-xl font-bold mb-2">VIP Rewards Program</h3>
//               <p className="text-gray-300 mb-4">
//                 Join our VIP program to unlock exclusive rewards, higher
//                 cashback rates, and special event access.
//               </p>
//               <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition">
//                 Upgrade to VIP
//               </button>
//             </div>
//             <div className="hidden md:block relative">
//               <img
//                 src="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=2864&auto=format&fit=crop"
//                 alt="VIP Rewards"
//                 className="absolute inset-0 h-full w-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
// export default RedeemSection



import {ShoppingBagIcon,TagIcon,CoinsIcon,ArrowRightIcon,} from 'lucide-react'
const RedeemSection = () => {
  const redeemItems = [
    {
      id: 1,
      name: 'Premium Membership',
      description: '1 Month of Premium benefits and exclusive access',
      price: '500 BET',
      image:
        'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=2940&auto=format&fit=crop',
      discount: '20% OFF',
    },
    {
      id: 2,
      name: 'Gaming Voucher',
      description: '$50 voucher for Steam, Epic Games or PlayStation',
      price: '750 BET',
      image:
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2942&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Crypto Cashback',
      description: 'Get USDT directly to your wallet',
      price: '2,000 BET',
      image:
        'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2815&auto=format&fit=crop',
    },
    {
      id: 5,
      name: 'Hardware Wallet',
      description: 'Ledger Nano X - Secure your crypto assets',
      price: '800 BET',
      image:
        'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2942&auto=format&fit=crop',
      discount: 'Limited Stock',
    },
    {
      id: 6,
      name: 'Luxury Getaway',
      description: '3 nights at a 5-star resort in Maldives',
      price: '5,000 BET',
      image:
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2942&auto=format&fit=crop',
      discount: 'NEW',
    },
  ]
  return (
    <section className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Redeem Rewards</h2>
        <button className="flex items-center px-4 py-2 text-sm bg-transparent border border-[#E27625] text-[#ffffff] hover:bg-[#E27625] rounded-lg transition">
          <ShoppingBagIcon size={16} className="mr-2" />
          View All Rewards
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {redeemItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#333447] rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {item.discount && (
                <div
                  className={`absolute top-3 right-3 ${item.discount === 'NEW' ? 'bg-[#00BD58]' : 'bg-purple-600'} text-white px-2 py-1 rounded-md text-xs font-medium`}
                >
                  {item.discount}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CoinsIcon size={16} className="text-yellow-400 mr-1" />
                  <span className="font-medium">{item.price}</span>
                </div>
                <button className="flex items-center px-3 py-1.5 bg-[#E28625] hover:bg-[#E27625] rounded-lg transition text-sm">
                  Redeem
                  <ArrowRightIcon size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="inline-block p-3 bg-blue-600/20 rounded-lg mb-4">
                <TagIcon size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">VIP Rewards Program</h3>
              <p className="text-gray-300 mb-4">
                Join our VIP program to unlock exclusive rewards, higher
                cashback rates, and special event access.
              </p>
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition">
                Upgrade to VIP
              </button>
            </div>
            <div className="hidden md:block relative">
              <img
                src="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=2864&auto=format&fit=crop"
                alt="VIP Rewards"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default RedeemSection
