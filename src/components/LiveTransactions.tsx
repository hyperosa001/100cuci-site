import { liveTransactions } from "@/lib/site-data";

export function LiveTransactions() {
  return (
    <section className="mx-2 my-2 overflow-hidden rounded-lg border border-[#d0d8f0] bg-white">
      <div className="bg-[#16398f] px-3 py-2 text-center text-sm font-bold text-white">
        LIVE TRANSACTION <span className="ml-1 animate-pulse text-[#4ade80]">LIVE</span>
      </div>
      <table className="w-full text-[11px] text-[#022f8a]">
        <thead>
          <tr className="border-b border-[#d0d8f0] bg-[#f0f4ff]">
            <th className="px-2 py-1.5 text-left font-semibold text-[#16a34a]">DEPOSIT</th>
            <th className="px-2 py-1.5 text-left font-semibold text-[#dc2626]">WITHDRAW</th>
            <th className="px-2 py-1.5 text-right font-semibold">PROVIDER</th>
          </tr>
        </thead>
        <tbody>
          {liveTransactions.map((tx) => (
            <tr key={`${tx.depositUser}-${tx.withdrawUser}`} className="border-b border-[#eef2ff]">
              <td className="px-2 py-1.5">
                <div className="font-medium">{tx.depositUser}</div>
                <div className="font-bold text-[#16a34a]">{tx.depositAmount}</div>
              </td>
              <td className="px-2 py-1.5">
                <div className="font-medium">{tx.withdrawUser}</div>
                <div className="font-bold text-[#dc2626]">{tx.withdrawAmount}</div>
              </td>
              <td className="px-2 py-1.5 text-right font-semibold">{tx.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
