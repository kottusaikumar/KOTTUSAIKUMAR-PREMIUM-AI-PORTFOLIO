import { process } from '../data/portfolio'
import { KineticGrid } from './KineticGrid'
import { Reveal } from './Reveal'

export function ProcessSection() {
  return (
    <section className="process-section paper-section" id="process" aria-labelledby="process-title">
      <KineticGrid />
      <div className="section-shell">
        <Reveal className="wide-heading">
          <p className="eyebrow dark">05 / Method</p>
          <h2 id="process-title">From ambiguity <em>to shipped work.</em></h2>
        </Reveal>
        <div className="process-grid">
          {process.map((step) => (
            <Reveal className="process-step" key={step.number}>
              <span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
