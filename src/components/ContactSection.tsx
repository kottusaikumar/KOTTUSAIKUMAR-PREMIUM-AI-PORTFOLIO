import { siGithub, siGoogledrive, siX, type SimpleIcon } from 'simple-icons'
import { personal, socialLinks } from '../data/portfolio'
import { Reveal } from './Reveal'

const footerIcons: Record<string, SimpleIcon> = {
  GitHub: siGithub,
  X: siX,
  Resume: siGoogledrive,
}

function FooterIcon({ label }: { label: string }) {
  if (label === 'LinkedIn') {
    return (
      <svg className="footer-social-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ color: '#0A66C2' }}>
        <rect x="2" y="2" width="20" height="20" rx="2.8" fill="currentColor" />
        <circle cx="7.1" cy="8" r="1.45" fill="#f4f0e5" />
        <path fill="#f4f0e5" d="M5.8 10.4h2.6v7.8H5.8zm4.4 0h2.5v1.07c.75-.91 1.7-1.37 2.87-1.37 2.1 0 3.43 1.38 3.43 4.05v4.05h-2.65v-3.78c0-1.2-.43-2.02-1.57-2.02-1.23 0-1.93.83-1.93 2.36v3.44H10.2z" />
      </svg>
    )
  }

  const icon = footerIcons[label]
  if (!icon) return null

  return (
    <svg
      className="footer-social-icon-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ color: `#${icon.hex}` }}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  )
}

interface ContactSectionProps {
  onOpenAssistant: () => void
}

export function ContactSection({ onOpenAssistant }: ContactSectionProps) {
  const footerLinks = [...socialLinks, { label: 'Resume', href: personal.resume }]

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-grid" aria-hidden="true" />
      <div className="section-shell contact-content">
        <Reveal>
          <p className="eyebrow">07 / Invitation</p>
          <h2 id="contact-title">Build something <em>worth verifying.</em></h2>
          <p className="contact-note">For AI/ML engineering, data science, analytics, or full-stack AI opportunities.</p>
          <div className="contact-actions">
            <button className="contact-assistant-button" type="button" onClick={onOpenAssistant}><span>Ask my portfolio</span><b aria-hidden="true">↗</b></button>
            <a className="contact-email" href={`mailto:${personal.email}`}>{personal.email}</a>
          </div>
        </Reveal>
        <footer className="site-footer">
          <div>
            {footerLinks.map((link) => (
              <a className="footer-social-link" href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                <span className="footer-social-icon" aria-hidden="true"><FooterIcon label={link.label} /></span>
                <span>{link.label}</span>
                <span className="footer-social-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <p>© 2026 Kottu Saikumar <span>/</span> {personal.location}</p>
          <a href="#main-content">Back to top <span aria-hidden="true">↑</span></a>
        </footer>
      </div>
    </section>
  )
}
