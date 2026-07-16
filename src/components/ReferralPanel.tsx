import Image from "next/image";
import Link from "next/link";

export function ReferralPanel() {
  const buttons = [
    { label: "Share", variant: "primary" },
    { label: "Downline", variant: "danger" },
    { label: "Copy Referral Link", variant: "warning" },
    { label: "Free Bot", variant: "more" },
  ] as const;

  const variantClass = {
    primary: "bg-[#16398f] text-white",
    danger: "bg-[#dc2626] text-white",
    warning: "bg-[#f59e0b] text-white",
    more: "bg-[#6366f1] text-white",
  };

  return (
    <section className="mx-2 my-2">
      <Image
        src="/images/rebate-banner.webp"
        alt="2 Days Rebate 6%"
        width={507}
        height={239}
        className="mb-2 h-auto w-full rounded-lg"
      />
      <div className="grid grid-cols-2 gap-2">
        {buttons.map((btn) => (
          <Link
            key={btn.label}
            href="#"
            className={`rounded-lg px-3 py-3 text-center text-xs font-bold ${variantClass[btn.variant]}`}
          >
            {btn.label}
          </Link>
        ))}
      </div>
      <div className="mt-2 rounded-lg border border-[#d0d8f0] bg-white p-3 text-center text-xs text-[#022f8a]">
        <p className="font-bold">10% WEEKLY COMMISSION</p>
        <p className="mt-1 text-[10px]">Every RM10 deposit can get a lucky number.</p>
        <p className="text-[10px]">Results release every Monday Tuesday Wednesday Thursday Friday Saturday Sunday</p>
        <p className="mt-1 font-semibold text-[#e63946]">Maximum Withdrawal: RM888</p>
      </div>
    </section>
  );
}
