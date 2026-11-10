"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useStoreCategories } from "@/src/hooks/useStoreCategories";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Deals", href: "/#deals" },
  { label: "New arrivals", href: "/#new-arrivals" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const categories = useStoreCategories();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center rounded-full p-2 text-[#171717] hover:bg-gray-100"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isOpen ? <X size={22} strokeWidth={1.7} /> : <Menu size={22} strokeWidth={1.7} />}
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-20"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-black/10 bg-white p-3 shadow-xl">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[#383838] transition-colors hover:bg-[#f5f4f1]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 border-t border-[#E8ECE6] pt-1">
              <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#777777]">
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-[#383838] transition-colors hover:bg-[#f5f4f1]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
