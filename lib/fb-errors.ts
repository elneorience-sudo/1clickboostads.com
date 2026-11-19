/**
 * បណ្ណាល័យបកប្រែ Error របស់ Facebook Marketing API មកជាភាសាខ្មែរផ្លូវការ
 * ងាយស្រួលយល់ និងមានដំណោះស្រាយជាក់ស្តែងសម្រាប់អ្នកលក់អនឡាញខ្មែរ
 */

export function translateFBError(error: any): string {
  if (!error) return "មានបញ្ហាមិនស្គាល់មួយបានកើតឡើងក្នុងប្រព័ន្ធ Facebook។";

  // ប្រសិនបើជា Error Object ពី Graph API
  const errMsg = typeof error === 'string' 
    ? error 
    : (error.message || error.error_user_msg || error.error_user_title || JSON.stringify(error));

  const lower = errMsg.toLowerCase();

  // 1. បញ្ហាថវិកាផ្សព្វផ្សាយ (Budget Errors)
  if (lower.includes("budget is too low") || lower.includes("minimum budget") || lower.includes("budget must be at least")) {
    return "⚠️ ថវិកាផ្សព្វផ្សាយទាបពេក៖ Facebook តម្រូវឱ្យដាក់ថវិកាយ៉ាងតិច $1.00 ក្នុងមួយថ្ងៃ (ឬច្រើនជាងនេះតាមប្រភេទ Campaign)។";
  }
  if (lower.includes("bid amount") || lower.includes("bid constraints") || lower.includes("bid_amount")) {
    return "⚠️ តម្លៃដេញថ្លៃ (Bid Amount) មិនត្រឹមត្រូវ៖ សូមពិនិត្យមើលការកំណត់ Bid Strategy ឬដោះ Bid Cap ចេញ។";
  }

  // 2. បញ្ហាវិធីទូទាត់ប្រាក់ និងគណនីផ្សាយ (Billing & Account Status)
  if (lower.includes("payment method") || lower.includes("billing") || lower.includes("card is invalid")) {
    return "💳 បញ្ហាកាតទូទាត់ប្រាក់៖ វិធីសាស្ត្រទូទាត់ប្រាក់ (កាតធនាគារ) មានបញ្ហា អស់លុយ ឬត្រូវការផ្ទៀងផ្ទាត់ក្នុង Ads Manager។";
  }
  if (lower.includes("account is disabled") || lower.includes("disabled ad account") || lower.includes("account_disabled")) {
    return "🚫 គណនីផ្សាយត្រូវបានបិទ៖ Ad Account នេះត្រូវបាន Facebook ផ្អាកដំណើរការ (Disabled) សូមចូលទៅ Account Quality ដើម្បីដោះស្រាយ។";
  }
  if (lower.includes("account restricted") || lower.includes("restricted from advertising")) {
    return "🚫 គណនីត្រូវបានកម្រិត (Restricted)៖ គណនី Facebook របស់អ្នកត្រូវបានកម្រិតការផ្សាយពាណិជ្ជកម្ម។";
  }

  // 3. បញ្ហា Access Token និងសិទ្ធិ (Permissions & Tokens)
  if (lower.includes("error validating access token") || lower.includes("session has expired") || lower.includes("session is invalid")) {
    return "🔑 សោរ Facebook (Token) បានផុតកំណត់៖ សូមចុចប៊ូតុង 'Connect Facebook' ឡើងវិញដើម្បីបន្តដំណើរការ។";
  }
  if (lower.includes("permissions error") || lower.includes("permission denied") || lower.includes("does not have permission")) {
    return "🔒 គ្មានសិទ្ធិគ្រប់គ្រាន់៖ គណនី Facebook របស់អ្នកមិនមានសិទ្ធិ (Admin ឬ Advertiser) លើ Page ឬ Ad Account នេះឡើយ។";
  }

  // 4. បញ្ហា Creative / ផុស (Ad Creative & Post Errors)
  if (lower.includes("invalid creative") || lower.includes("creative is invalid")) {
    return "🖼️ ផុសមិនអាចផ្សាយបាន (Invalid Creative)៖ ផុសនេះអាចខ្វះប៊ូតុងផ្ញើសារ (Send Message) ឬមានទម្រង់រូបភាព/វីដេអូមិនត្រូវតាមស្តង់ដារ Meta។";
  }
  if (lower.includes("object does not exist") || lower.includes("post not found") || lower.includes("unknown path")) {
    return "🔍 រកមិនឃើញផុស៖ ផុសនេះអាចត្រូវបានលុបចោល ឬដាក់កំណត់ជា Private ក្នុង Facebook Page។";
  }
  if (lower.includes("video length") || lower.includes("video duration")) {
    return "📹 វីដេអូមានបញ្ហា៖ រយៈពេលវីដេអូវែងពេក ឬខ្លីពេកសម្រាប់ Placement ដែលបានជ្រើសរើស (ឧ. Instagram Reels)។";
  }
  if (lower.includes("call to action") || lower.includes("call_to_action")) {
    return "🔘 ប៊ូតុងសកម្មភាព (CTA Button) មិនត្រូវគ្នា៖ ប៊ូតុងដែលជ្រើសរើសមិនត្រូវគ្នានឹងគោលដៅនៃផុសនេះឡើយ។";
  }

  // 5. បញ្ហា Performance Goal & Objective
  if (lower.includes("selected performance goal with your campaign objective") || lower.includes("performance goal")) {
    return "🎯 គោលដៅផ្សាយមិនស៊ីគ្នា៖ គោលដៅ Performance Goal មិនស៊ីគ្នាជាមួយប្រភេទ Campaign ឡើយ សូមជ្រើសរើស Goal ផ្សេង។";
  }
  if (lower.includes("special ad category") || lower.includes("housing") || lower.includes("employment")) {
    return "📋 ប្រភេទពាណិជ្ជកម្មពិសេស៖ ផុសនេះទាក់ទងនឹងការងារ អចលនទ្រព្យ ឬឥណទាន ដែលតម្រូវឱ្យជ្រើសរើស Special Ad Category។";
  }

  // 6. បញ្ហាទំហំ Audience (Targeting)
  if (lower.includes("audience is too small") || lower.includes("targeting is too narrow")) {
    return "👥 ក្រុមគោលដៅតូចពេក៖ ចំនួនមនុស្សដែល Target តិចជាង 1,000 នាក់ សូមពង្រីកអាយុ ឬបន្ថែមចំណាប់អារម្មណ៍ (Interests)។";
  }

  // 7. បញ្ហា Rate Limit (Facebook ជាប់រវល់)
  if (lower.includes("user request limit reached") || lower.includes("too many calls") || lower.includes("rate limit")) {
    return "⏳ Facebook ជាប់រវល់ (Rate Limit)៖ មានការស្នើសុំច្រើនដងពេក សូមរង់ចាំ ២ ទៅ ៣ នាទី រួចសាកល្បងម្តងទៀត។";
  }

  // 8. បញ្ហា Instagram Link
  if (lower.includes("instagram account") || lower.includes("instagram_actor_id")) {
    return "📸 គណនី Instagram មិនទាន់ភ្ជាប់៖ ផេករបស់អ្នកមិនទាន់បានភ្ជាប់ជាមួយ Instagram Business Account ឡើយ។";
  }

  // 9. បញ្ហា Invalid Parameter ទូទៅ
  if (lower.includes("invalid parameter")) {
    return "⚠️ ទិន្នន័យមិនត្រឹមត្រូវ (Invalid Parameter)៖ សូមពិនិត្យមើលការកំណត់ឈ្មោះ, អាយុ, ភេទ ឬតំណភ្ជាប់ផុសម្តងទៀត។";
  }

  // បើមិនចូលចំណុចខាងលើទាំងអស់ បង្ហាញ Error ដើម
  return `⚠️ Facebook Error: ${errMsg}`;
}
