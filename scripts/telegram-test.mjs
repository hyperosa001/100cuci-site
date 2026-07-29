/** Send a test Telegram message using .env.local credentials */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isTelegramConfigured, sendTelegramMessage } from "./telegram-notify.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    if (!process.env[t.slice(0, i).trim()])
      process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}

if (!isTelegramConfigured()) {
  console.error("Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local");
  process.exit(1);
}

const ok = await sendTelegramMessage(
  "✅ 100cuci.ad Telegram 通知已接通\n以后 push 文章后会自动提醒你。",
);
process.exit(ok ? 0 : 1);
