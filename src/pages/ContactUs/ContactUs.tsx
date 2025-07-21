import { motion } from "framer-motion";
import { MessageCircle, Shield, Headphones } from "lucide-react";
import NewsLetter from "@/components/ContactUsCom/NewsLetter";
import ContactUsTabs from "@/components/ContactUsCom/ContactUsTabs";

export default function ContactUs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F15] via-[#1C1C27] to-[#0F0F15]">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-2xl shadow-2xl">
                  <Headphones className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent mb-6">
                Contact Support
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                Our dedicated team is available 24/7 to assist you with any
                betting queries, account issues, or responsible gambling
                support.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-lg">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-semibold text-zinc-100">
                      24/7 Support
                    </div>
                    <div className="text-sm text-zinc-400">
                      Always here to help
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-semibold text-zinc-100">
                      Responsible Gaming
                    </div>
                    <div className="text-sm text-zinc-400">
                      Tools & support available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ContactUsTabs />
            <NewsLetter />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
