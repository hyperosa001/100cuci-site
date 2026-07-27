/**
 * Ensure every article is at least ~1200 words by appending topic extras once.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "docs", "cms-content-pack", "articles");
const meta = JSON.parse(readFileSync(join(dir, "_meta.json"), "utf8"));

const extra = {
  live: `<h2>After the first week</h2>
<p>Once the checklist feels automatic, keep the same structure and only change one variable at a time: a new table type, a slightly higher max bet inside the weekly budget, or a different banking channel test. Changing everything at once recreates beginner chaos. 100CUCI rewards stable routines more than dramatic reinventions.</p>
<p>Share your process with yourself in writing. A short weekly note — what worked, what broke the plan — is enough. Players who review weekly need fewer emergency deposits and fewer angry support chats. That is the real win condition for live casino beginners in Malaysia.</p>`,
  banking: `<h2>After the first successful cashout</h2>
<p>The first successful withdrawal teaches more than ten tipster videos. Save the timeline: when you claimed, when turnover completed, when you requested payout, when funds arrived. That timeline becomes your personal SLA expectation. Future sessions that fall far outside it deserve a calm check — promo unfinished, channel changed, or peak-hour delay — not an instant second account or panic deposit.</p>
<p>Keep celebrating boring banking. Boring means the system worked. Exciting banking usually means something went wrong.</p>`,
  jili: `<h2>After you know two studios</h2>
<p>When two familiar studios feel easy, add education goals instead of stake goals: read one new paytable fully, finish one promo cleanly, or test one tiny deposit rail. Stake goals push tilt; education goals push competence. Competence is what makes slot Malaysia play at 100CUCI sustainable.</p>
<p>If a friend sends a “must play” title, park it on a weekend list. Do not interrupt a clearance session for curiosity. Curiosity can wait until cash balance and a free evening.</p>`,
  slotcredit: `<h2>Graduation criteria before real deposits</h2>
<p>Graduate from free credit only when you can explain your last offer in one sentence, name three eligible games, and show a screenshot of progress or completion. If you cannot, stay on tutorial mode with tiny cash stakes or wait for the next clear campaign. Depositing to escape confusion multiplies confusion.</p>
<p>Graduation is a knowledge gate, not a feeling that you are “due” a win. 100CUCI will still be there when the gate is passed.</p>`,
  football: `<h2>Midweek maintenance</h2>
<p>Use one midweek evening to clear admin: verify promo status, confirm bank channels, update league shortlists, and reset unit size if Monday review changed it. Do not place “boredom tickets” during admin night. Admin night protects weekend quality on the 100CUCI sportsbook.</p>
<p>If work stress is high midweek, skip football entirely. Stress seeking stimulation is how unit sizes drift before Friday even starts.</p>`,
  liveodds: `<h2>When to demote yourself back to pre-match</h2>
<p>Demote back to pre-match for a week if you break unit size twice, accept rejected prices emotionally, or bet matches you are not watching. Demotion is skill maintenance, not punishment. Live odds will still be available later. Pre-match rhythm rebuilds the calm you need for in-play on 100CUCI.</p>`,
  "4d": `<h2>Combining lottery with other products safely</h2>
<p>If you also play slots or live casino, finish lottery on a separate night when possible. Same-night product hopping increases the chance that a lottery near miss becomes a slot chase. Separate nights rebuild the mental wall between envelopes. 100CUCI offers many products; you are not obliged to touch them all before sleep.</p>`,
  responsible: `<h2>Family and device boundaries</h2>
<p>Keep play off shared living-room screens. Use private sessions, lock the phone, and never leave balances visible to minors. If someone asks to “try one ticket” on your account, refuse. Accounts are personal; sharing breaks both safety and promo rules. Boundaries are part of responsible play, not extra politeness.</p>`,
  freecredit: `<h2>What success looks like after a welcome offer</h2>
<p>Success is not a screenshot of a huge multiplier. Success is: understood terms, eligible play only, turnover finished or consciously abandoned, banking verified, and no tilt deposit. If you finish with a small withdrawable amount, that completed loop is worth more as education than an unfinished giant headline credit.</p>
<p>Carry that definition into every future Promotions claim at 100CUCI.</p>`,
  referral: `<h2>When to ignore reward noise</h2>
<p>Ignore reward noise when you are clearing another campaign, when you are on a responsible pause, or when sleep is short. Noise is constant; your capacity is not. Selective blindness is a power user skill. Enable rewards again only when your weekly cap and calendar have room.</p>`,
};

const marker = "<!-- padded4 -->";

for (const m of meta) {
  const file = join(dir, m.file);
  let html = readFileSync(file, "utf8");
  // strip generator markers from WP-facing files
  html = html.replace(/<!-- padded\d* -->\n?/g, "");
  const wordsNow = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (wordsNow < 1200 && extra[m.topic] && !html.includes("After the first week") && !html.includes(extra[m.topic].slice(0, 40))) {
    html = html.replace(
      '<div class="lp-summary">',
      `${extra[m.topic]}\n\n<div class="lp-summary">`,
    );
  }
  writeFileSync(file, html.replace(/\n{3,}/g, "\n\n"));
  const words = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  console.log(`${m.file}: ~${words} words`);
}
