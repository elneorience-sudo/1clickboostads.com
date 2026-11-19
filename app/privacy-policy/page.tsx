"use client";

import { useState } from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold">
              Meta API Compliant 2026
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
          <div className="inline-block px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/25">
            Legal & Data Protection Notice
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            <strong>Application:</strong> 1Click Boost Ads (Ads Manager Pro) | <strong>Domain:</strong> https://www.1clickboostads.com
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            <strong>Effective Date:</strong> January 1, 2026 | <strong>Last Updated:</strong> November 20, 2026
          </p>
        </div>

        {/* Quick Jump Bar */}
        <div className={`p-4 rounded-2xl border mb-8 text-xs flex flex-wrap items-center gap-2 ${
          theme === 'dark' ? 'bg-[#161B22]/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="font-bold text-slate-400">Quick Links:</span>
          <a href="#meta-data-collected" className="text-blue-500 hover:underline">1. Meta Data Collected</a>
          <span>•</span>
          <a href="#data-usage" className="text-blue-500 hover:underline">2. How Data is Used</a>
          <span>•</span>
          <a href="#prohibitions" className="text-blue-500 hover:underline">3. No Sale / No AI Training</a>
          <span>•</span>
          <a href="#data-deletion" className="text-emerald-500 font-bold hover:underline">4. Data Deletion Instructions (Meta)</a>
          <span>•</span>
          <a href="#security" className="text-blue-500 hover:underline">5. Security & Tokens</a>
          <span>•</span>
          <a href="#contact" className="text-blue-500 hover:underline">6. Contact</a>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          
          <section className="space-y-3">
            <p>
              Welcome to <strong>1Click Boost Ads</strong> ("we," "our," or "us"). We operate <strong>https://www.1clickboostads.com</strong> ("the Service"). We are deeply committed to respecting your privacy, protecting your personal data, and strictly upholding the <strong>Meta Platform Terms</strong>, <strong>Meta Developer Policies</strong>, and international data protection standards (including GDPR and CCPA).
            </p>
            <p>
              This Privacy Policy explains what information we collect when you use our platform, how it is used, how your Meta (Facebook) account data is managed, and your right to inspect or delete your data at any time.
            </p>
          </section>

          {/* Section 1 */}
          <section id="meta-data-collected" className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">1.</span> Meta Platform Data We Access & Collect
            </h2>
            <p>
              When you voluntarily authenticate your Facebook account via Meta's official OAuth Login dialog, our application requests access solely to specific permissions required to provide advertising management tools. We only access the following data points:
            </p>
            <div className={`p-4 rounded-2xl border space-y-2.5 font-mono text-xs ${
              theme === 'dark' ? 'bg-[#161B22]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div><strong className="text-indigo-400">public_profile & email:</strong> Used strictly to authenticate your account, display your profile picture, and identify your session.</div>
              <div><strong className="text-indigo-400">pages_show_list, pages_read_engagement, pages_manage_posts, pages_manage_ads:</strong> Used to display the list of Facebook Pages you own or administer, retrieve page posts for ad boosting, and create boosted posts on your behalf.</div>
              <div><strong className="text-indigo-400">ads_management & ads_read:</strong> Used to read ad performance statistics (Spend, Impressions, Reach, CPA, Messaging Conversations) and to create, update, pause, or duplicate advertising campaigns upon your explicit command.</div>
              <div><strong className="text-indigo-400">instagram_basic (if applicable):</strong> Used solely to view Instagram accounts linked to your Facebook Pages for multi-placement ad delivery.</div>
            </div>
            <p>
              We also collect account-related information you provide during registration, such as your email address, subscription plan status, and your optional Telegram Chat ID if you configure Telegram notification alerts.
            </p>
          </section>

          {/* Section 2 */}
          <section id="data-usage" className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">2.</span> How We Use Your Information
            </h2>
            <p>
              We process Meta Platform Data and personal data exclusively for the core functionalities of the 1Click Boost Ads dashboard:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>To provide one-click ad creation, ad set configuration, and campaign duplication via the official Meta Marketing API.</li>
              <li>To calculate key performance indicators (CPA tier status, cost per message, total spend, daily budget pacing).</li>
              <li>To send automated notifications (such as daily budget reminders or CPA alerts) directly to your configured Telegram channel.</li>
              <li>To provide customer support and troubleshoot API authorization issues.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="prohibitions" className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">3.</span> Strict Compliance: No Sale of Data & No AI Model Training
            </h2>
            <div className={`p-4 rounded-2xl border space-y-2 border-emerald-500/30 ${
              theme === 'dark' ? 'bg-emerald-950/20 text-emerald-200' : 'bg-emerald-50/70 text-emerald-900'
            }`}>
              <p className="font-bold">In accordance with Meta Platform Terms Section 4.a and Developer Policies:</p>
              <ul className="list-disc pl-6 space-y-1 text-xs">
                <li><strong>No Data Brokering:</strong> We NEVER sell, lease, rent, trade, or transfer Meta Platform Data to any data brokers, ad networks, or unauthorized third parties.</li>
                <li><strong>No Unauthorized AI Training:</strong> We DO NOT use Meta Platform Data (such as user ad creatives, page posts, or ad performance metrics) to build, train, or improve general machine learning or foundation AI models without explicit user consent.</li>
                <li><strong>No Surveillance or Profiling:</strong> We DO NOT use Meta Platform Data to conduct surveillance, background checks, creditworthiness assessments, or discriminatory profiling.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 - Meta Mandatory Data Deletion */}
          <section id="data-deletion" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                4. Data Deletion Instructions (Meta Mandatory Requirement)
              </h2>
            </div>
            
            <p>
              Per Meta Platform Terms, you have full control over your data and have the absolute right to request the deletion of all data collected through Meta APIs at any time. You can delete your data using any of the following methods:
            </p>

            {/* Method A */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#161B22]/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-500 text-xs">Method 1</span>
                Instant In-App Disconnection (Instant Purge)
              </h3>
              <p className="text-xs">
                In your 1Click Boost Ads dashboard, simply click the <strong>"Disconnect"</strong> button located in the top header bar next to your Facebook profile or in the Settings tab. This immediately purges your Facebook access token, selected Page ID, and cached Ad Account references from your browser storage and associated database records.
              </p>
            </div>

            {/* Method B */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#161B22]/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-500 text-xs">Method 2</span>
                Revoke App Access via Facebook Account Settings
              </h3>
              <ol className="list-decimal pl-6 space-y-1 text-xs">
                <li>Log in to your Facebook account and go to <strong>Settings & Privacy &gt; Settings</strong>.</li>
                <li>In the left sidebar, navigate to <strong>Business Integrations</strong> (or <strong>Apps and Websites</strong>).</li>
                <li>Find <strong>1Click Boost Ads</strong> in the list of authorized apps.</li>
                <li>Check the box next to the app and click the <strong>Remove</strong> button.</li>
                <li>Facebook will immediately invalidate all access tokens and send a revocation signal to our server.</li>
              </ol>
            </div>

            {/* Method C */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
              theme === 'dark' ? 'bg-[#161B22]/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 text-xs">Method 3</span>
                Direct Written Data Erasure Request (Email)
              </h3>
              <p className="text-xs">
                To request a complete erasure of all records associated with your account from our database, send an email to our Data Protection Officer at:
              </p>
              <div className="font-mono text-xs text-blue-500 font-bold bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 inline-block">
                sengsoveasnapro@gmail.com (Subject: Meta Platform Data Deletion Request)
              </div>
              <p className="text-xs text-slate-500">
                Please include your Facebook User ID or registered email. We will process your deletion request and send a confirmation within <strong>48 hours</strong>.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="security" className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">5.</span> Data Security & Storage
            </h2>
            <p>
              We implement industry-standard administrative, physical, and technical security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>In-Transit Encryption:</strong> All communications between your browser, our servers, and Meta's Graph API are encrypted using Transport Layer Security (TLS 1.3 / SSL).</li>
              <li><strong>Token Protection:</strong> Facebook user access tokens are short-lived or stored securely, only utilized to make authorized requests against <code>graph.facebook.com</code>.</li>
              <li><strong>Zero Credit Card Storage:</strong> 1Click Boost Ads does NOT collect, store, or process Facebook ad credit card numbers or billing CVVs. All advertising charges occur directly inside Meta's payment infrastructure.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">6.</span> Third-Party Service Providers
            </h2>
            <p>
              We work with trusted third-party cloud infrastructure providers to deliver our service:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li><strong>Meta Platforms, Inc.:</strong> For user authentication, page management, and marketing API execution.</li>
              <li><strong>Supabase (PostgreSQL / Auth):</strong> For encrypted user profile storage and subscription verification.</li>
              <li><strong>Vercel Inc.:</strong> For secure, globally distributed serverless application hosting.</li>
              <li><strong>Telegram Bot API:</strong> For optional, user-configured ad performance alerts.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="contact" className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500">7.</span> Contact Us
            </h2>
            <p>
              If you have any questions, comments, or data privacy requests regarding this Privacy Policy, please reach out to our team:
            </p>
            <div className={`p-4 rounded-2xl border space-y-1 text-xs font-mono ${
              theme === 'dark' ? 'bg-[#161B22]/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div><strong>Application Name:</strong> 1Click Boost Ads</div>
              <div><strong>Owner / Data Controller:</strong> Seng Soveasna</div>
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
            <Link href="/terms" className="hover:text-indigo-400 hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/" className="hover:text-indigo-400 hover:underline">Dashboard</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
