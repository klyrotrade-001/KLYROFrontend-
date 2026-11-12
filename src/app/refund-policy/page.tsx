export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-[#151515] mb-2">Refund & Return Policy</h1>
        <p className="text-xs text-[#AAAAAA] mb-10">Last updated: November 2026</p>

        <div className="space-y-8 text-[#444444]">
          <section className="rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] p-5">
            <p className="text-sm font-bold text-[#005E23]">🛡️ 3-Day Replacement Guarantee</p>
            <p className="text-sm text-[#005E23] mt-1">We offer a hassle-free 3-day replacement for defective or damaged products.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">Eligible for Replacement</h2>
            <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>Defective or damaged product received</li>
              <li>Wrong product delivered</li>
              <li>Product not as described</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">Not Eligible for Return</h2>
            <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>Products damaged due to misuse</li>
              <li>Items returned after 3 days of delivery</li>
              <li>Products without original packaging</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">Refund Process</h2>
            <p className="text-sm leading-relaxed">Refunds are processed within 5–7 business days after the returned product is received and inspected. Refunds are credited to the original payment method.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">How to Request a Return</h2>
            <p className="text-sm leading-relaxed">Contact us within 3 days of delivery via WhatsApp at <a href="https://wa.me/918089030066" className="text-[#005E23] font-semibold">+91 80890 30066</a> with your order ID and photos of the issue.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
