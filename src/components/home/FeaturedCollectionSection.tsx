"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { getProductBySlug as getFallbackProduct } from "@/src/data/products";
import { getProducts } from "@/src/lib/api";

export default function FeaturedCollectionSection() {
  const [featuredProducts, setFeaturedProducts] = useState(() => ({
    blender: getFallbackProduct("portable-blender"),
    chopper: getFallbackProduct("mini-electric-chopper"),
    oilSprayer: getFallbackProduct("kitchen-oil-sprayer"),
  }));
  const { blender, chopper, oilSprayer } = featuredProducts;

  useEffect(() => {
    getProducts({ limit: 100 })
      .then((products) => {
        const bySlug = new Map(products.map((product) => [product.slug, product]));
        setFeaturedProducts((current) => ({
          blender: bySlug.get("portable-blender") ?? current.blender,
          chopper: bySlug.get("mini-electric-chopper") ?? current.chopper,
          oilSprayer: bySlug.get("kitchen-oil-sprayer") ?? current.oilSprayer,
        }));
      })
      .catch((error: unknown) => {
        console.error('Failed to load featured products from the backend:', error);
      });
  }, []);

  const highlights = [
    "Cordless freedom with USB-C rechargeable battery systems",
    "Surgical-grade 304 stainless steel precision blades",
    "Certified BPA-free & food-grade safe materials",
    "Whisper-quiet brushless motors engineered for modern apartments",
  ];

  return (
    <section id="featured" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Showcase Container */}
        <div className="overflow-hidden rounded-[32px] border border-[#E8ECE6] bg-[#F7F8F6] p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* Left Column (5 cols): Story & Feature Points */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005E23] text-white">
                  <Sparkles size={11} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005E23]">
                  Featured Collection
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#151515] sm:text-4xl leading-tight">
                Everyday Essentials. Thoughtfully Selected.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#777777]">
                Elevate your kitchen and daily prep with our signature cordless series. Built for busy mornings, rapid meal prep, and clutter-free countertops.
              </p>

              {/* Feature Points */}
              <div className="mt-6 space-y-3">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#005E23] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#151515]">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/shop?category=kitchen-items"
                  className="inline-flex items-center gap-2 rounded-full bg-[#005E23] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#004719] active:scale-95"
                >
                  <span>Explore Kitchen Edit</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column (7 cols): Visual Collage */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-12 gap-4 items-center">
                
                {/* Main Featured Item: Blender */}
                <div className="col-span-12 sm:col-span-7">
                  <Link
                    href="/product/portable-blender"
                    className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#E8ECE6] bg-white p-3 shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#F7F8F6]">
                      {blender && (
                        <Image
                          src={blender.images[0]}
                          alt="Portable Mini Blender"
                          fill
                          sizes="(max-width: 640px) 100vw, 40vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-106"
                        />
                      )}
                      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/90 p-3 shadow-md backdrop-blur-md">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#005E23]">
                          <span>Kitchen Series</span>
                          <span>40% OFF</span>
                        </div>
                        <h4 className="mt-0.5 text-xs font-bold text-[#151515]">Portable Mini Blender</h4>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xs font-black text-[#151515]">₹899</span>
                          <span className="text-[10px] text-[#777777] line-through">₹1,499</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Sub-featured Items Stack (Chopper & Oil Sprayer) */}
                <div className="col-span-12 sm:col-span-5 space-y-4">
                  {/* Chopper */}
                  <Link
                    href="/product/mini-electric-chopper"
                    className="group relative block overflow-hidden rounded-2xl border border-[#E8ECE6] bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#F7F8F6]">
                      {chopper && (
                        <Image
                          src={chopper.images[0]}
                          alt="Mini Electric Chopper"
                          fill
                          sizes="280px"
                          className="object-cover transition-transform duration-500 group-hover:scale-106"
                        />
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-[#151515] group-hover:text-[#005E23] transition-colors">
                          Cordless Chopper
                        </h5>
                        <span className="text-[10px] text-[#777777]">One-touch pulse</span>
                      </div>
                      <span className="text-xs font-black text-[#005E23]">₹499</span>
                    </div>
                  </Link>

                  {/* Oil Sprayer */}
                  <Link
                    href="/product/kitchen-oil-sprayer"
                    className="group relative block overflow-hidden rounded-2xl border border-[#E8ECE6] bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#F7F8F6]">
                      {oilSprayer && (
                        <Image
                          src={oilSprayer.images[0]}
                          alt="Kitchen Oil Sprayer"
                          fill
                          sizes="280px"
                          className="object-cover transition-transform duration-500 group-hover:scale-106"
                        />
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-[#151515] group-hover:text-[#005E23] transition-colors">
                          Glass Oil Sprayer
                        </h5>
                        <span className="text-[10px] text-[#777777]">Fan mist nozzle</span>
                      </div>
                      <span className="text-xs font-black text-[#005E23]">₹249</span>
                    </div>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
