'use client';

import Link from 'next/link';
import { FREE_ANALYSES_PER_MONTH } from '@/lib/parseUsage';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-risk-red">ContractClear</div>
        <Link href="/analyze" className="px-6 py-2 bg-risk-red text-white rounded-lg hover:bg-red-700">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Understand any contract in 30 seconds
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Upload your PDF or paste your text — our AI highlights risks, explains jargon, and tells you what actually matters.
        </p>
        <Link 
          href="/analyze" 
          className="inline-block px-8 py-4 bg-risk-red text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Analyze Your Contract
        </Link>
      </section>

      {/* Feature Cards */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <div className="text-risk-red text-3xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-3">Spot risky clauses</h3>
            <p className="text-gray-600">AI identifies potentially problematic terms and explains why they matter to you.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <div className="text-safe-green text-3xl mb-4">📖</div>
            <h3 className="text-xl font-semibold mb-3">Plain language</h3>
            <p className="text-gray-600">Legal jargon translated into simple, understandable explanations anyone can follow.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <div className="text-gray-900 text-3xl mb-4">🔢</div>
            <h3 className="text-xl font-semibold mb-3">Key numbers extracted</h3>
            <p className="text-gray-600">Important dates, amounts, and durations automatically highlighted in a table.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* One-time Plan */}
          <div className="border-2 border-gray-200 p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">One-time</h3>
            <div className="text-4xl font-bold text-risk-red mb-2">€3</div>
            <p className="text-gray-600 mb-6">5 analyses, one payment</p>
            <ul className="text-gray-700 space-y-2 mb-8">
              <li>✓ 5 contract analyses</li>
              <li>✓ Full risk assessment</li>
              <li>✓ PDF & text support</li>
              <li>✓ No commitment</li>
            </ul>
            <Link
              href="/checkout?plan=one-time"
              className="block w-full py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 text-center"
            >
              Choose Plan
            </Link>
          </div>

          {/* Subscription Plan */}
          <div className="border-2 border-risk-red p-8 rounded-lg bg-red-50">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="text-4xl font-bold text-risk-red mb-2">€8<span className="text-lg">/mo</span></div>
            <p className="text-gray-600 mb-6">Unlimited analyses</p>
            <ul className="text-gray-700 space-y-2 mb-8">
              <li>✓ Unlimited analyses</li>
              <li>✓ Full risk assessment</li>
              <li>✓ PDF & text support</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <Link
              href="/checkout?plan=subscription"
              className="block w-full py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 text-center"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-16 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to understand your contracts?</h2>
        <p className="text-gray-300 mb-8 text-lg">Start with {FREE_ANALYSES_PER_MONTH} free analyses every month.</p>
        <Link 
          href="/analyze" 
          className="inline-block px-8 py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Analyze Now
        </Link>
      </section>
    </div>
  );
}
