import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Shield } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import SupportTab from "./SupportTab";
import ResponsibleGamblingTab from "./ResponsibleGamblingTab";

const ContactUsTabs = () => {
  const { isLoggedin } = useContext(AppContext)!;

  return (
    <div className="mb-16 w-full max-w-full">
      <Tabs defaultValue="support" className="w-full flex flex-col">
        <TabsList className="grid w-full h-full grid-cols-2 bg-gradient-to-r from-[#2A2A3A] to-[#1C1C27] rounded-2xl p-2 border border-[#333447] shadow-2xl mb-8 shrink-0">
          <TabsTrigger
            value="support"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3B82F6] data-[state=active]:to-[#60A5FA] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-3 sm:py-4 px-4 sm:px-8 font-semibold transition-all duration-300 transform data-[state=active]:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-zinc-300 hover:text-white text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">Support</span>
          </TabsTrigger>
          <TabsTrigger
            value="responsible"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#A78BFA] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-3 sm:py-4 px-4 sm:px-8 font-semibold transition-all duration-300 transform data-[state=active]:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-zinc-300 hover:text-white text-sm sm:text-base"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">Responsible Gambling</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 w-full">
          <TabsContent
            value="support"
            className="mt-0 w-full h-full data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="w-full flex-1">
              <SupportTab isLoggedin={isLoggedin} />
            </div>
          </TabsContent>

          <TabsContent
            value="responsible"
            className="mt-0 w-full h-full data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="w-full flex-1">
              <ResponsibleGamblingTab isLoggedin={isLoggedin} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ContactUsTabs;
