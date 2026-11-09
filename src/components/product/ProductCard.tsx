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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] sm:rounded-[26px] border border-[#E6EAE4] bg-white p-3.5 sm:p-5 text-[#151515] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#005E23]/40 hover:shadow-[0_18px_40px_-8px_rgba(0,0,0,0.1)]">
      <div>
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-[#F7F8F6]">
          {product.discount > 0 && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#005E23] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white shadow">
              -{product.discount}%
            </span>
          )}

          <div className="absolute right-2.5 top-2.5 z-10">
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow border border-[#E8ECE6] transition-all hover:scale-110 active:scale-95"
            >
              <Heart
                size={16}
                className={`transition-colors ${isWishlisted ? "fill-[#EF4444] text-[#EF4444]" : "text-[#005E23]"}`}
              />
            </button>
          </div>

          <Link href={`/product/${product.slug}`} className="relative block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priorityImage}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>

          {imageBadge && (
            <div className="pointer-events-none absolute bottom-2.5 left-0 right-0 z-10 flex justify-center">
              <span className="rounded-full border border-white/80 bg-white/95 px-3 py-0.5 text-[10px] font-bold text-[#005E23] shadow backdrop-blur-sm">
                {imageBadge}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#777777]">
            {product.category}
          </span>
          <h3 className="mt-1 text-[13px] sm:text-[15px] font-bold leading-snug text-[#151515] line-clamp-2 group-hover:text-[#005E23] transition-colors">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-extrabold text-[#005E23]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-[#888] line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="font-bold text-[#151515]">{product.rating.toFixed(1)}</span>
            <span className="text-[#777777]">({product.reviewsCount || 95})</span>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="mt-3.5 grid grid-cols-2 gap-1.5 pt-1">
        <AddToCartButton onClick={handleAddToCart} size="md" />
        <BuyNowButton onClick={handleBuyNow} size="md" />
      </div>
    </div>
  );
}
