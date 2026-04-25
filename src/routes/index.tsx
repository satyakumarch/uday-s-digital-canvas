import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Particles } from "@/components/Particles";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Family } from "@/components/sections/Family";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bikkey Chaudhary — Class 10 Technical Student | Portfolio" },
      {
        name: "description",
        content:
          "Personal portfolio of Uday Bhan (Bikkey) Chaudhary — Class 10 technical-stream student from Kapilvastu, Nepal. Aspiring developer.",
      },
      { property: "og:title", content: "Bikkey Chaudhary — Personal Portfolio" },
      {
        property: "og:description",
        content:
          "Class 10 technical-stream student from Kapilvastu, Nepal. Aspiring developer and lifelong learner.",
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <Particles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Family />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
