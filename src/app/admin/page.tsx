'use client';

import { useEffect } from 'react';

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.href = 'https://klyro-admin.vercel.app';
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="h-10 w-10 rounded-full border-4 border-[#005E23] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#777777]">Redirecting to Admin Panel...</p>
      </div>
    </main>
  );
}
