import { about, personal } from '../data/portfolio'
import { AudioControl } from './AudioControl'
import { Reveal } from './Reveal'

export function AboutSection() {
  return (
    <section className="about-section paper-section" id="about" aria-labelledby="about-title">
      <div className="section-shell about-grid">
        <Reveal className="about-heading">
          <p className="eyebrow dark">01 / Recognition</p>
          <h2 id="about-title">A builder behind <em>the systems.</em></h2>
        </Reveal>
        <Reveal className="portrait-frame" delay={0.08}>
          <figure className="portrait-card" tabIndex={0} aria-label="Kottu Saikumar portrait card">
            <div className="portrait-backdrop" aria-hidden="true">
              <img src="images/about/about-portrait-back.webp" alt="" width="1000" height="1414" loading="lazy" />
            </div>
            <img className="portrait-cutout" src="images/about/about-portrait-cutout.png" alt="Portrait of Kottu Saikumar" width="964" height="1600" loading="lazy" />
            <figcaption className="portrait-caption">
              <strong>{personal.name}</strong>
              <span>{personal.role} / {personal.location}</span>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="about-copy" delay={0.14}>
          {about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="about-links">
            <AudioControl />
            <a className="text-link" href={personal.resume} target="_blank" rel="noreferrer">Read resume <span aria-hidden="true">↗</span></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
