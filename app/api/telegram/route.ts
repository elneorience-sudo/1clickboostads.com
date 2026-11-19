import { NextResponse } from 'next/server';
import { 
  sendTelegramMessage, 
  notifyAdDisapproved, 
  notifyPaymentFailed, 
  notifyNewSlipUploaded, 
  notifyKHQRInstantPaid,
  notifyExpiryWarning
} from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, botToken, chatId } = body;

    // targetChatId អាចបញ្ជាក់តាម chatId ផ្ទាល់ ឬតាម payload.chatId
    const targetChatId = chatId || payload?.chatId;

    // 1. សាកល្បងតេស្តការតភ្ជាប់ (Test Connection)
    if (action === 'test') {
      const isClient = !!targetChatId && targetChatId !== process.env.TELEGRAM_CHAT_ID;
      const result = await sendTelegramMessage(
        `🎉 <b>ការតភ្ជាប់ Telegram ជោគជ័យ!</b>\n━━━━━━━━━━━━━━━━━━━━━\n${isClient ? 'គណនី Telegram របស់អ្នកត្រូវបានភ្ជាប់ជាមួយ <b>1Click Boost Ads</b> ដោយជោគជ័យ!' : 'Telegram Bot ត្រូវបានភ្ជាប់ជាមួយ <b>1Click Boost Ads</b> ដោយជោគជ័យ។'}\n\nចាប់ពីពេលនេះ រាល់ Notification ពេល៖\n• 🚨 Ad ត្រូវ Facebook បដិសេធ (Disapproved)\n• 💳 Ad Account គាំងលុយ (Payment Failed)\n• ⏳ គណនីជិតផុតកំណត់សេវា (+៣ ថ្ងៃមុន)\n\nនឹងត្រូវផ្ញើប្រាប់អ្នកតាម Telegram នេះភ្លាមៗ!`,
        { botToken, chatId: targetChatId }
      );
      return NextResponse.json(result);
    }

    // 2. ជូនដំណឹងពេល Ad ត្រូវ Facebook បដិសេធ
    if (action === 'ad_disapproved') {
      const result = await notifyAdDisapproved({ ...payload, chatId: targetChatId });
      return NextResponse.json(result);
    }

    // 3. ជូនដំណឹងពេល Payment Failed / គាំងលុយ
    if (action === 'payment_failed') {
      const result = await notifyPaymentFailed({ ...payload, chatId: targetChatId });
      return NextResponse.json(result);
    }

    // 4. ជូនដំណឹងពេលសេវាកម្មជិតផុតកំណត់
    if (action === 'expiry_warning') {
      const result = await notifyExpiryWarning({ ...payload, chatId: targetChatId });
      return NextResponse.json(result);
    }

    // 5. ជូនដំណឹងពេលមាន Slip ថ្មី
    if (action === 'new_slip') {
      const result = await notifyNewSlipUploaded({ ...payload, chatId: targetChatId });
      return NextResponse.json(result);
    }

    // 6. ជូនដំណឹងពេលស្កេន KHQR បង់ប្រាក់ជោគជ័យ
    if (action === 'khqr_paid') {
      const result = await notifyKHQRInstantPaid({ ...payload, chatId: targetChatId });
      return NextResponse.json(result);
    }

    // បើជាសារទូទៅ
    if (body.message) {
      const result = await sendTelegramMessage(body.message, { botToken, chatId: targetChatId });
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
