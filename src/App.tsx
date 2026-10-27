import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from 'react'
import { projects, skills } from './data/portfolio'
import './App.css'

const currentYear = new Date().getFullYear()
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`
const resumeUrl = assetUrl('files/resume.pdf')
const contactFormEndpoint = 'https://formspree.io/f/mjyyyljg'
const roles = [
  'A Backend Developer',
  'A Software Engineer',
  'An Aspiring IT',
  'A Data Analyst',
  'A Problem Solver',
  'A Troubleshooter',
]
const scheduleScreenshots = [
  { src: assetUrl('projects/sched1.png'), alt: 'Schedule Table View' },
  { src: assetUrl('projects/sched2.png'), alt: 'Class Schedule Dashboard' },
  { src: assetUrl('projects/sched3.png'), alt: 'Schedule Generation and Results View' },
]
const discordBotScreenshots = [
  { src: assetUrl('projects/discordbot_logo&banner.png'), alt: "Caoili's Chatbot logo and Discord profile banner" },
  { src: assetUrl('projects/discordbot1.png'), alt: 'Discord chatbot answering a math question and providing Python code' },
  { src: assetUrl('projects/discordbot2.png'), alt: 'Discord chatbot generating a C++ rock-paper-scissors example' },
  { src: assetUrl('projects/discordbot3.png'), alt: 'Discord chatbot responding to a creative writing prompt' },
]

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" />
    </svg>
  )
}

function App() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [isLightMode, setIsLightMode] = useState(false)
  const [contactSubmissionStatus, setContactSubmissionStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [phoneCopyStatus, setPhoneCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [scheduleScreenshotIndex, setScheduleScreenshotIndex] = useState(0)
  const [discordBotScreenshotIndex, setDiscordBotScreenshotIndex] = useState(0)
  const [activePhotoProject, setActivePhotoProject] = useState<'schedule' | 'discord' | null>(null)
  const [isResearchViewerOpen, setIsResearchViewerOpen] = useState(false)
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lightboxCloseButtonRef = useRef<HTMLButtonElement>(null)
  const researchCloseButtonRef = useRef<HTMLButtonElement>(null)
  const resumeCloseButtonRef = useRef<HTMLButtonElement>(null)
  const isOverlayOpen = activePhotoProject !== null || isResearchViewerOpen || isResumeViewerOpen
  const activeScreenshots = activePhotoProject === 'discord' ? discordBotScreenshots : scheduleScreenshots
  const activeScreenshotIndex = activePhotoProject === 'discord' ? discordBotScreenshotIndex : scheduleScreenshotIndex

  const handlePhoneCopy = async () => {
    try {
      await navigator.clipboard.writeText('09772129931')
      setPhoneCopyStatus('copied')
    } catch {
      setPhoneCopyStatus('error')
    }
  }

  useEffect(() => {
    if (phoneCopyStatus === 'idle') return

    const timeout = window.setTimeout(() => setPhoneCopyStatus('idle'), 2800)
    return () => window.clearTimeout(timeout)
  }, [phoneCopyStatus])

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setContactSubmissionStatus('sending')

    try {
      const response = await fetch(contactFormEndpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        setContactSubmissionStatus('error')
        return
      }

      form.reset()
      setContactSubmissionStatus('success')
    } catch {
      setContactSubmissionStatus('error')
    }
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length)
    }, 2600)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const siteShell = document.querySelector('.site-shell')
    const revealElements = siteShell?.querySelectorAll<HTMLElement>('.scroll-reveal')
    if (!siteShell || !revealElements?.length) return

    if (!('IntersectionObserver' in window)) return

    siteShell.classList.add('scroll-reveal-ready')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' })

    revealElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      siteShell.classList.remove('scroll-reveal-ready')
    }
  }, [])

  useEffect(() => {
    if (isOverlayOpen) return

    const scheduleInterval = window.setInterval(() => {
      setScheduleScreenshotIndex((current) => (current + 1) % scheduleScreenshots.length)
    }, 10000)
    const discordInterval = window.setInterval(() => {
      setDiscordBotScreenshotIndex((current) => (current + 1) % discordBotScreenshots.length)
    }, 10000)

    return () => {
      window.clearInterval(scheduleInterval)
      window.clearInterval(discordInterval)
    }
  }, [isOverlayOpen])

  useEffect(() => {
    if (!isOverlayOpen) return

    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const overlay = overlayRef.current
    const closeButton = isResearchViewerOpen
      ? researchCloseButtonRef.current
      : isResumeViewerOpen
        ? resumeCloseButtonRef.current
        : lightboxCloseButtonRef.current
    document.body.style.overflow = 'hidden'
    closeButton?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setActivePhotoProject(null)
        setIsResearchViewerOpen(false)
        setIsResumeViewerOpen(false)
      } else if (activePhotoProject && !isResearchViewerOpen && event.key === 'ArrowLeft') {
        if (activePhotoProject === 'discord') {
          setDiscordBotScreenshotIndex((current) => (current - 1 + discordBotScreenshots.length) % discordBotScreenshots.length)
        } else {
          setScheduleScreenshotIndex((current) => (current - 1 + scheduleScreenshots.length) % scheduleScreenshots.length)
        }
      } else if (activePhotoProject && !isResearchViewerOpen && event.key === 'ArrowRight') {
        if (activePhotoProject === 'discord') {
          setDiscordBotScreenshotIndex((current) => (current + 1) % discordBotScreenshots.length)
        } else {
          setScheduleScreenshotIndex((current) => (current + 1) % scheduleScreenshots.length)
        }
      } else if (event.key === 'Tab') {
        const focusableElements = overlay?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        const firstElement = focusableElements?.[0]
        const lastElement = focusableElements?.[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (overlay && event.target instanceof Node && !overlay.contains(event.target)) {
        closeButton?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
      previousActiveElement?.focus()
    }
  }, [activePhotoProject, isOverlayOpen, isResearchViewerOpen, isResumeViewerOpen])

  return (
    <>
    <div
      className="site-shell min-h-screen"
      data-theme={isLightMode ? 'light' : 'dark'}
      style={{
        '--trace-dark': `url("${new URL(assetUrl('traces.svg'), document.baseURI).href}?v=9")`,
        '--trace-light': `url("${new URL(assetUrl('traces2.svg'), document.baseURI).href}?v=3")`,
      } as CSSProperties}
    >
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Pio Niccolo J. Caoili, home">
          <span>Pio Niccolo J. Caoili</span>
        </a>
        <nav aria-label="Main navigation" className="main-nav">
          <a href="#about">About</a>
          <a href="#work">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
          className="theme-toggle"
          type="button"
          aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-pressed={isLightMode}
          title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          onClick={() => setIsLightMode((lightMode) => !lightMode)}
        >
          {isLightMode ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M20.2 15.3A8.3 8.3 0 0 1 8.7 3.8 8.4 8.4 0 1 0 20.2 15.3Z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
          )}
        </button>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <h1>
              Pio Niccolo J. <span>Caoili</span>
            </h1>
            <p className="eyebrow"><span className="status-dot" /> COMPUTER ENGINEERING GRADUATE</p>
            <p className="hero-description">
              Turning <strong>tech challenges</strong> into <strong>smart solutions</strong>.
            </p>
            <p className="hero-role" aria-label={`Pio.is("${roles[roleIndex]}");`}>
              <span className="hero-code">Pio.is(&quot;</span>
              <span className="hero-role-value" key={roles[roleIndex]}>{roles[roleIndex]}</span>
              <span className="hero-code">&quot;);</span>
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore my projects <ArrowIcon />
              </a>
              <a className="text-link" href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
            </div>
            <p className="hero-location"><span aria-hidden="true">⌖</span> Naga City, Makati, and Cavite · Open to opportunities</p>
          </div>

          <div className="hero-art" aria-label="Decorative code editor illustration">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="editor-card">
              <div className="editor-topbar">
                <div className="window-dots"><i /><i /><i /></div>
                <span>pio.ts</span>
                <span className="editor-menu">•••</span>
              </div>
              <div className="editor-body">
                <div className="code-line"><span className="line-number">01</span><span><b>const</b> pio = {'{'}</span></div>
                <div className="code-line"><span className="line-number">02</span><span className="indent">name: <em>'Pio Niccolo J. Caoili'</em>,</span></div>
                <div className="code-line"><span className="line-number">03</span><span className="indent">focus: <em>'building and solving things'</em>,</span></div>
                <div className="code-line"><span className="line-number">04</span><span className="indent">currentlyLearning: <em>'always'</em>,</span></div>
                <div className="code-line"><span className="line-number">05</span><span> {'}'};</span></div>
                <div className="code-line code-spacer"><span className="line-number">06</span><span /></div>
                <div className="code-line"><span className="line-number">07</span><span><b>pio</b>.developSolution();<span className="cursor" /></span></div>
              </div>
              <div className="editor-footer"><span><span className="status-dot" /> All systems curious</span><span>UTF-8&nbsp;&nbsp; TypeScript</span></div>
            </div>
            <div className="profile-badge" aria-label="Profile photo">
              <span className="profile-photo-fallback" aria-hidden="true">YN</span>
              <img
                className="profile-photo"
                src={assetUrl('profile.jpg')}
                alt="Pio Niccolo J. Caoili"
                onError={(event) => { event.currentTarget.hidden = true }}
              />
              <span className="profile-status" role="img" aria-label="Online" />
            </div>
            <div className="floating-chip chip-bottom"><span>⌘</span> Always learning</div>
            <div className="hero-glow" />
          </div>
          <a href="#about" className="scroll-cue"><span /> SCROLL TO EXPLORE</a>
        </section>

        <section className="about-section section-wrap scroll-reveal" id="about">
          <div className="about-heading">
            <h2>About <span>me</span></h2>
          </div>
          <div className="about-copy">
            <p>Computer Engineering graduate with a strong foundation in software development, hardware troubleshooting, database management, and problem-solving.</p>
            <p>I am seeking an opportunity to apply my technical knowledge and hands-on experience in real-world engineering, software development, or IT. I enjoy turning complex challenges into practical solutions and I am eager to contribute my technical and analytical skills while continuously learning and growing in a collaborative environment.</p>

          </div>
        </section>

        <section className="work-section section-wrap scroll-reveal" id="work">
          <div className="section-heading">
            <div>
              <h2>Projects</h2>
            </div>
            <p className="section-intro">A couple of things I’ve designed, built, and learned from along the way.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => {
              const isScheduleProject = index === 0
              const screenshots = isScheduleProject ? scheduleScreenshots : discordBotScreenshots
              const screenshotIndex = isScheduleProject ? scheduleScreenshotIndex : discordBotScreenshotIndex
              const setScreenshotIndex = isScheduleProject ? setScheduleScreenshotIndex : setDiscordBotScreenshotIndex

              return (
              <article className={`project-card project-card-${index + 1} scroll-reveal`} key={project.title}>
                <div className="project-visual">
                  <div className={`schedule-gallery${isScheduleProject ? '' : ' discord-gallery'}`}>
                    <div className="schedule-category">{project.category}</div>
                    <span className="schedule-count" aria-live="polite">
                      {screenshotIndex + 1} / {screenshots.length}
                    </span>
                    <button
                      type="button"
                      className="schedule-image"
                      aria-label={`Enlarge image: ${screenshots[screenshotIndex].alt}`}
                      onClick={() => setActivePhotoProject(isScheduleProject ? 'schedule' : 'discord')}
                    >
                      <img
                        key={screenshots[screenshotIndex].src}
                        src={screenshots[screenshotIndex].src}
                        alt={screenshots[screenshotIndex].alt}
                      />
                    </button>
                    <button
                      type="button"
                      className="schedule-arrow schedule-arrow-previous"
                      aria-label={`Previous ${isScheduleProject ? 'scheduling' : 'Discord bot'} screenshot`}
                      onClick={() => setScreenshotIndex((current) => (current - 1 + screenshots.length) % screenshots.length)}
                    >
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                        <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="schedule-arrow schedule-arrow-next"
                      aria-label={`Next ${isScheduleProject ? 'scheduling' : 'Discord bot'} screenshot`}
                      onClick={() => setScreenshotIndex((current) => (current + 1) % screenshots.length)}
                    >
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                        <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
                      </svg>
                    </button>
                  </div>
                  {!isScheduleProject && <span className="project-number">0{index + 1}</span>}
                </div>
                <div className="project-details">
                  <div className="project-title-row">
                    <div className="project-heading-copy">
                      <h3>{project.title}</h3>
                      {project.role && <span className="project-role">{project.role}</span>}
                    </div>
                    <span className="project-type">{project.type}</span>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-meta-row">
                    <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    {index === 0 && (
                      <button
                        type="button"
                        className="research-link"
                        onClick={() => setIsResearchViewerOpen(true)}
                      >
                        View Research Paper <span aria-hidden="true">↗</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
              )
            })}
          </div>
        </section>

        <section className="skills-section section-wrap scroll-reveal" id="skills">
          <div className="section-heading">
            <div>
              <h2><span>Skills</span></h2>
            </div>
            <p className="section-intro">A growing tech stack for turning ideas into reliable, useful software.</p>
          </div>
          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skill-group" key={group.category}>
                <h3><span>{group.number}</span>{group.category}</h3>
                <div className="tag-list">{group.items.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section section-wrap scroll-reveal" id="contact">
          <h2>Contact</h2>
          <p className="contact-intro">I am open to discussing opportunities,
             collaborations, and projects where I can contribute my skills.
             Please feel free to contact me.</p>

          <div className="contact-panel-wrap">
            <form
              className="contact-form-panel"
              action={contactFormEndpoint}
              method="POST"
              onSubmit={handleContactSubmit}
            >
              <label className="contact-field">
                <span className="contact-label">&gt; NAME</span>
                <input type="text" name="name" autoComplete="name" placeholder="Your name" required />
              </label>

              <label className="contact-field">
                <span className="contact-label">&gt; EMAIL</span>
                <input type="email" name="email" autoComplete="email" placeholder="your@email.com" required />
              </label>

              <label className="contact-field">
                <span className="contact-label">&gt; MESSAGE</span>
                <textarea name="message" placeholder="Your message..." rows={5} required />
              </label>

              <button type="submit" className="transmit-button" disabled={contactSubmissionStatus === 'sending'}>
                {contactSubmissionStatus === 'sending' ? 'SENDING...' : 'SEND'}
              </button>
              <p className="contact-form-feedback" aria-live="polite" role="status">
                {contactSubmissionStatus === 'success' && 'Message sent successfully. Thank you for reaching out!'}
                {contactSubmissionStatus === 'error' && 'Your message could not be sent. Please try again in a moment.'}
              </p>
            </form>

            <aside className="contact-channels-panel" aria-label="External channels">
              <h3>EXTERNAL CHANNELS</h3>

              <button
                type="button"
                className="channel-button phone-copy-button"
                aria-label="Copy phone number"
                title="Copy phone number"
                onClick={handlePhoneCopy}
              >
                <span className="channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M7 4.5a2 2 0 0 1 2-2h1.4a2 2 0 0 1 1.9 1.5l.7 2.8a2 2 0 0 1-.6 1.9l-1.3 1.2a14.7 14.7 0 0 0 7.1 7.1l1.2-1.3a2 2 0 0 1 1.9-.6l2.8.7a2 2 0 0 1 1.5 1.9V16a2 2 0 0 1-2 2h-1.5C13.3 18 6 10.7 6 5.5V4a2 2 0 0 1 1-1.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span>09772129931</span>
              </button>
              <button
                type="button"
                className="channel-button channel-button-action"
                aria-label="View resume"
                onClick={() => setIsResumeViewerOpen(true)}
              >
                <span className="channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M14 3.75v4h4M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Resume</span>
                <span className="channel-action-arrow" aria-hidden="true">↗</span>
              </button>

              <a href="https://ph.linkedin.com/in/pio-niccolo-caoili" target="_blank" rel="noreferrer" className="channel-button">
                <span className="channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5A1.56 1.56 0 1 1 6.9 5.4a1.56 1.56 0 0 1 .04 3.1ZM5.52 9.86h2.8v8.64h-2.8V9.86Zm4.67 0h2.68v1.18h.04c.37-.7 1.28-1.44 2.63-1.44 2.8 0 3.32 1.84 3.32 4.24v6.66h-2.8v-6.26c0-1.49-.03-3.42-2.08-3.42-2.09 0-2.4 1.63-2.4 3.3v6.38h-2.8V9.86Z"/></svg>
                </span>
                <span>LinkedIn</span>
              </a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <p>© {currentYear} Pio Niccolo J. Caoili. All rights reserved.</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
    <a
      className="back-to-top"
      data-theme={isLightMode ? 'light' : 'dark'}
      href="#home"
      aria-label="Back to top"
      title="Back to top"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="m6 14 6-6 6 6M12 8v12" />
      </svg>
    </a>
    {phoneCopyStatus !== 'idle' && (
      <div className="copy-toast" data-theme={isLightMode ? 'light' : 'dark'} role="status" aria-live="polite">
        {phoneCopyStatus === 'copied'
          ? 'Phone number copied to clipboard.'
          : 'Could not copy the number. Please copy it manually.'}
      </div>
    )}
    {activePhotoProject && (
      <div
        ref={overlayRef}
        className="schedule-lightbox"
        data-theme={isLightMode ? 'light' : 'dark'}
        role="dialog"
        aria-modal="true"
        aria-label={`${activePhotoProject === 'discord' ? 'AI Companion Discord Bot' : 'Class Scheduling System'} screenshot`}
        onClick={() => setActivePhotoProject(null)}
      >
        <div className="photo-lightbox-panel" onClick={(event) => event.stopPropagation()}>
          <div className="photo-lightbox-header">
            <span>{activeScreenshots[activeScreenshotIndex].alt}</span>
            <div className="photo-lightbox-actions">
              <button
                type="button"
                className="photo-lightbox-arrow"
                aria-label="Previous screenshot"
                onClick={() => {
                  if (activePhotoProject === 'discord') {
                    setDiscordBotScreenshotIndex((current) => (current - 1 + discordBotScreenshots.length) % discordBotScreenshots.length)
                  } else {
                    setScheduleScreenshotIndex((current) => (current - 1 + scheduleScreenshots.length) % scheduleScreenshots.length)
                  }
                }}
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                  <path d="m12.5 4.5-5.5 5.5 5.5 5.5" />
                </svg>
              </button>
              <span className="photo-lightbox-count" aria-live="polite">
                {activeScreenshotIndex + 1} / {activeScreenshots.length}
              </span>
              <button
                type="button"
                className="photo-lightbox-arrow"
                aria-label="Next screenshot"
                onClick={() => {
                  if (activePhotoProject === 'discord') {
                    setDiscordBotScreenshotIndex((current) => (current + 1) % discordBotScreenshots.length)
                  } else {
                    setScheduleScreenshotIndex((current) => (current + 1) % scheduleScreenshots.length)
                  }
                }}
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                  <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
                </svg>
              </button>
              <button
                ref={lightboxCloseButtonRef}
                type="button"
                className="photo-lightbox-close"
                aria-label="Close enlarged screenshot"
                onClick={() => setActivePhotoProject(null)}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </div>
          <img
            className="schedule-lightbox-image"
            src={activeScreenshots[activeScreenshotIndex].src}
            alt={activeScreenshots[activeScreenshotIndex].alt}
          />
        </div>
      </div>
    )}
    {isResearchViewerOpen && (
      <div
        ref={overlayRef}
        className="schedule-lightbox research-viewer"
        data-theme={isLightMode ? 'light' : 'dark'}
        role="dialog"
        aria-modal="true"
        aria-label="Class Scheduling System research paper"
        onClick={() => setIsResearchViewerOpen(false)}
      >
        <div className="research-viewer-panel" onClick={(event) => event.stopPropagation()}>
          <div className="research-viewer-header">
            <h2 className="research-viewer-title">Class Scheduling System Research</h2>
            <button
              ref={researchCloseButtonRef}
              type="button"
              className="research-viewer-close"
              aria-label="Close research paper"
              onClick={() => setIsResearchViewerOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <iframe
            className="research-viewer-frame"
            src={assetUrl('files/research.pdf')}
            title="Class Scheduling System research paper"
          />
        </div>
      </div>
    )}
    {isResumeViewerOpen && (
      <div
        ref={overlayRef}
        className="schedule-lightbox research-viewer"
        data-theme={isLightMode ? 'light' : 'dark'}
        role="dialog"
        aria-modal="true"
        aria-label="Resume"
        onClick={() => setIsResumeViewerOpen(false)}
      >
        <div className="research-viewer-panel" onClick={(event) => event.stopPropagation()}>
          <div className="research-viewer-header">
            <h2 className="research-viewer-title">Resume</h2>
            <button
              ref={resumeCloseButtonRef}
              type="button"
              className="research-viewer-close"
              aria-label="Close resume"
              onClick={() => setIsResumeViewerOpen(false)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <iframe
            className="research-viewer-frame"
            src={resumeUrl}
            title="Pio Niccolo J. Caoili resume"
          />
        </div>
      </div>
    )}
    </>
  )
}

export default App
