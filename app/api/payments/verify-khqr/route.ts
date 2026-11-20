import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { notifyKHQRInstantPaid } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, planName, transactionRef } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Missing client email" }, { status: 400 });
    }

    const clientEmail = email.trim().toLowerCase();
    const payAmount = Number(amount) || 5.00;
    const refCode = transactionRef || `KHQR-${Date.now().toString().slice(-8)}`;

    // ១. ទាញយកព័ត៌មាន Subscription បច្ចុប្បន្ន
    const { data: client, error: fetchErr } = await supabaseAdmin
      .from('customer_subscriptions')
      .select('*')
      .eq('email', clientEmail)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ success: false, error: fetchErr.message }, { status: 500 });
    }

    // ២. គណនាកាលបរិច្ឆេទផុតកំណត់ថ្មី (+៣០ ថ្ងៃ)
    const today = new Date();
    let baseDate = today;
    if (client?.expiry_date) {
      const currentExpiry = new Date(client.expiry_date);
      if (currentExpiry > today) {
        baseDate = currentExpiry; // បើនៅសល់ថ្ងៃ ត្រូវបូកបន្ថែមពីលើថ្ងៃចាស់
      }
    }
    const newExpiry = new Date(baseDate);
    newExpiry.setDate(baseDate.getDate() + 30);

    // ៣. បន្ថែមប្រវត្តិទូទាត់ (Payment History)
    const existingHistory = client?.payment_history || [];
    const newPaymentRecord = {
      date: new Date().toISOString(),
      amount: payAmount,
      method: 'KHQR_BAKONG',
      reference: refCode,
      package: planName || 'កញ្ចប់ស្តង់ដារ',
      status: 'approved',
      verified_at: new Date().toISOString()
    };
    const updatedHistory = [newPaymentRecord, ...existingHistory];

    // ៤. Update ឬ Insert ទៅកាន់ Customer Subscriptions (Active ភ្លាមៗ)
    if (client) {
      const { error: updateErr } = await supabaseAdmin
        .from('customer_subscriptions')
        .update({
          status: 'active',
          slip_status: 'approved',
          amount: payAmount,
          package_name: planName || 'កញ្ចប់ស្តង់ដារ',
          expiry_date: newExpiry.toISOString(),
          payment_history: updatedHistory
        })
        .eq('email', clientEmail);

      if (updateErr) {
        return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
      }
    } else {
      const { error: insertErr } = await supabaseAdmin
        .from('customer_subscriptions')
        .insert([{
          email: clientEmail,
          client_name: clientEmail.split('@')[0],
          status: 'active',
          slip_status: 'approved',
          amount: payAmount,
          package_name: planName || 'កញ្ចប់ស្តង់ដារ',
          start_date: today.toISOString(),
          expiry_date: newExpiry.toISOString(),
          payment_history: updatedHistory,
          created_at: new Date().toISOString()
        }]);

      if (insertErr) {
        return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
      }
    }

    // ៥. ផ្ញើសារ Alert តាម Telegram Bot ជូន Admin
    notifyKHQRInstantPaid({
      clientName: client?.client_name || clientEmail,
      email: clientEmail,
      amount: payAmount,
      transactionRef: refCode,
      newExpiryDate: newExpiry.toLocaleDateString('km-KH')
    }).catch(err => console.warn("Telegram alert error:", err.message));

    return NextResponse.json({
      success: true,
      message: `✅ ការទូទាត់តាម KHQR (Bakong) ជោគជ័យ! គណនីរបស់អ្នកត្រូវបាន Activate +៣០ ថ្ងៃ (រហូតដល់ ${newExpiry.toLocaleDateString('km-KH')})`,
      expiry_date: newExpiry.toISOString(),
      reference: refCode
    });

  } catch (err: any) {
    console.error("KHQR Verify Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
