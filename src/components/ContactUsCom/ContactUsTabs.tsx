import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Shield } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import SupportTab from "./SupportTab";
import ResponsibleGamblingTab from "./ResponsibleGamblingTab";

const ContactUsTabs = () => {
  const { isLoggedin } = useContext(AppContext)!;

  return (
    <div className="mb-16">
      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-[#2A2A3A] to-[#1C1C27] rounded-2xl p-2 border border-[#333447] shadow-2xl">
          <TabsTrigger
            value="support"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3B82F6] data-[state=active]:to-[#60A5FA] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-4 px-8 font-semibold transition-all duration-300 transform data-[state=active]:scale-105 flex items-center justify-center gap-3 text-zinc-300 hover:text-white"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-base">Support</span>
          </TabsTrigger>
          <TabsTrigger
            value="responsible"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#A78BFA] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-4 px-8 font-semibold transition-all duration-300 transform data-[state=active]:scale-105 flex items-center justify-center gap-3 text-zinc-300 hover:text-white"
          >
            <Shield className="w-5 h-5" />
            <span className="text-base">Responsible Gambling</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="mt-8">
          <SupportTab isLoggedin={isLoggedin} />
        </TabsContent>

        <TabsContent value="responsible" className="mt-8">
          <ResponsibleGamblingTab isLoggedin={isLoggedin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactUsTabs;
