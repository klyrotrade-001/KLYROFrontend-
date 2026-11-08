'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "@/src/components/product/ProductCard";
import { Product } from "@/src/types";
import { getProducts } from "@/src/lib/api";

export default function NewArrivalsSection() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ limit: 100 })
      .then(setAllProducts)
      .catch((error: unknown) => {
        console.error('Failed to load new arrivals from the backend:', error);
      });
  }, []);

  const newArrivalsList = allProducts.filter((p) => p.isNewArrival);

  const filterOptions = [
    { label: "All Items", value: "all" },
    { label: "Kitchen", value: "kitchen-items" },
    { label: "Electronics", value: "mini-electronics" },
    { label: "Baby & Toys", value: "baby-products-toys" },
    { label: "Nebulizers", value: "mini-nebulizers" },
  ];

  const filteredProducts = selectedFilter === "all"
    ? newArrivalsList
    : newArrivalsList.filter((p) => p.categorySlug === selectedFilter);

  return (
    <section id="new-arrivals" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-5 bg-[#005E23]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005E23]">
                Fresh In Store
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#151515] sm:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-2 text-sm text-[#777777] max-w-lg">
              Explore newly arrived innovations designed with modern functionality and clean aesthetic.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#151515] hover:text-[#005E23]"
          >
            <span>See All Products</span>
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedFilter(opt.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                selectedFilter === opt.value
                  ? "bg-[#005E23] text-white shadow-sm"
                  : "border border-[#E8ECE6] bg-[#F7F8F6] text-[#151515] hover:border-[#005E23] hover:text-[#005E23]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
