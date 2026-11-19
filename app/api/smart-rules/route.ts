import { NextRequest, NextResponse } from 'next/server';
import { notifySmartRuleZeroMsgPaused, notifySmartRuleHighCpaTriggered } from '@/lib/telegram';

interface SmartRuleConfig {
  enabled: boolean;
  pauseZeroMessage: boolean;
  zeroMessageSpendThreshold: number; // e.g. 5 or 10
  highCpaAction: 'pause' | 'reduce_budget' | 'alert_only' | 'off';
  cpaThreshold: number; // e.g. 1.20
  chatId?: string;
  botToken?: string;
}

function extractMessagingResults(actions?: any[]): number {
  if (!actions || !Array.isArray(actions)) return 0;
  
  // Facebook action_types for messaging
  const messagingTypes = [
    'onsite_conversion.messaging_conversation_started_7d',
    'onsite_conversion.total_messaging_connection',
    'messaging_conversation_started_7d',
    'onsite_conversion.messaging_first_reply',
    'onsite_conversion.messaging_user_depth_2_reply'
  ];

  for (const mType of messagingTypes) {
    const found = actions.find((a: any) => a.action_type === mType);
    if (found && Number(found.value) > 0) {
      return Number(found.value);
    }
  }

  // Fallback to any messaging action
  const anyMsg = actions.find((a: any) => a.action_type && a.action_type.includes('messaging'));
  if (anyMsg) return Number(anyMsg.value || 0);

  // If no messaging, check general conversions/leads
  const lead = actions.find((a: any) => a.action_type === 'lead' || a.action_type === 'offsite_conversion.fb_pixel_lead');
  if (lead) return Number(lead.value || 0);

  return 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      access_token, 
      ad_account_id, 
      config, 
      date_preset = 'maximum' // default check lifetime or today
    } = body;

    const accessToken = access_token || process.env.FB_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Missing Facebook Access Token" }, { status: 400 });
    }

    if (!ad_account_id) {
      return NextResponse.json({ success: false, error: "Missing Ad Account ID" }, { status: 400 });
    }

    const cleanAccountId = ad_account_id.startsWith('act_') ? ad_account_id : `act_${ad_account_id}`;
    const ruleConfig: SmartRuleConfig = {
      enabled: config?.enabled ?? true,
      pauseZeroMessage: config?.pauseZeroMessage ?? true,
      zeroMessageSpendThreshold: Number(config?.zeroMessageSpendThreshold ?? 5),
      highCpaAction: config?.highCpaAction ?? 'pause',
      cpaThreshold: Number(config?.cpaThreshold ?? 1.20),
      chatId: config?.chatId,
      botToken: config?.botToken
    };

    if (!ruleConfig.enabled) {
      return NextResponse.json({ 
        success: true, 
        message: "Smart Rules are currently disabled in configuration.", 
        actions: [] 
      });
    }

    // 1. Fetch all ads and their insights from Meta Marketing API
    const fields = 'id,name,status,effective_status,adset_id,campaign_id,adset{id,name,daily_budget,lifetime_budget},insights.date_preset(' + date_preset + '){spend,impressions,reach,actions}';
    const adsUrl = `https://graph.facebook.com/v18.0/${cleanAccountId}/ads?fields=${fields}&limit=250&access_token=${accessToken}`;

    const fbRes = await fetch(adsUrl);
    const fbData = await fbRes.json();

    if (fbData.error) {
      throw new Error(fbData.error.message || "Failed to fetch ads from Meta API");
    }

    const adsList = fbData.data || [];
    const triggeredActions: any[] = [];
    const activeAds = adsList.filter((ad: any) => {
      const status = (ad.effective_status || ad.status || '').toUpperCase();
      return status === 'ACTIVE';
    });

    for (const ad of activeAds) {
      const insight = ad.insights?.data?.[0];
      const spend = Number(insight?.spend || 0);
      const messages = extractMessagingResults(insight?.actions);
      const cpa = messages > 0 ? (spend / messages) : 0;

      // ------------------------------------------------------------------
      // RULE 1: Zero-Message Spend Guard (បិទ Ad ពេលចំណាយលើសកំណត់តែគ្មានសារឆាត)
      // ------------------------------------------------------------------
      if (ruleConfig.pauseZeroMessage && spend >= ruleConfig.zeroMessageSpendThreshold && messages === 0) {
        // Auto-pause ad via Meta API
        try {
          const pauseRes = await fetch(`https://graph.facebook.com/v18.0/${ad.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'PAUSED',
              access_token: accessToken
            })
          });
          const pauseData = await pauseRes.json();

          if (pauseData.success || !pauseData.error) {
            // Trigger Telegram Alert
            if (ruleConfig.chatId) {
              await notifySmartRuleZeroMsgPaused({
                adName: ad.name,
                adId: ad.id,
                accountId: cleanAccountId,
                spend: spend,
                threshold: ruleConfig.zeroMessageSpendThreshold,
                chatId: ruleConfig.chatId
              });
            }

            triggeredActions.push({
              adId: ad.id,
              adName: ad.name,
              rule: 'zero_message',
              reason: `ចំណាយ $${spend.toFixed(2)} លើសពី $${ruleConfig.zeroMessageSpendThreshold} តែគ្មានសារឆាត (0 messages)`,
              action: 'PAUSED',
              spend: spend,
              messages: 0,
              timestamp: new Date().toISOString()
            });
            continue; // Skip next rule since ad is already paused
          }
        } catch (err: any) {
          console.error(`Error pausing ad ${ad.id}:`, err);
        }
      }

      // ------------------------------------------------------------------
      // RULE 2: High CPA Guard (បិទ ឬបន្ថយ Budget ពេល CPA ឡើងលើសកំណត់ ឧ. $1.20)
      // ------------------------------------------------------------------
      if (ruleConfig.highCpaAction !== 'off' && messages > 0 && cpa >= ruleConfig.cpaThreshold) {
        if (ruleConfig.highCpaAction === 'pause') {
          try {
            const pauseRes = await fetch(`https://graph.facebook.com/v18.0/${ad.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                status: 'PAUSED',
                access_token: accessToken
              })
            });
            const pauseData = await pauseRes.json();

            if (pauseData.success || !pauseData.error) {
              if (ruleConfig.chatId) {
                await notifySmartRuleHighCpaTriggered({
                  adName: ad.name,
                  adId: ad.id,
                  accountId: cleanAccountId,
                  spend: spend,
                  messages: messages,
                  cpa: cpa,
                  threshold: ruleConfig.cpaThreshold,
                  actionTaken: 'PAUSED',
                  chatId: ruleConfig.chatId
                });
              }

              triggeredActions.push({
                adId: ad.id,
                adName: ad.name,
                rule: 'high_cpa',
                reason: `CPA $${cpa.toFixed(2)} លើសពីកម្រិតកំណត់ $${ruleConfig.cpaThreshold.toFixed(2)}`,
                action: 'PAUSED',
                spend: spend,
                messages: messages,
                cpa: cpa,
                timestamp: new Date().toISOString()
              });
            }
          } catch (err: any) {
            console.error(`Error pausing ad ${ad.id} on high CPA:`, err);
          }
        } else if (ruleConfig.highCpaAction === 'reduce_budget') {
          // Reduce parent adset budget by 30%
          const currentBudget = Number(ad.adset?.daily_budget || 0);
          if (currentBudget > 100) { // More than $1
            const newBudget = Math.max(100, Math.round(currentBudget * 0.7)); // reduce 30%
            try {
              await fetch(`https://graph.facebook.com/v18.0/${ad.adset.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  daily_budget: newBudget,
                  access_token: accessToken
                })
              });

              if (ruleConfig.chatId) {
                await notifySmartRuleHighCpaTriggered({
                  adName: ad.name,
                  adId: ad.id,
                  accountId: cleanAccountId,
                  spend: spend,
                  messages: messages,
                  cpa: cpa,
                  threshold: ruleConfig.cpaThreshold,
                  actionTaken: 'REDUCED_BUDGET',
                  newBudget: (newBudget / 100),
                  chatId: ruleConfig.chatId
                });
              }

              triggeredActions.push({
                adId: ad.id,
                adName: ad.name,
                rule: 'high_cpa',
                reason: `CPA $${cpa.toFixed(2)} លើសកំណត់ $${ruleConfig.cpaThreshold.toFixed(2)} -> បន្ថយ Budget ៣០%`,
                action: 'REDUCED_BUDGET',
                spend: spend,
                messages: messages,
                cpa: cpa,
                newBudget: (newBudget / 100),
                timestamp: new Date().toISOString()
              });
            } catch (err: any) {
              console.error(`Error reducing budget for adset ${ad.adset?.id}:`, err);
            }
          }
        } else if (ruleConfig.highCpaAction === 'alert_only') {
          if (ruleConfig.chatId) {
            await notifySmartRuleHighCpaTriggered({
              adName: ad.name,
              adId: ad.id,
              accountId: cleanAccountId,
              spend: spend,
              messages: messages,
              cpa: cpa,
              threshold: ruleConfig.cpaThreshold,
              actionTaken: 'ALERT_ONLY',
              chatId: ruleConfig.chatId
            });
          }

          triggeredActions.push({
            adId: ad.id,
            adName: ad.name,
            rule: 'high_cpa',
            reason: `CPA $${cpa.toFixed(2)} លើសកំណត់ $${ruleConfig.cpaThreshold.toFixed(2)}`,
            action: 'ALERT_ONLY',
            spend: spend,
            messages: messages,
            cpa: cpa,
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalInspected: adsList.length,
      activeCount: activeAds.length,
      triggeredCount: triggeredActions.length,
      actions: triggeredActions
    });

  } catch (error: any) {
    console.error("Smart Rules Execution Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
