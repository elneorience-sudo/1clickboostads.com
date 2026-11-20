"use client";

import React, { useRef, useState, useEffect } from 'react';

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  planName: string;
  paymentMethod: string;
  transactionRef: string;
  status: 'PAID' | 'COMPLETED' | 'APPROVED';
  expiryDate?: string;
  fbPageName?: string;
}

interface DigitalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
  theme?: 'light' | 'dark';
}

export default function DigitalInvoiceModal({
  isOpen,
  onClose,
  invoiceData,
  theme = 'dark'
}: DigitalInvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOfflineReceipt = () => {
    // Generate standalone printable HTML receipt file for offline archiving
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${invoiceData.invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; padding: 30px; margin: 0; color: #0f172a; }
    .invoice-box { max-width: 750px; margin: auto; padding: 40px; border-radius: 16px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 24px; }
    .logo-area { display: flex; align-items: center; gap: 12px; }
    .brand { font-size: 22px; font-weight: 900; color: #1e40af; }
    .badge-paid { background: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: 13px; text-transform: uppercase; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .meta-block { background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid #edf2f7; font-size: 13px; }
    .meta-label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
    th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; color: #475569; }
    td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .total-row { font-size: 16px; font-weight: 900; color: #0f172a; border-top: 2px solid #0f172a; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <div class="logo-area">
        <div>
          <div class="brand">1Click Boost Ads</div>
          <div style="font-size: 12px; color: #64748b;">Ads Manager Pro & AI Automation</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Phnom Penh, Cambodia | sengsoveasnapro@gmail.com</div>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="badge-paid">PAID IN FULL ✓</span>
        <div style="font-size: 18px; font-weight: 900; margin-top: 8px;">${invoiceData.invoiceNumber}</div>
        <div style="font-size: 12px; color: #64748b;">Date: ${invoiceData.issueDate}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-block">
        <div class="meta-label">Billed To (អតិថិជន):</div>
        <div style="font-weight: bold; font-size: 14px;">${invoiceData.clientName || 'Valued Customer'}</div>
        <div style="color: #64748b;">${invoiceData.clientEmail}</div>
        ${invoiceData.fbPageName ? `<div style="color: #64748b; margin-top: 4px;">Page: ${invoiceData.fbPageName}</div>` : ''}
      </div>
      <div class="meta-block">
        <div class="meta-label">Payment Details (វិធីទូទាត់):</div>
        <div><strong>Method:</strong> ${invoiceData.paymentMethod}</div>
        <div><strong>Ref Code:</strong> <code>${invoiceData.transactionRef}</code></div>
        ${invoiceData.expiryDate ? `<div><strong>Valid Until:</strong> ${invoiceData.expiryDate}</div>` : ''}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount (USD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${invoiceData.planName || '1Click Boost Ads Pro Service'}</strong>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">
              Meta Marketing API automation, AI Copywriter, Smart Ad Rules 24/7, and Instant Telegram Alerts (+30 Days).
            </div>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">$${Number(invoiceData.amount).toFixed(2)}</td>
          <td style="text-align: right; font-weight: bold;">$${Number(invoiceData.amount).toFixed(2)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align: right; padding-top: 16px;">Subtotal:</td>
          <td style="text-align: right; padding-top: 16px;">$${Number(invoiceData.amount).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right;">VAT / Tax (0%):</td>
          <td style="text-align: right;">$0.00</td>
        </tr>
        <tr class="total-row">
          <td colspan="3" style="text-align: right; padding-top: 12px;">Total Paid:</td>
          <td style="text-align: right; padding-top: 12px; color: #16a34a;">$${Number(invoiceData.amount).toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer">
      <div>This is an official computer-generated receipt issued by 1Click Boost Ads.</div>
      <div>https://www.1clickboostads.com • Phnom Penh, Cambodia</div>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`fixed inset-0 z-[9999999] flex items-center justify-center ${isFullScreen ? 'p-0' : 'p-0 sm:p-4 md:p-6'} bg-black/85 backdrop-blur-md animate-in fade-in duration-200`}>
      
      {/* Container: Fullscreen on Mobile (Edge-to-Edge) and Responsive Modal on Desktop */}
      <div className={`w-full ${
        isFullScreen 
          ? 'w-screen h-screen max-w-none max-h-none rounded-none' 
          : 'h-full sm:h-auto sm:max-w-3xl sm:max-h-[94vh] rounded-none sm:rounded-3xl'
      } flex flex-col shadow-2xl border-0 sm:border overflow-hidden transition-all duration-300 ${
        theme === 'dark' ? 'bg-[#0D1117] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Action Bar (No-Print) */}
        <div className="no-print px-3 py-2.5 sm:px-5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-[#161B22]/90 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg sm:text-xl shrink-0">🧾</span>
            <div className="min-w-0">
              <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                វិក្កយបត្រផ្លូវការ (Invoice)
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono truncate">
                {invoiceData.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Toggle Fullscreen Modal */}
            <button
              type="button"
              onClick={() => setIsFullScreen(prev => !prev)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C2128]"
              title={isFullScreen ? "បង្រួម" : "ពេញអេក្រង់ (Full Screen)"}
            >
              <span>{isFullScreen ? "🗗" : "⛶"}</span>
              <span className="hidden md:inline">{isFullScreen ? "បង្រួម" : "ពេញអេក្រង់"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadOfflineReceipt}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1C2128]"
              title="Download HTML Receipt file"
            >
              <span>📥</span> <span className="hidden sm:inline">Save File</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-futuristic px-2.5 py-1.5 sm:px-4 sm:py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <span>🖨️</span> <span>Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 text-lg cursor-pointer ml-0.5"
              title="បិទ (Close)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 md:p-8 custom-scrollbar">
          <div 
            id="printable-invoice" 
            ref={invoiceRef}
            className="p-3.5 sm:p-6 md:p-8 rounded-2xl border bg-white text-slate-900 border-slate-200 shadow-sm"
          >
            
            {/* Header: Logo & Company Information */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-1 flex items-center justify-center shadow-md shrink-0">
                  <img src="/logo.png" alt="1Click Boost Ads" className="w-[85%] h-[85%] object-contain" />
                </div>
                <div>
                  <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900">
                    1Click Boost Ads
                  </h1>
                  <p className="text-[11px] sm:text-xs text-indigo-600 font-bold">
                    Ads Manager Pro & AI Automation
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                    Phnom Penh, Cambodia • sengsoveasnapro@gmail.com
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  PAID IN FULL ✓
                </span>
                <div className="text-sm sm:text-lg font-black text-slate-900 sm:mt-1 font-mono">
                  {invoiceData.invoiceNumber}
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  Date: {invoiceData.issueDate}
                </div>
              </div>
            </div>

            {/* Bill To & Payment Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-4 sm:my-6 text-xs">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Billed To (អតិថិជន):
                </div>
                <div className="font-black text-sm text-slate-900">
                  {invoiceData.clientName || 'Valued Client'}
                </div>
                <div className="text-slate-600 font-medium text-[11px] sm:text-xs break-all">
                  {invoiceData.clientEmail}
                </div>
                {invoiceData.fbPageName && (
                  <div className="text-slate-500 text-[11px]">
                    Page: <strong>{invoiceData.fbPageName}</strong>
                  </div>
                )}
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Payment Details (ព័ត៌មានទូទាត់):
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="text-red-600 font-black">KHQR</span> {invoiceData.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-indigo-600">{invoiceData.transactionRef}</span>
                </div>
                {invoiceData.expiryDate && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold text-[11px] sm:text-xs">
                    <span>Valid Until:</span>
                    <span>{invoiceData.expiryDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table with Horizontal Scroll & Non-Clipped Responsive Fit */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto custom-scrollbar mb-5">
              <table className="w-full text-left border-collapse text-xs min-w-[320px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 uppercase tracking-wider text-[10px] sm:text-[11px] font-bold text-slate-600">
                    <th className="py-2.5 px-3 sm:py-3 sm:px-4">បរិយាយ (Description)</th>
                    <th className="py-2.5 px-2 sm:py-3 sm:px-4 text-center w-12 sm:w-16 whitespace-nowrap">ចំនួន</th>
                    <th className="py-2.5 px-2 sm:py-3 sm:px-4 text-right w-16 sm:w-24 whitespace-nowrap">តម្លៃ</th>
                    <th className="py-2.5 px-3 sm:py-3 sm:px-4 text-right w-20 sm:w-28 whitespace-nowrap">សរុប</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 sm:py-4 sm:px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                        {invoiceData.planName || '1Click Boost Ads - Pro Subscription'}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-relaxed">
                        ចូលប្រើប្រាស់មុខងារ Meta Marketing API Boost, AI Copywriter, Smart Ad Rules 24/7, និង Telegram Bot Alerts (+៣០ ថ្ងៃ)។
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:py-4 sm:px-4 text-center font-bold text-xs sm:text-sm">1</td>
                    <td className="py-3 px-2 sm:py-4 sm:px-4 text-right font-mono font-bold text-xs sm:text-sm">${Number(invoiceData.amount).toFixed(2)}</td>
                    <td className="py-3 px-3 sm:py-4 sm:px-4 text-right font-mono font-black text-slate-900 text-xs sm:text-sm">${Number(invoiceData.amount).toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-slate-200 bg-slate-50/70 font-semibold text-xs">
                  <tr>
                    <td colSpan={3} className="py-2 px-3 sm:py-2.5 sm:px-4 text-right text-slate-500 text-[11px] sm:text-xs">Subtotal:</td>
                    <td className="py-2 px-3 sm:py-2.5 sm:px-4 text-right font-mono font-bold text-xs sm:text-sm">${Number(invoiceData.amount).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-1.5 px-3 sm:py-2 sm:px-4 text-right text-slate-500 text-[11px] sm:text-xs">VAT / Tax (0%):</td>
                    <td className="py-1.5 px-3 sm:py-2 sm:px-4 text-right font-mono font-bold text-xs sm:text-sm">$0.00</td>
                  </tr>
                  <tr className="border-t border-slate-200 text-sm">
                    <td colSpan={3} className="py-2.5 px-3 sm:py-3 sm:px-4 text-right font-black text-slate-900 text-xs sm:text-sm">Total Paid (ទឹកប្រាក់ទូទាត់សរុប):</td>
                    <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-right font-mono font-black text-emerald-600 text-sm sm:text-base whitespace-nowrap">
                      ${Number(invoiceData.amount).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Official Stamp & Bottom Verification */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-emerald-600 border-dashed p-1 flex items-center justify-center text-center rotate-[-12deg] bg-emerald-50/50 shrink-0">
                  <div className="text-[8px] sm:text-[9px] font-black text-emerald-700 uppercase leading-none">
                    1CLICK BOOST<br/>★ VERIFIED ★<br/>PAID
                  </div>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                  <div className="font-bold text-slate-700">Verified Electronic Receipt</div>
                  <div>Issued automatically upon Bakong KHQR verification.</div>
                  <div className="text-[10px] text-indigo-600 mt-0.5">https://www.1clickboostads.com</div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Authorized Signature</div>
                <div className="font-black text-sm text-slate-800 italic mt-0.5 font-serif">
                  Seng Soveasna
                </div>
                <div className="text-[10px] text-slate-500">Founder, 1Click Boost Ads</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info (No-Print) */}
        <div className="no-print px-3 py-2.5 sm:px-5 sm:py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 bg-slate-50/70 dark:bg-[#161B22]/70 shrink-0">
          <span className="text-[11px] sm:text-xs text-center sm:text-left">
            💡 ចុច "Save PDF" ដើម្បីរក្សាទុកក្នុងទូរស័ព្ទ ឬកុំព្យូទ័រ
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 font-bold text-xs rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white cursor-pointer transition shadow-xs text-center"
          >
            បិទ (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
