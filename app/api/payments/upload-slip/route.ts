import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { notifyNewSlipUploaded } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('slipFile') as File | null;
    const email = (formData.get('email') as string || '').trim().toLowerCase();
    const amount = Number(formData.get('amount')) || 5.00;
    const planName = (formData.get('planName') as string) || 'កញ្ចប់ស្តង់ដារ (Starter)';
    const phone = (formData.get('phone') as string) || '';

    if (!email) {
      return NextResponse.json({ success: false, error: "សូម Login ឬបញ្ជាក់ Email របស់អ្នកជាមុនសិន!" }, { status: 400 });
    }

    let publicUrl = '';

    // ១. Upload Slip ទៅកាន់ Supabase Storage (Bypass RLS ដោយប្រើ supabaseAdmin)
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileExt = file.name.split('.').pop() || 'png';
      const cleanFileName = `slip_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      try {
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        if (!buckets?.some(b => b.name === 'slips')) {
          await supabaseAdmin.storage.createBucket('slips', { public: true });
        }

        const { error: uploadError } = await supabaseAdmin.storage
          .from('slips')
          .upload(cleanFileName, buffer, {
            contentType: file.type || 'image/png',
            upsert: true
          });

        if (!uploadError) {
          const { data: urlData } = supabaseAdmin.storage
            .from('slips')
            .getPublicUrl(cleanFileName);
          publicUrl = urlData.publicUrl;
        } else {
          console.warn("Storage upload warning, fallback to base64:", uploadError.message);
          publicUrl = `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`;
        }
      } catch (storageErr: any) {
        console.warn("Storage exception, fallback to base64:", storageErr.message);
        publicUrl = `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`;
      }
    }

    // ២. ទាញយកព័ត៌មាន Subscription បច្ចុប្បន្ន
    const { data: existingClient } = await supabaseAdmin
      .from('customer_subscriptions')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    // ៣. រៀបចំប្រវត្តិទូទាត់ប្រាក់ (Payment History)
    const existingHistory = existingClient?.payment_history || [];
    const newPaymentRecord = {
      date: new Date().toISOString(),
      amount: amount,
      method: file ? 'BANK_SLIP' : 'KHQR_INSTANT',
      slip_url: publicUrl || undefined,
      package: planName,
      status: 'pending', // ⏳ ដាក់ជា pending ដើម្បីឱ្យ Admin ពិនិត្យ និង Approve ក្នុងផ្ទាំង CRM
      reference: `SLIP-${Date.now().toString().slice(-8)}`
    };
    const updatedHistory = [newPaymentRecord, ...existingHistory];

    const today = new Date();

    // ៤. Update ឬ Insert ចូល customer_subscriptions ជាមួយ slip_status = 'pending'
    if (existingClient) {
      const { error: updateErr } = await supabaseAdmin
        .from('customer_subscriptions')
        .update({
          slip_status: 'pending', // 👈 លោតទៅ Admin CRM ជា Pending Slip
          slip_url: publicUrl || existingClient.slip_url || null,
          amount: amount,
          package_name: planName,
          payment_history: updatedHistory
        })
        .eq('email', email);

      if (updateErr) throw updateErr;
    } else {
      const expiryDate = new Date();
      expiryDate.setDate(today.getDate() - 1); // ហួសថ្ងៃសិន រង់ចាំ Admin Approve

      const { error: insertErr } = await supabaseAdmin
        .from('customer_subscriptions')
        .insert([{
          email: email,
          client_name: email.split('@')[0],
          phone: phone,
          package_name: planName,
          amount: amount,
          status: 'pending',
          slip_status: 'pending', // 👈 លោតទៅ Admin CRM
          slip_url: publicUrl || null,
          start_date: today.toISOString(),
          expiry_date: expiryDate.toISOString(),
          payment_history: updatedHistory,
          created_at: new Date().toISOString()
        }]);

      if (insertErr) throw insertErr;
    }

    // ៥. ផ្ញើសារជូនដំណឹងទៅកាន់ Telegram Admin ភ្លាមៗដើម្បីឱ្យ Admin ចូលពិនិត្យ
    notifyNewSlipUploaded({
      clientName: existingClient?.client_name || email.split('@')[0],
      email: email,
      phone: phone || existingClient?.phone || 'N/A',
      amount: amount,
      packagePlan: planName,
      slipUrl: publicUrl || undefined
    }).catch(tgErr => console.warn("Telegram Admin Notify Error:", tgErr.message));

    return NextResponse.json({
      success: true,
      message: `🎉 បានបញ្ជូន Slip ផ្ទេរប្រាក់ជូន Admin រួចរាល់! សូមរង់ចាំ Admin ពិនិត្យ និង Approve ក្នុងផ្ទាំងគ្រប់គ្រងអតិថិជន។`,
      slipUrl: publicUrl
    });

  } catch (err: any) {
    console.error("Upload Slip Error:", err);
    return NextResponse.json({ success: false, error: err.message || "មានបញ្ហាក្នុងការ Upload Slip" }, { status: 500 });
  }
}
