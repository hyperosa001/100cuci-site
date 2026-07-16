import fs from "node:fs";
import path from "node:path";
import { CloneSite } from "@/components/CloneSite";
import { applySiteLinks } from "@/lib/apply-site-links";

function readCloneFile(name: string) {
  return fs.readFileSync(path.join(process.cwd(), "src", "clone", name), "utf8");
}

export default function Home() {
  return (
    <CloneSite
      headerHtml={readCloneFile("header.html")}
      marqueeHtml={readCloneFile("marquee.html")}
      contentHtml={applySiteLinks(readCloneFile("content.html"))}
      footerHtml={readCloneFile("footer.html")}
      sideMenuHtml={applySiteLinks(readCloneFile("side-menu.html"))}
      floatHtml={readCloneFile("float.html")}
    />
  );
}
