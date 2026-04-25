import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "family", label: "Family" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <button
          onClick={() => go("home")}
          className="font-display text-lg font-bold tracking-tight"
        >
          <span className="text-gradient">Bikkey</span>
          <span className="text-muted-foreground">.dev</span>
        </button>

        <nav className="hidden items-center gap-1 glass rounded-full px-2 py-1 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="glass flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 glass rounded-2xl p-3 md:hidden">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="block w-full rounded-xl px-4 py-2 text-left text-sm hover:bg-primary/10"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
