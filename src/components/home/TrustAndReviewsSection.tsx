import { Star, CheckCircle, ShieldCheck, RefreshCw, MessageCircle, Truck } from "lucide-react";

const reviews = [
  {
    rating: 5,
    title: "Blends smoothies flawlessly in 30 seconds!",
    content: "The portable mini blender is surprisingly powerful. I take it to gym and office every day. USB-C charging makes it super convenient, and cleaning takes just a quick rinse.",
    author: "Sneha Nair",
    location: "Kochi, Kerala",
    product: "Portable Mini Blender",
  },
  {
    rating: 5,
    title: "Lifesaver for traveling with a toddler",
    content: "The ultrasonic mesh nebulizer is completely silent. I can use it while my daughter is sleeping without waking her up. Very compact and well-engineered.",
    author: "Rohan Kapoor",
    location: "Gurugram, Haryana",
    product: "Compact Ultrasonic Nebulizer",
  },
  {
    rating: 5,
    title: "Excellent quality and fast WhatsApp support",
    content: "Ordered the silicone feeding set and mini food chopper. The suction on the bowl actually stays put, and ordering directly on WhatsApp was shockingly smooth and quick.",
    author: "Divya Patel",
    location: "Ahmedabad, Gujarat",
    product: "Silicone Baby Feeding Set",
  },
];

const trustBadges = [
  {
    icon: ShieldCheck,
    title: "100% Quality Inspected",
    subtitle: "Thorough multi-point quality check",
  },
  {
    icon: RefreshCw,
    title: "3-Day Easy Replacement",
    subtitle: "Hassle-free support for transit damage",
  },
  {
    icon: MessageCircle,
    title: "Real Human Support",
    subtitle: "Fast response via WhatsApp team",
  },
  {
    icon: Truck,
    title: "Express Tracked Delivery",
    subtitle: "Free on orders above ₹499",
  },
];

export default function TrustAndReviewsSection() {
  return (
    <section id="reviews" className="bg-white py-16 sm:py-24 border-t border-[#E8ECE6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <span className="h-[2px] w-5 bg-[#005E23]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005E23]">
              Customer Experiences
            </span>
            <span className="h-[2px] w-5 bg-[#005E23]" />
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#151515] sm:text-4xl">
            Trusted by Indian Homes
          </h2>
          <p className="mt-3 text-sm text-[#777777]">
            Read what verified buyers have to say about their KLYRO everyday essentials.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-[#E8ECE6] bg-[#F7F8F6] p-6 transition-all duration-300 hover:border-[#005E23]/40 hover:bg-white hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#005E23]">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={15} className="fill-[#005E23]" />
                  ))}
                </div>

                <h3 className="mt-3 text-sm font-bold text-[#151515]">
                  &ldquo;{r.title}&rdquo;
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#555555]">
                  {r.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8ECE6]/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#151515]">{r.author}</span>
                    <CheckCircle size={12} className="text-[#005E23]" />
                  </div>
                  <span className="text-[10px] text-[#777777]">{r.location}</span>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-[#005E23] border border-[#E8ECE6]">
                  {r.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-14 rounded-2xl border border-[#E8ECE6] bg-[#F7F8F6] p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#005E23] shadow-sm">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151515]">
                      {badge.title}
                    </h4>
                    <p className="text-[10px] text-[#777777] mt-0.5">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

