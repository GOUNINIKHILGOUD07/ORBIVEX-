import { useEffect, useRef, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ArrowDown, Play, Globe, Sparkles } from 'lucide-react'
import HeroGlobe from './HeroGlobe'

const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.8 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 5,
}))

function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

const SLIDER_STEPS = [
  { num: '01', targetId: 'discover', label: 'Discover' },
  { num: '02', targetId: 'destinations', label: 'Destinations' },
  { num: '03', targetId: 'globe', label: '3D Globe' },
  { num: '04', targetId: 'experiences', label: 'Experiences' },
  { num: '05', targetId: 'lifestyle', label: 'Lifestyle' },
  { num: '06', targetId: 'planner', label: 'Planner' },
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState('01')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from('.hero-word', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      })
      .from(subRef.current, {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.3')
      .from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      ref={sectionRef}
      id="discover"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden hero-bg select-none"
    >
      {/* Cinematic texture */}
      <div className="noise-overlay" />
      <ParticleField />

      {/* Warm ambient left glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(circle at 12% 40%, rgba(255, 140, 60, 0.14) 0%, transparent 55%)',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent pointer-events-none z-[3]" />

      {/* Left Vertical Slider */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-start gap-4 z-20">
        {SLIDER_STEPS.map((step) => {
          const isActive = activeStep === step.num
          return (
            <button
              key={step.num}
              onClick={() => {
                setActiveStep(step.num)
                scrollToSection(step.targetId)
              }}
              className="group flex items-center gap-2.5 text-left cursor-pointer transition-all duration-300"
              title={step.label}
              aria-label={`Go to ${step.label}`}
            >
              <span
                className={`font-ui text-xs font-semibold tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-sunset' : 'text-warm-white/30 group-hover:text-warm-white/70'
                }`}
              >
                {step.num}
              </span>
              {isActive && (
                <span className="w-6 h-0.5 bg-sunset rounded-full inline-block animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* Main 2-column layout */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-14 pt-28 pb-16 w-full min-h-screen grid lg:grid-cols-2 items-center gap-6 lg:gap-0">

        {/* ── Left Column: Typography & CTAs ── */}
        <div className="w-full max-w-2xl xl:pl-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-sunset shadow-lg shadow-sunset animate-pulse" />
            <span className="font-ui text-[11px] font-semibold tracking-[0.3em] uppercase text-sunset">
              Premium Travel Experience
            </span>
          </motion.div>

          {/* Headline */}
          <div ref={headlineRef} className="mb-4">
            <div className="overflow-hidden">
              <div className="font-display text-[clamp(2.6rem,5.8vw,5.8rem)] font-black leading-[0.93] tracking-tight text-warm-white">
                <span className="hero-word inline-block">GO BEYOND</span>
              </div>
            </div>
            <div className="overflow-hidden mt-1">
              <div className="font-display text-[clamp(2.6rem,5.8vw,5.8rem)] font-black leading-[0.93] tracking-tight">
                <span className="hero-word inline-block text-gradient-sunset drop-shadow-sm">ORDINARY</span>
              </div>
            </div>
          </div>

          {/* Subtext */}
          <div ref={subRef} className="max-w-md mt-5 mb-8">
            <p className="font-ui text-base md:text-lg font-light text-warm-white/80 leading-relaxed">
              Curated journeys to the world's most extraordinary places. Where every destination is a story, and every moment a memory that lasts forever.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => scrollToSection('destinations')}
              className="btn-primary group shadow-lg shadow-sunset/20 flex items-center gap-2"
              aria-label="Explore destinations"
            >
              <Globe size={15} />
              EXPLORE THE WORLD
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            <button
              onClick={() => scrollToSection('story')}
              className="btn-secondary group backdrop-blur-md bg-charcoal/40 border border-warm-white/30 hover:border-warm-white hover:bg-charcoal/70 flex items-center gap-2.5 px-5 py-3.5 font-ui text-[11px] font-semibold tracking-[0.15em] uppercase text-warm-white transition-all duration-300"
              aria-label="Watch journey film"
            >
              <div className="w-8 h-8 rounded-full border border-warm-white/50 flex items-center justify-center group-hover:border-warm-white group-hover:bg-warm-white/10 transition-all duration-300">
                <Play size={10} fill="currentColor" />
              </div>
              WATCH JOURNEY
            </button>

            <button
              onClick={() => scrollToSection('planner')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-none border border-sunset/40 text-sunset hover:bg-sunset/8 hover:border-sunset font-ui text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300"
              aria-label="Plan your trip"
            >
              <Sparkles size={13} />
              PLAN A TRIP
            </button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex gap-10 sm:gap-14 mt-10 pt-6 border-t border-warm-white/15"
          >
            {[
              { value: '120+', label: 'Destinations' },
              { value: '50K+', label: 'Travelers' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl sm:text-3xl font-bold text-warm-white">{stat.value}</div>
                <div className="font-ui text-[11px] font-medium tracking-[0.2em] uppercase text-warm-white/50 mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right Column: 3D Globe — Bigger, no clip ── */}
        <div className="relative flex items-center justify-center w-full">
          {/* Globe container: uses vw-based large size, stays centred */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 'min(620px, 100vw - 40px)',
              height: 'min(620px, 100vw - 40px)',
            }}
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-warm-white/30 font-ui text-sm">
                Loading 3D Live Earth…
              </div>
            }>
              <HeroGlobe />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Editorial Script Accent — Top Right */}
      <div className="hidden lg:block absolute right-6 xl:right-12 top-[88px] pointer-events-none z-20">
        <div className="hero-script-font text-2xl xl:text-3xl text-warm-white/55 rotate-[-8deg] tracking-wide drop-shadow-md whitespace-nowrap">
          A Bigger Brighter You
        </div>
      </div>

      {/* Lower Right Accents */}
      <div className="hidden lg:flex flex-col items-end gap-2.5 absolute right-6 sm:right-10 bottom-14 pointer-events-none z-20 text-right">
        <div className="font-ui text-[10px] tracking-[0.3em] uppercase text-warm-white/35 leading-relaxed">
          MORE<br />THAN<br />PLACES
        </div>
        <div className="w-8 h-px bg-warm-white/20" />
        <div className="font-ui text-[10px] tracking-[0.25em] uppercase text-warm-white/60 font-semibold">
          A NEW YOU
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        onClick={() => scrollToSection('destinations')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 text-warm-white/50 hover:text-warm-white transition-colors cursor-pointer scroll-indicator z-20"
        aria-label="Scroll to destinations"
      >
        <span className="w-8 h-px bg-warm-white/40" />
        <span className="font-ui text-[11px] tracking-[0.25em] uppercase">Scroll to explore</span>
        <ArrowDown size={13} className="animate-bounce" />
      </motion.button>
    </section>
  )
}
