import Link from "next/link";
import { siteTabs } from "@/lib/site-data";

export function SiteTabs() {
  return (
    <section className="mx-2 my-2">
      <div className="grid grid-cols-4 gap-2">
        {siteTabs.map((tab) => (
          <Link
            key={tab.label}
            href="#"
            className="flex flex-col items-center justify-center rounded-lg border border-[#d0d8f0] bg-white px-1 py-3 text-center text-[9px] font-semibold leading-tight text-[#16398f]"
          >
            {tab.spaced}
          </Link>
        ))}
      </div>
    </section>
  );
}
