import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { education, experience, projects } from '../data/portfolio'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Reveal } from './Reveal'

gsap.registerPlugin(ScrollTrigger)

const experienceChapters = [
  {
    number: '02',
    title: 'Food Spoilage AI Assistant',
    summary: 'A full-stack computer-vision and NLP application built for real-time food analysis and conversational support.',
    metrics: [
      { value: '94%', label: 'classification accuracy' },
      { value: '5,000+', label: 'food images' },
      { value: '1,000+', label: 'Q&A pairs' },
    ],
    points: [
      'Combined two independent AI paths: a VGG19 food-image classifier and an encoder-decoder LSTM for customer-service conversations.',
      'Loaded the CNN, NLP architecture, learned weights, and both tokenizers once at server startup, with graceful fallbacks when an artifact is unavailable.',
      'Preprocessed uploaded images with OpenCV by resizing them to 224 × 224, normalizing pixel values, and applying a 0.5 binary decision threshold.',
      'Reconstructed dedicated encoder and decoder inference models with a 256-unit latent state for token-by-token response generation.',
      'Cleaned user text, removed punctuation and digits, tokenized it, padded sequences to a fixed length, and stopped decoding on the end token.',
      'Exposed separate Flask endpoints for chat, image classification, and model-health reporting, with CORS enabled for the React client.',
      'Built the React chat flow with image previews, loading messages, multipart uploads, response-state updates, and connection-error handling.',
      'Removed temporary uploads after inference and translated the classifier result into an immediate fresh/spoiled assessment and refund recommendation.',
    ],
    href: projects.find((project) => project.id === 'food-spoilage')?.github,
  },
  {
    number: '01',
    title: 'Drug Effectiveness ML Pipeline',
    summary: 'An end-to-end predictive analytics workflow covering data preparation, model comparison, validation, and reporting.',
    metrics: [
      { value: '0.81', label: 'R² score' },
      { value: '0.38', label: 'RMSE' },
      { value: '10,000+', label: 'drug records' },
    ],
    points: [
      'Explored 10,000+ drug-review records containing condition, drug, ease of use, effectiveness, form, indication, price, reviews, satisfaction, and prescription type.',
      'Created effectiveness bands from the numeric score and examined distributions, category counts, box plots, and feature correlations.',
      'Compared mean, median, mode, and random-sample imputation strategies for missing numerical values before selecting usable feature variants.',
      'Filled missing categorical values with mode-based defaults or an explicit “Unknown Drug” category and standardized numerical features.',
      'Prepared the effectiveness score as the regression target and used a reproducible 80/20 train-test split with random state 42.',
      'Benchmarked nine regressors: linear, polynomial, Lasso, Ridge, Random Forest, SVR, XGBoost, KNN, and Decision Tree.',
      'Measured train/test RMSE and R², added three-fold cross-validation, and classified each model as underfit, good fit, overfit, or no fit.',
      'Ran 324 Random Forest and 324 XGBoost grid-search fits plus 108 Decision Tree fits to tune depth, estimators, sampling, and regularization controls.',
      'Reached test R² 0.81 and RMSE 0.38 with tuned ensemble models; the final tuned XGBoost regressor was serialized for reuse.',
    ],
    href: 'https://github.com/kottusaikumar/Drug-Effectiveness-predictor-Using-Machine-Learning',
  },
] as const

