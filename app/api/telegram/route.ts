import { NextResponse } from 'next/server';
import { 
  sendTelegramMessage, 
  notifyAdDisapproved, 
  notifyPaymentFailed, 
  notifyNewSlipUploaded, 
  notifyKHQRInstantPaid 
} from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, botToken, chatId } = body;

    // 1. សាកល្បងតេស្តការតភ្ជាប់ (Test Connection)
    if (action === 'test') {
      const result = await sendTelegramMessage(
        `🎉 <b>ការតភ្ជាប់ជោគជ័យ!</b>\n━━━━━━━━━━━━━━━━━━━━━\nTelegram Bot ត្រូវបានភ្ជាប់ជាមួយ <b>1Click Boost Ads</b> ដោយជោគជ័យ។ ចាប់ពីពេលនេះ រាល់ Notification ទាំងអស់នឹងត្រូវផ្ញើមកកាន់ទីនេះភ្លាមៗ!`,
        { botToken, chatId }
      );
      return NextResponse.json(result);
    }

    // 2. ជូនដំណឹងពេល Ad ត្រូវ Facebook បដិសេធ
    if (action === 'ad_disapproved') {
      const result = await notifyAdDisapproved(payload);
      return NextResponse.json(result);
    }

    // 3. ជូនដំណឹងពេល Payment Failed / គាំងលុយ
    if (action === 'payment_failed') {
      const result = await notifyPaymentFailed(payload);
      return NextResponse.json(result);
    }

    // 4. ជូនដំណឹងពេលមាន Slip ថ្មី
    if (action === 'new_slip') {
      const result = await notifyNewSlipUploaded(payload);
      return NextResponse.json(result);
    }

    // 5. ជូនដំណឹងពេលស្កេន KHQR បង់ប្រាក់ជោគជ័យ
    if (action === 'khqr_paid') {
      const result = await notifyKHQRInstantPaid(payload);
      return NextResponse.json(result);
    }

    // បើជាសារទូទៅ
    if (body.message) {
      const result = await sendTelegramMessage(body.message, { botToken, chatId });
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
