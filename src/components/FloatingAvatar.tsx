import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bikkey1 from "@/assets/bikkey-1.png";
import bikkey2 from "@/assets/bikkey-2.png";
import bikkey3 from "@/assets/bikkey-3.png";

const photos: string[] = [bikkey1, bikkey2, bikkey3];

/**
 * Lightweight circular avatar with auto-cycling photos and click-to-change.
 * Replaces the previous heavy three.js scene to keep the build well under
 * Render's 512Mi memory limit.
 */
export function FloatingAvatar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % photos.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  const next = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <div className="relative mx-auto h-[360px] w-[360px] sm:h-[440px] sm:w-[440px]">
      {/* Soft radial glow behind the photo */}
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-[var(--gradient-radial)] blur-3xl" />

      {/* Animated gradient ring */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #7c5cff, #22d3ee, #7c5cff, #22d3ee, #7c5cff)",
          padding: 4,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-full w-full rounded-full bg-background" />
      </motion.div>

      {/* Circular photo carousel */}
      <button
        type="button"
        onClick={next}
        aria-label="Show next photo"
        className="absolute inset-2 overflow-hidden rounded-full shadow-2xl ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={photos[index]}
            alt="Uday Bhan Chaudhary portrait"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />
        </AnimatePresence>
      </button>

      {/* Photo indicator dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show photo ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-6 bg-primary"
                : "w-2 bg-foreground/30 hover:bg-foreground/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
