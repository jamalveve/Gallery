
const links = [
  { icon: "♡", label: "Our Love Story", href: "#story" },
  { icon: "▧", label: "Beautiful Gallery", href: "#gallery" },
  { icon: "✉", label: "Love Notes", href: "#notes" },
  { icon: "◷", label: "Special Countdown", href: "#countdown" },
  { icon: "♫", label: "Our Favourite Music", href: "#song" },
];

export default function QuickLinks() {
  return (
    <section className="quick-links">
      {links.map((link) => (
        <a href={link.href} key={link.label}>
          <span>{link.icon}</span>
          {link.label}
        </a>
      ))}
    </section>
  );
}
