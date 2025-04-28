// src/app/self-assessment/page.tsx
import { useState } from "react";
import { Shield, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelfAssessment from "@/components/SelfAssessmentCom/SelfAssessment";
import SelfAssessmentHistory from "@/components/SelfAssessmentCom/SelfAssessmentHistory";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

export default function SelfAssessmentPage() {
  const { isLoggedin } = useContext(AppContext)!;
  const [activeTab, setActiveTab] = useState("assessment");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-3xl font-bold">Gambling Self-Assessment</h1>
      </div>

      <div className="bg-[#333447] rounded-2xl p-6 mb-8  shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-[#E27625]" />
          <h2 className="text-xl font-semibold">
            Are you in control of your gambling?
          </h2>
        </div>
        <p className="text-gray-300 text-sm">
          This confidential self-assessment will help you understand your
          gambling habits and whether they may be causing harm. The assessment
          takes about 5 minutes to complete and your answers are completely
          private.
        </p>
        {!isLoggedin && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mt-4">
            <p className="text-red-200 text-sm">
              Please log in to access the self-assessment feature.
            </p>
          </div>
        )}
      </div>

      {isLoggedin ? (
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6 bg-[#333447] rounded-xl">
            <TabsTrigger
              value="assessment"
              className="data-[state=active]:bg-[#1C1C27] data-[state=active]:text-white rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Take Assessment</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#1C1C27] data-[state=active]:text-white rounded-xl"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Assessment History</span>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assessment">
            <SelfAssessment />
          </TabsContent>
          <TabsContent value="history">
            <SelfAssessmentHistory />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-[#333447] rounded-lg p-8 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Login Required</h3>
          <p className="text-gray-300 text-sm mb-6">
            You need to be logged in to access the self-assessment tools.
          </p>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => (window.location.href = "/login")}
          >
            Login to Continue
          </Button>
        </div>
      )}
    </div>
  );
}
