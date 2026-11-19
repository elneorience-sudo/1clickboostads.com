import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// 🌟 បន្ទាត់នេះសំខាន់បំផុត៖ បិទការចងចាំ (Cache) របស់ Vercel ដាច់ខាត!
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ប្រើប្រាស់ supabaseAdmin client ពី lib/supabase-admin

    // 🌟 ទាញយកទិន្នន័យថ្មីៗបំផុតពី Table facebook_accounts
    const { data, error } = await supabaseAdmin
      .from('facebook_accounts')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ connected: false });
    }

    const account = data[0];

    return NextResponse.json({
      connected: true,
      accessToken: account.access_token,
      pageId: account.page_id,
      pageName: account.page_name,
      adAccountId: account.ad_account_id
    });

  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message }, { status: 500 });
  }
}