'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  statusHistory: { status: string; message: string; updatedAt: string }[];
}

const statusSteps = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusLabel: Record<string, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/track?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        setError('Order not found. Please check your Order ID or phone number.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <main className="min-h-screen bg-[#F7F8F6] py-16 px-4">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#005E23] mb-4">
            <Package size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#151515] tracking-tight">Track Your Order</h1>
          <p className="mt-2 text-sm text-[#777777]">Enter your Order ID or phone number to track your order.</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID or phone number..."
              className="w-full rounded-full border border-[#E8ECE6] bg-white pl-11 pr-4 py-3 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#005E23] px-6 py-3 text-sm font-bold text-white hover:bg-[#004719] disabled:opacity-60 transition-colors"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm font-semibold text-red-600 text-center">
            {error}
          </div>
        )}

        {order && (
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="rounded-2xl bg-white border border-[#E8ECE6] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-wider">Order ID</p>
                  <p className="text-sm font-black text-[#151515]">{order.id}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  order.status === 'delivered' ? 'bg-[#ecfdf5] text-[#005E23]' :
                  order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="flex items-start justify-between relative mb-6">
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#E8ECE6] -z-0" />
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-1 z-10 flex-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      i <= currentStep
                        ? 'bg-[#005E23] border-[#005E23]'
                        : 'bg-white border-[#E8ECE6]'
                    }`}>
                      {i < currentStep ? (
                        <CheckCircle size={14} className="text-white" />
                      ) : i === currentStep ? (
                        <Truck size={13} className="text-white" />
                      ) : (
                        <Clock size={13} className="text-[#CCCCCC]" />
                      )}
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-bold text-center leading-tight max-w-[40px] sm:max-w-none ${
                      i <= currentStep ? 'text-[#005E23]' : 'text-[#CCCCCC]'
                    }`}>
                      {statusLabel[step]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8ECE6] pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#777777]">Customer</span>
                  <span className="font-bold text-[#151515]">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#777777]">Order Date</span>
                  <span className="font-bold text-[#151515]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#777777]">Total Amount</span>
                  <span className="font-black text-[#005E23]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl bg-white border border-[#E8ECE6] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#AAAAAA] mb-3">Items Ordered</p>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#151515] font-medium">{item.name} × {item.quantity}</span>
                    <span className="font-bold text-[#151515]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
