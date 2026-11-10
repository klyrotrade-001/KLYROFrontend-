'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { CartItem, CustomerDetails } from '@/src/types';
import { createOrder } from '@/src/lib/api';
import { siteConfig } from '@/src/data/products';
import ProductImage from '@/src/components/product/ProductImage';

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // buyNowItems holds the parsed item from URL; null = not a Buy Now session
  const [buyNowItems, setBuyNowItems] = useState<CartItem[] | null>(null);
  // true once we've attempted to read URL params (prevents flash of "empty cart")
  const [isReady, setIsReady] = useState(false);

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    mobileNumber: '',
    email: '',
    houseBuilding: '',
    streetLocality: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: '',
    orderNotes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Read buyNow params from URL on mount (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('buyNow');

      if (raw) {
        const decoded = JSON.parse(decodeURIComponent(raw));

        // Build a CartItem-compatible object from the minimal encoded data.
        // ProductCard / ProductDetailModal both send:
        // { id, name, price, image, quantity, variant }
        const cartItem: CartItem = {
          quantity: decoded.quantity || 1,
          selectedVariant: decoded.variant,
          product: {
            // Required Product fields – fill from decoded data
            id: decoded.id ?? '',
            slug: decoded.slug ?? decoded.id ?? '',
            name: decoded.name ?? 'Product',
            category: decoded.category ?? 'Mini Electronics',
            categorySlug: decoded.categorySlug ?? '',
            price: decoded.price ?? 0,
            originalPrice: decoded.originalPrice ?? decoded.price ?? 0,
            discount: decoded.discount ?? 0,
            description: decoded.description ?? '',
            features: decoded.features ?? [],
            // Support both `images` array and single `image` string
            images: decoded.images?.length
              ? decoded.images
              : decoded.image
              ? [decoded.image]
              : ['/placeholder.png'],
            inStock: true,
            rating: decoded.rating ?? 5,
            reviewsCount: decoded.reviewsCount ?? 0,
          },
        };

        setBuyNowItems([cartItem]);
      }
    } catch (err) {
      console.error('Failed to parse buyNow param:', err);
    }

    setIsReady(true);
  }, []);

  // Determine which items to show at checkout
  const checkoutItems: CartItem[] = buyNowItems ?? cart;

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee =
    subtotal >= siteConfig.freeShippingThreshold || subtotal === 0
      ? 0
      : siteConfig.standardShippingFee;
  const totalAmount = subtotal + shippingFee;

  const formatPrice = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}`;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.mobileNumber.trim())
      errors.mobileNumber = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim().replace(/\D/g, '')))
      errors.mobileNumber = 'Enter a valid 10-digit number';
    if (!formData.houseBuilding.trim())
      errors.houseBuilding = 'House/Building info is required';
    if (!formData.streetLocality.trim())
      errors.streetLocality = 'Street/Locality is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pinCode.trim()) errors.pinCode = 'PIN Code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = await createOrder(formData, checkoutItems);
      setCreatedOrderId(data.orderId);
      setStep('success');

      if (typeof window !== 'undefined' && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }

      // Only clear the cart when this was a cart checkout (not Buy Now)
      if (!buyNowItems) {
        clearCart();
      }
    } catch (error) {
      console.error('Order error:', error);
      if (typeof window !== 'undefined') {
        alert(
          error instanceof Error
            ? error.message
            : 'Failed to place order. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state: show spinner while reading URL ──────────────────────────
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E23] mx-auto" />
          <p className="mt-4 text-sm text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No items to checkout
          </h2>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-2 bg-[#005E23] text-white rounded-full hover:bg-[#004719]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ecfdf5] text-[#005E23] mx-auto">
            <Check size={32} strokeWidth={2.5} />
          </div>
          <span className="mt-3 text-xs font-bold uppercase tracking-widest text-[#005E23] block">
            Order Registered
          </span>
          <h3 className="mt-1 text-2xl font-black text-[#151515]">
            #{createdOrderId}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#555555]">
            Your order details have been registered and forwarded to KLYRO
            WhatsApp Support for instant confirmation &amp; dispatch.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => router.push(`/track?query=${createdOrderId}`)}
              className="w-full py-3 bg-[#005E23] text-white rounded-full font-semibold hover:bg-[#004719]"
            >
              Track This Order
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="w-full py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-600 mt-1">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Address form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900">
                Delivery Address
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobileNumber: e.target.value,
                      })
                    }
                    placeholder="10-digit number"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                  />
                  {formErrors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.mobileNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                  />
                </div>
              </div>

              {/* House / Building */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  House / Flat / Building *
                </label>
                <input
                  type="text"
                  required
                  value={formData.houseBuilding}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      houseBuilding: e.target.value,
                    })
                  }
                  placeholder="Flat 402, Green Heights"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                />
                {formErrors.houseBuilding && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.houseBuilding}
                  </p>
                )}
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Street / Area / Locality *
                </label>
                <input
                  type="text"
                  required
                  value={formData.streetLocality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      streetLocality: e.target.value,
                    })
                  }
                  placeholder="12th Main Road, Indiranagar"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                />
                {formErrors.streetLocality && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.streetLocality}
                  </p>
                )}
              </div>

              {/* City + State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Bangalore"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="Karnataka"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* PIN Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData({ ...formData, pinCode: e.target.value })
                  }
                  placeholder="560038"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                />
                {formErrors.pinCode && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.pinCode}
                  </p>
                )}
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({ ...formData, landmark: e.target.value })
                  }
                  placeholder="Near Metro Station"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none"
                />
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={formData.orderNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNotes: e.target.value })
                  }
                  placeholder="Any special instructions"
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005E23] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#005E23] text-white rounded-full font-semibold hover:bg-[#004719] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
                <ShieldCheck size={14} className="text-[#005E23]" />
                <span>Secure checkout powered by KLYRO</span>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                      <ProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h3>
                      {item.selectedVariant && (
                        <p className="text-xs text-gray-600">
                          Variant: {item.selectedVariant}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? (
                      <span className="text-[#005E23]">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#005E23]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
