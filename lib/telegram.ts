/**
 * 🤖 Telegram Notification Service សម្រាប់ 1Click Boost Ads
 * មុខងារ៖ ផ្ញើសារជូនដំណឹងស្វ័យប្រវត្តិតាម Telegram ទាំងសម្រាប់ Admin និង អតិថិជន (Clients)៖
 * 1. Facebook Ads ត្រូវបដិសេធ (Disapproved/Rejected)
 * 2. Ad Account អស់លុយ ឬគាំងកាត (Payment Failed)
 * 3. គណនីជិតផុតកំណត់សេវាកម្ម (Subscription Expiry Warning)
 * 4. អតិថិជនថ្មីចុះឈ្មោះ ឬ Upload Slip បង់ប្រាក់
 * 5. អតិថិជនស្កេន KHQR (Bakong) បង់ប្រាក់ជោគជ័យ
 */

interface TelegramOptions {
  botToken?: string;
  chatId?: string;
}

export async function sendTelegramMessage(
  text: string, 
  options?: TelegramOptions & { parseMode?: 'HTML' | 'Markdown' }
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = options?.botToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = options?.chatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("⚠️ Telegram Bot Token ឬ Chat ID មិនទាន់ត្រូវបានកំណត់");
      return { success: false, error: "Telegram credentials missing" };
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: options?.parseMode || 'HTML',
        disable_web_page_preview: false,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("❌ Telegram Send Error:", data.description);
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (err: any) {
    console.error("❌ Telegram Network Exception:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 🚨 ផ្ញើសារ Alert ពេល Ad ត្រូវ Facebook បដិសេធ (Disapproved/Rejected)
 * (អាចផ្ញើទៅកាន់ Telegram ផ្ទាល់ខ្លួនរបស់អតិថិជន ឬ Admin)
 */
export async function notifyAdDisapproved(params: {
  accountName?: string;
  accountId?: string;
  adName: string;
  adId: string;
  reason?: string;
  recommendation?: string;
  chatId?: string;
}) {
  const time = new Date().toLocaleString('km-KH', { timeZone: 'Asia/Phnom_Penh' });
  const text = `
🚨 <b>[ALERT] FACEBOOK AD ត្រូវបដិសេធ (DISAPPROVED)!</b>
━━━━━━━━━━━━━━━━━━━━━
📢 <b>ឈ្មោះ Ad:</b> <code>${escapeHtml(params.adName)}</code>
🆔 <b>Ad ID:</b> <code>${params.adId}</code>
🏢 <b>គណនី Ad Account:</b> ${escapeHtml(params.accountName || 'N/A')} (<code>${params.accountId || 'N/A'}</code>)
⚠️ <b>មូលហេតុ:</b> ${escapeHtml(params.reason || 'រំលោភគោលការណ៍ផ្សព្វផ្សាយរបស់ Facebook')}
💡 <b>វិធីកែតម្រូវ:</b> ${escapeHtml(params.recommendation || 'សូមចូលទៅកែសម្រួល Caption ឬរូបភាពក្នុង 1Click Boost Ads')}
⏰ <b>ពេលវេលា:</b> ${time}
━━━━━━━━━━━━━━━━━━━━━
👉 <i>ចូលពិនិត្យ និងកែសម្រួលភ្លាមៗនៅ:</i> <a href="https://www.1clickboostads.com">1clickboostads.com</a>
`;
  return sendTelegramMessage(text.trim(), { chatId: params.chatId });
}

/**
 * 💳 ផ្ញើសារ Alert ពេល Ad Account គាំងលុយ ឬកាត់កាតមិនបាន (Payment Failed)
 * (អាចផ្ញើទៅកាន់ Telegram ផ្ទាល់ខ្លួនរបស់អតិថិជន ឬ Admin)
 */
export async function notifyPaymentFailed(params: {
  accountName?: string;
  accountId?: string;
  clientName?: string;
  errorDetail?: string;
  chatId?: string;
}) {
  const time = new Date().toLocaleString('km-KH', { timeZone: 'Asia/Phnom_Penh' });
  const text = `
💳 <b>[ALERT] AD ACCOUNT គាំងលុយ / PAYMENT FAILED!</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>ម្ចាស់គណនី:</b> ${escapeHtml(params.clientName || 'អតិថិជន')}
🏢 <b>ឈ្មោះ Account:</b> ${escapeHtml(params.accountName || 'N/A')} (<code>${params.accountId || 'N/A'}</code>)
❌ <b>បញ្ហា:</b> កាតធនាគារកាត់លុយមិនបាន ឬ Ad Account ជាប់ជំពាក់ប្រាក់ Facebook
⚠️ <b>លម្អិត:</b> ${escapeHtml(params.errorDetail || 'សូមពិនិត្យមើលសមតុល្យកាត ឬបញ្ចូលលុយបន្ថែម')}
⏰ <b>ពេលវេលា:</b> ${time}
━━━━━━━━━━━━━━━━━━━━━
💡 <i>សូមបញ្ចូលលុយក្នុងកាតធនាគាររបស់អ្នកជាបន្ទាន់ ដើម្បីកុំឱ្យ Ad ផ្អាកដំណើរការ!</i>
👉 <i>ចូលពិនិត្យ:</i> <a href="https://www.1clickboostads.com">1clickboostads.com</a>
`;
  return sendTelegramMessage(text.trim(), { chatId: params.chatId });
}

/**
 * ⏳ ផ្ញើសាររំលឹកពេលគណនីសេវាកម្មជិតផុតកំណត់ (Subscription Expiry Warning)
 */
export async function notifyExpiryWarning(params: {
  clientName?: string;
  daysLeft: number;
  expiryDate: string;
  chatId?: string;
}) {
  const time = new Date().toLocaleString('km-KH', { timeZone: 'Asia/Phnom_Penh' });
  const text = `
⏳ <b>[REMINDER] សេវាកម្មរបស់អ្នកជិតផុតកំណត់ហើយ!</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>អតិថិជន:</b> <b>${escapeHtml(params.clientName || 'អតិថិជន')}</b>
⚠️ <b>នៅសល់រយៈពេល:</b> <b>${params.daysLeft} ថ្ងៃទៀត</b>
📅 <b>កាលបរិច្ឆេទផុតកំណត់:</b> ${params.expiryDate}
⏰ <b>ពេលវេលា:</b> ${time}
━━━━━━━━━━━━━━━━━━━━━
⚡ <i>សូមចូលទៅកាន់ 1Click Boost Ads រួចស្កេន KHQR (Bakong) ដើម្បីបន្តសុពលភាព +៣០ ថ្ងៃស្វ័យប្រវត្តិ កុំឱ្យដាច់ការផ្សាយពាណិជ្ជកម្ម!</i>
👉 <a href="https://www.1clickboostads.com">1clickboostads.com</a>
`;
  return sendTelegramMessage(text.trim(), { chatId: params.chatId });
}

/**
 * 🧾 ផ្ញើសារជូនដំណឹងពេលមាន Slip បង់ប្រាក់ថ្មី Upload មក (ជូន Admin)
 */
export async function notifyNewSlipUploaded(params: {
  clientName: string;
  email: string;
  phone?: string;
  amount: number | string;
  slipUrl?: string;
  packagePlan?: string;
  chatId?: string;
}) {
  const time = new Date().toLocaleString('km-KH', { timeZone: 'Asia/Phnom_Penh' });
  const text = `
🧾 <b>[NEW SLIP] មានអតិថិជនផ្ញើ SLIP បង់ប្រាក់ថ្មី!</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>ឈ្មោះអតិថិជន:</b> <b>${escapeHtml(params.clientName)}</b>
📧 <b>អ៊ីមែល:</b> ${escapeHtml(params.email)}
📱 <b>លេខទូរស័ព្ទ:</b> ${escapeHtml(params.phone || 'N/A')}
💰 <b>ចំនួនទឹកប្រាក់:</b> <b>$${params.amount}</b>
📦 <b>កញ្ចប់សេវា:</b> ${escapeHtml(params.packagePlan || 'ប្រចាំខែ (Monthly)')}
⏰ <b>កាលបរិច្ឆេទ:</b> ${time}
${params.slipUrl ? `🔗 <b>ភ័ស្តុតាង Slip:</b> <a href="${params.slipUrl}">ចុចទីនេះដើម្បីមើលរូបភាព Slip</a>` : ''}
━━━━━━━━━━━━━━━━━━━━━
⚡ <i>សូមចូលទៅ Approve ក្នុងផ្ទាំង Dashboard CRM ដើម្បីឱ្យអតិថិជនអាចប្រើប្រាស់បន្ត!</i>
`;
  return sendTelegramMessage(text.trim(), { chatId: params.chatId });
}

/**
 * ⚡ ផ្ញើសារជូនដំណឹងពេលស្កេន KHQR (Bakong) បង់ប្រាក់បានសម្រេចស្វ័យប្រវត្តិ
 */
export async function notifyKHQRInstantPaid(params: {
  clientName: string;
  email: string;
  amount: number | string;
  transactionRef?: string;
  newExpiryDate?: string;
  chatId?: string;
}) {
  const time = new Date().toLocaleString('km-KH', { timeZone: 'Asia/Phnom_Penh' });
  const text = `
🎉 <b>[KHQR AUTO-PAY] ទូទាត់ប្រាក់ជោគជ័យ!</b>
━━━━━━━━━━━━━━━━━━━━━
⚡ <b>វិធីទូទាត់:</b> ស្កេន KHQR (Bakong / ABA) ស្វ័យប្រវត្តិ
👤 <b>អតិថិជន:</b> <b>${escapeHtml(params.clientName)}</b>
📧 <b>អ៊ីមែល:</b> ${escapeHtml(params.email)}
💰 <b>ទឹកប្រាក់:</b> <b>$${params.amount}</b>
🆔 <b>លេខវិក្កយបត្រ (Ref):</b> <code>${params.transactionRef || 'KHQR-' + Date.now().toString().slice(-6)}</code>
📅 <b>សុពលភាពថ្មី:</b> <b>${params.newExpiryDate || '+30 ថ្ងៃ'}</b>
⏰ <b>ពេលវេលា:</b> ${time}
━━━━━━━━━━━━━━━━━━━━━
✅ <i>ប្រព័ន្ធបានធ្វើការ Active និងបន្តសុពលភាព +៣០ ថ្ងៃដោយស្វ័យប្រវត្តិចប់សព្វគ្រប់!</i>
`;
  return sendTelegramMessage(text.trim(), { chatId: params.chatId });
}

/**
 * 👤 ផ្ញើសារជូនដំណឹងពេលមានអតិថិជនថ្មីទើបចុះឈ្មោះ (Sign Up)
 */
export async function notifyNewUserRegistered(params: {
  clientName: string;
  email: string;
  phone?: string;
  chatId?: string;
}) {
  const time = new Date().toLocaleString('km-KH', { timeZone: 'Asia/Phnom_Penh' });
  const text = `
👤 <b>[NEW USER] មានអ្នកចុះឈ្មោះថ្មីលើ 1Click Boost Ads!</b>
━━━━━━━━━━━━━━━━━━━━━
✨ <b>ឈ្មោះ:</b> ${escapeHtml(params.clientName)}
📧 <b>អ៊ីមែល:</b> ${escapeHtml(params.email)}
📱 <b>លេខទូរស័ព្ទ:</b> ${escapeHtml(params.phone || 'N/A')}
⏰ <b>កាលបរិច្ឆេទ:</b> ${time}
━━━━━━━━━━━━━━━━━━━━━
👉 <i>ចូលពិនិត្យមើលបញ្ជីអតិថិជននៅ:</i> <a href="https://www.1clickboostads.com">1clickboostads.com</a>
`;
  return sendTelegramMessage(text.trim(), { chatId: params.chatId });
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
