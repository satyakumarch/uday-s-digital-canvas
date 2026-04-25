import { motion } from "framer-motion";
import { School, Trophy, UserCog, Users } from "lucide-react";
import { Reveal } from "../Reveal";

const milestones = [
  {
    icon: School,
    title: "Shree Janchetna Community Secondary School",
    sub: "Currently studying — Class 10, Technical Stream",
    detail: "Shivraj-8, Kapilvastu, Nepal",
  },
  {
    icon: Trophy,
    title: "Class 8 Result",
    sub: "GPA 3.53",
    detail: "Strong foundation in core subjects",
  },
  {
    icon: UserCog,
    title: "Principal — Dewanand Nau",
    sub: "Leadership at Janchetna",
    detail: "Guiding students with vision and discipline",
  },
  {
    icon: Users,
    title: "Vice Principal — Bishnu Bishwakarma",
    sub: "Academic mentor",
    detail: "Supporting day-to-day learning experience",
  },
];

export function Education() {
  return (
    <section id="education" className="relative py-28">
      <div className="mx-auto max-w-5xl px-4">
        <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Education
          </p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            My academic <span className="text-gradient">journey</span>
          </h2>
        </Reveal>

        <div className="relative mt-14">
          {/* center line */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/0 via-primary/60 to-accent/0 md:left-1/2" />

          <div className="space-y-10">
            {milestones.map((m, i) => {
              const right = i % 2 === 1;
              return (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: right ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative grid grid-cols-[2rem_1fr] items-start gap-4 md:grid-cols-2 md:gap-12 ${
                    right ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* dot */}
                  <div className="relative md:hidden">
                    <div
                      className="absolute left-2.5 top-2 h-3 w-3 rounded-full ring-4 ring-background"
                      style={{ background: "var(--gradient-hero)" }}
                    />
                  </div>

                  <div className={`hidden md:block ${right ? "" : "md:text-right"}`}>
                    <Card m={m} alignRight={!right} />
                  </div>
                  <div className="hidden md:block">
                    <div className="relative h-full">
                      <div
                        className="absolute -left-[6px] top-3 h-3 w-3 rounded-full ring-4 ring-background md:left-1/2 md:-translate-x-1/2"
                        style={{ background: "var(--gradient-hero)" }}
                      />
                    </div>
                  </div>

                  <div className="md:hidden">
                    <Card m={m} alignRight={false} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  m,
  alignRight,
}: {
  m: { icon: React.ComponentType<{ className?: string }>; title: string; sub: string; detail: string };
  alignRight: boolean;
}) {
  const Icon = m.icon;
  return (
    <div className={`glass glow-on-hover rounded-2xl p-6 ${alignRight ? "md:ml-auto" : ""}`}>
      <div className={`flex items-center gap-3 ${alignRight ? "md:flex-row-reverse" : ""}`}>
        <div
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-semibold">{m.title}</h3>
      </div>
      <p className="mt-2 text-sm font-medium text-gradient">{m.sub}</p>
      <p className="mt-1 text-sm text-muted-foreground">{m.detail}</p>
    </div>
  );
}
