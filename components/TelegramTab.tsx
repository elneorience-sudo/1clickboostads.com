"use client";

import React, { useState, useEffect } from 'react';

interface TelegramTabProps {
  theme: 'light' | 'dark';
  showToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function TelegramTab({ theme, showToast }: TelegramTabProps) {
  const [telegramChatId, setTelegramChatId] = useState("");
  const [savedChatId, setSavedChatId] = useState<string | null>(null);
  const [alertDisapproved, setAlertDisapproved] = useState(true);
  const [alertBilling, setAlertBilling] = useState(true);
  const [alertExpiry, setAlertExpiry] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const localId = localStorage.getItem('client_telegram_chat_id');
    if (localId) {
      setTelegramChatId(localId);
      setSavedChatId(localId);
    }

    const prefDis = localStorage.getItem('client_alert_disapproved');
    if (prefDis !== null) setAlertDisapproved(prefDis === 'true');

    const prefBill = localStorage.getItem('client_alert_billing');
    if (prefBill !== null) setAlertBilling(prefBill === 'true');

    const prefExp = localStorage.getItem('client_alert_expiry');
    if (prefExp !== null) setAlertExpiry(prefExp === 'true');
  }, []);

  const handleSave = () => {
    if (!telegramChatId.trim()) {
      alert("⚠️ សូមបញ្ចូលលេខ Telegram Chat ID របស់អ្នក!");
      return;
    }

    const cleanId = telegramChatId.trim();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      localStorage.setItem('client_telegram_chat_id', cleanId);
      localStorage.setItem('client_alert_disapproved', String(alertDisapproved));
      localStorage.setItem('client_alert_billing', String(alertBilling));
      localStorage.setItem('client_alert_expiry', String(alertExpiry));

      setSavedChatId(cleanId);
      setStatusMsg({
        text: "✅ បានរក្សាទុកការកំណត់ Telegram ដោយជោគជ័យ! សូមចុចប៊ូតុង 'តេស្តផ្ញើសារ' ខាងក្រោមដើម្បីបញ្ជាក់ការតភ្ជាប់។",
        type: 'success'
      });
      if (showToast) showToast("✅ បានរក្សាទុក Telegram Chat ID!", "success");
    } catch (err: any) {
      setStatusMsg({ text: "❌ បរាជ័យ: " + err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    const targetId = telegramChatId.trim() || savedChatId;
    if (!targetId) {
      alert("⚠️ សូមបញ្ចូល និងរក្សាទុក Telegram Chat ID ជាមុនសិន!");
      return;
    }

    setIsTesting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          chatId: targetId
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          text: `🎉 សារតេស្តបានផ្ញើទៅកាន់ Telegram (ID: ${targetId}) របស់អ្នកជោគជ័យ! សូមបើកទូរស័ព្ទពិនិត្យ Telegram។`,
          type: 'success'
        });
        if (showToast) showToast("🎉 បានផ្ញើសារតេស្តទៅ Telegram!", "success");
      } else {
        setStatusMsg({
          text: `⚠️ មិនអាចផ្ញើសារបាន: ${data.error || "សូមប្រាកដថាអ្នកបានចុច Start ជាមួយ Bot ឬ Chat ID ត្រឹមត្រូវ"}`,
          type: 'error'
        });
      }
    } catch (err: any) {
      setStatusMsg({ text: "❌ Error: " + err.message, type: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    if (!confirm("តើអ្នកពិតជាចង់ផ្ដាច់ការទទួលសារ Alert តាម Telegram មែនទេ?")) return;
    localStorage.removeItem('client_telegram_chat_id');
    setTelegramChatId("");
    setSavedChatId(null);
    setStatusMsg({ text: "ℹ️ បានផ្ដាច់ការតភ្ជាប់ Telegram រួចរាល់។", type: 'success' });
    if (showToast) showToast("ℹ️ បានផ្ដាច់ Telegram", "info");
  };

  return (
    <div className={`p-6 sm:p-8 rounded-2xl shadow-sm border w-full max-w-3xl mx-auto my-6 animate-in fade-in duration-300 transition-colors ${theme === 'dark' ? 'bg-[#242526] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
      
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-sky-500/25">
            🤖
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              ភ្ជាប់ Telegram Bot ទទួលការជូនដំណឹងផ្ទាល់ខ្លួន
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              ប្រព័ន្ធនឹងផ្ញើសារ Alert ស្វ័យប្រវត្តិចូល Telegram របស់អ្នកភ្លាមៗ ពេល Facebook Ad ត្រូវបដិសេធ ឬគាំងលុយ
            </p>
          </div>
        </div>

        {savedChatId ? (
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ភ្ជាប់រួចរាល់ (ID: {savedChatId})</span>
          </span>
        ) : (
          <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-xs font-bold">
            ⚪ មិនទាន់ភ្ជាប់
          </span>
        )}
      </div>

      {/* Guide Box (របៀបយក Chat ID) */}
      <div className={`p-5 rounded-2xl border mb-6 text-xs leading-relaxed space-y-3 ${theme === 'dark' ? 'bg-[#18191A] border-slate-700 text-slate-300' : 'bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 text-slate-800'}`}>
        <h3 className="font-bold text-sm text-sky-800 dark:text-sky-400 flex items-center gap-2">
          <span>💡</span> <span>របៀបយក Telegram Chat ID របស់អ្នក ងាយៗ ៣ ជំហាន៖</span>
        </h3>
        
        <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed">
          <li>
            ចុចចូលទៅកាន់ Telegram Bot មួយណាក៏បានក្នុងចំណោមពីរនេះ៖
            <div className="mt-1 flex flex-wrap gap-2">
              <a
                href="https://t.me/userinfobot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-700 shadow-xs transition"
              >
                <span>👉 បើក @userinfobot ↗</span>
              </a>
              <a
                href="https://t.me/RawDataBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg font-bold text-xs hover:bg-slate-800 shadow-xs transition"
              >
                <span>👉 ឬបើក @RawDataBot ↗</span>
              </a>
            </div>
          </li>
          <li>
            ចុចពាក្យ <strong>Start</strong> នោះ Bot នឹងផ្ញើសារប្រាប់លេខសម្គាល់របស់អ្នកត្រង់ពាក្យ <code>Id: 123456789</code>។
          </li>
          <li>
            ចម្លង (Copy) លេខនោះ យកមកបិទភ្ជាប់ (Paste) ក្នុងប្រអប់ខាងក្រោម រួចចុច <strong>"💾 រក្សាទុក Telegram ID"</strong>។
          </li>
        </ol>
      </div>

      {/* Input Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Telegram Chat ID របស់អ្នក
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="ឧ. 123456789 (លេខសុទ្ធ)"
              className={`flex-1 px-4 py-3 border-2 rounded-xl text-sm outline-none focus:border-sky-500 font-mono font-bold transition-all ${
                theme === 'dark' ? 'bg-[#18191A] border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {isSaving ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក Telegram ID"}
            </button>
          </div>
        </div>

        {/* Alert Preferences */}
        <div className={`p-5 rounded-2xl border space-y-3 ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <span className="font-bold block text-slate-500 uppercase text-[11px] tracking-wider mb-1">
            ប្រភេទសារដែលអ្នកចង់ឱ្យប្រព័ន្ធជូនដំណឹង (Notification Preferences)៖
          </span>

          <label className="flex items-center gap-3 cursor-pointer select-none p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <input
              type="checkbox"
              checked={alertDisapproved}
              onChange={(e) => setAlertDisapproved(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
            />
            <div className="text-xs">
              <strong className="block text-slate-900 dark:text-white">🚨 Facebook Ad ត្រូវបដិសេធ (Disapproved/Rejected)</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">ប្រាប់ឈ្មោះ Ad និងមូលហេតុជាភាសាខ្មែរភ្លាមៗពេល Facebook បដិសេធ</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <input
              type="checkbox"
              checked={alertBilling}
              onChange={(e) => setAlertBilling(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
            />
            <div className="text-xs">
              <strong className="block text-slate-900 dark:text-white">💳 Ad Account គាំងលុយ / កាតកាត់មិនបាន (Payment Failed)</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">ដាស់តឿនឱ្យបញ្ចូលលុយក្នុងកាតធនាគារជាបន្ទាន់ ជៀសវាង Facebook ផ្អាក Ads</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <input
              type="checkbox"
              checked={alertExpiry}
              onChange={(e) => setAlertExpiry(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
            />
            <div className="text-xs">
              <strong className="block text-slate-900 dark:text-white">⏳ រំលឹកពេលសេវាកម្មជិតផុតកំណត់ (Subscription Expiry)</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">ផ្ញើសាររំលឹក ៣ ថ្ងៃមុនផុតកំណត់ ដើម្បីកុំឱ្យដាច់ការផ្សាយពាណិជ្ជកម្ម</span>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap pt-2">
          <button
            type="button"
            disabled={isTesting || !telegramChatId.trim()}
            onClick={handleTest}
            className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>📲</span>
            <span>{isTesting ? "កំពុងផ្ញើសារតេស្ត..." : "សាកល្បងតេស្តផ្ញើសារ (Test Alert)"}</span>
          </button>

          {savedChatId && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              ✕ ផ្ដាច់ការតភ្ជាប់
            </button>
          )}
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className={`p-4 rounded-xl text-xs font-medium border animate-in fade-in duration-200 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
              : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            {statusMsg.text}
          </div>
        )}
      </div>

    </div>
  );
}
