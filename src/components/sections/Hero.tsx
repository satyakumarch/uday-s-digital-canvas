import { motion } from "framer-motion";
import { ArrowDown, Github, Mail } from "lucide-react";
import { FloatingAvatar } from "../FloatingAvatar";
import { Typewriter } from "../Typewriter";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 bg-mesh"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-block glass rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground"
          >
            Hello, I'm
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl"
          >
            Uday Bhan <br />
            <span className="text-gradient">Chaudhary</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 text-base text-muted-foreground sm:text-lg"
          >
            Also known as <span className="text-foreground font-medium">Bikkey Chaudhary</span> — a{" "}
            <Typewriter
              className="text-gradient font-semibold"
              words={[
                "Technical Student",
                "Future Developer",
                "Tech Enthusiast",
                "Curious Learner",
              ]}
            />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="glow-on-hover inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Mail className="h-4 w-4" />
              Get in touch
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="glass glow-on-hover inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium"
            >
              <ArrowDown className="h-4 w-4" />
              About me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-10 flex items-center gap-4 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Class 10 · Technical</span>
            <span className="h-px w-16 bg-border" />
            <span className="text-xs uppercase tracking-widest">Kapilvastu, Nepal</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <FloatingAvatar />
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-current">
          <span className="mt-2 block h-2 w-1 animate-bounce rounded-full bg-current" />
        </div>
      </div>
    </section>
  );
}
