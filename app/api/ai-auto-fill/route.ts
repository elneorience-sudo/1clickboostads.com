import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    if (!product) {
      return NextResponse.json({ success: false, error: "Missing product description" }, { status: 400 });
    }

    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5,
      process.env.GEMINI_API_KEY_6,
    ].filter(key => typeof key === 'string' && key.length > 20);

    const prompt = `
You are an expert Facebook Ads Manager in Cambodia.
Based on the following product or service description, generate an optimal Facebook Ads setup in strict JSON format.

Product Description: "${product}"

Provide:
1. campaignName: Catchy name (e.g. "[Product] Boost Campaign")
2. adsetName: Target audience summary (e.g. "Target 18-45 - Phnom Penh & Provinces")
3. ageMin: Realistic minimum age (between 18 and 30)
4. ageMax: Realistic maximum age (between 35 and 65)
5. gender: "ALL", "MEN", or "WOMEN"
6. targeting: 3 to 6 high-volume, relevant English Facebook detailed targeting keywords comma-separated (e.g. "Online shopping, Clothing, Shoes, Retail")
7. placementType: "photo" or "video"

Return ONLY a JSON object:
{
  "campaignName": "string",
  "adsetName": "string",
  "ageMin": 18,
  "ageMax": 45,
  "gender": "ALL",
  "targeting": "string",
  "placementType": "photo"
}
`;

    let jsonResult = null;
    const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];

    if (apiKeys.length > 0) {
      apiKeyLoop: for (let i = 0; i < apiKeys.length; i++) {
        for (const model of models) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKeys[i]}`;
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!res.ok) continue;

            const data = await res.json();
            let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            textResponse = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
            const firstBrace = textResponse.indexOf('{');
            const lastBrace = textResponse.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
              textResponse = textResponse.substring(firstBrace, lastBrace + 1);
            }

            jsonResult = JSON.parse(textResponse);
            if (jsonResult && jsonResult.campaignName) {
              break apiKeyLoop;
            }
          } catch (err) {
            continue;
          }
        }
      }
    }

    // Smart Fallback ប្រសិនបើ API Key ជាប់ Limit
    if (!jsonResult) {
      const trimmedProduct = product.slice(0, 30);
      jsonResult = {
        campaignName: `Auto Boost - ${trimmedProduct}`,
        adsetName: `Targeting - ${trimmedProduct}`,
        ageMin: 18,
        ageMax: 45,
        gender: "ALL",
        targeting: "Online shopping, Consumer goods, Retail marketing",
        placementType: "photo"
      };
    }

    return NextResponse.json({ success: true, result: jsonResult });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Server Error" }, { status: 500 });
  }
}
