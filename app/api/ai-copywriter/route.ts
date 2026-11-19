import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = (formData.get('prompt') as string || "").trim();
    const file = formData.get('file') as File | null;

    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5,
      process.env.GEMINI_API_KEY_6,
    ].filter(key => typeof key === 'string' && key.length > 20);

    let parts: any[] = [];
    if (file) {
      const bytes = await file.arrayBuffer();
      const base64Data = Buffer.from(bytes).toString('base64');
      parts.push({ inlineData: { data: base64Data, mimeType: file.type || 'image/jpeg' } });
    }

    const systemInstruction = `
អ្នកជាអ្នកជំនាញសរសេរ Copywriting លំដាប់កំពូលសម្រាប់ Facebook Ads នៅប្រទេសកម្ពុជា។
សូមសរសេរអត្ថបទផ្សាយពាណិជ្ជកម្ម (Caption/Copywriting) ជាភាសាខ្មែរយ៉ាងទាក់ទាញ ជំរុញឱ្យអតិថិជនចង់ទិញ និងឆាតមកភ្លាមៗ។
ព័ត៌មាន ឬសំណើបន្ថែម៖ "${prompt || 'ផលិតផលក្នុងរូបភាព'}"

សូមបែងចែកជា ៣ ទម្រង់ដាច់ដោយឡែកពីគ្នា តាមទម្រង់នេះ៖
===STYLE_1===
[អត្ថបទបែបលក់ចំៗ & ប្រូម៉ូសិនទាក់ទាញ Hook ខ្លាំង បញ្ចុះតម្លៃ ដឹកជញ្ជូន និង CTA]
===STYLE_2===
[អត្ថបទបែបដោះស្រាយបញ្ហាអតិថិជន & គុណប្រយោជន៍ច្បាស់ៗ បង្កើតទំនុកចិត្ត]
===STYLE_3===
[អត្ថបទបែប Storytelling និទានរឿងទាក់ទាញអារម្មណ៍ គួរឱ្យចង់សាកល្បង]
`;

    parts.push({ text: systemInstruction });

    let rawResponse = "";
    const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];

    if (apiKeys.length > 0) {
      apiKeyLoop: for (let i = 0; i < apiKeys.length; i++) {
        for (const model of models) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKeys[i]}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts }] })
            });
            const data = await res.json();
            if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
              rawResponse = data.candidates[0].content.parts[0].text;
              break apiKeyLoop;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }

    let results: string[] = [];
    if (rawResponse.includes('===STYLE_1===') && rawResponse.includes('===STYLE_2===') && rawResponse.includes('===STYLE_3===')) {
      const p1 = rawResponse.split('===STYLE_1===')[1]?.split('===STYLE_2===')[0]?.trim();
      const p2 = rawResponse.split('===STYLE_2===')[1]?.split('===STYLE_3===')[0]?.trim();
      const p3 = rawResponse.split('===STYLE_3===')[1]?.trim();
      results = [
        `🔥 [បែបលក់ចំៗ & ប្រូម៉ូសិន]\n${p1 || rawResponse}`,
        `💡 [បែបដោះស្រាយបញ្ហា & គុណប្រយោជន៍]\n${p2 || rawResponse}`,
        `📖 [បែប Storytelling និទានរឿង]\n${p3 || rawResponse}`
      ];
    } else if (rawResponse) {
      results = [
        `🔥 [បែបលក់ដាច់ខ្លាំង]\n${rawResponse}`,
        `💥 [បែបប្រូម៉ូសិនពិសេស]\n${rawResponse}\n\n⚡ ប្រញាប់ឡើង ចំនួនមានកំណត់!`,
        `✨ [បែបទំនុកចិត្តខ្ពស់]\n${rawResponse}\n\n📩 Inbox ឥឡូវនេះ ដើម្បីទទួលបានការផ្តល់ជូនពិសេស!`
      ];
    } else {
      // Smart Fallback មិនឱ្យរអាក់រអួល
      const topic = prompt || "ផលិតផលគុណភាពខ្ពស់";
      results = [
        `🔥 [បែបលក់ចំៗ & ប្រូម៉ូសិន]\n🎉 ឱកាសពិសេសមិនធ្លាប់មាន! ${topic}\n✨ គុណភាពល្អឥតខ្ចោះ តម្លៃសមរម្យ និងធានាជូន ១០០%\n📦 មានស្តុកស្រាប់ ដឹកជញ្ជូនរហ័សទូទាំង ២៥ ខេត្ត-ក្រុង\n📩 Inbox ឥឡូវនេះដើម្បីទទួលបានតម្លៃពិសេស!`,
        `💡 [បែបដោះស្រាយបញ្ហា & គុណប្រយោជន៍]\n❓ តើអ្នកកំពុងស្វែងរក ${topic} ដែលមានគុណភាពពិតប្រាកដមែនទេ?\n👉 ឈប់បារម្ភទៀតទៅ! យើងខ្ញុំសូមណែនាំដំណោះស្រាយដ៏ល្អបំផុតសម្រាប់អ្នក\n✅ ងាយស្រួលប្រើប្រាស់ និងចំណេញពេលវេលា\n📞 ទំនាក់ទំនងប្រឹក្សា និងកុម្ម៉ង់ឥឡូវនេះ!`,
        `📖 [បែប Storytelling និទានរឿង]\n🌟 ទទួលបានបទពិសោធន៍ថ្មីជាមួយ ${topic}!\n❤️ អតិថិជនជាច្រើនបានសាកល្បង និងពេញចិត្តយ៉ាងខ្លាំង\n💬 ឆាតមកកាន់ផេកផ្ទាល់ដើម្បីសាកសួរព័ត៌មានលម្អិត!`
      ];
    }

    return NextResponse.json({ success: true, results, text: results[0] });

  } catch (error: any) {
    console.error("AI Copywriter API Error:", error);
    const fallbackText = "ផលិតផលគុណភាពខ្ពស់ ធានាជូនទាំងតម្លៃ និងគុណភាព។ ទំនាក់ទំនងកុម្ម៉ង់ឥឡូវនេះ!";
    return NextResponse.json({ 
      success: true, 
      results: [`🔥 [បែបលក់ដាច់ខ្លាំង]\n${fallbackText}`], 
      text: fallbackText 
    });
  }
}
