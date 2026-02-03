const links = [
  { href: "mailto:ajay192006@gmail.com", label: "ajay192006@gmail.com" },
  { href: "https://github.com/Ajaysvasan", label: "GitHub", external: true },
  {
    href: "https://linkedin.com/in/ajay-s-vasan-584111291",
    label: "LinkedIn",
    external: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 sm:py-32 scroll-mt-20 bg-anime-surface/30"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-anime-text mb-4 font-anime">
          Get in touch
        </h2>
        <p className="text-anime-text-dim mb-10">
          Have a project in mind or want to connect?
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {links.map(({ href, label, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-anime-lavender font-medium hover:text-anime-pink transition-colors underline underline-offset-4"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
