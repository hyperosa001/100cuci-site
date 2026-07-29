/**
 * One-time setup: find your Telegram chat_id after messaging your bot.
 *
 * 1. Message @BotFather → /newbot → copy TELEGRAM_BOT_TOKEN into .env.local
 * 2. Open Telegram → search your bot → Send any message (e.g. "hi")
 * 3. Run: npm run telegram:chat-id
 * 4. Copy chat id into .env.local as TELEGRAM_CHAT_ID
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error("Add TELEGRAM_BOT_TOKEN to .env.local first (from @BotFather).");
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const data = await res.json();

if (!data.ok) {
  console.error("Telegram API error:", data);
  process.exit(1);
}

const chats = new Map();
for (const u of data.result ?? []) {
  const chat = u.message?.chat ?? u.edited_message?.chat;
  if (!chat) continue;
  chats.set(String(chat.id), chat);
}

if (chats.size === 0) {
  console.log("No messages yet.\n");
  console.log("1. Open Telegram and send any message to your bot");
  console.log("2. Run this command again: npm run telegram:chat-id");
  process.exit(0);
}

console.log("\nUse one of these as TELEGRAM_CHAT_ID in .env.local:\n");
for (const [id, chat] of chats) {
  const label = chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(" ");
  console.log(`  TELEGRAM_CHAT_ID=${id}   (${chat.type}: ${label || id})`);
}
console.log("");
