"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DigitalInvoiceModal, { InvoiceData } from './DigitalInvoiceModal';

interface PaymentsTabProps {
  theme: 'light' | 'dark';
  isAdmin: boolean;
  adminQrUrl: string;
  handleUploadAdminQR: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clients: any[];
  fetchClients: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onPaymentSuccess?: () => void;
}

export default function PaymentsTab({
  theme,
  isAdmin,
  adminQrUrl,
  handleUploadAdminQR,
  clients,
  fetchClients,
  showToast,
  onPaymentSuccess,
}: PaymentsTabProps) {
  const [payMethod, setPayMethod] = useState<'khqr' | 'slip'>('khqr');
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number }>({
    name: 'កញ្ចប់ស្តង់ដារ (Starter)',
    amount: 5.00
  });
  const [isVerifyingKHQR, setIsVerifyingKHQR] = useState(false);
  const [khqrSuccessData, setKhqrSuccessData] = useState<any>(null);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [mySubscription, setMySubscription] = useState<any>(null);

  // 📸 Slip File & Preview States (សម្រាប់ KHQR Card)
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  // 📸 Dedicated Manual Slip Form States
  const [manualSlipFile, setManualSlipFile] = useState<File | null>(null);
  const [manualSlipPreview, setManualSlipPreview] = useState<string | null>(null);
  const [isUploadingManualSlip, setIsUploadingManualSlip] = useState(false);

  // ទាញយកព័ត៌មាន Subscription ផ្ទាល់ខ្លួនរបស់ Client
  const loadMySubscription = async (email: string) => {
    try {
      const { data } = await supabase
        .from('customer_subscriptions')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
      if (data) setMySubscription(data);
    } catch (e) {
      console.warn("Error fetching client subscription:", e);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
        loadMySubscription(user.email);
      }
    });
  }, []);

  // ដោះស្រាយពេលជ្រើសរើសរូបភាព Slip ក្នុង KHQR Card
  const handleSlipFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSlipFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSlipPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleRemoveSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
  };

  const [isCopiedAba, setIsCopiedAba] = useState(false);

  const handleCopyAba = () => {
    navigator.clipboard.writeText("010723080");
    setIsCopiedAba(true);
    showToast("📋 បានចម្លងលេខគណនី ABA: 010 72 30 80", "success");
    setTimeout(() => setIsCopiedAba(false), 2500);
  };

  const handleDownloadQR = async () => {
    if (!adminQrUrl) return;
    try {
      const response = await fetch(adminQrUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `KHQR_Payment_${selectedPlan.amount}USD.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast("📥 បានទាញយករូប QR រួចរាល់! សូមចូល App ABA រួច Scan ពីរូបថត", "success");
    } catch {
      window.open(adminQrUrl, '_blank');
    }
  };

  // ⚡ មុខងារផ្ទៀងផ្ទាត់ និង Activate ស្វ័យប្រវត្តិតាម KHQR (គាំទ្រទាំងមានភ្ជាប់ Slip និងគ្មាន Slip)
  const handleVerifyKHQRPayment = async () => {
    setIsVerifyingKHQR(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        showToast("❌ រកមិនឃើញគណនី Login ទេ សូម Login ជាថ្មី!", "error");
        return window.location.href = '/login';
      }

      let result: any = null;

      // ១. បើមានភ្ជាប់រូប Slip ផ្ញើតាម FormData ទៅ /api/payments/upload-slip (Server-side bypass RLS)
      if (slipFile) {
        const formData = new FormData();
        formData.append('slipFile', slipFile);
        formData.append('email', user.email);
        formData.append('amount', String(selectedPlan.amount));
        formData.append('planName', selectedPlan.name);

        const res = await fetch('/api/payments/upload-slip', {
          method: 'POST',
          body: formData,
        });
        result = await res.json();
      } else {
        // ២. បើអត់មានរូប Slip ផ្ញើ verify ស្វ័យប្រវត្តិតាម /api/payments/verify-khqr
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
        result = await res.json();
      }

      if (result.success) {
        setKhqrSuccessData(result);
        const successNotice = slipFile 
          ? "🎉 បានបញ្ជូន Slip ផ្ទេរប្រាក់ជូន Admin រួចរាល់! សូមរង់ចាំ Admin ពិនិត្យ និង Approve ក្នុងផ្ទាំង CRM"
          : "🎉 ការទូទាត់ប្រាក់ជោគជ័យ! គណនីត្រូវបាន Activate +៣០ ថ្ងៃ!";
        showToast(successNotice, "success");
        setSlipFile(null);
        setSlipPreview(null);
        loadMySubscription(user.email);
        fetchClients();
        if (onPaymentSuccess) onPaymentSuccess();
      } else {
        showToast("❌ បរាជ័យ: " + (result.error || "មិនអាចផ្ទៀងផ្ទាត់បានទេ"), "error");
      }
    } catch (err: any) {
      showToast("❌ Error: " + err.message, "error");
    } finally {
      setIsVerifyingKHQR(false);
    }
  };

  // 🧾 មុខងារ Upload Slip លើទម្រង់ Form ដាច់ដោយឡែក (Option 2)
  const handleManualSlipSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manualSlipFile) {
      showToast("⚠️ សូមជ្រើសរើសរូបភាព Slip ផ្ទេរប្រាក់ជាមុនសិន!", "error");
      return;
    }

    setIsUploadingManualSlip(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        showToast("❌ រកមិនឃើញគណនី Login ទេ សូម Login ម្ដងទៀត។", "error");
        return window.location.href = '/login';
      }

      const form = e.currentTarget;
      const amountInput = (form.elements.namedItem('amount') as HTMLInputElement).value;

      const formData = new FormData();
      formData.append('slipFile', manualSlipFile);
      formData.append('email', user.email);
      formData.append('amount', amountInput || String(selectedPlan.amount));
      formData.append('planName', selectedPlan.name);

      const res = await fetch('/api/payments/upload-slip', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setKhqrSuccessData(result);
        showToast("🎉 បានបញ្ជូន Slip ផ្ទេរប្រាក់ជូន Admin រួចរាល់! សូមរង់ចាំ Admin ពិនិត្យ និង Approve ក្នុងផ្ទាំង CRM", "success");
        setManualSlipFile(null);
        setManualSlipPreview(null);
        form.reset();
        loadMySubscription(user.email);
        fetchClients();
        if (onPaymentSuccess) onPaymentSuccess();
      } else {
        showToast("❌ បរាជ័យ: " + (result.error || "មិនអាចបញ្ជូនបានទេ"), "error");
      }
    } catch (err: any) {
      showToast("❌ Error: " + err.message, "error");
    } finally {
      setIsUploadingManualSlip(false);
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
    <div className={`p-6 rounded-2xl shadow-sm border w-full max-w-4xl mx-auto my-6 animate-in fade-in duration-300 transition-colors ${theme === 'dark' ? 'bg-[#0D1117] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>

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
            <span>⚡ ស្កេន KHQR & ភ្ជាប់ Slip</span>
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

      {/* 🌟 ផ្ទាំងជោគជ័យពេលបង់ប្រាក់ KHQR ឬ Upload Slip រួច */}
      {khqrSuccessData && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border-2 border-emerald-500/40 text-center animate-in zoom-in-95 duration-300 shadow-xl">
          <div className="text-4xl mb-2 animate-bounce">🎉</div>
          <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            ការទូទាត់ប្រាក់ទទួលបានជោគជ័យ!
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
            {khqrSuccessData.message}
          </p>
          <div className="inline-block mt-3 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-mono font-bold border border-emerald-500/30">
            Ref: {khqrSuccessData.reference || `REF-${Date.now().toString().slice(-6)}`}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                const client = mySubscription || (clients && clients.length > 0 ? clients[0] : null);
                setSelectedInvoice({
                  invoiceNumber: khqrSuccessData.reference || `INV-${Date.now().toString().slice(-6)}`,
                  issueDate: new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' }),
                  clientName: client?.client_name || userEmail || 'អតិថិជន',
                  clientEmail: userEmail || client?.email || '',
                  amount: selectedPlan.amount,
                  planName: selectedPlan.name,
                  paymentMethod: 'KHQR (Bakong / ABA)',
                  transactionRef: khqrSuccessData.reference || `REF-${Date.now().toString().slice(-6)}`,
                  status: 'PAID',
                  expiryDate: khqrSuccessData.expiry_date ? new Date(khqrSuccessData.expiry_date).toLocaleDateString('km-KH') : '+30 ថ្ងៃ'
                });
                setIsInvoiceModalOpen(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <span>🧾</span> <span>ទាញយកវិក្កយបត្រ (View & Download Invoice)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setKhqrSuccessData(null);
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <span>🚀</span> <span>ចូលទៅ Boost Ads ឥឡូវនេះ</span>
            </button>
          </div>
        </div>
      )}

      {/* 🌟 OPTION 1: KHQR (BAKONG) FLOW ជាមួយ DIRECT SLIP UPLOAD */}
      {payMethod === 'khqr' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* KHQR Card View */}
          <div className={`md:col-span-6 p-6 rounded-2xl border text-center flex flex-col items-center justify-center shadow-md relative ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-white border-slate-200'}`}>
            
            {/* 🟢 Live Connection Signal / Radar Badge */}
            <div className="w-full flex items-center justify-between px-3 py-2 mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-black tracking-wide">
                  ប្រព័ន្ធទទួលប្រាក់ KHQR កំពុងរង់ចាំ (Online 24/7)
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                READY
              </span>
            </div>

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
            <div className="w-full text-xs space-y-1 font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mb-3 text-left">
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

            {/* 📸 Direct Slip Upload Dropzone (កន្លែងភ្ជាប់រូប Slip ភ្លាមៗ) */}
            <div className="w-full mb-3 p-3 rounded-xl border-2 border-dashed border-sky-400/50 bg-sky-50/60 dark:bg-sky-950/20 text-center transition-all hover:border-sky-500">
              {!slipPreview ? (
                <label className="cursor-pointer block p-1 group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-300 flex items-center justify-center text-sm shadow-xs group-hover:scale-110 transition">
                      📷
                    </div>
                    <strong className="text-xs text-sky-700 dark:text-sky-300 font-bold group-hover:underline">
                      + ភ្ជាប់រូបភាពវិក្កយបត្រ / Slip ផ្ទេរប្រាក់ (Bank Slip)
                    </strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      បាញ់លុយតាម ABA/Bakong រួច ចុចត្រង់នេះដើម្បី Upload រូប Slip ភ្លាមៗ
                    </span>
                  </div>
                </label>
              ) : (
                <div className="flex items-center gap-3 p-1">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0 shadow-xs">
                    <img src={slipPreview} alt="Slip" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span>✅</span>
                      <span className="truncate">បានភ្ជាប់រូប Slip: {slipFile?.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      ទំហំ: {((slipFile?.size || 0) / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveSlip}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 px-2 py-1 rounded text-xs font-bold transition cursor-pointer"
                  >
                    ✕ ប្ដូរ
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2 w-full">
                {/* 1. ប៊ូតុងបើក App ABA Mobile ផ្ទាល់ */}
                <a
                  href="abamobilebank://"
                  className="py-2.5 px-3 bg-[#004A7C] hover:bg-[#003860] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>📱</span>
                  <span>បើក App ABA</span>
                </a>

                {/* 2. ប៊ូតុង Save រូប QR ទុកស្កេនពី Photo */}
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-300/60 dark:border-slate-700 cursor-pointer active:scale-95"
                >
                  <span>📥</span>
                  <span>Save រូប QR</span>
                </button>
              </div>

              {/* 3. ប៊ូតុងចម្លងលេខគណនី ABA */}
              <button
                type="button"
                onClick={handleCopyAba}
                className="w-full py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 border border-blue-200 dark:border-blue-900 cursor-pointer"
              >
                <span>📋</span>
                <span>{isCopiedAba ? "✅ បានចម្លងលេខ ABA 010 72 30 80 រួចរាល់!" : "ចម្លងលេខគណនី ABA (010 72 30 80)"}</span>
              </button>

              <button
                type="button"
                disabled={isVerifyingKHQR}
                onClick={handleVerifyKHQRPayment}
                className="btn-futuristic-rose btn-shimmer w-full py-3.5 rounded-xl text-xs font-black cursor-pointer shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isVerifyingKHQR ? (
                    <span>⏳ កំពុងផ្ទៀងផ្ទាត់ &amp; បញ្ជាក់ការទូទាត់...</span>
                  ) : slipFile ? (
                    <span>🚀 បញ្ជូន Slip ជូន Admin ពិនិត្យ &amp; Approve</span>
                  ) : (
                    <span>⚡ ខ្ញុំបានស្កេនរួចរាល់ (បញ្ជាក់ &amp; Active ភ្លាមៗ)</span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('slip')}
                className="w-full py-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>🧾</span>
                <span>ឬចុចទីនេះ ដើម្បីផ្ញើ Slip ជូន Admin ពិនិត្យដោយផ្ទាល់ ↗</span>
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
                      : (theme === 'dark' ? 'border-slate-700 hover:border-slate-600 bg-[#0B0F17]' : 'border-slate-200 hover:border-slate-300 bg-slate-50')
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
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700 text-slate-300' : 'bg-amber-50/60 border-amber-200 text-slate-700'}`}>
              <h5 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span>💡</span> <span>របៀបទូទាត់ប្រាក់រហ័ស 3 ជំហាន៖</span>
              </h5>
              <ol className="list-decimal list-inside space-y-2 text-[11px] leading-relaxed">
                <li>ចុចប៊ូតុង <strong>"📱 បើក App ABA"</strong> ឬចុច <strong>"📥 Save រូប QR"</strong> រួចចូលក្នុង App ABA / Bakong ស្កេនរូប QR ពីក្នុង Photo Gallery របស់អ្នក។</li>
                <li>ផ្ទៀងផ្ទាត់ឈ្មោះ <strong>SENG SOVEASNA</strong> និងចំនួនទឹកប្រាក់ <strong>${selectedPlan.amount.toFixed(2)}</strong> រួចធ្វើការទូទាត់។</li>
                <li>ភ្ជាប់រូបភាព <strong>Slip ផ្ទេរប្រាក់</strong> រួចចុចប៊ូតុង <strong>"⚡ បញ្ជាក់ការទូទាត់"</strong> នោះប្រព័ន្ធនឹង Active គណនី +៣០ ថ្ងៃភ្លាមៗ!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 OPTION 2: DEDICATED SLIP UPLOAD FLOW */}
      {payMethod === 'slip' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* ផ្នែកខាងឆ្វេង៖ QR Code */}
          <div className={`md:col-span-5 p-6 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
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
              <p>លេខគណនី ABA៖ <strong className="text-blue-600 dark:text-blue-400 font-mono">010 72 30 80</strong></p>
              <p>ចំនួនទឹកប្រាក់៖ <strong className="text-red-600 font-bold">${selectedPlan.amount.toFixed(2)} USD</strong></p>
            </div>
          </div>

          {/* ផ្នែកខាងស្តាំ៖ Form Upload Slip */}
          <div className={`md:col-span-7 p-6 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <span>🧾</span> <span>បញ្ជូនព័ត៌មាន និង Slip ផ្ទេរប្រាក់</span>
            </h3>

            <form onSubmit={handleManualSlipSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-500 uppercase">ទឹកប្រាក់បានបង់ ($)</label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  required
                  defaultValue={selectedPlan.amount.toFixed(2)}
                  placeholder="5.00"
                  className={`w-full p-3 rounded-xl border text-sm outline-none font-bold text-emerald-500 ${theme === 'dark' ? 'bg-[#1C2128] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-500 uppercase">រូបភាព Slip ផ្ទេរប្រាក់ (Bank Slip)</label>
                <input
                  type="file"
                  name="slipFile"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const f = e.target.files[0];
                      setManualSlipFile(f);
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setManualSlipPreview(ev.target?.result as string);
                      };
                      reader.readAsDataURL(f);
                    }
                  }}
                  className={`w-full p-2.5 rounded-xl border text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer ${theme === 'dark' ? 'bg-[#1C2128] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-700'}`}
                />
              </div>

              {/* Preview នៃរូប Slip ដែលបានរើស */}
              {manualSlipPreview && (
                <div className="p-3 rounded-xl border bg-white dark:bg-slate-900 flex items-center gap-3">
                  <img src={manualSlipPreview} alt="Slip" className="w-14 h-14 object-cover rounded-lg border" />
                  <div className="text-left flex-1 min-w-0">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block truncate">
                      ✅ រូបភាពត្រៀមបញ្ជូន: {manualSlipFile?.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ទំហំ: {((manualSlipFile?.size || 0) / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploadingManualSlip}
                className="btn-futuristic btn-shimmer w-full py-3.5 rounded-xl font-black text-sm cursor-pointer shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>📤</span>
                  <span>{isUploadingManualSlip ? "កំពុងបញ្ជូន Slip..." : "បញ្ជូន Slip ជូន Admin ពិនិត្យ & Approve"}</span>
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 ផ្នែកគ្រប់គ្រងសម្រាប់ Admin (QR Upload & Telegram Bot Test) */}
      {isAdmin && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Admin Upload QR */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-amber-50/50 border-amber-200'}`}>
            <span className="text-xs font-bold text-amber-600 block mb-2">⚙️ Admin: ផ្លាស់ប្ដូររូបភាព QR Code</span>
            <label className="cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-2">
              <span>📁</span>
              <span>ជ្រើសរើសរូបភាព QR ថ្មី</span>
              <input type="file" accept="image/*" onChange={handleUploadAdminQR} className="hidden" />
            </label>
          </div>

          {/* Admin Telegram Bot Connection Test */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-sky-50/50 border-sky-200'}`}>
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
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <span>📜</span> ប្រវត្តិការទូទាត់ប្រាក់របស់អ្នក (Payment History)
        </h3>

        <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b uppercase tracking-wider ${theme === 'dark' ? 'bg-[#1C2128] text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  <th className="py-3 px-4 font-bold">កាលបរិច្ឆេទ (Date)</th>
                  <th className="py-3 px-4 font-bold">ទឹកប្រាក់ (Amount)</th>
                  <th className="py-3 px-4 font-bold">វិធីទូទាត់ (Method)</th>
                  <th className="py-3 px-4 font-bold text-center">ស្ថានភាព (Status)</th>
                  <th className="py-3 px-4 font-bold text-center">វិក្កយបត្រ (Invoice)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {(() => {
                  const currentClientData = mySubscription || (clients && clients.length > 0 ? clients.find((c: any) => c.email === userEmail) || clients[0] : null);
                  const historyRecords = currentClientData?.payment_history || (currentClientData?.slip_url ? [{
                    date: currentClientData.created_at || new Date().toISOString(),
                    amount: currentClientData.amount || 0,
                    method: 'MANUAL_SLIP',
                    slip_url: currentClientData.slip_url,
                    status: currentClientData.slip_status || 'approved'
                  }] : []);

                  return historyRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 italic">
                        មិនទាន់មានប្រវត្តិការទូទាត់ប្រាក់នៅឡើយទេ។
                      </td>
                    </tr>
                  ) : (
                    historyRecords.map((record: any, idx: number) => (
                      <tr key={idx} className={`transition ${theme === 'dark' ? 'hover:bg-[#1C2128]' : 'hover:bg-slate-50'}`}>
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
                        <td className="py-3 px-4 text-center">
                          {record.status === 'approved' ? (
                            <button
                              type="button"
                              onClick={() => {
                                const client = mySubscription || (clients && clients.length > 0 ? clients[0] : null);
                                setSelectedInvoice({
                                  invoiceNumber: record.reference || `INV-${new Date(record.date).getTime().toString().slice(-6)}`,
                                  issueDate: new Date(record.date).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' }),
                                  clientName: client?.client_name || userEmail || 'អតិថិជន',
                                  clientEmail: userEmail || client?.email || '',
                                  amount: Number(record.amount || 0),
                                  planName: record.package || '1Click Boost Ads Service',
                                  paymentMethod: record.method === 'KHQR_BAKONG' ? 'KHQR (Bakong / ABA)' : 'Manual Bank Transfer',
                                  transactionRef: record.reference || 'REF-VERIFIED',
                                  status: 'PAID',
                                  expiryDate: client?.expiry_date ? new Date(client.expiry_date).toLocaleDateString('km-KH') : undefined
                                });
                                setIsInvoiceModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/25 font-bold text-[11px] transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            >
                              <span>🧾</span> <span>Invoice</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">-</span>
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

      {/* 🧾 Digital Invoice Modal (វិក្កយបត្រផ្លូវការ) */}
      <DigitalInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoiceData={selectedInvoice}
        theme={theme}
      />
    </div>
  );
}
