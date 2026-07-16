import Link from "next/link";

export function WelcomeSection() {
  return (
    <section className="mx-2 my-4 rounded-xl bg-gradient-to-b from-[#16398f] to-[#0a2463] p-6 text-center text-white">
      <h2 className="text-xl font-bold">Welcome To 100CUCI</h2>
      <Link
        href="#register"
        className="mt-4 inline-block rounded-lg bg-[#e63946] px-8 py-3 text-lg font-bold"
      >
        REGISTER NOW
      </Link>
      <p className="mt-3 text-sm">
        Already A Member?{" "}
        <Link href="#login" className="font-semibold underline">
          Log in Here
        </Link>
      </p>
    </section>
  );
}

export function SeoContent() {
  return (
    <section className="mx-2 my-4 rounded-lg bg-white p-4 text-xs leading-relaxed text-[#334155]">
      <h1 className="mb-3 text-base font-bold text-[#16398f]">
        100CUCI | Free Credit No Deposit New Member 2026
      </h1>
      <p className="mb-3">
        100CUCI gives Malaysian players a genuine free credit no deposit path into online casino gaming,
        starting the moment you register. Every offer on this page is backed by the actual bonus terms and
        certifications live on the platform today.
      </p>
      <div className="mb-4 grid grid-cols-2 gap-2 text-center text-[10px]">
        {["RM1 Min Deposit", "15 to 30 min Withdrawal", "24/7 Live Support", "Certified iTech Labs & BMM"].map(
          (item) => (
            <div key={item} className="rounded-lg bg-[#f0f4ff] px-2 py-2 font-semibold text-[#16398f]">
              {item}
            </div>
          ),
        )}
      </div>
      <h2 className="mb-2 text-sm font-bold text-[#16398f]">
        Why 100CUCI Stands Out Among Online Casino Malaysia Platforms
      </h2>
      <p className="mb-3">
        Most online casino Malaysia platforms offer one small entry bonus and stop there. 100CUCI takes a
        different approach. New members get free credit no deposit rewards from the moment they register.
      </p>
      <h2 className="mb-2 text-sm font-bold text-[#16398f]">FAQ</h2>
      <details className="mb-2 rounded-lg border border-[#d0d8f0] p-2">
        <summary className="cursor-pointer font-semibold text-[#16398f]">
          What is free credit no deposit at 100CUCI?
        </summary>
        <p className="mt-2">
          Free credit no deposit is bonus credit given to new members without requiring them to fund their
          account first. At 100CUCI, this starts with the New Register Free RM5.
        </p>
      </details>
      <details className="mb-2 rounded-lg border border-[#d0d8f0] p-2">
        <summary className="cursor-pointer font-semibold text-[#16398f]">
          Is 100CUCI safe and legit for Malaysian players?
        </summary>
        <p className="mt-2">
          Yes. 100CUCI has operated since 2018 under the Syarikat Cuci Group Partnership and holds
          certifications from iTech Labs, BMM Testlabs, and iovation.
        </p>
      </details>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-2 mb-24 rounded-lg bg-[#16398f] p-4 text-center text-[10px] text-white">
      <p className="mb-2 font-bold">2026 100CUCI. All Rights Reserved</p>
      <div className="flex flex-wrap justify-center gap-2">
        {["711CUCI", "12CUCI", "365CUCI", "88CUCI", "SITI88", "PELUANG88"].map((link) => (
          <Link key={link} href="#" className="underline">
            {link}
          </Link>
        ))}
      </div>
    </footer>
  );
}
