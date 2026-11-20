"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SettingsTabProps {
  theme: 'light' | 'dark';
  setTheme?: (theme: 'light' | 'dark') => void;
  lang?: 'kh' | 'en';
  setLang?: (lang: 'kh' | 'en') => void;
  showToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function SettingsTab({ theme, setTheme, lang = 'kh', setLang, showToast }: SettingsTabProps) {
  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (showToast) showToast(msg, type);
    else if (typeof window !== 'undefined') window.alert(msg);
  };
  // Password states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Client Telegram Notification states
  const [telegramChatId, setTelegramChatId] = useState("");
  const [savedChatId, setSavedChatId] = useState<string | null>(null);
  const [alertDisapproved, setAlertDisapproved] = useState(true);
  const [alertBilling, setAlertBilling] = useState(true);
  const [alertExpiry, setAlertExpiry] = useState(true);
  const [alertBoost, setAlertBoost] = useState(true);
  const [alertApproved, setAlertApproved] = useState(true);
  const [isSavingTelegram, setIsSavingTelegram] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // ទាញយកព័ត៌មាន Telegram ដែលបានកំណត់ពីមុន
  useEffect(() => {
    const loadTelegramSettings = async () => {
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

      const prefBoost = localStorage.getItem('client_alert_boost');
      if (prefBoost !== null) setAlertBoost(prefBoost === 'true');

      const prefAppr = localStorage.getItem('client_alert_approved');
      if (prefAppr !== null) setAlertApproved(prefAppr === 'true');
    };
    loadTelegramSettings();
  }, []);

  // 💾 រក្សាទុក Telegram Settings របស់អតិថិជន
  const handleSaveTelegram = async () => {
    if (!telegramChatId.trim()) {
      notify("⚠️ សូមបញ្ចូលលេខ Telegram Chat ID របស់អ្នក!", "error");
      return;
    }

    const cleanId = telegramChatId.trim();
    setIsSavingTelegram(true);
    setTelegramStatusMsg(null);

    try {
      // ១. រក្សាទុកក្នុង localStorage លើ Browser របស់អតិថិជន
      localStorage.setItem('client_telegram_chat_id', cleanId);
      localStorage.setItem('client_alert_disapproved', String(alertDisapproved));
      localStorage.setItem('client_alert_billing', String(alertBilling));
      localStorage.setItem('client_alert_expiry', String(alertExpiry));
      localStorage.setItem('client_alert_boost', String(alertBoost));
      localStorage.setItem('client_alert_approved', String(alertApproved));

      setSavedChatId(cleanId);
      setTelegramStatusMsg({
        text: "✅ បានរក្សាទុកការកំណត់ Telegram ដោយជោគជ័យ! សូមចុចប៊ូតុង 'តេស្តផ្ញើសារ' ខាងក្រោមដើម្បីបញ្ជាក់ការតភ្ជាប់។",
        type: 'success'
      });
    } catch (err: any) {
      setTelegramStatusMsg({ text: "❌ បរាជ័យ: " + err.message, type: 'error' });
    } finally {
      setIsSavingTelegram(false);
    }
  };

  // 📲 សាកល្បងតេស្តផ្ញើសារ Telegram ទៅកាន់ Client
  const handleTestClientTelegram = async () => {
    const targetId = telegramChatId.trim() || savedChatId;
    if (!targetId) {
      notify("⚠️ សូមបញ្ចូល និងរក្សាទុក Telegram Chat ID ជាមុនសិន!", "error");
      return;
    }

    setIsTestingTelegram(true);
    setTelegramStatusMsg(null);

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
        setTelegramStatusMsg({
          text: `🎉 សារតេស្តបានផ្ញើទៅកាន់ Telegram (ID: ${targetId}) របស់អ្នកជោគជ័យ! សូមបើក Telegram ដើម្បីពិនិត្យ។`,
          type: 'success'
        });
      } else {
        setTelegramStatusMsg({
          text: `⚠️ មិនអាចផ្ញើសារបាន: ${data.error || "សូមប្រាកដថាអ្នកបានចុច Start ជាមួយ Bot ឬ Chat ID ត្រឹមត្រូវ"}`,
          type: 'error'
        });
      }
    } catch (err: any) {
      setTelegramStatusMsg({ text: "❌ Error: " + err.message, type: 'error' });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // ✕ ផ្ដាច់ការតភ្ជាប់ Telegram
  const handleDisconnectTelegram = () => {
    if (!confirm("តើអ្នកពិតជាចង់ផ្ដាច់ការទទួលសារ Alert តាម Telegram មែនទេ?")) return;
    localStorage.removeItem('client_telegram_chat_id');
    setTelegramChatId("");
    setSavedChatId(null);
    setTelegramStatusMsg({ text: "ℹ️ បានផ្ដាច់ការតភ្ជាប់ Telegram រួចរាល់។", type: 'success' });
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm border w-full max-w-2xl mx-auto my-6 animate-in fade-in duration-300 transition-colors ${theme === 'dark' ? 'bg-[#0D1117] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
      
      {/* ========================================================= */}
      {/* 🌟 ផ្នែកទី ០៖ ការកំណត់រូបរាង (Theme) & ភាសា (Language) */}
      {/* ========================================================= */}
      <div className="mb-8 border-b pb-8 border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center text-xl shadow-xs">
            🎨
          </div>
          <div>
            <h2 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              រូបរាង &amp; ភាសា (Theme &amp; Language)
            </h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              ប្ដូរទម្រង់ពន្លឺ/ងងឹត (Light / Dark Mode) និងជ្រើសរើសភាសាប្រើប្រាស់ក្នុងប្រព័ន្ធ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          {/* ១. Theme Switcher */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              ទម្រង់ពណ៌ (Appearance Mode)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (setTheme) setTheme('light');
                  if (typeof window !== 'undefined') localStorage.setItem('theme', 'light');
                  notify("☀️ បានប្ដូរទៅជា Light Mode", "success");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                  theme === 'light'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>☀️</span>
                <span>ពន្លឺថ្ងៃ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (setTheme) setTheme('dark');
                  if (typeof window !== 'undefined') localStorage.setItem('theme', 'dark');
                  notify("🌙 បានប្ដូរទៅជា Dark Mode", "success");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>🌙</span>
                <span>យប់ងងឹត</span>
              </button>
            </div>
          </div>

          {/* ២. Language Switcher */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              ភាសាប្រព័ន្ធ (Language)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (setLang) setLang('kh');
                  if (typeof window !== 'undefined') localStorage.setItem('lang', 'kh');
                  notify("🇰🇭 បានប្ដូរទៅជា ភាសាខ្មែរ", "success");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                  lang === 'kh'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>🇰🇭</span>
                <span>ខ្មែរ (KH)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (setLang) setLang('en');
                  if (typeof window !== 'undefined') localStorage.setItem('lang', 'en');
                  notify("🇺🇸 Switched to English", "success");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🌟 ផ្នែកទី ១៖ ភ្ជាប់ Telegram Notification ផ្ទាល់ខ្លួនសម្រាប់អតិថិជន */}
      {/* ========================================================= */}
      <div className="mb-8 border-b pb-8 border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 flex items-center justify-center text-xl shadow-xs">
              🤖
            </div>
            <div>
              <h2 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                ភ្ជាប់ Telegram ទទួលការជូនដំណឹងផ្ទាល់ខ្លួន
              </h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                ទទួលសារ Alert ភ្លាមៗលើទូរស័ព្ទរបស់អ្នកពេល Facebook Ad មានបញ្ហា ឬគាំងលុយ
              </p>
            </div>
          </div>

          {savedChatId ? (
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ភ្ជាប់រួចរាល់ (ID: {savedChatId})
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[11px] font-bold">
              មិនទាន់ភ្ជាប់
            </span>
          )}
        </div>

        {/* ការណែនាំរបៀបយក Chat ID (How-to Guide) */}
        <div className={`p-4 rounded-xl border text-xs space-y-2 mb-4 leading-relaxed ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700 text-slate-300' : 'bg-sky-50/60 border-sky-200 text-slate-700'}`}>
          <h4 className="font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
            <span>💡</span> <span>របៀបយក Telegram Chat ID របស់អ្នក ងាយៗ ៣ ជំហាន៖</span>
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-[11px]">
            <li>
              បើក Telegram រួចចុចលើ Bot នេះ៖{" "}
              <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="font-bold text-sky-600 hover:underline">
                @userinfobot ↗
              </a>{" "}
              (ឬ{" "}
              <a href="https://t.me/RawDataBot" target="_blank" rel="noopener noreferrer" className="font-bold text-sky-600 hover:underline">
                @RawDataBot ↗
              </a>
              )
            </li>
            <li>ចុចប៊ូតុង <strong>Start</strong> នោះវានឹងបង្ហាញលេខសម្គាល់របស់អ្នកត្រង់ពាក្យ <code>Id: 123456789</code></li>
            <li>ចម្លង (Copy) លេខនោះមកបិទភ្ជាប់ (Paste) ក្នុងប្រអប់ខាងក្រោម រួចចុច <strong>"រក្សាទុក Telegram ID"</strong>។</li>
          </ol>
        </div>

        {/* Input Form & Preferences */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Telegram Chat ID របស់អ្នក
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="ឧ. 123456789"
                className={`flex-1 px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:border-sky-500 font-mono font-bold ${theme === 'dark' ? 'bg-[#1C2128] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              />
              <button
                type="button"
                disabled={isSavingTelegram}
                onClick={handleSaveTelegram}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                {isSavingTelegram ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
              </button>
            </div>
          </div>

          {/* Alert Options Checkboxes */}
          <div className={`p-3.5 rounded-xl border text-xs space-y-2.5 ${theme === 'dark' ? 'bg-[#0B0F17] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <span className="font-bold block text-slate-500 uppercase text-[10px]">ជ្រើសរើសប្រភេទសារដែលចង់ទទួលបាន៖</span>
            
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alertBoost}
                onChange={(e) => setAlertBoost(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
              <span className="font-medium">🚀 ជូនដំណឹងពេលបានបង្កើត &amp; BOOST Ad ជោគជ័យ</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alertApproved}
                onChange={(e) => setAlertApproved(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
              <span className="font-medium">🎉 ជូនដំណឹងពេល Facebook បានយល់ព្រម (Ad Approved / Active)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alertDisapproved}
                onChange={(e) => setAlertDisapproved(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
              <span className="font-medium">🚨 ជូនដំណឹងពេល Facebook Ad ត្រូវបដិសេធ (Disapproved/Rejected)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alertBilling}
                onChange={(e) => setAlertBilling(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
              <span className="font-medium">💳 ជូនដំណឹងពេល Ad Account គាំងលុយ / កាតកាត់មិនបាន (Payment Failed)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={alertExpiry}
                onChange={(e) => setAlertExpiry(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
              <span className="font-medium">⏳ ជូនដំណឹងរំលឹកពេលគណនីជិតផុតកំណត់សេវា (៣ ថ្ងៃមុន)</span>
            </label>
          </div>

          {/* Test & Disconnect Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              disabled={isTestingTelegram || !telegramChatId.trim()}
              onClick={handleTestClientTelegram}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>📲</span>
              <span>{isTestingTelegram ? "កំពុងផ្ញើ..." : "សាកល្បងតេស្តផ្ញើសារ (Test Alert)"}</span>
            </button>

            {savedChatId && (
              <button
                type="button"
                onClick={handleDisconnectTelegram}
                className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ✕ ផ្ដាច់ការតភ្ជាប់
              </button>
            )}
          </div>

          {/* Feedback Message */}
          {telegramStatusMsg && (
            <div className={`p-3 rounded-xl text-xs font-medium border animate-in fade-in duration-200 ${
              telegramStatusMsg.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              {telegramStatusMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🌟 ផ្នែកទី ២៖ ផ្លាស់ប្ដូរលេខសម្ងាត់ (Change Password) */}
      {/* ========================================================= */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center text-xl shadow-xs">
            🔒
          </div>
          <div>
            <h2 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              ផ្លាស់ប្ដូរលេខសម្ងាត់ (Change Password)
            </h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              ផ្លាស់ប្ដូរលេខសម្ងាត់សម្រាប់ Login ចូលប្រើប្រាស់គណនីរបស់អ្នក
            </p>
          </div>
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const newPass = (form.elements.namedItem('newPass') as HTMLInputElement).value;
          const confirmPass = (form.elements.namedItem('confirmPass') as HTMLInputElement).value;

          if (newPass !== confirmPass) {
            notify("❌ លេខសម្ងាត់ថ្មី និងការបញ្ជាក់មិនដូចគ្នាទេ!", "error");
            return;
          }
          if (newPass.length < 6) {
            notify("❌ លេខសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ!", "error");
            return;
          }

          try {
            const { error } = await supabase.auth.updateUser({ password: newPass });
            if (error) throw error;

            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
              await supabase.from('customer_subscriptions').update({ password: newPass }).eq('email', user.email);
            }

            notify("✅ បានផ្លាស់ប្ដូរលេខសម្ងាត់ថ្មីដោយជោគជ័យ!", "success");
            form.reset();
          } catch (err: any) {
            notify("❌ បរាជ័យ: " + err.message, "error");
          }
        }} className="space-y-4 text-xs">

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">លេខសម្ងាត់ថ្មី</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPass"
                required
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:border-blue-500 font-medium ${theme === 'dark' ? 'bg-[#1C2128] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
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

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">បញ្ជាក់លេខសម្ងាត់ថ្មី</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPass"
                required
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 pr-10 border rounded-xl text-sm outline-none focus:border-blue-500 font-medium ${theme === 'dark' ? 'bg-[#1C2128] border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
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
            ✓ រក្សាទុកលេខសម្ងាត់ថ្មី
          </button>
        </form>
      </div>

    </div>
  );
}
