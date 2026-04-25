import { Heart, Briefcase, Home } from "lucide-react";
import { Reveal } from "../Reveal";

const family = [
  {
    icon: Briefcase,
    role: "Father",
    name: "Dhrampal Chaudhary",
    detail: "Accountant — the calm strength who taught me discipline.",
  },
  {
    icon: Home,
    role: "Mother",
    name: "Sangita Kumari Chaudhary",
    detail: "Housewife — the heart of our home and my biggest support.",
  },
];

export function Family() {
  return (
    <section id="family" className="relative py-28">
      <div className="mx-auto max-w-5xl px-4">
        <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Family
          </p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            The people who <span className="text-gradient">made me</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {family.map((p, i) => (
            <Reveal key={p.role} delay={i * 0.1}>
              <div className="glass glow-on-hover group relative overflow-hidden rounded-3xl p-8">
                <div
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                  style={{ background: "var(--gradient-hero)" }}
                />
                <div className="relative">
                  <div
                    className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground shadow-glow"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <p.icon className="h-6 w-6" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {p.role}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{p.name}</h3>
                  <p className="mt-3 text-muted-foreground">{p.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-destructive" />
            With endless gratitude.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
