"use client";

import React, { useRef } from 'react';

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
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Container */}
      <div className={`w-full max-w-2xl max-h-[94vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden ${
        theme === 'dark' ? 'bg-[#0D1117] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Action Bar (No-Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#161B22]/60">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧾</span>
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                វិក្កយបត្រផ្លូវការ (Digital Receipt / Invoice)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {invoiceData.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadOfflineReceipt}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1C2128]"
              title="Download HTML Receipt file"
            >
              <span>📥</span> <span className="hidden sm:inline">Save File</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-futuristic px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <span>🖨️</span> <span>បោះពុម្ព / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 text-lg cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div 
            id="printable-invoice" 
            ref={invoiceRef}
            className="p-6 sm:p-8 rounded-2xl border bg-white text-slate-900 border-slate-200 shadow-sm"
          >
            
            {/* Header: Logo & Company Information */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-1 flex items-center justify-center shadow-md">
                  <img src="/logo.png" alt="1Click Boost Ads" className="w-[85%] h-[85%] object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">
                    1Click Boost Ads
                  </h1>
                  <p className="text-xs text-indigo-600 font-bold">
                    Ads Manager Pro & AI Automation
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Phnom Penh, Cambodia • sengsoveasnapro@gmail.com
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  PAID IN FULL ✓
                </span>
                <div className="text-lg font-black text-slate-900 mt-2 font-mono">
                  {invoiceData.invoiceNumber}
                </div>
                <div className="text-xs text-slate-500">
                  Date: {invoiceData.issueDate}
                </div>
              </div>
            </div>

            {/* Bill To & Payment Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Billed To (អតិថិជន):
                </div>
                <div className="font-black text-sm text-slate-900">
                  {invoiceData.clientName || 'Valued Client'}
                </div>
                <div className="text-slate-600 font-medium">
                  {invoiceData.clientEmail}
                </div>
                {invoiceData.fbPageName && (
                  <div className="text-slate-500 text-[11px]">
                    Page: <strong>{invoiceData.fbPageName}</strong>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Payment Details (ព័ត៌មានទូទាត់):
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="text-red-600 font-black">KHQR</span> {invoiceData.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-indigo-600">{invoiceData.transactionRef}</span>
                </div>
                {invoiceData.expiryDate && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span>Valid Until:</span>
                    <span>{invoiceData.expiryDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold text-slate-600">
                    <th className="py-3 px-4">បរិយាយ (Description)</th>
                    <th className="py-3 px-4 text-center w-16">ចំនួន (Qty)</th>
                    <th className="py-3 px-4 text-right w-24">តម្លៃ (Price)</th>
                    <th className="py-3 px-4 text-right w-28">សរុប (Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-[13px]">
                        {invoiceData.planName || '1Click Boost Ads - Pro Subscription'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        ចូលប្រើប្រាស់មុខងារ Meta Marketing API Boost, AI Copywriter, Smart Ad Rules 24/7, និង Telegram Bot Alerts (+៣០ ថ្ងៃ)។
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold">1</td>
                    <td className="py-4 px-4 text-right font-mono font-bold">${Number(invoiceData.amount).toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-mono font-black text-slate-900">${Number(invoiceData.amount).toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-slate-200 bg-slate-50/70 font-semibold text-xs">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-4 text-right text-slate-500">Subtotal:</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">${Number(invoiceData.amount).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-right text-slate-500">VAT / Tax (0%):</td>
                    <td className="py-2 px-4 text-right font-mono font-bold">$0.00</td>
                  </tr>
                  <tr className="border-t border-slate-200 text-sm">
                    <td colSpan={3} className="py-3 px-4 text-right font-black text-slate-900">Total Paid (ទឹកប្រាក់ទូទាត់សរុប):</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-600 text-base">
                      ${Number(invoiceData.amount).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Official Stamp & Bottom Verification */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-600 border-dashed p-1 flex items-center justify-center text-center rotate-[-12deg] bg-emerald-50/50">
                  <div className="text-[9px] font-black text-emerald-700 uppercase leading-none">
                    1CLICK BOOST<br/>★ VERIFIED ★<br/>PAID
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  <div className="font-bold text-slate-700">Verified Electronic Receipt</div>
                  <div>Issued automatically upon Bakong KHQR verification.</div>
                  <div className="text-[10px] text-indigo-600 mt-0.5">https://www.1clickboostads.com</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Authorized Signature</div>
                <div className="font-black text-sm text-slate-800 italic mt-1 font-serif">
                  Seng Soveasna
                </div>
                <div className="text-[10px] text-slate-500">Founder, 1Click Boost Ads</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info (No-Print) */}
        <div className="no-print p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-50/50 dark:bg-[#161B22]/40">
          <span>💡 ចុច "បោះពុម្ព / Save PDF" ដើម្បី Save ជា PDF ទុកក្នុងទូរស័ព្ទ ឬកុំព្យូទ័រ</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-xs rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white cursor-pointer transition"
          >
            បិទ (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
