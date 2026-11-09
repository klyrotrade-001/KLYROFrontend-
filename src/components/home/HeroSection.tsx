'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ShieldCheck, Zap, Truck, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-40 min-h-[85vh] flex items-center">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 right-0 -z-10 h-96 w-96 rounded-full bg-[#005E23]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 h-80 w-80 rounded-full bg-[#F7F8F6] blur-2xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1.15fr] lg:gap-14">

          {/* Left Column: Refined Typography & CTAs */}
          <div className="max-w-xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#005E23]/15 bg-[#005E23]/[0.05] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005E23] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#005E23]">
                Smart Living • Better Choices
              </span>
            </div>

            {/* Clean & Neat Headline */}
            <h1 className="mt-4 text-2xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold tracking-[-0.03em] text-[#151515] leading-[1.16]">
              Everyday Essentials,{" "}
              <span className="block text-[#005E23]">
                Made Smarter.
              </span>
            </h1>

            {/* Neat Subtitle */}
            <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#666666] max-w-lg font-normal">
              Thoughtfully selected smart electronics, cordless kitchen tools, and daily lifestyle essentials designed to simplify your everyday routine with lasting quality.
            </p>

            {/* Clean Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#005E23] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#004719] hover:shadow-md active:scale-95"
              >
                <span>Shop Collection</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="#categories"
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[#E8ECE6] bg-white px-5 text-xs font-semibold uppercase tracking-wider text-[#151515] transition-all duration-200 hover:border-[#005E23]/30 hover:bg-[#F7F8F6] hover:text-[#005E23]"
              >
                <span>Explore Categories</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Trust Highlights Pill */}
            <div className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full border border-[#E8ECE6] bg-[#F7F8F6]/80 px-4 py-2 text-[11px] font-medium text-[#555555]">
              <div className="flex items-center gap-1.5 text-[#151515]">
                <Zap size={13} className="text-[#005E23]" />
                <span>Latest Technology</span>
              </div>
              <span className="text-[#D1D5DB]">•</span>
              <div className="flex items-center gap-1.5 text-[#151515]">
                <Truck size={13} className="text-[#005E23]" />
                <span>Fast & Secure Delivery</span>
              </div>
              <span className="text-[#D1D5DB]">•</span>
              <div className="flex items-center gap-1.5 text-[#151515]">
                <ShieldCheck size={13} className="text-[#005E23]" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Product Composition */}
          <div className="relative mx-auto w-full max-w-sm sm:max-w-lg lg:max-w-none pt-4 pb-10 px-2 sm:pt-8 sm:pb-12 sm:px-6">
            {/* Main Stage */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[24px] sm:rounded-[36px] border border-[#E8ECE6] bg-gradient-to-br from-[#F7F8F6] to-[#ECEFEA] p-2.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=90"
                  alt="KLYRO Portable Mini Blender"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/95 px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-md backdrop-blur-md text-[10px] sm:text-xs font-bold text-[#151515] border border-black/5">
                  <Star size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
                  <span>4.9 / 5</span>
                  <span className="hidden sm:inline text-[10px] text-[#777777] font-normal">(1.4k+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Floating Card 1 — bottom-left, smaller on mobile */}
            <div className="absolute bottom-0 left-0 sm:-bottom-2 sm:-left-2 z-20 w-36 sm:w-52 rounded-xl sm:rounded-2xl border border-[#E8ECE6] bg-white p-2 sm:p-3 shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#F7F8F6]">
                <Image
                  src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=85"
                  alt="Smart Audio"
                  fill
                  loading="eager"
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#777777]">Acoustics</p>
                  <p className="text-[10px] sm:text-xs font-bold text-[#151515] truncate">Pocket Speaker</p>
                </div>
                <span className="shrink-0 text-[10px] sm:text-xs font-black text-[#005E23]">→</span>
              </div>
            </div>

            {/* Floating Card 2 — hidden on mobile, shown sm+ */}
            <div className="hidden sm:block absolute -top-2 -right-2 z-20 w-48 rounded-2xl border border-[#E8ECE6] bg-white p-3 shadow-[0_16px_36px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F8F6]">
                  <Image
                    src="https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=300&q=85"
                    alt="Kitchen Essential"
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#005E23]">Bestseller</span>
                  <p className="text-xs font-bold text-[#151515] line-clamp-1">Kitchen Tools</p>
                  <p className="text-xs font-medium text-[#777777]">Shop Now →</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
