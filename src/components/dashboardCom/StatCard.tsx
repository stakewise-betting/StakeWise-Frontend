import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  percentage?: string;
  icon: ReactNode;
  iconColor?: string;
}

const StatCard = ({ title, value, percentage, icon, iconColor = "#E27625" }: StatCardProps) => {
  return (
    <div className="flex items-center justify-between overflow-hidden rounded-[20px] shadow-lg bg-gradient-to-b bg-[#333447] px-5 py-4 backdrop-blur-sm">
      <div>
        <p className="text-sm text-[#A0AEC0]">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {percentage && <p className="text-xs font-bold text-[#01B574]">{percentage}</p>}
      </div>
      <div className={`rounded-lg p-2`} style={{ backgroundColor: iconColor }}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
