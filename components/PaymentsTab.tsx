"use client";

import React from 'react';
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
  return (
    <div className={`p-6 rounded-2xl shadow-sm border w-full max-w-4xl mx-auto my-6 animate-in fade-in duration-300 transition-colors ${theme === 'dark' ? 'bg-[#242526] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3 shadow-lg shadow-orange-500/20">
          💳
        </div>
        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          ទូទាត់ប្រាក់ និងបញ្ជាក់ Slip សេវាកម្ម
        </h1>
        <p className={`text-sm mt-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          សូមស្កេន QR Code ខាងក្រោមដើម្បីបង់ប្រាក់ប្រចាំខែ រួច Upload រូបភាព Slip ផ្ទេរប្រាក់បញ្ជូនមកកាន់ប្រព័ន្ធ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* ផ្នែកខាងឆ្វេង៖ បង្ហាញ QR Code ធនាគារ (ទាញយកពី Supabase ផ្ទាល់) */}
        <div className={`md:col-span-5 p-6 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className="font-bold text-sm mb-4 text-blue-600 dark:text-blue-400">Scan to Pay (ABA / Bakong)</h3>

          {/* QR Code Frame */}
          <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center mb-4 relative group">
            {adminQrUrl ? (
              <img
                src={adminQrUrl}
                alt="Admin Bank QR Code"
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="text-xs text-slate-400 text-center p-4">
                <span>⏳ កំពុងទាញយក QR Code...</span>
              </div>
            )}
          </div>

          <div className="text-xs space-y-1 font-medium text-slate-500 dark:text-slate-400 mb-6">
            <p>ឈ្មោះគណនី៖ <strong className="text-slate-800 dark:text-white">SENG SOVEASNA</strong></p>
            <p>លេខគណនី ABA៖ <strong className="text-blue-600 dark:text-blue-400">010 72 30 80</strong></p>
          </div>

          {/* 🌟 ផ្នែកសម្រាប់ Admin Upload QR Code ថ្មី */}
          {isAdmin && (
            <div className="w-full mt-6 pt-4 border-t border-slate-300 dark:border-slate-700 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-amber-500">⚙️ Admin: ផ្លាស់ប្ដូរ QR Code ថ្មី</span>
              <label className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2">
                <span>📁</span>
                <span>ជ្រើសរើសរូបភាព QR ថ្មី</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAdminQR}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* ផ្នែកខាងស្តាំ៖ Form សម្រាប់អតិថិជន Upload Slip */}
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
                .select('payment_history')
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
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md cursor-pointer mt-2"
            >
              📤 បញ្ជូន Slip ជូន Admin
            </button>
          </form>
        </div>
      </div>

      {/* 🌟 ផ្នែកប្រវត្តិបង់ប្រាក់ (Payment History Table) នៅខាងក្រោម */}
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
                  <th className="py-3 px-4 font-bold">រូបភាព Slip</th>
                  <th className="py-3 px-4 font-bold text-center">ស្ថានភាព (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {(() => {
                  const currentClientData = clients.find(() => true);
                  const historyRecords = currentClientData?.payment_history || (currentClientData?.slip_url ? [{
                    date: currentClientData.created_at || new Date().toISOString(),
                    amount: currentClientData.amount || 0,
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
                          {record.slip_url ? (
                            <a
                              href={record.slip_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline font-bold flex items-center gap-1"
                            >
                              <span>មើល Slip 🧾</span>
                            </a>
                          ) : (
                            <span className="text-slate-400">គ្មាន Slip</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {record.status === 'approved' ? (
                            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-full font-bold text-[11px] border border-blue-500/20">
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
