"use client";

import React from 'react';

export interface KhmerEcommerceTemplate {
  id: string;
  title: string;
  shortLabel: string;
  icon: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  borderHover: string;
  desc: string;
  prompt: string;
}

export const KHMER_ECOMMERCE_TEMPLATES: KhmerEcommerceTemplate[] = [
  {
    id: "cosmetics",
    title: "Caption លក់គ្រឿងសម្អាង / ឡេ",
    shortLabel: "💄 គ្រឿងសម្អាង/ឡេ",
    icon: "💄",
    badge: "ពេញនិយមខ្លាំង",
    badgeColor: "bg-pink-500/15 text-pink-500 dark:text-pink-400 border-pink-500/30",
    gradient: "from-pink-500/15 via-rose-500/10 to-transparent",
    borderHover: "hover:border-pink-500/60 dark:hover:border-pink-500/50",
    desc: "ផ្តោតលើស្បែកសភ្លឺថ្លា មានសំណើម សុវត្ថិភាព ជាមួយ Call to Action ជំរុញឱ្យឆាតទិញភ្លាមៗ",
    prompt: "ជួយសរសេរ Caption ផ្សាយពាណិជ្ជកម្ម Facebook លក់ឡេ ឬគ្រឿងសម្អាងឱ្យទាក់ទាញខ្លាំងបំផុត៖\n• ចំណុចលេចធ្លោ៖ ស្បែកសភ្លឺថ្លា កាត់បន្ថយស្នាមអុចខ្មៅ ផ្ដល់សំណើមជ្រៅ ឃើញប្រសិទ្ធភាពពិត សុវត្ថិភាពខ្ពស់មានស្តង់ដារទទួលស្គាល់\n• ទម្រង់សំណេរ៖ មានចំណងជើង Hook ចាប់អារម្មណ៍ខ្លាំង, សាច់រឿងដោះស្រាយបញ្ហាស្បែក, ការធានាគុណភាព, និង Call To Action ជំរុញឱ្យអតិថិជនចុច Send Message ឆាតទិញឥឡូវនេះ (មាន Emoji ស្អាតៗ)"
  },
  {
    id: "fashion",
    title: "Caption លក់សម្លៀកបំពាក់នារី",
    shortLabel: "👗 សម្លៀកបំពាក់នារី",
    icon: "👗",
    badge: "ម៉ូដថ្មីទាន់សម័យ",
    badgeColor: "bg-purple-500/15 text-purple-500 dark:text-purple-400 border-purple-500/30",
    gradient: "from-purple-500/15 via-indigo-500/10 to-transparent",
    borderHover: "hover:border-purple-500/60 dark:hover:border-purple-500/50",
    desc: "ម៉ូដស្អាតទាន់សម័យ សាច់ក្រណាត់ទន់ត្រជាក់ មានគ្រប់ទំហំ (S-XL) និងប្រូម៉ូសិនហ្វ្រីដឹក",
    prompt: "ជួយសរសេរ Caption ផ្សាយពាណិជ្ជកម្ម Facebook លក់សម្លៀកបំពាក់នារីម៉ូដថ្មីទាន់សម័យ៖\n• ចំណុចលេចធ្លោ៖ សាច់ក្រណាត់ទន់ត្រជាក់ មិនស្កៀប មិនបែកព្រុយ ស្លៀកទៅធ្វើការក៏សម ដើរលេងក៏ឡូយ មានគ្រប់ Size (S, M, L, XL)\n• ប្រូម៉ូសិនពិសេស៖ ទិញ ២ ឈុត ហ្វ្រីដឹកជញ្ជូនដល់ផ្ទះ ២៥ ខេត្តក្រុង\n• បញ្ចប់ដោយពាក្យជំរុញឱ្យឆាតទម្លាក់លេខ ឬឆាតមក Page ភ្លាមៗ (មាន Emoji ទាក់ទាញ)"
  },
  {
    id: "food",
    title: "Caption លក់ម្ហូប / អាហារសម្រន់",
    shortLabel: "🍱 ម្ហូប/អាហារសម្រន់",
    icon: "🍱",
    badge: "ឆ្ងាញ់ជាប់ចិត្ត",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    gradient: "from-amber-500/15 via-orange-500/10 to-transparent",
    borderHover: "hover:border-amber-500/60 dark:hover:border-amber-500/50",
    desc: "រសជាតិដើមឆ្ងាញ់ប្លែកមាត់ ស្រស់ៗរាល់ថ្ងៃ អនាម័យខ្ពស់ ដឹកជូនរហ័សដល់មុខផ្ទះ",
    prompt: "ជួយសរសេរ Caption ផ្សាយពាណិជ្ជកម្ម Facebook លក់ម្ហូប ឬអាហារសម្រន់បែបឆ្ងាញ់ពិសា៖\n• ចំណុចលេចធ្លោ៖ រសជាតិឆ្ងាញ់ប្លែកមាត់ ធ្វើស្រស់ៗថ្មីៗរាល់ថ្ងៃ អនាម័យខ្ពស់ គ្រឿងផ្សំធម្មជាតិសុទ្ធសាធ\n• អារម្មណ៍៖ ឃ្លានភ្លាម នឹកឃើញភ្លាម កុម្ម៉ង់ភ្លាម ដឹកជូនភ្លាមៗដល់មុខផ្ទះក្តៅៗ\n• Call To Action៖ ឆាតមកឥឡូវនេះដើម្បីទទួលបានការបញ្ចុះតម្លៃពិសេស និងសេវាដឹកជញ្ជូនរហ័ស"
  },
  {
    id: "hook",
    title: "សរសេរ Hook ទាក់ទាញក្នុង ៣ វិនាទី",
    shortLabel: "🎯 Hook ៣ វិនាទី",
    icon: "🎯",
    badge: "Killer Feature 🔥",
    badgeColor: "bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/30",
    gradient: "from-rose-500/15 via-red-500/10 to-transparent",
    borderHover: "hover:border-rose-500/60 dark:hover:border-rose-500/50",
    desc: "ចំណងជើងទាក់ទាញឱ្យភ្ញៀវឈប់អូសទូរសព្ទ (Stop Scrolling) សម្រាប់ Ads/Reels",
    prompt: "ជួយបង្កើតសំណេរ Hook ទាក់ទាញចំណាប់អារម្មណ៍ភ្ញៀវឱ្យឈប់មើលក្នុង ៣ វិនាទីដំបូង (Stop Scrolling Hooks) ចំនួន ៥ ជម្រើសផ្សេងគ្នា សម្រាប់យកទៅដាក់លើរូបភាព ឬដើមវីដេអូ Reels/TikTok/Facebook Ad ដើម្បីឱ្យភ្ញៀវចុច Send Message ឆាតទិញភ្លាមៗ"
  },
  {
    id: "promotion",
    title: "Caption ប្រូម៉ូសិន ទិញ ១ ថែម ១",
    shortLabel: "🎁 ទិញ ១ ថែម ១",
    icon: "🎁",
    badge: "ជំរុញការទិញបន្ទាន់",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    borderHover: "hover:border-emerald-500/60 dark:hover:border-emerald-500/50",
    desc: "ពាក្យពេចន៍បន្ទាន់ (Urgency) កំណត់ចំនួនភ្ញៀវ ៥០ នាក់ និងជំរុញឱ្យកក់ឥឡូវនេះ",
    prompt: "ជួយសរសេរ Caption ប្រូម៉ូសិនពិសេស ទិញ ១ ថែម ១ សម្រាប់អតិថិជន៖\n• ភាពបន្ទាន់ (Urgency)៖ កំណត់ត្រឹម ៥០ នាក់ដំបូងប៉ុណ្ណោះ ឬត្រឹមដាច់សប្តាហ៍នេះ\n• អត្ថប្រយោជន៍៖ ចំណេញទ្វេដង គុណភាពខ្ពស់ដូចគ្នា និងមានកាដូថែមជូន\n• Call to Action៖ ឆាតមកកក់កន្លែងឥឡូវនេះមុននឹងអស់ស្តុក!"
  },
  {
    id: "review",
    title: "សំណេរបែប Review & Feedback ភ្ញៀវ",
    shortLabel: "⭐ Review ពីអតិថិជន",
    icon: "⭐",
    badge: "បង្កើនទំនុកចិត្ត",
    badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    gradient: "from-sky-500/15 via-blue-500/10 to-transparent",
    borderHover: "hover:border-sky-500/60 dark:hover:border-sky-500/50",
    desc: "រៀបរាប់ពីបទពិសោធន៍ពិតរបស់អតិថិជនដែលប្រើប្រាស់រួចពេញចិត្តខ្លាំង (Social Proof)",
    prompt: "ជួយសរសេរ Caption ផ្សាយពាណិជ្ជកម្ម Facebook បែបអតិថិជន Review និងសរសើរពីផលិតផលពិតៗ៖\n• ដំណើររឿង៖ ពីមុនធ្លាប់ស្ទាក់ស្ទើរ និងបារម្ភ តែក្រោយពេលសាកល្បងប្រើរួច ស្រលាញ់ពេញចិត្តខ្លាំង និងណែនាំបន្ត\n• ការកសាងទំនុកចិត្ត (Social Proof) និងជំរុញឱ្យអ្នកអានឆាតមកសាកល្បងដោយមិនស្តាយក្រោយ"
  }
];

