import Image from "next/image";

export function AppBanner() {
  return (
    <div className="w-full overflow-hidden">
      <Image
        src="/images/app-banner.gif"
        alt="100CUCI App Download"
        width={754}
        height={143}
        className="h-auto w-full"
        priority
        unoptimized
      />
    </div>
  );
}
