import Link from "next/link";
import { ArrowRight, MessageCircle, Tag } from "lucide-react";

export default function PromoBannerSection() {
  return (
    <section id="deals" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#00501E] px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-white shadow-xl">
          {/* Subtle natural lighting overlay */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-black/20 blur-2xl" />

          <div className="relative z-10 max-w-2xl">
            {/* Promo Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
              <Tag size={13} className="text-[#86efac]" />
              <span>LIMITED PERIOD OFFER • UP TO 45% OFF</span>
            </div>

            {/* Headline */}
            <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl lg:text-5xl leading-[1.18] text-white">
              Upgrade Your Everyday Routine With Smart Choices.
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed max-w-xl font-normal">
              From whisper-quiet nebulizers and cordless kitchen essentials to safe silicone baby feeding sets. Enjoy complimentary express delivery on orders above ₹499.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/shop?sort=discount"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#00501E] shadow-md transition-all hover:bg-[#F0FDF4] hover:shadow-lg active:scale-95"
              >
                <span>SHOP DEALS NOW</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="https://wa.me/919292674447?text=Hello%20KLYRO%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20current%20offers."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
              >
                <MessageCircle size={15} className="text-[#25D366]" />
                <span>INQUIRE ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
