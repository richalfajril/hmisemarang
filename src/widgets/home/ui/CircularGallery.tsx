"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string; // presentation-ready URL ("" → placeholder)
}

interface CircularGalleryProps {
  albums: GalleryAlbum[];
  /** Tujuan klik semua album. */
  href?: string;
  radius?: number;
  autoRotateSpeed?: number;
  className?: string;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 380;

export function CircularGallery({
  albums,
  href = "/galeri",
  radius = 560,
  autoRotateSpeed = 0.035,
  className,
}: CircularGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  // Ukuran kartu mengecil di layar sempit; radius dihitung agar kartu tidak
  // saling tumpuk (kartu depan tetap center, sisi berputar ke belakang).
  const [cw, setCw] = useState(CARD_WIDTH);
  const [ch, setCh] = useState(CARD_HEIGHT);
  const [r, setR] = useState(radius);

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const drag = useRef({ active: false, startX: 0, startRot: 0, moved: false });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const cardW = Math.min(CARD_WIDTH, Math.max(200, vw - 72));
      const cardH = Math.round(cardW * 1.32);
      // radius minimal agar tepi kartu tidak bertabrakan
      const needed =
        cardW / 2 / Math.tan(Math.PI / Math.max(albums.length, 2)) + 28;
      setCw(cardW);
      setCh(cardH);
      setR(Math.max(needed, radius * (cardW / CARD_WIDTH)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [radius, albums.length]);

  // Rotasi mengikuti scroll halaman
  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setRotation(progress * 360);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Auto-rotate (melambat saat hover, berhenti saat scroll/drag)
  useEffect(() => {
    const tick = () => {
      if (!isScrolling && !dragging) {
        const speed = hovered ? autoRotateSpeed * 0.15 : autoRotateSpeed;
        setRotation((prev) => prev + speed);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isScrolling, hovered, dragging, autoRotateSpeed]);

  // Drag horizontal manual (mouse + touch) untuk memutar
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = {
      active: true,
      startX: e.clientX,
      startRot: rotation,
      moved: false,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    setRotation(drag.current.startRot + dx * 0.3); // 0.3° per px
  };
  const endDrag = () => {
    drag.current.active = false;
    setDragging(false);
  };

  if (albums.length === 0) return null;
  const anglePerAlbum = 360 / albums.length;

  return (
    <div
      role="region"
      aria-label="Galeri kegiatan"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative flex h-full w-full cursor-grab items-center justify-center touch-pan-y active:cursor-grabbing ${className ?? ""}`}
      style={{ perspective: "2000px" }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {albums.map((album, index) => {
          const angle = index * anglePerAlbum;
          const relativeAngle = (angle + (rotation % 360) + 360) % 360;
          const normalizedAngle = Math.abs(
            relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
          );
          const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

          return (
            <Link
              key={album.id}
              href={href}
              aria-label={album.title}
              onClick={(e) => {
                if (drag.current.moved) e.preventDefault();
              }}
              className="absolute rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
              style={{
                width: cw,
                height: ch,
                left: "50%",
                top: "50%",
                marginLeft: -(cw / 2),
                marginTop: -(ch / 2),
                opacity,
                transform: `rotateY(${angle}deg) translateZ(${r}px)`,
                transition: "opacity .3s linear",
              }}
            >
              <div className="group relative h-full w-full overflow-hidden rounded-2xl border bg-emerald-950 shadow-2xl">
                {album.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={album.coverImageUrl}
                    alt={album.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-950" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-5">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {album.title}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
