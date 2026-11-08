'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, ShoppingBag, ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useCart } from '@/src/context/CartContext';
import { useStoreCategories } from '@/src/hooks/useStoreCategories';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/#new-arrivals' },
  { label: 'Best Sellers', href: '/#best-sellers' },
  { label: 'Why KLYRO', href: '/#why-klyro' },
  { label: 'Reviews', href: '/#reviews' },
];

export default function Navbar() {
  const { openCart, openSearch, totalItems } = useCart();
  const categories = useStoreCategories();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[#E8ECE6] bg-[#FBFBFA]/95 backdrop-blur-md transition-shadow">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="KLYRO home">
          <span className="text-2xl font-black tracking-[-0.04em] text-[#151515] group-hover:text-[#005E23] transition-colors">
            KLYRO
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-[#005E23] group-hover:scale-125 transition-transform" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-semibold text-[#454545] transition-colors hover:text-[#005E23]"
            >
              {link.label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoriesOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[13px] font-semibold text-[#454545] transition-colors hover:text-[#005E23] cursor-pointer"
              aria-expanded={isCategoriesOpen}
            >
              <span>Categories</span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180 text-[#005E23]' : ''}`}
              />
            </button>

            {isCategoriesOpen && (
              <div className="absolute right-0 top-full mt-3 z-40 w-64 rounded-2xl border border-[#E8ECE6] bg-white p-2.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#E8ECE6] mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                    Collections
                  </span>
                  <Link
                    href="/shop"
                    onClick={() => setIsCategoriesOpen(false)}
                    className="text-[11px] font-bold text-[#005E23] hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>All</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#383838] transition-colors hover:bg-[#F7F8F6] hover:text-[#005E23]"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] font-normal text-[#999]">{cat.itemCount}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions: Search + Cart + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search products"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#343434] hover:bg-black/5 hover:text-[#005E23] transition-colors cursor-pointer"
          >
            <Search size={20} strokeWidth={1.8} />
          </button>

          {/* Shopping Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            aria-label="View shopping bag"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#343434] hover:bg-black/5 hover:text-[#005E23] transition-colors cursor-pointer"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#005E23] px-1 text-[10px] font-bold text-white shadow-sm animate-in zoom-in-75 duration-200">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger (Visible < lg) */}
          <MobileMenu />
        </div>

      </div>
    </header>
  );
}
