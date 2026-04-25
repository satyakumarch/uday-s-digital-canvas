export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} <span className="text-gradient font-semibold">Bikkey Chaudhary</span>. All rights reserved.
        </p>
        <p className="text-xs">Crafted with care · Kapilvastu, Nepal</p>
      </div>
    </footer>
  );
}
