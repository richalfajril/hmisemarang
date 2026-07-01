"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** Hero background image with a subtle scroll parallax. */
export function HeroBackground({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translate3d(0, ${
            window.scrollY * 0.3
          }px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        ref={ref}
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
      >
        <Image
          src={src}
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