export function ExperienceTimeline() {
  const primaryExperience = experience[0]
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sequenceRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const sequence = sequenceRef.current
    if (!section || !stage || !sequence || reducedMotion) return

    const media = gsap.matchMedia()
    media.add('(min-width: 1101px) and (min-height: 700px)', () => {
      const projectFrame = sequence.querySelector<HTMLElement>('.experience-project-frame')
      const projectSlides = gsap.utils.toArray<HTMLElement>('.experience-project-slide', sequence)
      const steps = gsap.utils.toArray<HTMLElement>('.experience-sequence-step', stage)
      if (!projectFrame || projectSlides.length !== 2) return

      sequence.classList.add('is-animated')
      gsap.killTweensOf(projectFrame)
      gsap.set(projectFrame, { yPercent: 0, zIndex: 1, opacity: 1 })
      gsap.set(projectSlides, { yPercent: 100, zIndex: (index) => index + 1 })
      gsap.set(projectSlides[0], { yPercent: 0 })

      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      timeline
        .to({}, { duration: 0.3 })
        .addLabel('project-two')
        .to(projectSlides[0], { yPercent: -100, duration: 1.2 })
        .to(projectSlides[1], { yPercent: 0, duration: 1.2 }, '<')
        .to({}, { duration: 0.9 })

      const setActiveStep = (activeIndex: number) => {
        steps.forEach((step, index) => step.classList.toggle('active', index === activeIndex))
      }

      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: 'top 7%',
        end: () => `+=${Math.round(window.innerHeight * 2.8)}`,
        pin: stage,
        animation: timeline,
        scrub: 0.1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => setActiveStep(progress < 0.45 ? 0 : 1),
      })

      setActiveStep(0)
      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        trigger.kill()
        timeline.kill()
        sequence.classList.remove('is-animated')
        gsap.set(projectFrame, { clearProps: 'transform,zIndex,opacity' })
        gsap.set(projectSlides, { clearProps: 'transform,zIndex' })
      }
    })

    return () => media.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className="experience-section paper-section" id="experience" aria-labelledby="experience-title">
      <div className="section-shell experience-layout">
        <header className="experience-heading">
          <p className="eyebrow dark">03 / Experience</p>
          <h2 id="experience-title">Experience, <em>made verifiable.</em></h2>
          <p className="experience-heading-note">Two applied AI engagements. One continuous journey from model experimentation to usable systems.</p>
        </header>

        <div className="experience-story">
          <div ref={stageRef} className="career-dossier experience-stage">
            <header className="experience-company-header">
              <div className="experience-company-identity">
                <img src={primaryExperience.logo} alt="Vajra.ai logo" width="64" height="64" loading="lazy" />
                <div>
                  <span className="verification-label">Applied AI internship</span>
                  <h3>{primaryExperience.role}</h3>
                  <p>{primaryExperience.company}</p>
                </div>
              </div>
              <time>Aug 2024 — Feb 2025</time>
            </header>

            <p className="experience-company-summary">
              Six months building measurable machine-learning systems across computer vision, NLP, predictive analytics, and full-stack delivery.
            </p>

            <div ref={sequenceRef} className="experience-sequence">
              <div className="experience-sequence-panel experience-project-frame">
                {experience.map((entry, index) => {
                  const chapter = experienceChapters[index]
                  return (
                  <article className="experience-project experience-project-slide" key={entry.period}>
                    <div className="experience-project-marker" aria-hidden="true"><span>{chapter.number}</span></div>
                    <div className="experience-project-body">
                      <div className="experience-project-meta">
                        <span>Project chapter {chapter.number}</span>
                        <time>{entry.period}</time>
                      </div>
                      <h4>{chapter.title}</h4>
                      <p className="experience-project-summary">{chapter.summary}</p>

                      <ul className="experience-metrics" aria-label={`${chapter.title} verified results`}>
                        {chapter.metrics.map((metric) => (
                          <li key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></li>
                        ))}
                      </ul>

                      <div className="experience-details">
                        <div className="experience-details-heading">
                          <h5>Implementation details</h5>
                          <span>Scroll to explore</span>
                        </div>
                        <ul className="experience-contributions" tabIndex={0} aria-label={`${chapter.title} implementation details`}>
                          {chapter.points.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </div>

                      <div className="experience-project-footer">
                        <div className="tag-list" aria-label="Technologies">
                          {entry.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                        </div>
                        {chapter.href && (
                          <a href={chapter.href} target="_blank" rel="noreferrer">
                            View related project <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                  )
                })}
              </div>

            </div>

            <div className="experience-sequence-progress" aria-hidden="true">
              {['Project 1', 'Project 2'].map((label, index) => (
                <span className={`experience-sequence-step${index === 0 ? ' active' : ''}`} key={label}>
                  <i />{label}
                </span>
              ))}
            </div>
          </div>

          <Reveal className="education-note experience-education">
            <div className="education-heading-row">
              <span className="verification-label">Education</span>
              <p>Academic foundation</p>
            </div>
            <div className="education-list">
              {education.map((entry) => (
                <article className="education-entry" key={entry.institution}>
                  <div className="education-title-row">
                    <h3>{entry.institution}</h3>
                    <time>{entry.period}</time>
                  </div>
                  <p>{entry.degree}</p>
                  <div className="education-meta">
                    <strong>{entry.result}</strong>
                    {entry.location && <span>{entry.location}</span>}
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
