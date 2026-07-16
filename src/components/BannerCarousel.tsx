"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { carouselBanners } from "@/lib/site-data";

export function BannerCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % carouselBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div className="relative aspect-[271/153] w-full">
        {carouselBanners.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`Banner ${i + 1}`}
            fill
            className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
            sizes="100vw"
          />
        ))}
      </div>
      <div className="flex justify-center gap-1 py-2">
        {carouselBanners.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 w-2 rounded-full ${i === active ? "bg-[#e63946]" : "bg-gray-300"}`}
          />
        ))}
      </div>
      <Image
        src="/images/static-banner.png"
        alt="Promotional banner"
        width={1358}
        height={168}
        className="h-auto w-full"
      />
    </div>
  );
}
