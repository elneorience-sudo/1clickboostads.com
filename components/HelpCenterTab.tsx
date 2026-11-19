"use client";

import React, { useState } from 'react';

interface HelpCenterTabProps {
  theme: 'light' | 'dark';
}

interface TutorialVideo {
  id: string;
  title: string;
  duration: string;
  category: string;
  desc: string;
  steps: string[];
  youtubeId?: string; // បើមាន YouTube Embed ID
}

export default function HelpCenterTab({ theme }: HelpCenterTabProps) {
  const [selectedVideo, setSelectedVideo] = useState<TutorialVideo | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const videos: TutorialVideo[] = [
    {
      id: 'connect-fb',
      title: '១. របៀប Connect គណនី Facebook ជាមួយប្រព័ន្ធលើកដំបូង',
      duration: '02:30',
      category: 'មូលដ្ឋានគ្រឹះ',
      desc: 'ណែនាំពីរបៀបភ្ជាប់ Facebook Account, ផ្ដល់សិទ្ធិ Permissions និងការជ្រើសរើស Ad Account ត្រឹមត្រូវ។',
      steps: [
        'ចុចលើប៊ូតុងពណ៌ខៀវ "Connect FB" នៅខាងលើស្ដាំដៃ។',
        'ជ្រើសរើសគណនី Facebook ផ្ទាល់ខ្លួនរបស់អ្នកដែលកាន់សិទ្ធិ Admin លើ Page ឬ Ad Account។',
        'ចុច "Edit access" ឬ "Allow all permissions" ដើម្បីឱ្យប្រព័ន្ធអាចទាញយក Ad Account និង Page មកគ្រប់គ្រងបាន។',
        'ពេល Connect ជោគជ័យ ផ្ទាំងនឹងបង្ហាញឈ្មោះគណនី និង Ad Account របស់អ្នកដោយស្វ័យប្រវត្តិ។'
      ]
    },
    {
      id: 'boost-1click',
      title: '២. របៀបបង្កើត Campaign & Boost Ads ត្រឹមតែ 1-Click',
      duration: '03:45',
      category: 'បង្កើត Ad',
      desc: 'របៀបជ្រើសរើសប៉ុស្តិ៍ Facebook Page, កំណត់ Budget, ថ្ងៃផុតកំណត់ និងចុច Boost ដំណើរការភ្លាមៗ។',
      steps: [
        'ចូលទៅកាន់ផ្ទាំង "បង្កើត (Create)"។',
        'ជ្រើសរើស Page និង ប៉ុស្តិ៍ (Post) ដែលអ្នកចង់ធ្វើការ Boost។',
        'ជ្រើសរើស Objective (ឧ. Engagement ផ្ញើសារ ឬ Lead ទាក់ទាញអតិថិជន)។',
        'កំណត់កញ្ចប់ថវិកាប្រចាំថ្ងៃ (Daily Budget) ចាប់ពី $1-$5 ឡើងទៅ។',
        'ចុចប៊ូតុង "🚀 Boost Now (1-Click)" ដើម្បីបង្ហោះចូល Facebook Ads Manager ភ្លាមៗ!'
      ]
    },
    {
      id: 'ai-copywriter',
      title: '៣. របៀបប្រើ Gemini AI Copywriter សរសេរ Caption & Target',
      duration: '03:10',
      category: 'AI Assistant',
      desc: 'ប្រើប្រាស់បញ្ញាសិប្បនិម្មិត Gemini AI ជួយសរសេរ Caption លក់ដាច់ និងស្រង់ទាញ Target ចំៗ។',
      steps: [
        'ចូលទៅកាន់ផ្ទាំង "AI Copywriter" នៅក្នុង Sidebar។',
        'វាយបញ្ចូលឈ្មោះទំនិញ ឬសេវាកម្មរបស់អ្នក រួមទាំងចំណុចពិសេស និងតម្លៃ។',
        'ជ្រើសរើសស្ទីលសរសេរ (Direct Sales, Problem Solving ឬ Storytelling)។',
        'ចុចប៊ូតុង "✨ បង្កើត Caption ដោយ AI" ដើម្បីទទួលបាន Caption ជាភាសាខ្មែរទាក់ទាញភ្លាមៗ។',
        'ប្រើមុខងារ "AI Auto-Fill" ក្នុងផ្ទាំង Boost ដើម្បីឱ្យ AI កំណត់អាយុ ភេទ និង Interests ស្វ័យប្រវត្តិ!'
      ]
    },
    {
      id: 'manage-insights',
      title: '៤. របៀបពិនិត្យមើល CPA (ថ្លៃក្នុងមួយសារ) និង Duplicate AdSet',
      duration: '04:15',
      category: 'គ្រប់គ្រង & តាមដាន',
      desc: 'ការវាយតម្លៃប្រសិទ្ធភាព Ads តាមរយៈពណ៌ Badge AI CPA ៥ កម្រិត និងការពង្រីក AdSet លក់ដាច់។',
      steps: [
        'ចូលទៅកាន់ផ្ទាំង "គ្រប់គ្រង (Manage)"។',
        'ពិនិត្យមើលសូចនាករ CPA (Cost Per Result)៖ ពណ៌បៃតង = ថោកខ្លាំង, ពណ៌ក្រហម = ថ្លៃគួរផ្អាក។',
        'មើលចំនួន Results (សារ), Reach (អ្នកឃើញ) និង Amount Spent (លុយដែលបានចំណាយ)។',
        'ប្រសិនបើ AdSet ណាលក់ដាច់ខ្លាំង ចុចប៊ូតុង "Duplicate" ដើម្បីបង្កើនចំនួន AdSet ស្វ័យប្រវត្តិដោយមិនបាច់រៀបចំថ្មី។'
      ]
    },
    {
      id: 'khqr-payment',
      title: '៥. របៀបស្កេន KHQR (Bakong) បន្តសុពលភាពស្វ័យប្រវត្តិ',
      duration: '01:50',
      category: 'ការទូទាត់ប្រាក់',
      desc: 'របៀបបង់ថ្លៃសេវាប្រចាំខែតាម KHQR Bakong និងដំណើរការគណនីបន្តភ្លាមៗ។',
      steps: [
        'ចូលទៅកាន់ផ្ទាំង "Settings" -> "ទូទាត់ប្រាក់ (Payments)"។',
        'ជ្រើសរើសកញ្ចប់សេវាកម្មដែលអ្នកចង់ប្រើប្រាស់ ($5, $10 ឬ $25)។',
        'បើក App ធនាគាររបស់អ្នក (Bakong, ABA, Wing...) ស្កេនរូបភាព KHQR។',
        'ចុចប៊ូតុង "⚡ ខ្ញុំបានស្កេនរួចរាល់" ដើម្បីឱ្យប្រព័ន្ធ Activate +៣០ ថ្ងៃស្វ័យប្រវត្តិ!'
      ]
    }
  ];

  const faqs = [
    {
      q: 'តើប្រព័ន្ធ 1Click Boost Ads នេះមានសុវត្ថិភាពកម្រិតណា?',
      a: 'សុវត្ថិភាពខ្ពស់បំផុត ១០០%! ប្រព័ន្ធដំណើរការតាមរយៈ Meta Marketing API ផ្លូវការរបស់ Facebook។ យើងមិនរក្សាទុកលេខសម្ងាត់ Facebook របស់អ្នកឡើយ ហើយការទូទាត់ប្រាក់ផ្សាយពាណិជ្ជកម្ម Facebook គឺកាត់តាមកាតផ្ទាល់ខ្លួនរបស់អ្នកនៅក្នុង Facebook Ads Manager ដូចធម្មតា។'
    },
    {
      q: 'ហេតុអ្វីបានជា Ad របស់ខ្ញុំត្រូវ Facebook បដិសេធ (Disapproved)?',
      a: 'ជាទូទៅបណ្ដាលមកពី៖ Caption មានពាក្យទាក់ទងនឹងសម្រកទម្ងន់ខ្លាំងពេក, រូបភាព Before/After, ការសន្យាហួសការពិត ឬទាក់ទងនឹងកម្មសិទ្ធិបញ្ញា។ ប្រព័ន្ធយើងមាន Smart Error Translation ដែលនឹងបង្ហាញមូលហេតុលម្អិត និងវិធីកែសម្រួលជូនអ្នកភ្លាមៗ។'
    },
    {
      q: 'តើ CPA (Cost Per Result) ប៉ុន្មានទើបចាត់ទុកថាថោក និងចំណេញ?',
      a: 'សម្រាប់ទីផ្សារស្រុកខ្មែរ (Message Ads)៖ CPA ក្រោម $0.30 ចាត់ទុកថាថោកខ្លាំង (Very Cheap), ចន្លោះ $0.30 - $0.70 គឺល្អមធ្យម (Normal)។ ប្រសិនបើ CPA លើសពី $1.50 ឡើងទៅ ប្រព័ន្ធ AI នឹងផ្ដល់សញ្ញាពណ៌ក្រហម ដើម្បីណែនាំឱ្យអ្នកផ្អាក ឬកែប្រែរូបភាពថ្មី។'
    },
    {
      q: 'ពេលកាតធនាគារកាត់លុយមិនបាន (Payment Failed) តើត្រូវធ្វើដូចម្តេច?',
      a: 'សូមពិនិត្យសមតុល្យលុយក្នុងកាតធនាគារ (ABA/Acleda...) ឬទាក់ទងធនាគារដើម្បីបើកសិទ្ធិ E-Commerce។ បន្ទាប់មកចូលទៅកាន់ Facebook Ads Manager ចុចប៊ូតុង "Pay Now" នោះ Ads របស់អ្នកនឹងត្រឡប់មកដើរវិញធម្មតា។'
    }
  ];

  return (
    <div className={`p-6 rounded-2xl shadow-sm border w-full max-w-5xl mx-auto my-6 animate-in fade-in duration-300 transition-colors ${theme === 'dark' ? 'bg-[#242526] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}>
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 mb-8 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 tracking-wide">
            🎓 មជ្ឈមណ្ឌលជំនួយ & វីដេអូបង្រៀន (Help Center)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">
            រៀនប្រើ 1Click Boost Ads ឱ្យមានប្រសិទ្ធភាពខ្ពស់
          </h1>
          <p className="text-sm text-blue-100 mt-2 leading-relaxed">
            វីដេអូណែនាំមួយជំហានម្តងៗ ងាយយល់ ទោះបីជាមិនសូវចេះបច្ចេកវិទ្យាក៏អាច Boost Ad និងបង្កើនការលក់បានយ៉ាងងាយស្រួល។
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://t.me/sengsoveasna"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-blue-700 rounded-xl text-xs font-bold shadow-md hover:bg-blue-50 transition flex items-center gap-2"
            >
              <span>💬</span> <span>ទាក់ទងជំនួយតាម Telegram</span>
            </a>
            <a
              href="tel:010723080"
              className="px-4 py-2 bg-blue-500/30 backdrop-blur-md text-white border border-white/30 rounded-xl text-xs font-bold hover:bg-blue-500/40 transition flex items-center gap-2"
            >
              <span>📞</span> <span>Hotline: 010 72 30 80</span>
            </a>
          </div>
        </div>

        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-15 pointer-events-none select-none">
          🚀
        </div>
      </div>

      {/* 🌟 ផ្ទាំងវីដេអូបង្រៀន (Video Tutorials Grid) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black flex items-center gap-2">
            <span>🎬</span> <span>វីដេអូណែនាំខ្លីៗ (Short Tutorials)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">ចំនួន {videos.length} មេរៀន</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              className={`rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-md ${
                theme === 'dark' ? 'bg-[#18191A] border-slate-700 hover:border-blue-500' : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-white'
              }`}
            >
              <div>
                {/* Thumbnail Simulation Frame */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white mb-3 shadow-inner">
                  <div className="w-12 h-12 rounded-full bg-blue-600/90 group-hover:bg-blue-600 group-hover:scale-110 text-white flex items-center justify-center text-lg transition-transform shadow-lg shadow-blue-600/40">
                    ▶
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono font-bold">
                    {vid.duration}
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500/80 backdrop-blur-xs rounded text-[10px] font-bold">
                    {vid.category}
                  </span>
                </div>

                <h3 className="font-bold text-xs line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
                  {vid.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {vid.desc}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <span>មើលការណែនាំលម្អិត</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 ផ្ទាំង Modal បង្ហាញជំហានលម្អិតនៃវីដេអូដែលបានជ្រើសរើស */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${theme === 'dark' ? 'bg-[#242526] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-md">
                  {selectedVideo.category} • {selectedVideo.duration}
                </span>
                <h3 className="text-base font-black mt-1 leading-snug">{selectedVideo.title}</h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="my-4 rounded-xl overflow-hidden bg-slate-900 aspect-video flex flex-col items-center justify-center text-center p-6 text-white shadow-inner relative">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl mb-3 shadow-lg shadow-blue-500/50 animate-pulse">
                ▶
              </div>
              <h4 className="font-bold text-sm">{selectedVideo.title}</h4>
              <p className="text-xs text-slate-300 max-w-md mt-1">{selectedVideo.desc}</p>
              <div className="mt-3 text-[11px] text-blue-300 font-mono">
                [វីដេអូកំពុងចាក់ផ្សាយកម្រិតច្បាស់ Full HD 1080p]
              </div>
            </div>

            {/* Steps List */}
            <div className="overflow-y-auto flex-1 custom-scrollbar pr-2 space-y-2">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">ជំហានអនុវត្ត (Step-by-Step Guide):</h4>
              {selectedVideo.steps.map((st, i) => (
                <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{st}</span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                យល់ព្រម ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 សំណួរដែលជួបញឹកញាប់ (FAQs Accordion) */}
      <div className="mt-10">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
          <span>❓</span> <span>សំណួរដែលជួបញឹកញាប់ (Frequently Asked Questions)</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                theme === 'dark' ? 'bg-[#18191A] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs cursor-pointer gap-3"
              >
                <span className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">Q{idx + 1}:</span>
                  <span>{faq.q}</span>
                </span>
                <span className={`text-slate-400 transform transition-transform ${openFaqIndex === idx ? 'rotate-180 text-blue-500' : ''}`}>
                  ▼
                </span>
              </button>

              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
