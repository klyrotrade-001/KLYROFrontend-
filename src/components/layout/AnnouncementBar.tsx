import Link from "next/link";
import { MessageCircle, MapPin } from "lucide-react";
import { siteConfig } from "@/src/data/products";

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement & Quick Links" className="border-b border-white/10 bg-[#151515] text-[11px] font-medium text-[#b5b5b5] select-none">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Offer & Key Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-white/95">
            Complimentary express delivery on orders over ₹{siteConfig.freeShippingThreshold}
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
          <nav aria-label="Announcement Secondary Links" className="hidden items-center gap-3.5 sm:flex">
            <Link href="#about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="#warranty" className="transition-colors hover:text-white">
              Warranty
            </Link>
            <Link href="#faq" className="transition-colors hover:text-white">
              FAQ
            </Link>
          </nav>
        </div>

        {/* Right Side: Phone / WhatsApp & Service */}
        <div className="flex items-center gap-4 text-[11px]">
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hello KLYRO Team, I would like to inquire about your products.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-medium text-white/90 transition-colors hover:text-[#4ade80]"
          >
            <MessageCircle size={13} className="text-[#25D366]" />
            <span className="hidden xs:inline">{siteConfig.whatsappDisplay}</span>
          </a>
          <span className="hidden h-3 w-px bg-white/20 md:inline-block" />
          <Link href="/track" className="hidden items-center gap-1 transition-colors hover:text-white md:inline-flex">
            <MapPin size={12} />
            Track Order
          </Link>
        </div>