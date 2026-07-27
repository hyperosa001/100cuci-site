/**
 * Pads generated CMS articles to ~1200+ words with topic-specific sections.
 * Run after: node scripts/generate-cms-articles.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "docs", "cms-content-pack", "articles");
const meta = JSON.parse(readFileSync(join(dir, "_meta.json"), "utf8"));

const pads = {
  live: `<h2>Session script you can reuse</h2>
<p>Use this script every time you open live casino at 100CUCI. Minute 0–5: confirm OTP status, open Promotions, note eligibility for live tables, and write your RM budget, max bet, and stop time. Minute 5–15: open a low-limit baccarat or roulette room, watch one full shoe or several spins without raising stakes, and check lag on your network. Minute 15–40: play only inside the written max bet. Minute 40+: if the budget is gone or the stop time hits, leave. Do not renegotiate with yourself because the shoe “feels due.”</p>
<p>Malaysian players often play on phones between errands. That lifestyle needs harder stop rules, not softer ones. Put the stop time in your calendar alarm. When it rings, cash out of the table even if the next hand looks interesting. Interesting hands are infinite; your weekly budget is not.</p>
<p>If you use free credit no deposit before live play, finish reading contribution rates first. A welcome offer that looks generous can become expensive if live games contribute at a reduced percentage. In that case, clear the offer on eligible slots first, then move to live casino with cash balance. Mixing unclear clearance paths is how first sessions turn into support tickets.</p>
<p>Table etiquette still matters in digital rooms. Do not spam chat, do not demand side bets you do not understand, and do not blame the dealer interface for your own stake mistakes. Calm behaviour keeps your attention on limits and pace — the two variables you actually control at 100CUCI.</p>
<p>Before you end the night, screenshot your balance and any promo progress bar. Those two images become tomorrow’s baseline. Players who skip records usually reopen the cashier “just to check” and accidentally deposit again. Records are a control tool, not homework.</p>
<p>Finally, decide your next session date in advance. Daily live casino is optional, not mandatory. Online casino Malaysia entertainment stays healthier when you schedule play like a hobby night, not like an open browser tab that never closes. Register once, verify once, and reuse the same checklist until it becomes muscle memory.</p>`,

  banking: `<h2>A full deposit-to-withdrawal walkthrough</h2>
<p>Imagine a clean first week at 100CUCI. Day one: Register, OTP, tiny deposit through an e-wallet you already use, screenshot the reference, wait for balance, then stop. Day two: open Promotions, claim one offer you understand, and play only eligible games. Day three: check turnover progress without changing payout details. Day four or later: when clearance is done, submit one withdrawal to the verified channel and wait. That calendar sounds slow on purpose. Slow banking is how you avoid duplicate deposits, mismatched names, and weekend panic.</p>
<p>Name matching deserves extra attention. If your profile uses a legal name format that differs from an e-wallet display name, fix it early through official support channels — not through random chat accounts. First-time payouts may need extra checks. Expect that and plan cash needs elsewhere so a pending withdrawal does not create pressure to keep playing.</p>
<p>Peak hours matter. Friday night deposits and Monday morning withdrawals can sit in longer queues. If you need funds for a real-life deadline, do not rely on a same-hour casino cashout. Build a buffer. Entertainment money should never be money you need at 9 a.m. for bills.</p>
<p>Security habits belong in the same checklist as turnover maths. Bookmark official entry points from this site. Reject APK links from strangers. Never install remote-control apps because someone claims they can “speed up withdrawal.” Real 100CUCI processes do not require that. If a page looks slightly wrong — odd domain, broken SSL, strange download prompt — leave immediately and return through your bookmark.</p>
<p>When you play live casino and slots in the same week, label which balance is clearing which promo. Players who treat all credits as one pile often clear the wrong product and then blame the cashier. The cashier is following rules printed on the promo card. Your job is to read that card before the session, not after a failed cashout.</p>
<p>Keep one simple spreadsheet or notes file: date, method, amount in, amount out, promo name, status. Ten seconds of logging prevents an hour of confusion later. Boring records are a feature of adult bankroll management at any online casino Malaysia brand, including 100CUCI.</p>`,

  jili: `<h2>A seven-day familiarisation plan</h2>
<p>Day 1 at 100CUCI: Register, OTP, open Slots, find one JILI-style title you recognise, play a short low-stake session, stop. Day 2: add one MEGA888-style or similar familiar room if listed, still low stakes, still short. Day 3: read Promotions in detail and decide whether slot free credit or free credit no deposit is worth claiming. Day 4: if claimed, play only eligible games toward turnover with medium-volatility titles. Day 5: explore one new provider only after the warm-up set feels automatic. Day 6: test a tiny real deposit if you like the lobby. Day 7: review notes — which games drained too fast, which paytables you understand, which promo rules were confusing — then adjust next week’s plan.</p>
<p>This schedule prevents the “open fifty games in one night” pattern that burns attention and bonus balances. Slot Malaysia lobbies are designed to look endless. Your job is to make them finite. A finite list of titles is how you learn volatility without mythology.</p>
<p>Feature buys deserve a special warning. They can be fun when you are playing cash for entertainment, but they can wreck turnover plans if the bet size is capped or if the feature cost eats the bonus too quickly. Until you have cleared one campaign successfully, skip feature buys. Learn the base game first.</p>
<p>Audio and screen time also matter. Loud win sounds on a phone can push stake size up without a conscious decision. Play muted for your first week if needed. Mute removes some of the carnival pressure and leaves the maths visible: balance, bet size, spins remaining.</p>
<p>If a title feels confusing after two short sessions, drop it. There are always more games. Loyalty to a confusing paytable is not a virtue. Familiar JILI and MEGA888-style rooms exist in the catalogue so Malaysian players can start from recognition instead of from a random jackpot banner.</p>
<p>End each session with two screenshots: balance and promo progress. Then close the app. Closing matters. Background tabs are how “one more spin” becomes an unplanned hour. 100CUCI should fit inside your evening, not swallow it.</p>`,

  slotcredit: `<h2>Turning free credit into a real tutorial</h2>
<p>Think of slot free credit as a paid classroom where the tuition is your attention to rules. The credit amount is the lesson budget. The wagering multiple is the homework. Eligible games are the classroom list. Max bet caps are the school rules. If you ignore any of those, the lesson fails even if a few spins look exciting.</p>
<p>Start by translating the promo card into your own words in a notes app. Example: “RM credit, slots only, no live casino, turnover X, bet cap Y, expires Friday.” If you cannot write that sentence, you are not ready to claim. Claiming first and reading later is how players clear the wrong product and then feel cheated by ordinary terms.</p>
<p>Choose three eligible games maximum for the whole campaign. More than three splits focus and makes volatility harder to read. Prefer titles you already recognise from JILI or MEGA888-style play when they are eligible. Recognition reduces misclicks and misread symbols.</p>
<p>Session length should be short. Free credit invites long sessions because it feels consequence-free. It is not. Long sessions create fatigue, and fatigue creates deposits. Set a timer. When the timer ends, leave even if credit remains. Remaining credit can wait for tomorrow’s calm session.</p>
<p>After the campaign ends — cleared or expired — write a post-mortem: Did I understand the game list? Did I respect bet caps? Did I deposit from tilt? That short review makes the next offer cheaper in emotional cost. Online casino Malaysia players who keep post-mortems improve faster than players who only remember the biggest win animation.</p>
<p>If no free credit no deposit offer is live, do not hunt shady third-party “credit sellers.” Those channels are how accounts get stolen. Wait for official Promotions inside 100CUCI, or play tiny cash stakes you can afford. Official patience beats unofficial risk every time.</p>`,

  football: `<h2>Weekend matchday operating system</h2>
<p>Friday: confirm OTP and banking are ready, read Promotions for sports eligibility, set the weekend sports budget, and choose at most two leagues. Saturday morning: place only pre-match tickets you can explain in one sentence, using unit stakes. Saturday afternoon: watch your matches without editing stakes after kick-off. Sunday: review results, update notes, and stop — do not invent a “recovery coupon” that was never in the plan.</p>
<p>This operating system keeps football betting Malaysia sessions on 100CUCI from blending into slot nights and live casino tilt. Different products need different brains. Football needs fixture knowledge and patience. Slots need paytable literacy. Live casino needs pace control. Mixing them in one emotional spiral is how bankrolls vanish.</p>
<p>Group chats are a special hazard. Tips arrive with confidence and no accountability. If a tip cannot survive your one-sentence rule, skip it. Your unit size does not care that a stranger is “sure.” Sure is not a market.</p>
<p>Asian handicap literacy is worth one quiet study session. Learn what 0.5 and 0.25 style lines mean before you stake real money on them. Misreading a line is a self-inflicted loss, not variance. Use small stakes while learning settlement. Settlement surprises should happen with tiny tickets, not with rent money.</p>
<p>If you also hold slot free credit, keep it off football unless the promo card allows sports. Crossing products without reading contribution rates creates locked withdrawals and angry evenings. Angry evenings produce more tickets. More tickets without a plan produce a worse week. Break the chain at the promo card.</p>
<p>End the weekend with a screenshot of settled tickets and remaining sports budget. Then close the sportsbook. Monday is for ordinary life, not for inventing midweek “must win” parlays that were never part of the Friday plan.</p>`,

  liveodds: `<h2>Building in-play only after pre-match mastery</h2>
<p>Give yourself ten clean pre-match tickets across different days before you promote yourself to live odds. Those ten tickets teach confirmation flow, history checks, and emotional reaction to wins and losses. If you cannot stay calm on pre-match, live markets will amplify the problem.</p>
<p>When you do go live, start with matches you are watching end-to-end. Half-watching while scrolling social media is how late goals arrive as surprises and how revenge clicks appear. Full attention is part of the stake. If you cannot watch, do not bet live.</p>
<p>Create a personal latency test. Place a tiny live bet early in a low-importance match and time how long acceptance takes on your usual network. If acceptance is slow, your network is not ready for sharp in-play markets. Switch to Wi-Fi or stay pre-match. Fighting latency with bigger stakes is backwards.</p>
<p>Limit yourself to one live market type at first — for example next goal or full-time result — until settlement feels obvious. Adding corners, cards, and player props on week one creates a fog of rules. Fog is expensive.</p>
<p>Promotions still apply. If free credit no deposit or other campaigns exclude live bets, do not “just try.” Trying ineligible markets wastes time and sometimes progress. Read the card, then decide whether tonight is an in-play night at all.</p>
<p>After each live session, note two things: how many rejected slips you accepted at a worse price, and whether your unit size drifted. Those two metrics predict bankroll damage better than any tipster. Improve them before you increase volume on the 100CUCI sportsbook.</p>`,

  "4d": `<h2>Drawing nights without superstition scripts</h2>
<p>People invent scripts: lucky hours, lucky shops, lucky digit patterns after a near miss. None of those scripts change independent draws. What does change results for your life is stake size and frequency. Keep both low while you learn 100CUCI number-game interfaces.</p>
<p>Create a draw-night checklist: budget remaining this week, cut-off time, bet type understood, screenshot ready, promo eligibility checked. Run the checklist every time. Rituals that improve process are useful; rituals that promise destiny are not.</p>
<p>If you play lottery and slots the same week, decide the split before Monday. Example: 70% slots learning budget, 30% lottery entertainment. When lottery is spent, it is spent — slots money is not a backup generator. That wall between envelopes is responsible play in practice.</p>
<p>Family-shared devices need extra care. Log out. Do not leave tickets visible on a lock screen. Do not let minors access the account. Adults 18+ only is not a slogan; it is a hard rule.</p>
<p>If a ticket UI ever looks different after an update, stop and read the new labels before confirming. Interface changes are when mis-taps happen. Mis-taps on number games are still real stakes.</p>
<p>Over a month, review how often lottery play improved your week versus how often it created stress. If stress wins, shrink the budget or pause. 100CUCI should remain optional entertainment, not a nightly obligation tied to draw schedules.</p>`,

  responsible: `<h2>Warning signs and practical pauses</h2>
<p>Warning signs include hiding play, borrowing for tickets, irritability without a daily draw, and raising stakes after near misses. If two or more appear, take a seven-day pause. Delete shortcuts, log out, and move entertainment money to a separate real-life goal for that week. A pause is not failure; it is maintenance.</p>
<p>Tell one trusted adult if play is becoming secretive. Secrecy grows problems. Light accountability shrinks them. You do not need to share every ticket — you need someone who can ask whether you kept the weekly cap.</p>
<p>Use official 100CUCI entry points only. Scam pages often combine fake free credit no deposit promises with urgent language. Urgency is a manipulation tool. Real Promotions can wait until you verify the domain and the terms.</p>
<p>If you also play live casino or slots, apply the same weekly cap across products unless you deliberately separate envelopes. A responsible lottery plan fails if casino chase empties the same wallet an hour later.</p>
<p>Sleep is part of responsible play. Draw results at late hours are not a reason to skip rest. Tired players make denser mistakes and softer promises to themselves. Set a last-ticket time and keep it.</p>
<p>Remember the audience rule: adults 18+ only, playing with money they can afford to lose. If that sentence ever becomes uncomfortable, stop and seek local help resources for gambling harm. No 100CUCI campaign is worth financial or family damage.</p>`,

  freecredit: `<h2>Offer comparison worksheet</h2>
<p>When two promotions appear, compare them on paper before tapping claim. Columns: amount, eligible games, turnover, max bet, max cashout, expiry, stacking notes. The larger headline amount often loses to the clearer game list. Clarity clears faster than hype.</p>
<p>Example thinking: a smaller slot free credit with straightforward eligible providers may beat a larger mixed offer that quietly reduces live casino contribution and confuses your week. Your goal is a finished campaign and a learned lobby, not a screenshot of a big number.</p>
<p>After claiming, schedule the clearance sessions in your calendar like appointments. Random “whenever I feel like it” play often hits expiry with unfinished turnover. Expiry is avoidable friction. Appointments fix it.</p>
<p>Do not create extra accounts to harvest multiple free credit no deposit offers. Multi-accounting is a common rule break and a common reason balances vanish. One clean Register, one verified profile, one honest campaign path.</p>
<p>When clearance completes, withdraw a portion if the terms allow and you want the psychological win of a completed loop. Completing a loop teaches the full system: claim, play eligible games, cash out, stop. Players who never cash out small wins sometimes never trust the cashier — and distrust leads to messier behaviour.</p>
<p>If live chat answers contradict the promo card, keep screenshots of both and ask for clarification before large play. Documentation protects you. Memory does not. Treat 100CUCI promotions like contracts you can show yourself later.</p>`,

  referral: `<h2>Streaks, invites, and weekly caps</h2>
<p>Daily rewards love streaks. Your budget may not. Decide a maximum number of login days per week that still respects sleep and work. If a streak requires unhealthy hours, break it. A broken streak costs less than a broken routine.</p>
<p>Referral invites should be rare and honest. Message people who already asked about online casino Malaysia options, not every contact in your phone. Consent matters. Adults only. Explain that terms apply and that Register is optional entertainment.</p>
<p>Track referral progress separately from welcome free credit no deposit. Separate notes prevent stacking mistakes. If a friend stalls on verification, wait — do not create pressure messages every hour. Pressure turns invitations into spam.</p>
<p>When daily credit is small, play it with the same discipline as large credit. Small balances still teach bad habits if you chase them. Use eligible games, keep stakes tiny, and stop.</p>
<p>If rewards ever feel like a job, disable them. Entertainment that feels like unpaid work is a signal to simplify. 100CUCI should add optional extras, not become a second shift.</p>
<p>Close the loop monthly: list what you claimed, what you finished, what you abandoned, and whether your weekly cap survived. That review tells you whether referral and daily tools are helping or merely increasing login frequency without benefit.</p>`,
};

const pads2 = {
  live: `<h2>Common first-night mistakes to avoid</h2>
<p>Opening the highest limit table because a friend screenshotted a win. Mixing three promos before understanding one. Depositing twice because the first reference was slow. Playing through lag instead of switching rooms. Skipping OTP and discovering limits later. Each mistake is preventable with the checklist above. If you catch yourself doing one, stop the session early rather than “fixing it” with bigger bets.</p>
<p>Also avoid learning blackjack strategy charts and live dealer timing in the same hour. One skill per night is enough. 100CUCI will still be there tomorrow. Online casino Malaysia play rewards patience more than heroic catch-up sessions.</p>`,
  banking: `<h2>Documents and verification without panic</h2>
<p>If 100CUCI asks for extra verification, provide what official support requests through official channels only. Do not send identity documents to random Telegram accounts. Keep copies of what you submitted and when. Verification delays feel personal; they are usually process. Plan entertainment around them instead of fighting them with more deposits.</p>
<p>After a successful withdrawal once, keep using the same channel when possible. Consistency speeds future reviews. Switching channels every week recreates first-time friction again and again.</p>`,
  jili: `<h2>Reading volatility like a budget tool</h2>
<p>Volatility is not a personality test. It is a budget tool. If your session budget is small, choose smoother games so you can complete the learning loop. If your budget is larger and you explicitly want swingy entertainment, choose higher volatility knowingly — not accidentally after a tip in a chat group.</p>
<p>Write the chosen volatility level into your session note. That single line prevents mid-session game hopping that resets your understanding every ten minutes.</p>`,
  slotcredit: `<h2>Social media screenshots vs real terms</h2>
<p>Screenshots travel faster than terms. A viral “slot free credit Malaysia” image may be expired, region-limited, or edited. Always open Promotions inside 100CUCI after you Register and treat that page as the only source of truth. If chat support confirms details, save the transcript. Your future self will thank you when a cashout question appears.</p>`,
  football: `<h2>Derby nights and stake discipline</h2>
<p>Derby fixtures create noise. Noise creates oversized stakes. Decide unit size on Thursday for a Sunday derby, then refuse to edit it after lineup news unless the news invalidates your original one-sentence thesis. If the thesis dies, cancel — do not inflate. 100CUCI sportsbook tools work best when your process is calmer than the crowd.</p>`,
  liveodds: `<h2>One-screen rule for mobile live betting</h2>
<p>Keep only one match screen and one bet slip visible. Split-screen chaos on a phone is how wrong markets get tapped. If you need stats, pause betting while you check, then return. Speed without clarity is not skill on the 100CUCI sportsbook — it is noise with a stake attached.</p>`,
  "4d": `<h2>Near-miss psychology in number games</h2>
<p>A near miss feels like information. It is not. It is a designed emotional spike. Answer it with your weekly cap, not with an immediate second ticket twice as large. If near misses repeatedly break your plan, switch entertainment types for a week — slots with a timer, or no play at all — until the urge settles.</p>`,
  responsible: `<h2>Tools that support the pause</h2>
<p>Practical pause tools: remove bookmarks for a week, turn off promo notifications, move discretionary cash to a bills account, and schedule a non-gambling evening activity at your usual play time. Replace the habit slot, do not leave it empty. Empty slots refill with the old habit.</p>`,
  freecredit: `<h2>Talking to support the smart way</h2>
<p>When you message live chat about free credit no deposit, ask precise questions: eligible games, contribution percent, max bet, expiry, max cashout. Vague questions get vague answers. Precise questions create transcripts you can reuse. Bring your claim time and offer name. That preparation makes 100CUCI support interactions faster for everyone.</p>`,
  referral: `<h2>Quality referrals beat volume</h2>
<p>One friend who understands terms is more valuable than twenty confused signups. Confused signups create complaints and promo risk. Share the official Register path from this site, tell people to read Promotions themselves, and never promise withdrawable cash from a headline alone.</p>`,
};

const pads3 = {
  live: `<h2>Checklist printable version</h2>
<p>Copy this into your notes app: (1) OTP done (2) promo eligibility for live casino checked (3) RM budget written (4) max bet written (5) stop time alarm set (6) Wi-Fi checked (7) one payout channel verified (8) screenshots after session. If any box is unchecked, do not open a high-limit table. This printable mindset is how first sessions at 100CUCI stay boring in the best way.</p>`,
  banking: `<h2>Weekend vs weekday banking expectations</h2>
<p>Weekdays usually move faster for FPX and e-wallet reviews. Weekends can stretch. If you must withdraw before a Monday bill, start clearance earlier in the week. Do not discover unfinished turnover on Sunday night. Plan 100CUCI banking like you plan any other payment — with calendar space, not with hope.</p>
<p>Also separate “play money” in your real bank or e-wallet so entertainment top-ups have a hard ceiling. When the envelope is empty, the week is over even if a promo banner is still shouting.</p>`,
  jili: `<h2>Provider hopping rules</h2>
<p>Allow yourself one new provider per week after the familiar JILI and MEGA888-style start. Take notes on load time, paytable clarity, and how fast the balance moves at your usual stake. If a provider fails two of those three checks, drop it. Catalogue size is marketing; your shortlist is strategy.</p>
<p>When Promotions list eligible providers, match your shortlist to that list before you claim. Claiming first and searching later wastes free credit on learning curves you did not schedule.</p>`,
  slotcredit: `<h2>Bet-cap discipline with free credit</h2>
<p>Bet caps exist to stop bonus clearing with oversized spins. Respect them even if the UI lets you try. Failed contributions and voided progress are frustrating in a way that feels unfair — but the rule was printed. Keep stakes comfortably under the cap so mis-taps do not breach it. That is how slot free credit at 100CUCI stays a tutorial instead of a dispute.</p>
<p>If you are unsure whether a feature buy counts, ask live chat before buying. One question beats twenty wasted spins.</p>`,
  football: `<h2>Bankroll envelopes for sports only</h2>
<p>Label a sports-only envelope in your notes: starting amount, unit size, max tickets per day, max loss for the weekend. When the envelope hits max loss, the sportsbook closes for you — even if a late kick-off looks tempting. This envelope system keeps football betting Malaysia activity on 100CUCI from cannibalising slot or live casino budgets.</p>
<p>Review the envelope every Monday. Adjust only then, never mid-match.</p>`,
  liveodds: `<h2>Rejected slip protocol</h2>
<p>When a live slip rejects, follow a fixed protocol: breathe, check match state, check new price, decide with the original unit size or cancel. Forbidden actions: instantly accepting any new number, doubling stake, or adding legs to “get value back.” Write the protocol in your notes and glance at it the first three times you play live odds on 100CUCI. Protocols beat adrenaline.</p>`,
  "4d": `<h2>Record keeping for number games</h2>
<p>Keep a monthly log: dates played, total staked, total returned, mood before play, mood after play. The mood columns matter. If after-play mood is repeatedly worse, shrink the budget regardless of monetary break-even. Lottery entertainment that reliably worsens your evening is failing its only job.</p>
<p>Share the monthly total with yourself honestly. Hidden totals grow. Visible totals stay smaller.</p>`,
  responsible: `<h2>Re-entry rules after a pause</h2>
<p>After any pause longer than seven days, re-enter with half your previous weekly cap for one week. Earn the full cap back only if the half-cap week stayed calm — no chasing, no secrecy, no borrowed funds. Re-entry rules protect you from celebrating a pause by immediately overplaying. 100CUCI will still offer games later; your stability is the scarce resource.</p>`,
  freecredit: `<h2>Expiry and calendar discipline</h2>
<p>Put offer expiry in your phone calendar with a two-day warning. Use the warning to schedule clearance sessions, not to panic-spin at midnight. Panic-spinning before expiry is how bet caps get breached and how eligible-game lists get ignored. Calendar discipline turns free credit no deposit from a stress event into a short project with a deadline.</p>
<p>If you cannot finish an offer in time, let it expire rather than forcing ineligible play. Forcing creates worse outcomes than missing a small credit.</p>`,
  referral: `<h2>Taxonomy of rewards in your notes</h2>
<p>Keep three headings in one note file: Welcome / Free credit no deposit, Daily rewards, Referral rewards. Under each, store amount, rules, status, and next action. This taxonomy stops the common mistake of treating every credit as identical. Different rewards at 100CUCI can have different cashout paths. Your notes should mirror that reality.</p>
<p>Review the file every Sunday night in five minutes. Five minutes of admin saves a week of confusion.</p>`,
};

const marker = "<!-- padded -->";
const marker2 = "<!-- padded2 -->";
const marker3 = "<!-- padded3 -->";

for (const m of meta) {
  const file = join(dir, m.file);
  let html = readFileSync(file, "utf8");
  if (!html.includes(marker) && pads[m.topic]) {
    html = html.replace(
      '<div class="lp-summary">',
      `${marker}\n${pads[m.topic]}\n\n<div class="lp-summary">`,
    );
  }
  if (!html.includes(marker2) && pads2[m.topic]) {
    html = html.replace(
      '<div class="lp-summary">',
      `${marker2}\n${pads2[m.topic]}\n\n<div class="lp-summary">`,
    );
  }
  if (!html.includes(marker3) && pads3[m.topic]) {
    html = html.replace(
      '<div class="lp-summary">',
      `${marker3}\n${pads3[m.topic]}\n\n<div class="lp-summary">`,
    );
  }
  writeFileSync(file, html);
  const words = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  console.log(`${m.file}: ~${words} words`);
}
