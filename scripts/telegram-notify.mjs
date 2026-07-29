/**
 * Send Telegram notifications when WP content is pushed.
 *
 * .env.local:
 *   TELEGRAM_BOT_TOKEN=123456:ABC...
 *   TELEGRAM_CHAT_ID=your_chat_id
 */

export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

export async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.warn("[telegram] skipped — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local");
    return false;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.warn(`[telegram] send failed ${res.status}: ${body.slice(0, 200)}`);
    return false;
  }

  return true;
}

export function formatPushSummary({ updated, failed, touchDate, siteUrl }) {
  const lines = [];
  const host = siteUrl?.replace(/^https?:\/\//, "") ?? "100cuci.ad";

  if (failed.length === 0) {
    lines.push(`✅ ${host} 已更新 ${updated.length} 篇文章`);
  } else {
    lines.push(`⚠️ ${host} 更新完成（${updated.length} 成功，${failed.length} 失败）`);
  }

  for (const row of updated) {
    lines.push(`• #${row.wpId} ${row.note ?? row.slug ?? ""}`.trim());
  }

  for (const row of failed) {
    lines.push(`✗ #${row.wpId} ${row.error ?? "failed"}`);
  }

  lines.push("");
  lines.push(touchDate ? "Publish date 已刷新 · 前台 ~60 秒同步" : "仅正文更新 · 前台 ~60 秒同步");

  return lines.join("\n");
}
