import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl"
        >
          The Butter Bowl
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-white/90 transition hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="Shopping cart"
            className="relative rounded-full p-2 text-white transition hover:bg-white/10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-dark">
                {cartCount}
              </span>
            )}
          </button>
          <a
            href="#login"
            className="rounded-full border border-gold/80 px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
          >
            Login / Register
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-dark/95 px-4 py-6 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-base font-medium text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="text-sm text-white/80">Cart ({cartCount})</span>
            <a
              href="#login"
              className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-dark"
              onClick={() => setMenuOpen(false)}
            >
              Login / Register
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
