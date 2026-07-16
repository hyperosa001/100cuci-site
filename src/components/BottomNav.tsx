"use client";

import Link from "next/link";
import { bottomNavItems } from "@/lib/site-data";

const iconMap: Record<string, string> = {
  home: "🏠",
  access_time: "🕐",
  redeem: "🎁",
  question_answer: "💬",
  settings: "⚙️",
};

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#d0d8f0] bg-white">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-around">
        {bottomNavItems.map((item, i) => (
          <Link
            key={item.label}
            href="#"
            className={`relative flex flex-1 flex-col items-center justify-center py-2 text-[10px] font-medium ${
              i === 0 ? "text-[#e63946]" : "text-[#64748b]"
            }`}
          >
            <span className="text-lg">{iconMap[item.icon]}</span>
            <span>{item.label}</span>
            {item.badge !== null && (
              <span className="absolute right-3 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e63946] text-[9px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
