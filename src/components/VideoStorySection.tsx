import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VideoStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned scroll storytelling
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.5,
          pin: true,
        },
      })

      tl.from('.story-line-1', { y: 80, opacity: 0, duration: 1 })
        .from('.story-line-2', { y: 80, opacity: 0, duration: 1 }, '-=0.5')
        .from('.story-sub', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.story-cta', { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
        .to('.story-bg-overlay', { opacity: 0.2, duration: 1 }, 0)
        .to('.story-bg', { scale: 1.08, duration: 3 }, 0)

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative w-full h-screen overflow-hidden video-story-bg"
    >
      {/* Animated BG */}
      <div
        className="story-bg absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80)',
          transformOrigin: 'center center',
        }}
      />
      {/* Overlays */}
      <div className="story-bg-overlay absolute inset-0 bg-charcoal opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />

      {/* Noise */}
      <div className="noise-overlay" />

      {/* Content */}
      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-px bg-sunset" />
          <span className="font-ui text-xs font-bold tracking-[0.3em] uppercase text-sunset">The ORBIVEX Philosophy</span>
          <div className="w-10 h-px bg-sunset" />
        </div>

        <div className="overflow-hidden mb-2">
          <h2 className="story-line-1 font-display text-[clamp(2.8rem,8vw,7.5rem)] font-black text-warm-white leading-[0.9]">
            COLLECT MOMENTS.
          </h2>
        </div>
        <div className="overflow-hidden mb-8">
          <h2 className="story-line-2 font-display text-[clamp(2.8rem,8vw,7.5rem)] font-black text-gradient-sunset leading-[0.9]">
            NOT MILES.
          </h2>
        </div>

        <p className="story-sub font-ui text-base md:text-lg text-warm-white/50 max-w-lg leading-relaxed mb-10">
          The most valuable currency isn't air miles or loyalty points — it's the memory of standing somewhere that stole your breath away.
        </p>

        <button
          className="story-cta btn-primary"
          data-cursor="EXPLORE"
          onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
        >
          START YOUR STORY →
        </button>

        {/* Decorative lines */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-px h-6 bg-warm-white" style={{ opacity: 1 - i * 0.1 }} />
          ))}
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-px h-6 bg-warm-white" style={{ opacity: 1 - i * 0.1 }} />
          ))}
        </div>
      </div>
    </section>
  )
}
