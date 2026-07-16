import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const cloneDir = path.join(root, "src", "clone");
const publicDir = path.join(root, "public");
const browserLogs = "C:/Users/user-notebook/.cursor/browser-logs";

async function readCdpValue(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const json = JSON.parse(raw);
  return json.result?.value ?? "";
}

function rewriteUrls(text) {
  return text
    .replace(/https:\/\/xt30sf\.b-cdn\.net\/media\//g, "/media/")
    .replace(/data-cursor-ref="[^"]*"/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
}

async function main() {
  const contentHtml = rewriteUrls(
    await readCdpValue(path.join(browserLogs, "cdp-response-Runtime.evaluate-2026-07-15T09-33-04-191Z.json")),
  );
  const sideMenuHtml = rewriteUrls(
    await readCdpValue(path.join(browserLogs, "cdp-response-Runtime.evaluate-2026-07-15T09-34-28-108Z.json")),
  );

  const css1 = await readCdpValue(path.join(browserLogs, "cdp-response-Runtime.evaluate-2026-07-15T09-33-12-004Z.json"));
  const css2 = await readCdpValue(path.join(browserLogs, "cdp-response-Runtime.evaluate-2026-07-15T09-33-12-528Z.json"));
  const css3 = await readCdpValue(path.join(browserLogs, "cdp-response-Runtime.evaluate-2026-07-15T09-33-12-492Z.json"));
  const css = rewriteUrls(css1 + css2 + css3);

  const headerHtml = rewriteUrls(`<div id="header" style="background-image: url('/media/72b8152791c96d24d3520.webp'); visibility: visible;">
\t<i class="opensidemenu fa fa-bars" style="display: inline;"></i>
\t<a href="#home"><img class="logo" src="/media/d6838063072a67b0cddf5.gif"></a>
\t<a class="link currency changecurrency" id="changecurrency"><img src="/media/a6464acc5e4a6612bade2.webp"></a>
\t<a class="link language" id="changelanguage"><i class="material-icons">g_translate</i></a>
</div>`);

  const marqueeHtml = rewriteUrls(`<div id="marquee" style="background-image: url('/media/1df83d4772196c5a35147.png'); visibility: visible;"><span style="animation-duration: 35s; padding-left: 390px;"><p style="color:#fff">100Cuci | Trusted SyarikatCuci Group . Minimum Deposit RM1 . Share 1 Kwn Free RM10 . HotGame JILI , VPOWER , MEGA888H5 | JudiFree | FreeCreditNoDeposit | Link Free Credit | Free Credit 365 | MyCasinoWallet | JudiFreeCreditWalletNoDeposit | 2025freecreditnew | Freecreditkini | Kinibotfree | Freecredit2u   </p></span></div>`);

  const footerHtml = rewriteUrls(`<div id="footer"><a href="#home" class="selected" style="width: 20%;"><i class="material-icons">home</i>Home</a><a href="#history" style="width: 20%;"><i class="material-icons">access_time</i>History</a><a href="#promotion" style="width: 20%;"><i class="material-icons">redeem</i><span class="badge main-pulse">1</span>Promo</a><a href="#chatroom" style="width: 20%;"><i class="material-icons">question_answer</i><span class="badge main-pulse">1</span>Live Chat</a><a href="#setting" style="width: 20%;"><i class="material-icons">settings</i>Setting</a></div>`);

  const popupHtml = rewriteUrls(`<div id="popupwindow" style="display: block; opacity: 1;"><div class="main-notice-wrapper"><div id="main-notice" style="margin: 317px auto;"><i class="ic-close close"></i><div class="popup-wrapper"><div class="popup-sidebar"><ul><li class="active" data-key="NoticeURL0"><i class="fa-solid fa-video"></i> Official Websites</li><li data-key="NoticeURL1"><i class="fa-solid fa-video"></i> 100CUCI x JILI</li><li data-key="NoticeURL2"><i class="fa-solid fa-grip"></i> 100CUCI x CLOTPLAY</li><li data-key="NoticeURL3"><i class="fa-solid fa-grip"></i> 100CUCI x UUSLOTS</li><li data-key="NoticeURL4"><i class="fa-solid fa-grip"></i> 100CUCI x MEGAH5</li><li data-key="NoticeURL5"><i class="fa-solid fa-grip"></i> 100CUCI x VERTEXPLAY</li><li data-key="NoticeURL6"><i class="fa-solid fa-grip"></i> 100CUCI x RICHGAMING</li><li data-key="NoticeURL7"><i class="fa-solid fa-grip"></i> 100CUCI x META</li><li data-key="NoticeURL8"><i class="fa-solid fa-grip"></i> 100CUCI x VPLUS</li><li data-key="NoticeURL9"><i class="fa-solid fa-grip"></i> 100CUCI x PLAYSTAR</li><li data-key="NoticeURL10"><i class="fa-solid fa-grip"></i> Syarikat Cuci FIFA 2026 EVENT</li><li data-key="NoticeURL11"><i class="fa-solid fa-grip"></i> Syarikat Cuci</li></ul></div></div><div class="notice-wrapper" data-key="Notice000OFFICIALWEBSITE" style="display: block;"><div class="notice-banner-wrapper"><a class="notice" href="https://100cuci.link/" target="_blank" style="background-image: url('/media/318d64f5935a62a0c4f13.webp'); padding-top: 130%;"></a></div></div></div></div></div>`);

  const floatHtml = rewriteUrls(`<div id="floatcontainer"><div id="header-menu" style="padding-top: 0px;"><a id="header-partnership" href="/partnership" target="_blank" style="display: block;"></a></div><a class="floating-bsg" href="https://www.cuci100.com/partnership" target="_blank"><img src="/media/1baade0046f56f2146f84.png"></a><a class="floating-svl" href="https://joy.link/100cucifree/" target="_blank"><img src="/media/3c2d473413466b9ab3b96.png"></a></div>`);

  await fs.mkdir(cloneDir, { recursive: true });
  await fs.mkdir(path.join(publicDir, "clone"), { recursive: true });

  const files = {
    "content.html": contentHtml,
    "header.html": headerHtml,
    "marquee.html": marqueeHtml,
    "footer.html": footerHtml,
    "side-menu.html": sideMenuHtml,
    "popup.html": popupHtml,
    "float.html": floatHtml,
    "clone.css": css,
  };

  for (const [name, data] of Object.entries(files)) {
    await fs.writeFile(path.join(cloneDir, name), data);
    if (name === "clone.css") {
      await fs.writeFile(path.join(publicDir, "clone", "clone.css"), data);
    }
  }

  const urlMatches = [
    ...new Set([
      ...Object.values(files).join("").matchAll(/\/media\/[a-zA-Z0-9._-]+/g),
    ].map((m) => m[0].split(")")[0].split('"')[0].split("'")[0])),
  ];

  const remoteUrls = urlMatches.map((p) => `https://xt30sf.b-cdn.net${p}`);
  await fs.writeFile(path.join(cloneDir, "asset-urls.json"), JSON.stringify(remoteUrls, null, 2));
  console.log("Clone files saved. Assets:", remoteUrls.length);
}

main().catch(console.error);
