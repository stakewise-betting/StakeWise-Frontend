import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  percentage?: string;
  icon: ReactNode;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  percentage,
  icon,
  iconColor = "#E27625",
}: StatCardProps) => {
  return (
    <div className="group bg-gradient-to-br from-[#1C1C27] via-[#252538] to-[#1C1C27] border border-[#333447] shadow-2xl hover:shadow-3xl rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-zinc-100 group-hover:text-white transition-colors">
              {value}
            </p>
            {percentage && (
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                {percentage}
              </p>
            )}
          </div>
          <div
            className="p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
            }}
          >
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
