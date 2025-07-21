import { Switch } from "@/components/ui/switch";
import { ReactNode } from "react";

interface PreferenceItemProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  icon?: ReactNode;
}

export default function PreferenceItem({
  title,
  description,
  defaultChecked = false,
  onChange,
  icon,
}: PreferenceItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1 flex-1">
        <div className="font-medium text-zinc-100 flex items-center gap-2">
          {icon}
          {title}
        </div>
        <div className="text-sm text-zinc-400 leading-relaxed">
          {description}
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <Switch
          defaultChecked={defaultChecked}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#E27625] data-[state=checked]:to-[#F4A261]"
        />
      </div>
    </div>
  );
}
