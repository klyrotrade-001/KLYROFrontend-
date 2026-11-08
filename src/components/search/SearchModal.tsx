'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Tag } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { getProducts } from "@/src/lib/api";
import { Product } from "@/src/types";

export default function SearchModal() {
  const { isSearchOpen, closeSearch, openQuickView } = useCart();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    getProducts({ limit: 100 })
      .then(setProducts)
      .catch((error: unknown) => {
        console.error('Failed to load products for search from the backend:', error);
      });
  }, []);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ""
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  const popularSearches = ["Blender", "Mini Fan", "Chopper", "Nebulizer", "Speaker", "Drill"];

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-16 sm:pt-24 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#E8ECE6] px-5 py-4">
          <Search size={22} className="text-[#005E23] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search smart electronics, kitchen essentials, baby sets..."
            className="w-full bg-transparent px-4 text-base font-medium text-[#151515] placeholder-[#777777] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-2 text-xs font-semibold text-[#777777] hover:text-[#151515]"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#777777] hover:bg-[#F7F8F6] hover:text-[#151515]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {query.trim() === "" ? (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#777777]">
                <Tag size={13} className="text-[#005E23]" />
                <span>Popular Searches</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-[#E8ECE6] bg-[#F7F8F6] px-3.5 py-1.5 text-xs font-semibold text-[#151515] transition-colors hover:border-[#005E23] hover:text-[#005E23]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm font-bold text-[#151515]">No products found for &quot;{query}&quot;</p>
              <p className="mt-1 text-xs text-[#777777]">Try searching for blender, fan, chopper, speaker, or drill.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                Results ({filteredProducts.length})
              </span>
              <div className="divide-y divide-[#F0F2EE]">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 py-3 group cursor-pointer hover:bg-[#F7F8F6]/50 rounded-xl px-2 transition-colors"
                    onClick={() => {
                      closeSearch();
                      openQuickView(p);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E8ECE6] bg-[#F7F8F6]">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-bold text-[#151515] group-hover:text-[#005E23] transition-colors">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-[#151515]">
                            {formatPrice(p.price)}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-[10px] text-[#777777] line-through">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeSearch();
                        }}
                        className="rounded-full border border-[#E8ECE6] px-3 py-1.5 text-[11px] font-semibold text-[#151515] hover:bg-white"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
