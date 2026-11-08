"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useStoreCategories } from "@/src/hooks/useStoreCategories";

function CategoryCardImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || "/categories/default.jpg");

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      onError={() => {
        if (imgSrc !== "/categories/default.jpg") {
          setImgSrc("/categories/default.jpg");
        }
      }}
    />
  );
}

export default function CategorySection() {
  const categories = useStoreCategories();

  return (
    <section id="categories" className="bg-[#F7F8F6] py-16 sm:py-24 border-y border-[#E8ECE6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-5 bg-[#005E23]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005E23]">
                Categories
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#151515] sm:text-4xl">
              Shop by Categories
            </h2>
            <p className="mt-2 text-sm text-[#777777] max-w-lg">
              Explore thoughtfully engineered products designed for your modern home and everyday routine.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#151515] hover:text-[#005E23]"
          >
            <span>View All Collections</span>
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Categories Grid (5 categories) */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8ECE6] bg-white p-3.5 transition-all duration-300 hover:border-[#005E23]/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            >
              {/* Category Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F7F8F6]">
                <CategoryCardImage
                  src={category.image}
                  alt={category.name}
                />
                <span className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#151515] opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 group-hover:bg-[#005E23] group-hover:text-white">
                  <ArrowUpRight size={14} />
                </span>
              </div>

              {/* Title & Item Count */}
              <div className="mt-3.5 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#151515] transition-colors group-hover:text-[#005E23] line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#777777] line-clamp-1">
                    {category.itemCount} items
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
