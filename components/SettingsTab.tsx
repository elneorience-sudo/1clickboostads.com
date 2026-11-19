"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SettingsTabProps {
  theme: 'light' | 'dark';
}

export default function SettingsTab({ theme }: SettingsTabProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={`p-6 rounded-2xl shadow-sm border w-full max-w-xl mx-auto my-6 animate-in fade-in duration-300 transition-colors ${theme === 'dark' ? 'bg-[#242526] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
      <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-100 dark:border-slate-700">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center text-xl shadow-xs">
          🔒
        </div>
        <div>
          <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>ផ្លាស់ប្ដូរលេខសម្ងាត់ (Change Password)</h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>គ្រប់គ្រងព័ត៌មាន និងផ្លាស់ប្ដូរលេខសម្ងាត់គណនីរបស់អ្នក</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <span>🔑</span> កំណត់លេខសម្ងាត់ថ្មី
          </h3>

          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const newPass = (form.elements.namedItem('newPass') as HTMLInputElement).value;
            const confirmPass = (form.elements.namedItem('confirmPass') as HTMLInputElement).value;

            if (newPass !== confirmPass) {
              alert("❌ លេខសម្ងាត់ថ្មី និងការបញ្ជាក់មិនដូចគ្នាទេ!");
              return;
            }
            if (newPass.length < 6) {
              alert("❌ លេខសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ!");
              return;
            }

            try {
              const { error } = await supabase.auth.updateUser({ password: newPass });
              if (error) throw error;

              const { data: { user } } = await supabase.auth.getUser();
              if (user?.email) {
                await supabase.from('customer_subscriptions').update({ password: newPass }).eq('email', user.email);
              }

              alert("✅ បានផ្លាស់ប្ដូរលេខសម្ងាត់ថ្មីដោយជោគជ័យ!");
              form.reset();
            } catch (err: any) {
              alert("❌ បរាជ័យ: " + err.message);
            }
          }} className="space-y-4">

            {/* ប្រអប់លេខសម្ងាត់ថ្មី */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">លេខសម្ងាត់ថ្មី</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPass"
                  required
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:border-blue-500 font-medium ${theme === 'dark' ? 'bg-[#3A3B3C] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base cursor-pointer select-none"
                  title={showNewPassword ? "លាក់លេខសម្ងាត់" : "បង្ហាញលេខសម្ងាត់"}
                >
                  {showNewPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>

            {/* ប្រអប់បញ្ជាក់លេខសម្ងាត់ថ្មី */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">បញ្ជាក់លេខសម្ងាត់ថ្មី</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPass"
                  required
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:border-blue-500 font-medium ${theme === 'dark' ? 'bg-[#3A3B3C] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base cursor-pointer select-none"
                  title={showConfirmPassword ? "លាក់លេខសម្ងាត់" : "បង្ហាញលេខសម្ងាត់"}
                >
                  {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1877F2] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition shadow-md cursor-pointer"
            >
              ✓ រក្សាទុកការផ្លាស់ប្ដូរ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
