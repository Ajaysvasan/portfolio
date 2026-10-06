import PageShell from './PageShell'

const channels = [
  { label: 'Email', handle: 'ajay192006@gmail.com', href: 'mailto:ajay192006@gmail.com' },
  { label: 'GitHub', handle: 'github.com/Ajaysvasan', href: 'https://github.com/Ajaysvasan', external: true },
  { label: 'LinkedIn', handle: 'in/ajay-s-vasan-584111291', href: 'https://linkedin.com/in/ajay-s-vasan-584111291', external: true },
]

export default function Contact() {
  return (
    <PageShell id="contact">
      <p className="reveal max-w-xl text-2xl leading-snug text-ink sm:text-3xl" style={{ '--i': 3 }}>
        Have a project in mind or want to connect?
      </p>
      <a href="mailto:ajay192006@gmail.com" className="contact-mail reveal" style={{ '--i': 4 }}>
        ajay192006@gmail.com
      </a>

      <ul className="mt-20 border-t border-void-line">
        {channels.map(({ label, handle, href, external }, i) => (
          <li key={label} className="reveal border-b border-void-line" style={{ '--i': i + 5 }}>
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="channel"
            >
              <span className="channel__label">{label}</span>
              <span className="channel__handle">{handle}</span>
              <span className="channel__go" aria-hidden>
                {external ? '↗' : '→'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
