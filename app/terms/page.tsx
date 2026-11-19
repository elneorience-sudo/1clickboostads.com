"use client";

import { useState } from "react";
import Link from "next/link";

export default function TermsOfService() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <div className={`min-h-screen font-sans p-4 sm:p-8 md:p-12 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0F17] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className={`max-w-4xl mx-auto rounded-3xl shadow-2xl border transition-all duration-300 p-6 sm:p-10 md:p-12 ${
        theme === 'dark' 
          ? 'bg-[#0D1117] border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' 
          : 'bg-white border-slate-200/90 shadow-xl'
      }`}>
        
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <Link 
            href="/"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'bg-[#161B22] text-indigo-400 hover:text-white hover:bg-[#1C2128] border border-slate-800' 
                : 'bg-slate-100 text-indigo-600 hover:text-indigo-800 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            ← Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold">
              Meta Commercial Terms 2026
            </span>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className={`w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-all border ${
                theme === 'dark' 
                  ? 'bg-[#161B22] border-slate-800 text-white hover:bg-[#1C2128]' 
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
              }`}
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Title & Meta Details */}
        <div className="my-8 space-y-2">
          <div className="inline-block px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/25">
            Terms of Service & Usage Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            <strong>Application:</strong> 1Click Boost Ads (Ads Manager Pro) | <strong>Domain:</strong> https://www.1clickboostads.com
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            <strong>Effective Date:</strong> January 1, 2026 | <strong>Last Updated:</strong> November 20, 2026
          </p>
        </div>

        {/* Important Disclaimer Banner */}
        <div className={`p-4 rounded-2xl border mb-8 text-xs border-amber-500/30 space-y-1 ${
          theme === 'dark' ? 'bg-amber-950/20 text-amber-200' : 'bg-amber-50/70 text-amber-900'
        }`}>
          <div className="font-bold flex items-center gap-1.5">
            <span>⚠️</span> Mandatory Meta Platform Disclaimer:
          </div>
          <p>
            <strong>1Click Boost Ads</strong> is an independent software tool that connects to the official Meta Marketing API. 1Click Boost Ads is <strong>NOT</strong> endorsed, sponsored, affiliated with, or certified by Meta Platforms, Inc., Facebook, or Instagram. All advertising spend is billed directly by Meta Platforms, Inc.
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          
          <section className="space-y-3">
            <p>
              Please read these Terms of Service ("Terms") carefully before using the <strong>1Click Boost Ads</strong> web application (the "Service") operated by 1Click Boost Ads ("we," "us," or "our").
            </p>
            <p>
              By accessing or using the Service, connecting your Meta (Facebook) account, or deploying advertising campaigns through our dashboard, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">1.</span> Scope of Service & Meta Marketing API Integration
            </h2>
            <p>
              1Click Boost Ads provides a streamlined user interface to manage, boost, duplicate, and analyze social media advertising campaigns by interfacing with Meta Platforms, Inc.'s official Marketing API.
            </p>
            <p>
              Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li>Listing Facebook Pages and fetching published posts for ad creation.</li>
              <li>Configuring Campaign objectives, Ad Sets, targeting parameters, and creative ads.</li>
              <li>Displaying campaign performance metrics including Spend, Impressions, Reach, and Cost Per Action (CPA).</li>
              <li>Automated Telegram budget and CPA threshold notifications.</li>
              <li>AI-powered ad copywriting and creative suggestions.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">2.</span> Compliance with Meta Advertising Standards & Policies
            </h2>
            <p>
              You explicitly agree and warrant that all content, ad creatives, page posts, target audiences, and products/services promoted through 1Click Boost Ads strictly comply with:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>Meta Advertising Standards:</strong> (including rules prohibiting deceptive practices, counterfeit goods, discriminatory targeting, adult content, or unauthorized financial schemes).</li>
              <li><strong>Meta Platform Terms & Developer Policies:</strong> Users must not attempt to use our integration to bypass Meta's review filters or abuse Meta's API rate limits.</li>
              <li><strong>Applicable Laws:</strong> All commercial advertisements must respect local consumer protection, copyright, trademark, and advertising laws.</li>
            </ul>
            <p className="text-xs text-rose-400 font-bold">
              We reserve the immediate right to suspend or terminate service to any account that uses our software to disseminate fraudulent, deceptive, or prohibited advertising.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">3.</span> Advertising Spend & Meta Billing Disclaimer
            </h2>
            <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
              theme === 'dark' ? 'bg-[#161B22]/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <p>
                <strong>Direct Meta Billing:</strong> All advertising budgets, daily budgets, and lifetime ad spend configured within 1Click Boost Ads are charged <strong>directly by Meta Platforms, Inc.</strong> to the payment method (credit card, PayPal, or local billing) attached to your Meta Ad Account.
              </p>
              <p>
                1Click Boost Ads does <strong>NOT</strong> collect, escrow, or mark up your Facebook advertising spend. We are strictly a software management tool. You are solely responsible for setting and monitoring your campaign budgets and managing your billing relationship with Meta.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">4.</span> Software Subscriptions & Usage Fees
            </h2>
            <p>
              Access to premium features of 1Click Boost Ads may require a software subscription (e.g. Free Trial, Pro Plan, or VIP Subscription).
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li>Subscription fees cover software access, AI token credits, server infrastructure, and Telegram bot notification services.</li>
              <li>Payments may be made via KHQR, Bakong, or supported digital payment channels.</li>
              <li>Subscriptions can be cancelled or upgraded at any time through the Subscriptions tab.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">5.</span> Account Security & Access Tokens
            </h2>
            <p>
              You are solely responsible for maintaining the confidentiality of your login credentials and ensuring that authorized personnel only have access to your connected Facebook accounts. We are not liable for actions taken via valid access tokens authorized by your account.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">6.</span> Limitation of Liability & No Guarantee of Ad Results
            </h2>
            <p>
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>No Guarantee of ROAS or CPA:</strong> While 1Click Boost Ads provides optimization recommendations and CPA alerts, we cannot and do not guarantee specific sales, lead volumes, Cost Per Action (CPA), or ad performance. Campaign success depends on market factors, creative quality, audience targeting, and Meta auction competition.</li>
              <li><strong>Meta Actions & Outages:</strong> We shall not be held liable for any ad rejections, ad account bans, Page restrictions, or API downtime imposed by Meta Platforms, Inc.</li>
              <li><strong>Maximum Liability:</strong> In no event shall our total aggregate liability exceed the amount paid by you to 1Click Boost Ads for software subscription services during the three (3) months preceding the claim.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">7.</span> User Data & Data Deletion
            </h2>
            <p>
              Your use of our service is also governed by our <Link href="/privacy-policy" className="text-blue-500 font-bold underline">Privacy Policy</Link>. As outlined in our Privacy Policy, you maintain the right to revoke app access and delete your data at any time via the in-app "Disconnect" button, Facebook Business Integrations settings, or by emailing our team.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">8.</span> Modifications to Terms
            </h2>
            <p>
              We reserve the right to revise or replace these Terms at any time to reflect updates to Meta Platform Policies, regulatory developments, or software feature additions. Any material changes will be announced on this page with an updated effective date.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">9.</span> Contact Us
            </h2>
            <p>
              If you have any questions or require legal clarification regarding these Terms of Service, please contact us:
            </p>
            <div className={`p-4 rounded-2xl border space-y-1 text-xs font-mono ${
              theme === 'dark' ? 'bg-[#161B22]/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div><strong>Application Name:</strong> 1Click Boost Ads</div>
              <div><strong>Official Email:</strong> <a href="mailto:sengsoveasnapro@gmail.com" className="text-blue-500 underline font-bold">sengsoveasnapro@gmail.com</a></div>
              <div><strong>Official Domain:</strong> <a href="https://www.1clickboostads.com" className="text-blue-500 underline">https://www.1clickboostads.com</a></div>
              <div><strong>Address:</strong> Phnom Penh, Cambodia</div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div>© 2026 1Click Boost Ads. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-indigo-400 hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-indigo-400 hover:underline">Dashboard</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
