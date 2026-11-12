'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Star, ShieldCheck, Truck, Check } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import AddToCartButton from "@/src/components/buttons/AddToCartButton";
import BuyNowButton from "@/src/components/buttons/BuyNowButton";

export default function ProductDetailModal() {
  const router = useRouter();
  const { quickViewProduct, closeQuickView, addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentVariant = selectedVariant || product.variants?.[0]?.options[0] || "";

  const handleAddToCart = () => {
    addToCart(product, quantity, currentVariant);
    setTimeout(() => {
      closeQuickView();
    }, 1500);
  };

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#151515] shadow-md transition-colors hover:bg-[#F7F8F6]"
        >
          <X size={18} />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 p-6 bg-[#F7F8F6] flex flex-col justify-between">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-inner">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-[#005E23] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                    selectedImageIndex === idx ? "border-[#005E23]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#777777]">
              <span>{product.category}</span>
              <div className="flex items-center gap-1 text-[#151515]">
                <Star size={13} className="fill-[#005E23] text-[#005E23]" />
                <span>{product.rating}</span>
                <span className="text-[#777777]">({product.reviewsCount})</span>
              </div>
            </div>

            <h2 className="mt-2 text-xl font-black text-[#151515]">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-black text-[#151515]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm font-medium text-[#777777] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#777777]">
              {product.fullDescription || product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E8ECE6]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#151515]">
                  Select {product.variants[0].name}: {currentVariant}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants[0].options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedVariant(opt)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        currentVariant === opt
                          ? "bg-[#005E23] text-white shadow-sm"
                          : "border border-[#E8ECE6] bg-white text-[#151515] hover:border-[#005E23]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#151515]">
                Quantity:
              </span>
              <div className="flex items-center rounded-full border border-[#E8ECE6] bg-[#F7F8F6] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm hover:bg-[#F0F2EE]"
                >
                  -
                </button>
                <span className="w-9 text-center text-xs font-bold text-[#151515]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm hover:bg-[#F0F2EE]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Features preview */}
            <div className="mt-4 space-y-1.5 pt-3 border-t border-[#E8ECE6]">
              {product.features.slice(0, 3).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-[#444444]">
                  <Check size={13} className="text-[#005E23] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-[#E8ECE6] space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <AddToCartButton
                onClick={handleAddToCart}
                size="md"
              />

              <button
                type="button"
                onClick={() => {
                  // Direct checkout - send only ID/slug to avoid URL length issues
                  console.log('BUY NOW CLICKED (Modal) - Going to checkout page');
                  const minimalData = {
                    productId: product.id,
                    slug: product.slug,
                    quantity,
                    variant: currentVariant
                  };
                  const encodedData = encodeURIComponent(JSON.stringify(minimalData));
                  console.log('Navigating to:', `/checkout?buyNow=${encodedData}`);
                  router.push(`/checkout?buyNow=${encodedData}`);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#005E23] bg-[#005E23] py-2.5 px-2 text-[11px] sm:text-xs font-bold text-white shadow-sm transition-all hover:bg-[#004719] hover:border-[#004719] active:scale-95"
              >
                <span className="truncate">Buy Now</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-[10px] font-semibold text-[#777777] pt-2">
              <span className="flex items-center gap-1">
                <Truck size={12} className="text-[#005E23]" /> Free Shipping &gt; ₹499
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#005E23]" /> 3-Day Easy Replacement
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

