import { ShieldCheck, MessageCircle, HeartHandshake, Truck } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Carefully Selected Quality",
    description: "Every item in our collection is hands-on evaluated for real-world functionality, durability, and safety standards before release.",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Ordering",
    description: "No tedious account setup. Place orders, select variants, and receive instant delivery updates directly with our friendly WhatsApp support.",
  },
  {
    icon: HeartHandshake,
    title: "Safe & Certified Materials",
    description: "Certified food-grade Eastman Tritan, 304 stainless steel blades, and 100% BPA-free platinum silicone safe for the whole family.",
  },
  {
    icon: Truck,
    title: "Reliable Nationwide Express",
    description: "Carefully packaged with tamper-proof boxing. Complimentary express delivery across India on all eligible orders over ₹499.",
  },
];

export default function WhyChooseSection() {
  return (
    <section id="why-klyro" className="bg-[#F7F8F6] py-16 sm:py-24 border-t border-[#E8ECE6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-5 bg-[#005E23]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005E23]">
              The KLYRO Standard
            </span>
            <span className="h-[2px] w-5 bg-[#005E23]" />
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#151515] sm:text-4xl">
            Why Choose KLYRO
          </h2>
          <p className="mt-3 text-sm text-[#777777] leading-relaxed">
            Thoughtfully designed around modern Indian households to deliver better finds for better everyday living.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E8ECE6] bg-white p-6 transition-all duration-300 hover:border-[#005E23]/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F8F6] text-[#005E23] transition-colors group-hover:bg-[#005E23] group-hover:text-white">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-[#151515]">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#777777]">
                    {r.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
