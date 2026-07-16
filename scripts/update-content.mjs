import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const cloneDir = path.join(root, "src", "clone");
const browserLogs = "C:/Users/user-notebook/.cursor/browser-logs";

function rewriteUrls(text) {
  return text
    .replace(/https:\/\/xt30sf\.b-cdn\.net\/media\//g, "/media/")
    .replace(/data-cursor-ref="[^"]*"/g, "");
}

async function readCdp(file) {
  const raw = await fs.readFile(path.join(browserLogs, file), "utf8");
  return JSON.parse(raw).result?.value ?? "";
}

const contentHtml = rewriteUrls(
  await readCdp("cdp-response-Runtime.evaluate-2026-07-15T09-55-49-395Z.json"),
);

const [headerHtml, marqueeHtml, footerHtml] = rewriteUrls(
  `<div id="header" style="background-image: url('/media/72b8152791c96d24d3520.webp'); visibility: visible;">
\t<i class="opensidemenu fa fa-bars" style="display: inline;"></i>
\t<a href="#home"><img class="logo" src="/media/d6838063072a67b0cddf5.gif"></a>
\t<a class="link currency changecurrency" id="changecurrency"><img src="/media/a6464acc5e4a6612bade2.webp"></a>
\t<a class="link language" id="changelanguage"><i class="material-icons">g_translate</i></a>
</div>|||<div id="marquee" style="background-image: url('/media/1df83d4772196c5a35147.png'); visibility: visible;"><span style="animation-duration: 52s;"><p style="color:#fff">100Cuci | Trusted SyarikatCuci Group . Minimum Deposit RM1 . Share 1 Kwn Free RM10 . HotGame JILI , VPOWER , MEGA888H5 | JudiFree | FreeCreditNoDeposit | Link Free Credit | Free Credit 365 | MyCasinoWallet | JudiFreeCreditWalletNoDeposit | 2025freecreditnew | Freecreditkini | Kinibotfree | Freecredit2u   </p></span></div>|||<div id="footer" style="background-image: url('/media/16f44bc595166f01f6468.jpg'); visibility: visible;"><a href="#home" class="selected" style="width: 20%;"><i class="material-icons">home</i>Home</a><a href="#history" style="width: 20%;"><i class="material-icons">access_time</i>History</a><a href="#promotion" style="width: 20%;"><i class="material-icons">redeem</i><span class="badge main-pulse">1</span>Promo</a><a href="#chatroom" style="width: 20%;"><i class="material-icons">question_answer</i><span class="badge main-pulse">1</span>Live Chat</a><a href="#settings" style="width: 20%;"><i class="material-icons">settings</i>Setting</a></div>`,
).split("|||");

const scrollFix = `
/* Clone scroll fix: show full page content */
html, body {
  overflow: auto !important;
  overflow-x: hidden !important;
  height: auto !important;
  min-height: 100vh !important;
  max-height: none !important;
}
#content {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
}
#footer {
  position: relative !important;
  bottom: auto !important;
}
#popupwindow {
  display: none !important;
}
`;

await fs.writeFile(path.join(cloneDir, "content.html"), contentHtml);
await fs.writeFile(path.join(cloneDir, "header.html"), headerHtml);
await fs.writeFile(path.join(cloneDir, "marquee.html"), marqueeHtml);
await fs.writeFile(path.join(cloneDir, "footer.html"), footerHtml);

const existingCss = await fs.readFile(path.join(cloneDir, "clone.css"), "utf8");
const patchedCss = existingCss + scrollFix;
await fs.writeFile(path.join(cloneDir, "clone.css"), patchedCss);
await fs.writeFile(path.join(root, "public", "clone", "clone.css"), patchedCss);

console.log("Updated content.html:", contentHtml.length, "chars");
