import { Switch } from "@/components/ui/switch"

interface PreferenceItemProps {
  title: string
  description: string
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
}

export default function PreferenceItem({ title, description, defaultChecked = false, onChange }: PreferenceItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="font-medium text-zinc-100">{title}</div>
        <div className="text-sm text-zinc-400">{description}</div>
      </div>
      <Switch defaultChecked={defaultChecked} onCheckedChange={onChange} />
    </div>
  )
}

