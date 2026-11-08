import Link from "next/link";
import { ArrowRight, MessageCircle, Tag } from "lucide-react";

export default function PromoBannerSection() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#003D16] via-[#005E23] to-[#004719] px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-white shadow-2xl">
          {/* Subtle decorative circles */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-black/20 blur-2xl" />

          <div className="relative z-10 max-w-2xl">
            {/* Promo Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#86efac] backdrop-blur-md border border-white/20">
              <Tag size={13} />
              <span>Limited Period Offer • Up to 45% OFF</span>
            </div>

            {/* Headline */}
            <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] sm:text-4xl lg:text-5xl leading-tight">
              Upgrade Your Everyday Routine With Smart Choices.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              From whisper-quiet nebulizers and cordless kitchen essentials to safe silicone baby feeding sets. Enjoy complimentary express delivery on orders above ₹499.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop?sort=discount"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#005E23] shadow-lg transition-all hover:bg-[#F7F8F6] active:scale-95"
              >
                <span>Shop Deals Now</span>
                <ArrowRight size={14} />
              </Link>

              <a
                href="https://wa.me/919292674447?text=Hello%20KLYRO%20Team%2C%20I%20would%20like%20to%20know%20more%20about%20your%20current%20offers."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <MessageCircle size={15} className="text-[#25D366]" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
