'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  MessageCircle,
  Check,
  Heart,
  Share2,
} from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { siteConfig } from '@/src/data/products';
import { getProducts } from '@/src/lib/api';
import { Product } from '@/src/types';
import ProductCard from '@/src/components/product/ProductCard';
import ReviewSection from '@/src/components/product/ReviewSection';
import ProductImage from '@/src/components/product/ProductImage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart, generateSingleProductWhatsAppUrl } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getProducts()
      .then((all) => {
        if (!isMounted) return;
        const found = all.find((p) => p.slug === slug);
        if (found) {
          setProduct(found);
          setRelatedProducts(
            all.filter((p) => p.categorySlug === found.categorySlug && p.id !== found.id).slice(0, 4)
          );
        } else {
          setProduct(null);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setProduct(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#777]">
          <RefreshCw size={20} className="animate-spin text-[#005E23]" />
          <span>Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center px-4">
        <h2 className="text-2xl font-black text-[#151515]">Product Not Found</h2>
        <p className="mt-2 text-sm text-[#777]">
          The product you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-[#005E23] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#004a1b]"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants?.[0]?.options[0] || '';
  const currentImage = product.images[selectedImage] || product.images[0];

  const handleAddToCart = () => {
    addToCart(product, quantity, currentVariant, true);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, currentVariant, true);
  };

  const handleWhatsAppOrder = () => {
    const url = generateSingleProductWhatsAppUrl(product, quantity, currentVariant);
    window.open(url, '_blank');
  };

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-[#FBFBFA] pt-6 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#777] border-b border-[#E8ECE6] pb-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#005E23] shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          <Link href="/shop" className="hover:text-[#005E23] shrink-0">Shop</Link>
          <span className="shrink-0">/</span>
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-[#005E23] shrink-0">
            {product.category}
          </Link>
          <span className="shrink-0">/</span>
          <span className="font-semibold text-[#151515] truncate">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-[#E8ECE6] shadow-sm">
              <ProductImage
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 rounded-full bg-[#005E23] px-3 py-1 text-xs font-bold text-white shadow-md">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-[#005E23] shadow-md ring-2 ring-[#005E23]/20'
                        : 'border-[#E8ECE6] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={img} alt="" fill className="object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#005E23]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#151515]">
                  <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{product.rating}</span>
                  <span className="text-[#888] font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#151515]">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#005E23]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-[#888] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs font-bold text-[#005E23] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Delivery notice */}
              <p className="mt-2 text-xs text-[#666]">
                Tax included. Free shipping on orders above ₹{siteConfig.freeShippingThreshold}.
              </p>

              {/* Description */}
              <p className="mt-6 text-sm text-[#555] leading-relaxed border-t border-[#E8ECE6] pt-6">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 border-t border-[#E8ECE6] pt-6 space-y-4">
                  {product.variants.map((v) => (
                    <div key={v.name}>
                      <span className="text-xs font-bold text-[#151515] uppercase tracking-wider">
                        {v.name}: <span className="text-[#005E23] font-semibold">{currentVariant}</span>
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {v.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedVariant(opt)}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                              currentVariant === opt
                                ? 'bg-[#005E23] text-white shadow-sm'
                                : 'bg-white border border-[#E8ECE6] text-[#444] hover:border-[#005E23]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold text-[#151515] uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center rounded-full border border-[#E8ECE6] bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#555] hover:bg-[#F7F8F6]"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#151515]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#555] hover:bg-[#F7F8F6]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-[#005E23] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-[#004a1b] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {addedNotice ? (
                    <>
                      <Check size={16} />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 rounded-full bg-[#151515] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-black active:scale-95 transition-all"
                >
                  Buy It Now
                </button>
              </div>

              {/* Direct WhatsApp Order */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="mt-3 w-full rounded-full border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-xs font-bold uppercase tracking-wider text-[#128C7E] hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                <span>Order on WhatsApp directly</span>
              </button>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mt-8 border-t border-[#E8ECE6] pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#151515]">
                    Key Highlights
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#555]">
                        <Check size={14} className="text-[#005E23] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#E8ECE6] pt-6 text-xs text-[#555]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-[#005E23]" />
                  <span>100% Quality Inspected</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck size={18} className="text-[#005E23]" />
                  <span>Complimentary Shipping &gt; ₹499</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection
          productSlug={slug}
          productId={product.id}
          productName={product.name}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-[#E8ECE6] pt-16">
            <h2 className="text-2xl font-black text-[#151515]">You May Also Like</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

