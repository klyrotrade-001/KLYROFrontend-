'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, MessageCircle, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { siteConfig } from "@/src/data/products";
import { CustomerDetails } from "@/src/types";
import { createOrder } from "@/src/lib/api";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    shippingFee,
    totalAmount,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: "",
    mobileNumber: "",
    email: "",
    houseBuilding: "",
    streetLocality: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
    orderNotes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const freeShippingThreshold = siteConfig.freeShippingThreshold;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim().replace(/\D/g, ''))) {
      errors.mobileNumber = "Enter a valid 10-digit number";
    }
    if (!formData.houseBuilding.trim()) errors.houseBuilding = "House/Building info is required";
    if (!formData.streetLocality.trim()) errors.streetLocality = "Street/Locality is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pinCode.trim()) errors.pinCode = "PIN Code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = await createOrder(formData, cart);
      setCreatedOrderId(data.orderId);
      setStep('success');

      try {
        localStorage.setItem('klyro_last_order', data.orderId);
      } catch (error) {
        console.error('Failed to save the latest order ID:', error);
      }

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }

      clearCart();
    } catch (error) {
      console.error('Order checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={closeCart} />

      {/* Slide-over Drawer */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E8ECE6] px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#005E23]" />
            <h2 className="text-base font-bold text-[#151515]">
              {step === 'cart'
                ? `Your Cart (${totalItems})`
                : step === 'checkout'
                ? 'Delivery Address'
                : 'Order Confirmed!'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#777777] hover:bg-[#F7F8F6] hover:text-[#151515]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        {step === 'cart' && (
          <div className="border-b border-[#E8ECE6] bg-[#F7F8F6] px-6 py-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#151515]">
              {remainingForFreeShipping > 0 ? (
                <span>Add <strong className="text-[#005E23]">{formatPrice(remainingForFreeShipping)}</strong> more for FREE Delivery</span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#005E23] font-bold">
                  <CheckCircle2 size={13} /> You unlocked FREE Express Delivery!
                </span>
              )}
              <span className="text-[10px] text-[#777777]">{Math.round(progressPercent)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full bg-[#005E23] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 'success' ? (
            /* Order Placed Success View */
            <div className="flex h-full flex-col items-center justify-center text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ecfdf5] text-[#005E23]">
                <Check size={32} strokeWidth={2.5} />
              </div>
              <span className="mt-3 text-[11px] font-bold uppercase tracking-widest text-[#005E23]">
                Order Registered
              </span>
              <h3 className="mt-1 text-2xl font-black text-[#151515]">
                #{createdOrderId}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#555555] max-w-xs">
                Your order details have been registered in our system and forwarded to KLYRO WhatsApp Support for instant confirmation & dispatch.
              </p>

              <div className="mt-8 flex w-full flex-col gap-2.5">
                <Link
                  href={`/track?query=${createdOrderId}`}
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#005E23] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#004719]"
                >
                  <span>Track This Order</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setStep('cart');
                    closeCart();
                  }}
                  className="rounded-full border border-[#E8ECE6] py-3 text-xs font-semibold text-[#151515] hover:bg-[#F7F8F6]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : step === 'cart' ? (
            cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F8F6] text-[#777777]">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#151515]">Your cart is empty</h3>
                <p className="mt-1 max-w-xs text-xs text-[#777777]">
                  Discover our curated smart home, kitchen and everyday living essentials.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#005E23] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#004719]"
                >
                  Start Shopping
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F2EE]">
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedVariant || idx}`} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E8ECE6] bg-[#F7F8F6]">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#151515] line-clamp-1">
                            {item.product.name}
                          </h4>
                          {item.selectedVariant && (
                            <span className="inline-block mt-0.5 text-[10px] font-medium text-[#777777]">
                              Variant: {item.selectedVariant}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          aria-label="Remove item"
                          className="text-[#999999] hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-full border border-[#E8ECE6] bg-[#F7F8F6] p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold hover:bg-white"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[#151515]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold hover:bg-white"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <span className="text-xs font-black text-[#151515]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Checkout Step: Customer Delivery Address Form */
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-3.5">
              <div className="rounded-xl bg-[#F7F8F6] p-3 text-[11px] text-[#555555]">
                Please enter your shipping address. Your order will be logged in our system and forwarded to WhatsApp for rapid confirmation.
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#151515]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                />
                {formErrors.fullName && <p className="mt-0.5 text-[10px] text-red-600">{formErrors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#151515]">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    placeholder="10-digit mobile"
                    className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                  />
                  {formErrors.mobileNumber && <p className="mt-0.5 text-[10px] text-red-600">{formErrors.mobileNumber}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#151515]">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#151515]">
                  Flat / House / Building *
                </label>
                <input
                  type="text"
                  required
                  value={formData.houseBuilding}
                  onChange={(e) => setFormData({ ...formData, houseBuilding: e.target.value })}
                  placeholder="e.g. Flat 402, Green Heights"
                  className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                />
                {formErrors.houseBuilding && <p className="mt-0.5 text-[10px] text-red-600">{formErrors.houseBuilding}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#151515]">
                  Street / Area / Locality *
                </label>
                <input
                  type="text"
                  required
                  value={formData.streetLocality}
                  onChange={(e) => setFormData({ ...formData, streetLocality: e.target.value })}
                  placeholder="e.g. 12th Main Road, Indiranagar"
                  className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                />
                {formErrors.streetLocality && <p className="mt-0.5 text-[10px] text-red-600">{formErrors.streetLocality}</p>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#151515]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-2.5 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#151515]">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-2.5 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#151515]">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="6 digits"
                    className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-2.5 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#151515]">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="Near metro station / school"
                  className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#151515]">
                  Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  placeholder="Special instructions for delivery"
                  className="mt-1 w-full rounded-xl border border-[#E8ECE6] px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer with Totals & Actions */}
        {cart.length > 0 && step !== 'success' && (
          <div className="border-t border-[#E8ECE6] bg-white p-6 shadow-lg">
            <div className="space-y-1.5 text-xs text-[#555555]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#151515]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-[#151515]">
                  {shippingFee === 0 ? <span className="text-[#005E23]">FREE</span> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#F0F2EE] text-sm font-black text-[#151515]">
                <span>Total Payable</span>
                <span className="text-base text-[#005E23]">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#005E23] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#004719] active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="rounded-full border border-[#E8ECE6] px-4 py-3 text-xs font-bold text-[#151515] hover:bg-[#F7F8F6]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#20ba5a] active:scale-95 disabled:opacity-60"
                >
                  <MessageCircle size={17} />
                  <span>{isSubmitting ? 'Registering Order...' : 'Confirm on WhatsApp'}</span>
                </button>
              </div>
            )}

            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[#777777]">
              <ShieldCheck size={13} className="text-[#005E23]" />
              <span>Safe & Secure • Order confirmed directly via WhatsApp</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
