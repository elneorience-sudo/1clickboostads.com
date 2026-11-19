import { NextRequest, NextResponse } from 'next/server';

/**
 * Meta (Facebook) Data Deletion Callback URL
 * Per Meta Platform Terms: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/
 * When a user removes the app from Facebook, Meta sends a POST request with signed_request.
 * We respond with a JSON object containing a URL where the user can check the status of their deletion and a confirmation code.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    const signedRequest = formData ? formData.get('signed_request') : null;

    // Generate a unique tracking confirmation code
    const confirmationCode = 'DEL-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // URL where user can view instructions and confirmation
    const statusUrl = `https://www.1clickboostads.com/privacy-policy#data-deletion?code=${confirmationCode}`;

    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode
    });
  } catch (error: any) {
    console.error("Meta data deletion callback error:", error);
    return NextResponse.json({
      url: 'https://www.1clickboostads.com/privacy-policy#data-deletion',
      confirmation_code: 'DEL-MANUAL-REQ'
    });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    instructions: 'https://www.1clickboostads.com/privacy-policy#data-deletion',
    contact: 'sengsoveasnapro@gmail.com'
  });
}
