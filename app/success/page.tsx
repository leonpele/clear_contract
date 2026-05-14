'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setPaidUser } from '@/lib/parseUsage';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setPaidUser();

    const timer = setTimeout(() => {
      router.push('/analyze');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-4xl font-bold text-safe-green mb-4">Payment successful!</h1>
        <p className="text-gray-600 text-lg mb-2">Your account has been upgraded.</p>
        <p className="text-gray-600 mb-8">
          {/* Dynamic message based on payment type */}
          You now have full access to ContractClear.
        </p>

        <Link
          href="/analyze"
          className="inline-block px-8 py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Start Analyzing
        </Link>

        <p className="text-gray-500 text-sm mt-8">Redirecting in 5 seconds...</p>
      </div>
    </div>
  );
}
