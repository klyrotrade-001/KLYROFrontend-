'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is the delivery time?',
    a: 'We deliver within 3–7 business days across India. Express delivery is available in select cities.',
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes, Cash on Delivery is available for all orders across India.',
  },
  {
    q: 'What is your return and replacement policy?',
    a: 'We offer a 7-day replacement policy for all products. If you receive a defective or damaged item, contact us within 7 days of delivery.',
  },
  {
    q: 'How do I track my order?',
    a: 'You can track your order using the Track Order page. Enter your Order ID or phone number to get real-time updates.',
  },
  {
    q: 'How can I contact customer support?',
    a: 'You can reach us via WhatsApp at +91 80890 30066 or email us at klyrotrade@gmail.com. We respond within 24 hours.',
  },
  {
    q: 'Are the products covered under warranty?',
    a: 'Yes, most electronic products come with a manufacturer warranty. Check the product description for specific warranty details.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Orders can be cancelled within 12 hours of placing them. Contact us via WhatsApp immediately for cancellation requests.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently, we only ship within India. International shipping will be available soon.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-[#151515] tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-3 text-sm text-[#777777]">Everything you need to know about KLYRO.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[#E8ECE6] bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-bold text-[#151515]">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-[#005E23] transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-[#555555] leading-relaxed border-t border-[#E8ECE6] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[#005E23] p-6 text-center">
          <p className="text-sm font-bold text-white">Still have questions?</p>
          <a
            href="https://wa.me/918089030066"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-white px-6 py-2.5 text-xs font-bold text-[#005E23] hover:bg-[#F7F8F6] transition-colors"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
