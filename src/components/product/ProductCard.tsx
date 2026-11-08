'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Product } from "@/src/types";
import { useCart } from "@/src/context/CartContext";
import AddToCartButton from "@/src/components/buttons/AddToCartButton";
import BuyNowButton from "@/src/components/buttons/BuyNowButton";

interface ProductCardProps {
  product: Product;
  priorityImage?: boolean;
}

export default function ProductCard({ product, priorityImage = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1, product.variants?.[0]?.options[0], true);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, product.variants?.[0]?.options[0], true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  // Priority badge text to display at bottom of image
  const imageBadge = product.isNewArrival
    ? "New Arrival"
    : product.isBestSeller
    ? "Bestseller"
    : null;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#E6EAE4] bg-white p-4 text-[#151515] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#005E23]/40 hover:shadow-[0_22px_45px_-10px_rgba(0,0,0,0.12),0_10px_20px_-5px_rgba(0,94,35,0.08)] sm:p-5">
      <div>
        {/* Product Image Stage (Edge-to-Edge Filled Image with Floating Badges) */}
        <div className="relative aspect-square sm:aspect-4/3.5 w-full overflow-hidden rounded-[22px] bg-[#F7F8F6] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)]">
          {/* Top-Left Floating Discount Pill */}
          {product.discount > 0 && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#005E23] px-3 py-1 text-[11px] font-bold tracking-wider text-white shadow-[0_2px_8px_rgba(0,94,35,0.3)]">
              -{product.discount}% OFF
            </span>
          )}

          {/* Top-Right Floating Actions: Wishlist Heart */}
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#E8ECE6] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] active:scale-95"
            >
              <Heart
                size={18}
                className={`transition-colors duration-200 ${
                  isWishlisted
                    ? "fill-[#EF4444] text-[#EF4444]"
                    : "text-[#005E23]"
                }`}
              />
            </button>
          </div>

          {/* Filled Product Image Link */}
          <Link
            href={`/product/${product.slug}`}
            className="relative block h-full w-full"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priorityImage}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
            />
          </Link>

          {/* Bottom Floating Badge (e.g. New Arrival / Bestseller) */}
          {imageBadge && (
            <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center">
              <span className="rounded-full border border-white/80 bg-white/95 px-3.5 py-1 text-[11px] font-bold text-[#005E23] shadow-[0_4px_14px_rgba(0,0,0,0.08)] backdrop-blur-xs">
                {imageBadge}
              </span>
            </div>
          )}
        </div>

        {/* Product Content Details */}
        <div className="mt-3.5">
          {/* Category in clean uppercase */}
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#777777]">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="mt-1 text-[15px] sm:text-base font-bold leading-snug text-[#151515] transition-colors line-clamp-2 group-hover:text-[#005E23]">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Pricing Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-[22px] font-extrabold tracking-tight text-[#005E23]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs font-normal text-[#888888] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating & Review count */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="font-bold text-[#151515]">{product.rating.toFixed(1)}</span>
            <span className="text-[#777777]">
              ({product.reviewsCount || 95} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Dual CTA Buttons Side-by-Side (Rounded Rectangle Style) */}
      <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
        {/* Button 1: Add to Cart */}
        <AddToCartButton
          onClick={handleAddToCart}
          size="md"
        />

        {/* Button 2: Buy Now */}
        <BuyNowButton
          onClick={handleBuyNow}
          size="md"
        />
      </div>
    </div>
  );
}
