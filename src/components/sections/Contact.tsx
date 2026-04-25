import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, Github, Instagram, Facebook, Linkedin, CheckCircle2 } from "lucide-react";
import { Reveal } from "../Reveal";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

const socials = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fe[String(issue.path[0])] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setSent(true);
    e.currentTarget.reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Contact
          </p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Let's <span className="text-gradient">connect</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-5">
          {/* details */}
          <Reveal className="md:col-span-2" delay={0.1}>
            <div className="glass h-full rounded-3xl p-8">
              <h3 className="font-display text-xl font-semibold">Get in touch</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                I'd love to hear from you. Reach out through any of these channels.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <a
                  href="mailto:bikkeychaudhary4@gmail.com"
                  className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-primary/10"
                >
                  <Mail className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="break-all">bikkeychaudhary4@gmail.com</span>
                </a>
                <a
                  href="tel:9702742757"
                  className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-primary/10"
                >
                  <Phone className="mt-0.5 h-4 w-4 text-primary" />
                  <span>+977 9702742757</span>
                </a>
                <div className="flex items-start gap-3 rounded-xl p-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span>Shivraj-8, Bilrahawa, Kapilvastu, Nepal</span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Follow</p>
                <div className="mt-3 flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="glass glow-on-hover flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:-translate-y-1 hover:rotate-6"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal className="md:col-span-3" delay={0.2}>
            <form onSubmit={onSubmit} className="glass rounded-3xl p-8" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name" name="name" error={errors.name} placeholder="Jane Doe" />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  error={errors.email}
                  placeholder="jane@example.com"
                />
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  maxLength={1000}
                  placeholder="Say hello…"
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition-shadow focus:shadow-glow"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="glow-on-hover mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground"
                style={{ background: "var(--gradient-hero)" }}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Sent!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send message
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        maxLength={200}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition-shadow focus:shadow-glow"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
