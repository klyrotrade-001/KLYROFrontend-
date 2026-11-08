import { BadgeCheck, Cpu, Truck } from "lucide-react";

const highlights = [
  { label: "Latest Technology", icon: Cpu },
  { label: "Fast & Secure Delivery", icon: Truck },
  { label: "Premium Quality Products", icon: BadgeCheck },
];

export default function TrustHighlights() {
  return (
    <div className="mt-14 flex flex-col gap-5 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:gap-0">
      {highlights.map(({ label, icon: Icon }, index) => (
        <div key={label} className="flex items-center sm:flex-1">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#55514b]">
            <Icon size={18} strokeWidth={1.4} className="text-[#8b5e3c]" />
            {label}
          </div>
          {index < highlights.length - 1 && <span className="ml-auto hidden h-7 w-px bg-black/10 sm:block" />}
        </div>
      ))}
    </div>
  );
}
