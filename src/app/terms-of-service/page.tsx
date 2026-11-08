export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-[#151515] mb-2">Terms of Service</h1>
        <p className="text-xs text-[#AAAAAA] mb-10">Last updated: November 2026</p>

        <div className="space-y-8 text-[#444444]">
          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">By accessing and using KLYRO, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">2. Products & Pricing</h2>
            <p className="text-sm leading-relaxed">All product descriptions and prices are accurate to the best of our knowledge. We reserve the right to modify prices without prior notice. Final prices are confirmed at checkout.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">3. Orders & Payments</h2>
            <p className="text-sm leading-relaxed">Orders are confirmed only after payment verification or COD acceptance. We reserve the right to cancel orders due to stock unavailability or pricing errors.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">4. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">All content on KLYRO including logos, images, and text is the property of KLYRO and is protected by applicable intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">5. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">KLYRO shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">6. Contact</h2>
            <p className="text-sm leading-relaxed">Questions about these terms? Contact us at <a href="mailto:klyrotrade@gmail.com" className="text-[#005E23] font-semibold">klyrotrade@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
