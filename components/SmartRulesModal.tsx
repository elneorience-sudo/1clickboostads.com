"use client";

import React, { useState, useEffect } from 'react';

export interface SmartRuleConfig {
  enabled: boolean;
  pauseZeroMessage: boolean;
  zeroMessageSpendThreshold: number; // e.g. 5 or 10
  highCpaAction: 'pause' | 'reduce_budget' | 'alert_only' | 'off';
  cpaThreshold: number; // e.g. 1.20
  autoScanInterval: number; // in minutes (e.g. 15)
}

interface SmartRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  selectedAdAccount: string;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRulesTriggered?: () => void;
}

export const DEFAULT_SMART_RULES_CONFIG: SmartRuleConfig = {
  enabled: true,
  pauseZeroMessage: true,
  zeroMessageSpendThreshold: 5,
  highCpaAction: 'pause',
  cpaThreshold: 1.20,
  autoScanInterval: 15
};

export default function SmartRulesModal({
  isOpen,
  onClose,
  theme,
  selectedAdAccount,
  showToast,
  onRulesTriggered
}: SmartRulesModalProps) {
  const [config, setConfig] = useState<SmartRuleConfig>(DEFAULT_SMART_RULES_CONFIG);
  const [telegramChatId, setTelegramChatId] = useState<string>('');
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [checkResult, setCheckResult] = useState<any | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Load config & logs from localStorage
  useEffect(() => {
    if (!isOpen) return;

    try {
      const saved = localStorage.getItem('smart_ad_rules_config');
      if (saved) {
        setConfig(JSON.parse(saved));
      }
      const savedChatId = localStorage.getItem('client_telegram_chat_id') || '';
      setTelegramChatId(savedChatId);

      const logs = localStorage.getItem('smart_ad_rules_logs');
      if (logs) {
        setRecentLogs(JSON.parse(logs));
      }
    } catch (e) {
      console.error("Failed to load smart rules config:", e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem('smart_ad_rules_config', JSON.stringify(config));
      if (showToast) {
        showToast("✅ បានរក្សាទុកការកំណត់ Smart Ad Rules ដោយជោគជ័យ!", "success");
      }
      onClose();
    } catch (err: any) {
      if (showToast) showToast("បរាជ័យក្នុងការរក្សាទុក: " + err.message, "error");
    }
  };

  const handleRunCheckNow = async () => {
    const token = localStorage.getItem('fb_user_token');
    if (!token) {
      if (showToast) showToast("⚠️ សូមភ្ជាប់ Facebook Account ជាមុនសិន!", "error");
      return;
    }
    if (!selectedAdAccount) {
      if (showToast) showToast("⚠️ សូមជ្រើសរើស Ad Account ជាមុនសិន!", "error");
      return;
    }

    setIsRunningCheck(true);
    setCheckResult(null);

    try {
      const res = await fetch('/api/smart-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: token,
          ad_account_id: selectedAdAccount,
          config: {
            ...config,
            chatId: telegramChatId || undefined
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setCheckResult(data);
        if (data.triggeredCount > 0) {
          const updatedLogs = [...data.actions, ...recentLogs].slice(0, 20);
          setRecentLogs(updatedLogs);
          localStorage.setItem('smart_ad_rules_logs', JSON.stringify(updatedLogs));

          if (showToast) {
            showToast(`🎯 រកឃើញ និងបានការពារ ${data.triggeredCount} Ad(s) ដែលខាតលុយ!`, "info");
          }
          if (onRulesTriggered) onRulesTriggered();
        } else {
          if (showToast) {
            showToast(`✅ ពិនិត្យចប់: Ads កំពុងដំណើរការល្អ (${data.activeCount} Active Ads)!`, "success");
          }
        }
      } else {
        if (showToast) showToast("❌ Error: " + data.error, "error");
      }
    } catch (err: any) {
      if (showToast) showToast("❌ មិនអាចភ្ជាប់ទៅកាន់ប្រព័ន្ធបានទេ: " + err.message, "error");
    } finally {
      setIsRunningCheck(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden transition-all ${
          theme === 'dark' 
            ? 'bg-[#0D1117] border-slate-800 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.8)]' 
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/25 shrink-0">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  Smart Ad Rules (ច្បាប់ការពារខាតលុយ)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  Killer Feature
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ប្រព័ន្ធតាមដាន 24/7 បិទ Ad អូតូពេលស៊ីលុយអត់សារ ឬពេលថ្លៃសារ (CPA) ឡើងខ្ពស់
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar text-xs sm:text-sm">
          
          {/* Master Switch */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
            config.enabled 
              ? (theme === 'dark' ? 'bg-indigo-950/20 border-indigo-500/40' : 'bg-indigo-50/80 border-indigo-300')
              : (theme === 'dark' ? 'bg-[#161B22]/60 border-slate-800' : 'bg-slate-50 border-slate-200')
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.enabled ? '🛡️' : '⚪'}</span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  ដំណើរការប្រព័ន្ធការពារខាតលុយស្វ័យប្រវត្តិ (Master Guard)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {config.enabled ? 'ប្រព័ន្ធកំពុងដំណើរការតាមដានរៀងរាល់ ១៥ នាទី និងផ្ញើសារប្រាប់តាម Telegram' : 'ប្រព័ន្ធការពារកំពុងបិទផ្អាក'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={config.enabled} 
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })} 
                className="sr-only peer" 
              />
              <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
            </label>
          </div>

          {/* Rule 1: Zero-Message Spend Guard */}
          <div className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
            theme === 'dark' ? 'bg-[#161B22]/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <span className="text-lg">🛑</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    ច្បាប់ទី ១: បិទ Ad ពេលស៊ីលុយអត់សារ (Zero-Message Guard)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    ការពារកុំឱ្យស៊ីលុយឥតប្រយោជន៍ពេលគេងយប់។ ប្រសិនបើ Ad ចំណាយដល់កំណត់ហើយគ្មានអ្នកឆាតទាល់តែសោះ (0 Messages) ➡️ ផ្អាក (Pause) ភ្លាម!
                  </p>
                </div>
              </div>

              <input 
                type="checkbox" 
                checked={config.pauseZeroMessage} 
                onChange={(e) => setConfig({ ...config, pauseZeroMessage: e.target.checked })}
                className="w-5 h-5 accent-indigo-600 cursor-pointer rounded mt-1 shrink-0" 
              />
            </div>

            {config.pauseZeroMessage && (
              <div className="pt-2 pl-7 space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">
                  កម្រិតចំណាយអតិបរមាគ្មានសារ (Spend Limit):
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[3, 5, 10, 15, 20].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setConfig({ ...config, zeroMessageSpendThreshold: amount })}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                        config.zeroMessageSpendThreshold === amount
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-500 shadow-sm'
                          : (theme === 'dark' ? 'bg-[#0D1117] border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200')
                      }`}
                    >
                      ${amount} {amount === 5 ? '🔥 (ណែនាំ)' : ''}
                    </button>
                  ))}
                  
                  {/* Custom Input */}
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      min="1" 
                      step="1"
                      value={config.zeroMessageSpendThreshold} 
                      onChange={(e) => setConfig({ ...config, zeroMessageSpendThreshold: Number(e.target.value) })}
                      className={`w-20 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold outline-none ${
                        theme === 'dark' ? 'bg-[#0D1117] border-slate-700 text-white' : 'bg-white border-slate-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rule 2: High CPA Guard */}
          <div className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
            theme === 'dark' ? 'bg-[#161B22]/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-start gap-2.5">
              <span className="text-lg">📈</span>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  ច្បាប់ទី ២: គ្រប់គ្រងថ្លៃដើមសារឡើងខ្ពស់ (High CPA Guard)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  ប្រសិនបើថ្លៃក្នុងមួយសារ (CPA) ឡើងលើសពីកម្រិតកំណត់ ➡️ អនុវត្តសកម្មភាពដែលអ្នកបានជ្រើសរើសដើម្បីកាត់បន្ថយការខាតបង់។
                </p>
              </div>
            </div>

            <div className="pl-7 space-y-3 pt-1">
              {/* Action Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">
                  សកម្មភាពត្រូវអនុវត្តពេលថ្លៃសារឡើងខ្ពស់៖
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'pause', label: '🛑 ផ្អាក Ad ភ្លាមៗ', desc: 'សុវត្ថិភាពបំផុត (ណែនាំ)' },
                    { key: 'reduce_budget', label: '📉 បន្ថយ Budget ៣០%', desc: 'រក្សា Ad ឱ្យរត់តិចៗ' },
                    { key: 'alert_only', label: '🔔 Alert តាម Telegram', desc: 'កុំទាន់បិទ' },
                  ].map((act) => (
                    <div 
                      key={act.key}
                      onClick={() => setConfig({ ...config, highCpaAction: act.key as any })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        config.highCpaAction === act.key
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : (theme === 'dark' ? 'border-slate-800 bg-[#0D1117] text-slate-400 hover:border-slate-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100')
                      }`}
                    >
                      <div className="font-bold text-xs">{act.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{act.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold Selector */}
              {config.highCpaAction !== 'off' && (
                <div className="pt-2 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">
                    កម្រិតថ្លៃសារអតិបរមា (Max CPA Threshold):
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[0.60, 0.80, 1.00, 1.20, 1.50, 2.00].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setConfig({ ...config, cpaThreshold: rate })}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                          config.cpaThreshold === rate
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-500 shadow-sm'
                            : (theme === 'dark' ? 'bg-[#0D1117] border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200')
                        }`}
                      >
                        ${rate.toFixed(2)} {rate === 1.20 ? '🔥 (ណែនាំ)' : ''}
                      </button>
                    ))}

                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-slate-400 font-bold">$</span>
                      <input 
                        type="number" 
                        min="0.1" 
                        step="0.05"
                        value={config.cpaThreshold} 
                        onChange={(e) => setConfig({ ...config, cpaThreshold: Number(e.target.value) })}
                        className={`w-20 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold outline-none ${
                          theme === 'dark' ? 'bg-[#0D1117] border-slate-700 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Telegram Status & Manual Check Trigger */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            theme === 'dark' ? 'bg-[#161B22]/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Telegram Alert:</span>
                  {telegramChatId ? (
                    <span className="text-emerald-500 font-mono text-[11px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      បានភ្ជាប់ (ID: {telegramChatId})
                    </span>
                  ) : (
                    <span className="text-amber-500 text-[11px]">
                      ⚠️ មិនទាន់ភ្ជាប់ (សូមចូលទៅ Tab Telegram ដើម្បីភ្ជាប់)
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">
                  រាល់ពេលប្រព័ន្ធបិទ Ad ឬ CPA ឡើងខ្ពស់ វានឹងផ្ញើសារប្រាប់តាម Telegram ភ្លាម!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunCheckNow}
              disabled={isRunningCheck}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                isRunningCheck 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:scale-105 active:scale-95'
              }`}
            >
              {isRunningCheck ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>កំពុងពិនិត្យ...</span>
                </>
              ) : (
                <>
                  <span>⚡ ត្រួតពិនិត្យ Ad ឥឡូវនេះ</span>
                </>
              )}
            </button>
          </div>

          {/* Live Check Result Banner */}
          {checkResult && (
            <div className={`p-4 rounded-2xl border animate-in fade-in duration-200 text-xs ${
              checkResult.triggeredCount > 0 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              <div className="font-bold flex items-center gap-2 mb-1">
                <span>{checkResult.triggeredCount > 0 ? '⚠️' : '✅'}</span>
                <span>លទ្ធផលនៃការត្រួតពិនិត្យជាក់ស្ដែង៖</span>
              </div>
              <p>
                បានពិនិត្យ <strong>{checkResult.totalInspected} Ads</strong> (ក្នុងនោះមាន <strong>{checkResult.activeCount} Ads</strong> កំពុងរត់សកម្ម)។ 
                រកឃើញ <strong>{checkResult.triggeredCount} Ads</strong> ដែលជាប់ច្បាប់ និងបានអនុវត្តសកម្មភាពរួចរាល់!
              </p>
            </div>
          )}

          {/* Activity History Logs */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <span>📋</span> កំណត់ត្រាសកម្មភាពថ្មីៗ (Recent Guard Logs)
            </h4>
            
            {recentLogs.length === 0 ? (
              <div className={`p-4 rounded-2xl border text-center text-xs text-slate-500 ${
                theme === 'dark' ? 'bg-[#0D1117] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                មិនទាន់មានកំណត់ត្រា Ad ជាប់ច្បាប់ខាតលុយនៅឡើយទេ (Ad ដំណើរការល្អ)
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {recentLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                      theme === 'dark' ? 'bg-[#161B22]/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-200">{log.adName || `Ad #${log.adId}`}</div>
                      <div className="text-[10px] text-slate-400">{log.reason}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'PAUSED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {log.action}
                      </span>
                      <div className="text-[9px] text-slate-500 mt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
              theme === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-[#161B22]' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            បោះបង់
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="btn-futuristic btn-shimmer px-6 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-lg"
          >
            💾 រក្សាទុកការកំណត់ Smart Rules
          </button>
        </div>

      </div>
    </div>
  );
}
