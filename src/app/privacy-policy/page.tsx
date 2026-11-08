export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-[#151515] mb-2">Privacy Policy</h1>
        <p className="text-xs text-[#AAAAAA] mb-10">Last updated: November 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-[#444444]">
          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed">We collect information you provide directly when placing orders, including your name, phone number, email address, and delivery address. We also collect usage data to improve our services.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">2. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed">Your information is used to process orders, provide customer support, send order updates, and improve our platform. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">3. Data Security</h2>
            <p className="text-sm leading-relaxed">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">4. Cookies</h2>
            <p className="text-sm leading-relaxed">We use cookies to enhance your browsing experience. You can disable cookies in your browser settings, though this may affect site functionality.</p>
          </section>

          <section>
            <h2 className="text-base font-black text-[#151515] mb-2">5. Contact Us</h2>
            <p className="text-sm leading-relaxed">For any privacy-related concerns, contact us at <a href="mailto:klyrotrade@gmail.com" className="text-[#005E23] font-semibold">klyrotrade@gmail.com</a> or WhatsApp: +91 80890 30066.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
