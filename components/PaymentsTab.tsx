"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PaymentsTabProps {
  theme: 'light' | 'dark';
  isAdmin: boolean;
  adminQrUrl: string;
  handleUploadAdminQR: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clients: any[];
  fetchClients: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function PaymentsTab({
  theme,
  isAdmin,
  adminQrUrl,
  handleUploadAdminQR,
  clients,
  fetchClients,
  showToast,
}: PaymentsTabProps) {
  const [payMethod, setPayMethod] = useState<'khqr' | 'slip'>('khqr');
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number }>({
    name: 'កញ្ចប់ស្តង់ដារ (Standard)',
    amount: 5.00
  });
  const [isVerifyingKHQR, setIsVerifyingKHQR] = useState(false);
  const [khqrSuccessData, setKhqrSuccessData] = useState<any>(null);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);

  // ⚡ មុខងារផ្ទៀងផ្ទាត់ និង Activate ស្វ័យប្រវត្តិតាម KHQR
  const handleVerifyKHQRPayment = async () => {
    setIsVerifyingKHQR(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        alert("❌ រកមិនឃើញគណនី Login ទេ សូម Login ជាថ្មី!");
        return window.location.href = '/login';
      }

      const res = await fetch('/api/payments/verify-khqr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: selectedPlan.amount,
          planName: selectedPlan.name,
          transactionRef: `KHQR-${Date.now().toString().slice(-8)}`
        })
      });

      const result = await res.json();
      if (result.success) {
        setKhqrSuccessData(result);
        showToast("🎉 ការទូទាត់ប្រាក់ជោគជ័យ! គណនីត្រូវបាន Activate ៣០ ថ្ងៃ!", "success");
        fetchClients();
      } else {
        alert("❌ បរាជ័យ: " + (result.error || "មិនអាចផ្ទៀងផ្ទាត់បានទេ"));
      }
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    } finally {
      setIsVerifyingKHQR(false);
    }
  };

  // 🤖 Admin សាកល្បងតេស្ត Telegram Bot
  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTelegramStatus(null);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' })
      });
      const data = await res.json();
      if (data.success) {
        setTelegramStatus("✅ សារសាកល្បងបានផ្ញើទៅកាន់ Telegram ដោយជោគជ័យ!");
        showToast("✅ បានផ្ញើសារតេស្តទៅ Telegram!", "success");
      } else {
        setTelegramStatus("⚠️ " + (data.error || "មិនអាចផ្ញើបាន សូមពិនិត្យមើល TELEGRAM_BOT_TOKEN ក្នុង .env.local"));
      }
    } catch (err: any) {
      setTelegramStatus("❌ Error: " + err.message);
    } finally {
      setIsTestingTelegram(false);
    }
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm border w-full max-w-4xl mx-auto my-6 animate-in fade-in duration-300 transition-colors ${theme === 'dark' ? 'bg-[#242526] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-lg shadow-red-500/20">
          🇰🇭
        </div>
        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          ទូទាត់ប្រាក់ KHQR (Bakong) & បញ្ជាក់សេវាកម្ម
        </h1>
        <p className={`text-sm mt-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          គាំទ្រការស្កេនទូទាត់ស្វ័យប្រវត្តិតាម Bakong, ABA, Wing, ACLEDA ជាមួយប្រព័ន្ធបន្តសុពលភាពភ្លាមៗ
        </p>

        {/* Payment Method Switcher */}
        <div className="flex items-center justify-center gap-2 mt-5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setPayMethod('khqr')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${payMethod === 'khqr' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
          >
            <span>⚡ ស្កេន KHQR (Active ភ្លាមៗ)</span>
          </button>
          <button
            type="button"
            onClick={() => setPayMethod('slip')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${payMethod === 'slip' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'}`}
          >
            <span>🧾 ផ្ញើ Slip ផ្ទេរប្រាក់</span>
          </button>
        </div>
      </div>

      {/* 🌟 ផ្ទាំងជោគជ័យពេលបង់ប្រាក់ KHQR រួច */}
      {khqrSuccessData && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30 text-center animate-in zoom-in-95 duration-300">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-400">ការទូទាត់ប្រាក់ KHQR ជោគជ័យ!</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{khqrSuccessData.message}</p>
          <div className="inline-block mt-3 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-mono font-bold">
            Ref: {khqrSuccessData.reference}
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                setKhqrSuccessData(null);
                window.location.reload();
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              🔄 ចូលប្រើប្រាស់ផ្ទាំង Dashboard ឥឡូវនេះ
            </button>
          </div>
        </div>
      )}

      {/* 🌟 OPTION 1: KHQR (BAKONG) FLOW */}
      {payMethod === 'khqr' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* KHQR Card View */}
          <div className={`md:col-span-6 p-6 rounded-2xl border text-center flex flex-col items-center justify-center shadow-md relative ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-white border-slate-200'}`}>
            
            {/* National Bank of Cambodia KHQR Header */}
            <div className="w-full bg-[#E1251B] text-white py-2 px-4 rounded-xl flex items-center justify-between font-black tracking-wider text-xs shadow-sm mb-4">
              <span className="flex items-center gap-1.5">
                <span className="bg-white text-[#E1251B] px-1.5 py-0.5 rounded text-[10px] font-black">KHQR</span>
                <span>BAKONG</span>
              </span>
              <span className="text-[11px] font-mono tracking-widest">USD $</span>
            </div>

            {/* QR Code Frame */}
            <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-inner border-2 border-red-100 flex items-center justify-center mb-4 relative">
              {adminQrUrl ? (
                <img
                  src={adminQrUrl}
                  alt="Bakong KHQR Code"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="text-xs text-slate-400 text-center p-4">
                  <span>⏳ កំពុងទាញយក KHQR Code...</span>
                </div>
              )}
            </div>

            {/* Merchant Details */}
            <div className="w-full text-xs space-y-1 font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mb-4 text-left">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">ឈ្មោះគណនី:</span>
                <strong className="text-slate-900 dark:text-white">SENG SOVEASNA</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">ABA Account:</span>
                <strong className="text-blue-600 dark:text-blue-400 font-mono">010 72 30 80</strong>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">ចំនួនទឹកប្រាក់:</span>
                <strong className="text-red-600 dark:text-red-400 font-black text-sm">${selectedPlan.amount.toFixed(2)} USD</strong>
              </div>
            </div>

            <div className="w-full space-y-2">
              <a
                href="bakong://"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>📱</span> <span>បើកក្នុង App Bakong / ABA</span>
              </a>

              <button
                type="button"
                disabled={isVerifyingKHQR}
                onClick={handleVerifyKHQRPayment}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-xl text-xs transition shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isVerifyingKHQR ? (
                  <span>⏳ កំពុងផ្ទៀងផ្ទាត់ប្រព័ន្ធ...</span>
                ) : (
                  <>
                    <span>⚡ ខ្ញុំបានស្កេនរួចរាល់ (បញ្ជាក់ & Active ភ្លាមៗ)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Plan Selection and Instructions */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              ជ្រើសរើសកញ្ចប់សេវាកម្ម (Choose Subscription Plan)
            </h3>

            {/* Plans List */}
            <div className="space-y-3">
              {[
                { name: 'កញ្ចប់សាកល្បង (Starter)', amount: 5.00, desc: 'ប្រើប្រាស់ 1Click Boost + AI Copywriter រយៈពេល ៣០ ថ្ងៃ' },
                { name: 'កញ្ចប់ពេញនិយម (Pro)', amount: 10.00, desc: 'មិនកំណត់ចំនួន Campaign + AI Gemini គ្មានដែនកំណត់' },
                { name: 'កញ្ចប់អាជីវកម្ម (VIP Agency)', amount: 25.00, desc: 'គ្រប់គ្រង Page & Ad Account ច្រើន + ជំនួយបច្ចេកទេសពិសេស' }
              ].map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedPlan.name === plan.name
                      ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 shadow-xs'
                      : (theme === 'dark' ? 'border-slate-700 hover:border-slate-600 bg-[#18191A]' : 'border-slate-200 hover:border-slate-300 bg-slate-50')
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{plan.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{plan.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-red-600 dark:text-red-400">${plan.amount.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 block">/ ៣០ ថ្ងៃ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${theme === 'dark' ? 'bg-[#18191A] border-slate-700 text-slate-300' : 'bg-amber-50/60 border-amber-200 text-slate-700'}`}>
              <h5 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span>💡</span> <span>របៀបទូទាត់ប្រាក់រហ័ស 3 ជំហាន៖</span>
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>បើកកម្មវិធី <strong>Bakong, ABA, Wing ឬធនាគារណាមួយ</strong> ក្នុងទូរស័ព្ទ។</li>
                <li>ស្កេនរូបភាព <strong>KHQR</strong> ខាងឆ្វេង និងផ្ទៀងផ្ទាត់ចំនួនទឹកប្រាក់ <strong>${selectedPlan.amount.toFixed(2)}</strong>។</li>
                <li>ចុចប៊ូតុងពណ៌ក្រហម <strong>"⚡ ខ្ញុំបានស្កេនរួចរាល់"</strong> នោះប្រព័ន្ធនឹង Active គណនីភ្លាមៗដោយស្វ័យប្រវត្តិ!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 OPTION 2: MANUAL SLIP UPLOAD FLOW */}
      {payMethod === 'slip' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* ផ្នែកខាងឆ្វេង៖ QR Code */}
          <div className={`md:col-span-5 p-6 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="font-bold text-sm mb-4 text-blue-600 dark:text-blue-400">Scan to Pay (ABA / Bakong)</h3>
            <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center mb-4">
              {adminQrUrl ? (
                <img src={adminQrUrl} alt="Admin QR" className="w-full h-full object-contain pointer-events-none" />
              ) : (
                <div className="text-xs text-slate-400 p-4">⏳ កំពុងទាញយក QR Code...</div>
              )}
            </div>
            <div className="text-xs space-y-1 font-medium text-slate-500 dark:text-slate-400 mb-2">
              <p>ឈ្មោះគណនី៖ <strong className="text-slate-800 dark:text-white">SENG SOVEASNA</strong></p>
              <p>លេខគណនី ABA៖ <strong className="text-blue-600 dark:text-blue-400">010 72 30 80</strong></p>
            </div>
          </div>

          {/* ផ្នែកខាងស្តាំ៖ Form Upload Slip */}
          <div className={`md:col-span-7 p-6 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="font-bold text-sm mb-4">បញ្ជូនព័ត៌មាន និង Slip ផ្ទេរប្រាក់</h3>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const amountInput = (form.elements.namedItem('amount') as HTMLInputElement).value;
              const fileInput = form.elements.namedItem('slipFile') as HTMLInputElement;

              if (!fileInput.files || fileInput.files.length === 0) {
                alert("⚠️ សូមជ្រើសរើសរូបភាព Slip ផ្ទេរប្រាក់ជាមុនសិន!");
                return;
              }

              try {
                const file = fileInput.files[0];
                const { data: { user } } = await supabase.auth.getUser();
                if (!user || !user.email) {
                  alert("❌ រកមិនឃើញគណនី Login ទេ សូម Login ម្ដងទៀត។");
                  return window.location.href = '/login';
                }
                const clientEmailInput = user.email.trim().toLowerCase();

                const fileName = `slip_${Date.now()}_${file.name}`;
                const { error: uploadError } = await supabase.storage
                  .from('slips')
                  .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                  .from('slips')
                  .getPublicUrl(fileName);

                const { data: oldData } = await supabase
                  .from('customer_subscriptions')
                  .select('payment_history, client_name, phone')
                  .eq('email', clientEmailInput)
                  .single();

                const existingHistory = oldData?.payment_history || [];
                const newPaymentRecord = {
                  date: new Date().toISOString(),
                  amount: Number(amountInput) || 0,
                  slip_url: publicUrl,
                  status: 'pending'
                };

                const updatedHistory = [newPaymentRecord, ...existingHistory];

                const { error } = await supabase
                  .from('customer_subscriptions')
                  .update({
                    slip_url: publicUrl,
                    slip_status: 'pending',
                    amount: Number(amountInput) || 0,
                    payment_history: updatedHistory
                  })
                  .eq('email', clientEmailInput);

                if (error) throw error;

                // 🤖 ផ្ញើ Telegram Alert ជូន Admin ភ្លាមៗពេលមាន Slip ថ្មី
                fetch('/api/telegram', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'new_slip',
                    payload: {
                      clientName: oldData?.client_name || user.email,
                      email: user.email,
                      phone: oldData?.phone || '',
                      amount: amountInput,
                      slipUrl: publicUrl
                    }
                  })
                }).catch(() => {});

                showToast("✅ បានបញ្ជូន Slip ទៅកាន់ Admin ដោយជោគជ័យ!", "success");
                form.reset();
                fetchClients();

              } catch (err: any) {
                alert("❌ បរាជ័យក្នុងការបញ្ជូន Slip: " + err.message);
              }
            }} className="space-y-4 text-xs">

              <div>
                <label className="block font-bold mb-1 text-slate-500 uppercase">ទឹកប្រាក់បានបង់ ($)</label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  required
                  placeholder="5.00"
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-bold text-emerald-500 ${theme === 'dark' ? 'bg-[#3A3B3C] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-500 uppercase">រូបភាព Slip ផ្ទេរប្រាក់ (Bank Slip)</label>
                <input
                  type="file"
                  name="slipFile"
                  accept="image/*"
                  required
                  className={`w-full p-2.5 rounded-xl border text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer ${theme === 'dark' ? 'bg-[#3A3B3C] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-700'}`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-md cursor-pointer mt-2"
              >
                📤 បញ្ជូន Slip ជូន Admin ពិនិត្យ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 ផ្នែកគ្រប់គ្រងសម្រាប់ Admin (QR Upload & Telegram Bot Test) */}
      {isAdmin && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Admin Upload QR */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-amber-50/50 border-amber-200'}`}>
            <span className="text-xs font-bold text-amber-600 block mb-2">⚙️ Admin: ផ្លាស់ប្ដូររូបភាព QR Code</span>
            <label className="cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-2">
              <span>📁</span>
              <span>ជ្រើសរើសរូបភាព QR ថ្មី</span>
              <input type="file" accept="image/*" onChange={handleUploadAdminQR} className="hidden" />
            </label>
          </div>

          {/* Admin Telegram Bot Connection Test */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-sky-50/50 border-sky-200'}`}>
            <span className="text-xs font-bold text-sky-600 block mb-2">🤖 Admin: ពិនិត្យ Telegram Bot Notification</span>
            <button
              type="button"
              disabled={isTestingTelegram}
              onClick={handleTestTelegram}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>📲</span>
              <span>{isTestingTelegram ? "កំពុងតេស្ត..." : "តេស្តផ្ញើសារ Telegram Bot"}</span>
            </button>
            {telegramStatus && (
              <p className="text-[11px] mt-2 font-medium text-slate-600 dark:text-slate-300">{telegramStatus}</p>
            )}
          </div>
        </div>
      )}

      {/* 🌟 ផ្នែកប្រវត្តិបង់ប្រាក់ (Payment History Table) */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <span>📜</span> ប្រវត្តិការទូទាត់ប្រាក់របស់អ្នក (Payment History)
        </h3>

        <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b uppercase tracking-wider ${theme === 'dark' ? 'bg-[#3A3B3C] text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  <th className="py-3 px-4 font-bold">កាលបរិច្ឆេទ (Date)</th>
                  <th className="py-3 px-4 font-bold">ទឹកប្រាក់ (Amount)</th>
                  <th className="py-3 px-4 font-bold">វិធីទូទាត់ (Method)</th>
                  <th className="py-3 px-4 font-bold text-center">ស្ថានភាព (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {(() => {
                  const currentClientData = clients.find(() => true);
                  const historyRecords = currentClientData?.payment_history || (currentClientData?.slip_url ? [{
                    date: currentClientData.created_at || new Date().toISOString(),
                    amount: currentClientData.amount || 0,
                    method: 'MANUAL_SLIP',
                    slip_url: currentClientData.slip_url,
                    status: currentClientData.slip_status || 'pending'
                  }] : []);

                  return historyRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-400 italic">
                        មិនទាន់មានប្រវត្តិការទូទាត់ប្រាក់នៅឡើយទេ។
                      </td>
                    </tr>
                  ) : (
                    historyRecords.map((record: any, idx: number) => (
                      <tr key={idx} className={`transition ${theme === 'dark' ? 'hover:bg-[#3A3B3C]' : 'hover:bg-slate-50'}`}>
                        <td className="py-3 px-4 font-medium">
                          {new Date(record.date).toLocaleString('km-KH')}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-500">
                          ${Number(record.amount || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          {record.method === 'KHQR_BAKONG' ? (
                            <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded text-[10px] font-bold border border-red-500/20">
                              ⚡ KHQR Bakong
                            </span>
                          ) : record.slip_url ? (
                            <a
                              href={record.slip_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline font-bold flex items-center gap-1"
                            >
                              <span>មើល Slip 🧾</span>
                            </a>
                          ) : (
                            <span className="text-slate-400">ផ្ទេរប្រាក់</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {record.status === 'approved' ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-[11px] border border-emerald-500/20">
                              បានទូទាត់ប្រាក់ ✓ (Approved)
                            </span>
                          ) : record.status === 'rejected' ? (
                            <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full font-bold text-[11px] border border-red-500/20">
                              បានបដិសេធ ✕ (Rejected)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full font-bold text-[11px] border border-amber-500/20 animate-pulse">
                              រង់ចាំពិនិត្យ ⏳ (Pending)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
