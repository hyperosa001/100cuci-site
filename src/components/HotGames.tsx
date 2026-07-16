"use client";

import Image from "next/image";
import { useRef } from "react";
import { hotGames } from "@/lib/site-data";

export function HotGames() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="mx-2 my-2">
      <div className="mb-2 flex h-10 items-center gap-2 px-2">
        <Image src="/images/hot-icon.webp" alt="Hot" width={40} height={40} className="h-10 w-10" />
        <h2 className="text-sm font-bold tracking-[0.3em] text-[#c1000b]">H O T G A M E S</h2>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {hotGames.map((src, i) => (
          <div key={src} className="relative h-[115px] w-[98px] shrink-0">
            <Image
              src={src}
              alt={`Hot game ${i + 1}`}
              fill
              className="rounded-md object-cover"
              sizes="98px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
