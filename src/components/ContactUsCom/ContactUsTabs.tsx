"use client"

import { useContext } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppContext } from "@/context/AppContext"
import SupportTab from "./SupportTab"
import ResponsibleGamblingTab from "./ResponsibleGamblingTab"

const ContactUsTabs = () => {
  const { isLoggedin } = useContext(AppContext)!

  return (
    <div>
      <Tabs defaultValue="support" className="mb-12">
        <TabsList className={`grid w-full grid-cols-2 bg-[#333447] rounded-xl`}>
          <TabsTrigger value="support" className={`data-[state=active]:bg-[#1C1C27] data-[state=active]:text-white rounded-xl`}>
            Support
          </TabsTrigger>
          <TabsTrigger
            value="responsible"
            className={` data-[state=active]:bg-[#1C1C27] data-[state=active]:text-white rounded-xl`}
          >
            Responsible Gambling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="mt-6">
          <SupportTab isLoggedin={isLoggedin} />
        </TabsContent>

        <TabsContent value="responsible" className="mt-6">
          <ResponsibleGamblingTab isLoggedin={isLoggedin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ContactUsTabs
