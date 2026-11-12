'use client';

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Search, ShoppingBag } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/src/context/CartContext";
import { useStoreCategories } from "@/src/hooks/useStoreCategories";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "FAQ", href: "/#why-klyro" },
];

export default function Navbar() {
  const { openCart, openSearch, totalItems } = useCart();
  const categories = useStoreCategories();

  return (
    <nav className="z-50 border-b border-black/10 bg-[#fbfaf8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[120px] max-w-7xl items-center justify-between gap-6 px-5 lg:grid lg:grid-cols-[1fr_auto_auto] lg:px-8">
        <Link href="/" className="shrink-0" aria-label="KLYRO home">
          <Image
            src="/logoclean.png"
            alt="KLYRO"
            width={160}
            height={60}
            priority
            className="h-[120px] w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center justify-self-end gap-10 pr-10 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-[#454545] transition-colors hover:text-[#8b5e3c]"
            >
              {link.label}
            </Link>
          ))}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-[13px] font-medium text-[#454545] transition-colors hover:text-[#8b5e3c] [&::-webkit-details-marker]:hidden">
              Categories
              <ChevronDown size={14} strokeWidth={1.8} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-8 z-30 w-60 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="block rounded-xl px-3 py-2.5 text-left text-xs font-medium text-[#383838] transition-colors hover:bg-[#f5f4f1] hover:text-[#8b5e3c]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </details>
        </div>

        <div className="flex items-center gap-4 lg:justify-self-end">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search"
              className="text-[#343434] transition-colors hover:text-[#8b5e3c] cursor-pointer"
            >
              <Search size={19} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label="Shopping bag"
              className="relative text-[#343434] transition-colors hover:text-[#8b5e3c] cursor-pointer"
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#005E23] text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
