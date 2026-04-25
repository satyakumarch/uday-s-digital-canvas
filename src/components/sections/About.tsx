import { GraduationCap, MapPin, Phone, Mail, User, BookOpen } from "lucide-react";
import { Reveal } from "../Reveal";

const items = [
  { icon: User, label: "Full Name", value: "Uday Bhan Chaudhary (Bikkey)" },
  { icon: BookOpen, label: "Class & Stream", value: "Class 10 · Technical" },
  { icon: GraduationCap, label: "Class 8 GPA", value: "3.53" },
  { icon: MapPin, label: "Address", value: "Shivraj-8, Bilrahawa, Kapilvastu, Nepal" },
  { icon: Phone, label: "Phone", value: "9702742757" },
  { icon: Mail, label: "Email", value: "bikkeychaudhary4@gmail.com" },
];

export function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            About me
          </p>
          <h2 className="max-w-2xl font-display text-4xl font-bold sm:text-5xl">
            A curious student building toward a future in{" "}
            <span className="text-gradient">technology</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            I'm a Class 10 technical-stream student from Kapilvastu, Nepal. I love learning new
            things, exploring how computers work, and dreaming up the apps I want to build one day.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.05}>
              <div className="glass glow-on-hover group h-full rounded-2xl p-6">
                <div
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <it.icon className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {it.label}
                </p>
                <p className="mt-1 break-words font-medium text-foreground">{it.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
