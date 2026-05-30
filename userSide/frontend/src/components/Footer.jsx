const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Track Order", href: "#track" },
];

const socials = [
  { name: "Instagram", href: "#", icon: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM12 9a3 3 0 110 6 3 3 0 010-6z" },
  { name: "Facebook", href: "#", icon: "M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" },
  { name: "Twitter", href: "#", icon: "M20 6.7c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1A4 4 0 0010 10.5c0 .3 0 .7.1 1A11.3 11.3 0 013 5.4a4 4 0 001.2 5.4 4 4 0 01-1.8-.5v.1a4 4 0 003.2 3.9 4 4 0 01-1.8.1 4 4 0 003.7 2.8A8 8 0 012 18.6 11.5 11.5 0 008.3 20c7.5 0 11.6-6.2 11.6-11.6v-.5c.8-.6 1.5-1.3 2.1-2.1z" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-display text-2xl font-semibold text-white">The Butter Bowl</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/80">
            Homestyle North Indian meals, cooked with ghee and love — delivered fresh across the city.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Quick Links</h4>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-cream/80 transition hover:text-gold">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>📍 42 Kitchen Lane, Indiranagar, Bengaluru</li>
            <li>
              <a href="tel:+919876543210" className="hover:text-gold">
                📞 +91 98765 43210
              </a>
            </li>
            <li>
              <a href="mailto:hello@thebutterbowl.com" className="hover:text-gold">
                ✉️ hello@thebutterbowl.com
              </a>
            </li>
            <li>🕐 Open daily: 11 AM – 11 PM</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Follow Us</h4>
          <div className="mt-4 flex gap-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream transition hover:border-gold hover:bg-gold hover:text-dark"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} The Butter Bowl. All rights reserved.
      </div>
    </footer>
  );
}
