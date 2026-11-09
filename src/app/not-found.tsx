import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-[#005E23]">404</p>
        <h1 className="text-2xl font-black text-[#151515] mt-3 tracking-tight">Page Not Found</h1>
        <p className="text-sm text-[#777777] mt-2 max-w-xs mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Link href="/"
            className="rounded-full bg-[#005E23] px-6 py-3 text-sm font-bold text-white hover:bg-[#004719] transition-colors">
            Go Home
          </Link>
          <Link href="/shop"
            className="rounded-full border border-[#E8ECE6] px-6 py-3 text-sm font-bold text-[#151515] hover:bg-[#F7F8F6] transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
