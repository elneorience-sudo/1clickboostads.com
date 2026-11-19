"use client";

import React from 'react';

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
  generateAiCopy: () => void;
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
  return (
    <div className={`flex flex-col w-full h-[calc(100vh-90px)] max-w-5xl mx-auto animate-in fade-in duration-300 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
      {aiResults.length === 0 && !aiLoading ? (
        /* 🌟 ១. ទំព័រចាប់ផ្តើម (Initial State) */
        <div className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-10 sm:mt-20">
          <h1 className="text-3xl sm:text-[40px] mb-10 font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 tracking-tight text-center">
            តើអ្នកចង់ចាប់ផ្តើមពីចំណុចណា?
          </h1>

          {/* ប្រអប់ Input កណ្តាល */}
          <div className={`w-full max-w-3xl relative flex items-end p-2 rounded-[28px] transition-all border ${theme === 'dark' ? 'bg-[#1E1F20] border-slate-700' : 'bg-[#F0F4F9] border-transparent focus-within:bg-white focus-within:shadow-md'}`}>
            <label className={`cursor-pointer p-3 rounded-full transition-colors mb-0.5 ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`} title="Upload image/video">
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleAiMediaChange} />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </label>

            <div className="flex-1 flex flex-col py-3 px-2">
              {aiMediaPreview && (
                <div className="relative mb-3 w-fit animate-in zoom-in duration-200">
                  {aiMedia?.type.startsWith('video') ? (
                    <video src={aiMediaPreview} className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                  ) : (
                    <img src={aiMediaPreview} alt="Preview" className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                  )}
                  <button onClick={removeAiMedia} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow">✕</button>
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
                placeholder="សរសេរសំណួរ ឬបញ្ចូលព័ត៌មានផលិតផលរបស់អ្នកទីនេះ..."
                className="w-full bg-transparent border-none outline-none text-[16px] resize-none max-h-[150px] overflow-y-auto custom-scrollbar placeholder-slate-500"
                rows={aiInput.split('\n').length > 1 ? Math.min(aiInput.split('\n').length, 5) : 1}
              />
            </div>

            <div className="p-2 mb-0.5">
              {aiInput.trim() || aiMedia ? (
                <button onClick={generateAiCopy} className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ) : (
                <button className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
            </div>
          </div>

          {/* គំរូសំណួរ (Suggestions) */}
          <div className="mt-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "✨", text: "សរសេរអត្ថបទផ្សាយលក់ស្បែកជើងម៉ូដថ្មី" },
              { icon: "🎁", text: "ខ្លឹមសារបញ្ចុះតម្លៃពិសេសសម្រាប់អតិថិជនចាស់" },
              { icon: "⭐", text: "បង្កើតអត្ថបទផ្សាយលក់បែប Review ពីអតិថិជន" },
              { icon: "🎬", text: "សរសេរ Caption ខ្លីៗសម្រាប់ Reels/TikTok" }
            ].map((item, idx) => (
              <button key={idx} onClick={() => setAiInput(item.text)} className={`flex items-center gap-3 p-3.5 rounded-2xl transition-colors text-left text-[14px] font-medium cursor-pointer ${theme === 'dark' ? 'hover:bg-[#1E1F20] text-slate-300' : 'hover:bg-[#F0F4F9] text-slate-700'}`}>
                <span className="text-xl opacity-80">{item.icon}</span> {item.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 🌟 ២. ទំព័រសន្ទនា (Chat State) */
        <>
          <div className="flex-1 overflow-y-auto p-4 sm:px-8 pt-8 custom-scrollbar flex flex-col gap-8">
            {/* សំណួររបស់ User */}
            <div className="flex justify-end w-full">
              <div className={`px-5 py-3.5 rounded-3xl rounded-tr-sm max-w-[85%] sm:max-w-[75%] text-[15px] leading-relaxed shadow-sm ${theme === 'dark' ? 'bg-[#3A3B3C] text-white' : 'bg-[#F0F4F9] text-[#050505]'}`}>
                {aiMediaPreview && (
                  <img src={aiMediaPreview} className="max-w-[250px] max-h-[250px] object-cover rounded-xl mb-3 border shadow-sm" alt="Uploaded" />
                )}
                {aiInput || "ជួយសរសេរអត្ថបទលក់ផលិតផលក្នុងរូបភាពនេះឱ្យបានទាក់ទាញបំផុត"}
              </div>
            </div>

            {/* ចម្លើយរបស់ AI (Loading State) */}
            {aiLoading && (
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500 flex items-center justify-center text-white shrink-0 animate-spin shadow-md">
                  ✨
                </div>
                <div className="flex flex-col gap-3 w-full max-w-2xl pt-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6 animate-pulse"></div>
                </div>
              </div>
            )}

            {/* ចម្លើយរបស់ AI (Results) */}
            {!aiLoading && aiResults.map((res, idx) => (
              <div key={idx} className="flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-slate-200' : 'text-[#050505]'}`}>
                    {res}
                  </div>

                  {/* Toolbar ខាងក្រោមចម្លើយ */}
                  <div className="flex items-center gap-1.5 mt-5">
                    <button onClick={() => { navigator.clipboard.writeText(res); showToast("✅ បានចម្លងអត្ថបទ!", "success"); }} className={`p-2 rounded-full transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-black/5 text-slate-500 hover:text-slate-800'}`} title="Copy">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 8h2a2 2 0 012 2v10a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button onClick={resetAiChat} className={`p-2 rounded-full transition-colors cursor-pointer text-xs ${theme === 'dark' ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-black/5 text-slate-500 hover:text-slate-800'}`} title="Restart">
                      🔄 សន្ទនាឡើងវិញ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🌟 ផ្នែក Input ខាងក្រោមពេលកំពុងសន្ទនា */}
          <div className="p-4 w-full bg-transparent">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
              <div className={`w-full relative flex items-end p-2 rounded-[28px] shadow-sm transition-all border ${theme === 'dark' ? 'bg-[#1E1F20] border-slate-700' : 'bg-[#F0F4F9] border-slate-200 focus-within:bg-white focus-within:shadow-md focus-within:border-slate-300'}`}>
                <label className={`cursor-pointer p-3 rounded-full transition-colors mb-0.5 ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`} title="Upload image/video">
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleAiMediaChange} />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </label>

                <div className="flex-1 flex flex-col py-3 px-2">
                  {aiMediaPreview && (
                    <div className="relative mb-3 w-fit animate-in zoom-in duration-200">
                      {aiMedia?.type.startsWith('video') ? (
                        <video src={aiMediaPreview} className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                      ) : (
                        <img src={aiMediaPreview} alt="Preview" className="h-14 w-14 object-cover rounded-xl border shadow-sm" />
                      )}
                      <button onClick={removeAiMedia} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow">✕</button>
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
                    placeholder="សួរសំណួរបន្ថែម..."
                    className="w-full bg-transparent border-none outline-none text-[16px] resize-none max-h-[150px] overflow-y-auto custom-scrollbar placeholder-slate-500"
                    rows={aiInput.split('\n').length > 1 ? Math.min(aiInput.split('\n').length, 5) : 1}
                  />
                </div>

                <div className="p-2 mb-0.5">
                  {aiInput.trim() || aiMedia ? (
                    <button onClick={generateAiCopy} className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  ) : (
                    <button className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                </div>
              </div>
              <p className={`text-[11px] mt-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Gemini is AI and can make mistakes.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
