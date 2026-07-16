import Link from "next/link";
import { sportsMatches } from "@/lib/site-data";

export function AccountPanel() {
  return (
    <section className="mx-2 my-2 rounded-lg border border-[#d0d8f0] bg-white p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-[#022f8a]">
        <span className="font-bold">VIP RANK VIP1</span>
        <span>RM0 / RM3888</span>
      </div>
      <div className="mb-3 text-center">
        <p className="text-xs text-[#64748b]">Balance :</p>
        <p className="text-2xl font-bold text-[#16398f]">RM0.00</p>
        <p className="text-[10px] text-[#64748b]">Minimum Deposit: RM1.00</p>
        <p className="text-[10px] text-[#64748b]">Minimum Withdrawal: RM25.00</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Deposit", "Withdraw", "Refresh"].map((action) => (
          <Link
            key={action}
            href="#"
            className="rounded-lg bg-[#16398f] py-2.5 text-center text-xs font-bold text-white"
          >
            {action}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SportsSection() {
  return (
    <section className="mx-2 my-2 rounded-lg border border-[#d0d8f0] bg-white p-3">
      <h3 className="mb-2 text-center text-sm font-bold text-[#16398f]">UPCOMING SPORTS</h3>
      {sportsMatches.map((match) => (
        <div key={`${match.home}-${match.away}`} className="mb-2 rounded-lg bg-[#f0f4ff] p-2 text-center text-xs text-[#022f8a]">
          <p className="font-semibold">{match.league}</p>
          <p className="my-1 text-sm font-bold">
            {match.home} vs {match.away}
          </p>
          <p className="text-[#64748b]">{match.time}</p>
        </div>
      ))}
    </section>
  );
}
