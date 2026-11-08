'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/src/components/product/ProductCard";
import { Product } from "@/src/types";
import { getProducts } from "@/src/lib/api";

export default function BestSellersSection() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ sort: 'bestseller', limit: 8 })
      .then((products) => {
        setBestSellers(products.filter((product) => product.isBestSeller).slice(0, 4));
      })
      .catch((error: unknown) => {
        console.error('Failed to load best sellers from the backend:', error);
      });
  }, []);

  return (
    <section id="best-sellers" className="bg-[#F7F8F6] py-16 sm:py-24 border-t border-[#E8ECE6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-5 bg-[#005E23]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005E23]">
                Customer Favorites
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#151515] sm:text-4xl">
              Best Sellers
            </h2>
            <p className="mt-2 text-sm text-[#777777] max-w-lg">
              Top-rated daily essentials trusted by thousands of happy households across India.
            </p>
          </div>

          <Link
            href="/shop?sort=bestseller"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#151515] hover:text-[#005E23]"
          >
            <span>View All Bestsellers</span>
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-sm text-[#777777]">
              No bestsellers yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
