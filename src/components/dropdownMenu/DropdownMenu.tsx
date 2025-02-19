import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function FilterSidebar({
  title,
  items,
}: {
  title: string
  items: { name: string; count: number }[]
}) {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6 space-y-2">
      <CollapsibleTrigger className="flex w-full items-center justify-between text-sm">
        <span className="text-zinc-400">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 rounded border-zinc-600 bg-zinc-800" />
              <span className="ml-2 text-sm">{item.name}</span>
            </label>
            <span className="text-xs text-zinc-500">{item.count}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}