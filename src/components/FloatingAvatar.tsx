import { useEffect, useRef, useState } from "react";
import bikkey1 from "@/assets/bikkey-1.png";
import bikkey2 from "@/assets/bikkey-2.png";
import bikkey3 from "@/assets/bikkey-3.png";

const photos = [bikkey1, bikkey2, bikkey3];

// 3D-tilt floating avatar with rotating photo carousel and orbiting glow rings.
export function FloatingAvatar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((n) => (n + 1) % photos.length), 3500);
    return () => clearInterval(t);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 14}deg`);
    el.style.setProperty("--ry", `${x * 14}deg`);
  };
  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto h-[320px] w-[320px] sm:h-[400px] sm:w-[400px]"
      style={{ perspective: "1000px" }}
    >
      {/* orbiting rings */}
      <div className="absolute inset-0 animate-spin-slow rounded-full border border-primary/30" />
      <div
        className="absolute inset-4 rounded-full border border-accent/30"
        style={{ animation: "spin 24s linear infinite reverse" }}
      />
      <div className="absolute -inset-6 rounded-full bg-[var(--gradient-radial)] blur-2xl" />

      {/* tilting photo card */}
      <div
        className="relative h-full w-full overflow-hidden rounded-full shadow-glow"
        style={{
          transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))",
          transition: "transform 0.2s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {photos.map((p, i) => (
          <img
            key={i}
            src={p}
            alt="Bikkey Chaudhary portrait"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* floating dots */}
      <div className="pointer-events-none absolute -right-4 top-10 h-3 w-3 animate-float rounded-full bg-accent shadow-glow-cyan" />
      <div
        className="pointer-events-none absolute -left-2 bottom-16 h-2 w-2 rounded-full bg-primary shadow-glow"
        style={{ animation: "float 5s ease-in-out infinite 1s" }}
      />
    </div>
  );
}
