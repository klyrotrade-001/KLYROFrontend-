'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, MessageCircle, MapPin, Search, ShoppingBag } from 'lucide-react';
import { useStoreCategories } from '@/src/hooks/useStoreCategories';
import { useCart } from '@/src/context/CartContext';
import { siteConfig } from '@/src/data/products';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Shop All Products', href: '/shop' },
  { label: 'New Arrivals', href: '/#new-arrivals' },
  { label: 'Best Sellers', href: '/#best-sellers' },
  { label: 'Why Choose KLYRO', href: '/#why-klyro' },
  { label: 'Customer Reviews', href: '/#reviews' },
  { label: 'Deals & Offers', href: '/#deals' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const categories = useStoreCategories();
  const { openSearch, openCart, totalItems } = useCart();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#151515] hover:bg-black/5 transition-colors"
      >
        <Menu size={22} strokeWidth={1.8} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={closeMenu}
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#E8ECE6] px-5">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-[#151515]">KLYRO</span>
            <span className="h-2 w-2 rounded-full bg-[#005E23]" />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#555] hover:bg-[#F7F8F6] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 border-b border-[#E8ECE6] p-3">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openSearch();
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#F7F8F6] py-2.5 text-xs font-bold text-[#151515] hover:bg-[#ECEEEA] transition-colors"
          >
            <Search size={15} />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              openCart();
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#005E23] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#004a1b] transition-colors"
          >
            <ShoppingBag size={15} />
            <span>Bag ({totalItems})</span>
          </button>
        </div>

        {/* Links Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Main Pages */}
          <div className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#888]">
              Navigation
            </p>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#151515] hover:bg-[#F7F8F6] hover:text-[#005E23] transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight size={14} className="text-[#bbb]" />
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="border-t border-[#E8ECE6] pt-4 space-y-1">
            <div className="flex items-center justify-between px-3 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                Shop by Category
              </p>
              <Link
                href="/shop"
                onClick={closeMenu}
                className="text-[11px] font-bold text-[#005E23] hover:underline"
              >
                View all
              </Link>
            </div>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[#444] hover:bg-[#F7F8F6] hover:text-[#005E23] transition-colors"
              >
                <span>{c.name}</span>
                <span className="text-[11px] text-[#999]">{c.itemCount} items</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-[#E8ECE6] bg-[#FBFBFA] p-4 space-y-2.5">
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
              'Hello KLYRO Team, I would like to inquire about your products.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-xs font-bold text-[#128C7E] hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageCircle size={15} className="text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="flex items-center justify-between text-[11px] text-[#777] px-1 pt-1">
            <Link href="/track" onClick={closeMenu} className="flex items-center gap-1 hover:text-[#005E23]">
              <MapPin size={12} />
              <span>Track Order</span>
            </Link>
            <span className="text-[10px] font-semibold text-[#999]">KLYRO v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