interface AICopywriterTabProps {
  theme: 'light' | 'dark';
  aiResults: string[];
  aiLoading: boolean;
  aiInput: string;
  setAiInput: (val: string) => void;
  aiMedia: File | null;
  aiMediaPreview: string | null;
  handleAiMediaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAiMedia: () => void;
  generateAiCopy: (customPrompt?: string) => void;
  resetAiChat: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AICopywriterTab({
  theme,
  aiResults,
  aiLoading,
  aiInput,
  setAiInput,
  aiMedia,
  aiMediaPreview,
  handleAiMediaChange,
  removeAiMedia,
  generateAiCopy,
  resetAiChat,
  showToast,
}: AICopywriterTabProps) {

  const handleSelectTemplate = (prompt: string, autoRun = false) => {
    setAiInput(prompt);
    if (autoRun) {
      generateAiCopy(prompt);
    } else {
      showToast("📝 បានជ្រើសរើស Template! បងអាចកែសម្រួល ឬចុច Send បានភ្លាមៗ", "info");
    }
  };

  return (
    <div className={`flex flex-col w-full h-[calc(100vh-90px)] max-w-5xl mx-auto animate-in fade-in duration-300 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
      
      {aiResults.length === 0 && !aiLoading ? (
        /* 🌟 ១. ទំព័រចាប់ផ្តើម (Initial State with Bento Quick Templates) */
        <div className="flex flex-col items-center flex-1 w-full px-3 sm:px-4 py-6 overflow-y-auto custom-scrollbar">
          
          {/* Header Title & Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 text-purple-400 border border-purple-500/20 mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              ✨ Khmer E-Commerce AI Copywriter
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 tracking-tight mb-2">
              តើបងចង់ឱ្យ AI សរសេរ Caption បែបណាថ្ងៃនេះ?
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              ចុចលើគំរូ E-Commerce ខាងក្រោមដើម្បីឱ្យ AI សរសេរភ្លាមៗ ឬវាយបញ្ចូលព័ត៌មានផលិតផលផ្ទាល់ខ្លួន
            </p>
          </div>

          {/* 🌟 Khmer E-Commerce Quick Templates (Bento Grid ទាំង ៦) */}
          <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {KHMER_ECOMMERCE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.prompt, false)}
                className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-3 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                  theme === 'dark' 
                    ? `bg-[#0D1117] border-slate-800 ${tmpl.borderHover}` 
                    : `bg-white border-slate-200/90 ${tmpl.borderHover}`
                }`}
              >
                {/* Background soft ambient gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tmpl.gradient} rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                      {tmpl.icon}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-[14.5px] tracking-tight mb-1 group-hover:text-purple-400 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {tmpl.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200">
                    ចុចជ្រើសរើស ➔
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(tmpl.prompt, true);
                    }}
                    className="btn-shimmer px-3 py-1.5 rounded-xl text-[11px] font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
                    title="សរសេរភ្លាមៗក្នុង ១ វិនាទី"
                  >
                    <span>🚀</span> <span>សរសេរភ្លាម</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ប្រអប់ Input កណ្តាល */}
          <div className={`w-full max-w-3xl relative flex items-end p-2 rounded-[28px] transition-all border shadow-lg ${
            theme === 'dark' 
              ? 'bg-[#161B22] border-slate-700/80 focus-within:border-purple-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]' 
              : 'bg-white border-slate-300 focus-within:border-purple-500 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
          }`}>
            <label className={`cursor-pointer p-3 rounded-full transition-colors mb-0.5 ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`} title="Upload image/video">
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleAiMediaChange} />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </label>

            <div className="flex-1 flex flex-col py-3 px-2">
              {aiMediaPreview && (
                <div className="relative mb-3 w-fit animate-in zoom-in duration-200">
                  {aiMedia?.type.startsWith('video') ? (
                    <video src={aiMediaPreview} className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                  ) : (
                    <img src={aiMediaPreview} alt="Preview" className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                  )}
                  <button onClick={removeAiMedia} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow cursor-pointer">✕</button>
                </div>
              )}
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateAiCopy();
                  }
                }}
                placeholder="សរសេរសំណួរ ឬជ្រើសរើស Template ខាងលើ..."
                className="w-full bg-transparent border-none outline-none text-[15px] resize-none max-h-[140px] overflow-y-auto custom-scrollbar placeholder-slate-500 leading-relaxed font-sans"
                rows={aiInput.split('\n').length > 1 ? Math.min(aiInput.split('\n').length, 5) : 1}
              />
            </div>

            <div className="p-2 mb-0.5">
              {aiInput.trim() || aiMedia ? (
                <button 
                  onClick={() => generateAiCopy()} 
                  className="btn-shimmer p-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  title="Generate"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ) : (
                <button className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* 🌟 ២. ទំព័រសន្ទនា (Chat State) */
        <>
          <div className="flex-1 overflow-y-auto p-4 sm:px-8 pt-6 custom-scrollbar flex flex-col gap-6">
            
            {/* សំណួររបស់ User */}
            <div className="flex justify-end w-full">
              <div className={`px-5 py-3.5 rounded-3xl rounded-tr-sm max-w-[85%] sm:max-w-[75%] text-[14.5px] leading-relaxed shadow-sm border ${
                theme === 'dark' ? 'bg-[#161B22] border-slate-700/80 text-white' : 'bg-slate-100 border-slate-200 text-[#050505]'
              }`}>
                {aiMediaPreview && (
                  <img src={aiMediaPreview} className="max-w-[250px] max-h-[250px] object-cover rounded-xl mb-3 border shadow-sm" alt="Uploaded" />
                )}
                <div className="whitespace-pre-line font-medium">
                  {aiInput || "ជួយសរសេរអត្ថបទលក់ផលិតផលក្នុងរូបភាពនេះឱ្យបានទាក់ទាញបំផុត"}
                </div>
              </div>
            </div>

            {/* ចម្លើយរបស់ AI (Loading State) */}
            {aiLoading && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/20">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-2xl pt-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* ចម្លើយរបស់ AI (Results) */}
            {!aiLoading && aiResults.map((res, idx) => (
              <div key={idx} className="flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/20 text-lg">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`p-5 rounded-3xl border shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap font-sans ${
                    theme === 'dark' ? 'bg-[#0D1117] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    {res}
                  </div>

                  {/* Toolbar ខាងក្រោមចម្លើយ */}
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={() => { 
                        navigator.clipboard.writeText(res); 
                        showToast("✅ បានចម្លង Caption ទៅ Clipboard!", "success"); 
                      }} 
                      className="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 8h2a2 2 0 012 2v10a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>Copy Caption</span>
                    </button>
                    <button 
                      onClick={resetAiChat} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        theme === 'dark' ? 'bg-[#1C2128] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>🔄</span> <span>សន្ទនាឡើងវិញ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🌟 ផ្នែក Input ខាងក្រោមពេលកំពុងសន្ទនា ជាមួយ Quick Chips Bar */}
          <div className="p-3 sm:p-4 w-full bg-transparent">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-2">
              
              {/* Quick Template Chips Bar ខាងលើប្រអប់ Input */}
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 custom-scrollbar">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">គំរូទាន់ចិត្ត:</span>
                {KHMER_ECOMMERCE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.prompt, true)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 border transition-all cursor-pointer flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 ${
                      theme === 'dark' 
                        ? 'bg-[#161B22] border-slate-700 text-slate-300 hover:border-purple-500/60 hover:text-white' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:text-purple-600'
                    }`}
                  >
                    <span>{tmpl.icon}</span>
                    <span>{tmpl.shortLabel}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Container */}
              <div className={`w-full relative flex items-end p-2 rounded-[28px] shadow-lg transition-all border ${
                theme === 'dark' 
                  ? 'bg-[#161B22] border-slate-700 focus-within:border-purple-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]' 
                  : 'bg-white border-slate-300 focus-within:border-purple-500 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
              }`}>
                <label className={`cursor-pointer p-3 rounded-full transition-colors mb-0.5 ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`} title="Upload image/video">
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleAiMediaChange} />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </label>

                <div className="flex-1 flex flex-col py-3 px-2">
                  {aiMediaPreview && (
                    <div className="relative mb-3 w-fit animate-in zoom-in duration-200">
                      {aiMedia?.type.startsWith('video') ? (
                        <video src={aiMediaPreview} className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                      ) : (
                        <img src={aiMediaPreview} alt="Preview" className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                      )}
                      <button onClick={removeAiMedia} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow cursor-pointer">✕</button>
                    </div>
                  )}
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        generateAiCopy();
                      }
                    }}
                    placeholder="សួរបន្ថែម ឬកែសម្រួល Caption..."
                    className="w-full bg-transparent border-none outline-none text-[15px] resize-none max-h-[140px] overflow-y-auto custom-scrollbar placeholder-slate-500 leading-relaxed font-sans"
                    rows={aiInput.split('\n').length > 1 ? Math.min(aiInput.split('\n').length, 5) : 1}
                  />
                </div>

                <div className="p-2 mb-0.5">
                  {aiInput.trim() || aiMedia ? (
                    <button 
                      onClick={() => generateAiCopy()} 
                      className="btn-shimmer p-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  ) : (
                    <button className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/5 text-slate-500'}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                </div>
              </div>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>✨ Powered by Gemini AI • ឆ្លាតវៃក្នុងការសរសេរ Caption E-Commerce</p>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
