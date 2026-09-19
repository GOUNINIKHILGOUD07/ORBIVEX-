import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Camera, Share2, Play, Mail } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function OutroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
      tl.from('.outro-line', { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' })
        .from('.outro-sub', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
        .from('.outro-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Outro Hero */}
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden outro-bg"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-charcoal/80" />

        {/* Decorative globe rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-warm-white/5 absolute animate-[spin_40s_linear_infinite]" />
          <div className="w-[400px] h-[400px] rounded-full border border-sunset/8 absolute animate-[spin_25s_linear_infinite_reverse]" />
          <div className="w-[200px] h-[200px] rounded-full border border-warm-white/10 absolute animate-[spin_15s_linear_infinite]" />
        </div>

        {/* Noise */}
        <div className="noise-overlay" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-px bg-sunset" />
            <span className="font-ui text-xs font-semibold tracking-[0.3em] uppercase text-sunset">Begin Here</span>
            <div className="w-8 h-px bg-sunset" />
          </div>

          <div className="overflow-hidden mb-2">
            <h2 className="outro-line font-display text-[clamp(2.5rem,7vw,6.5rem)] font-black text-warm-white leading-[0.9]">
              YOUR NEXT STORY
            </h2>
          </div>
          <div className="overflow-hidden mb-10">
            <h2 className="outro-line font-display text-[clamp(2.5rem,7vw,6.5rem)] font-black text-gradient-sunset leading-[0.9]">
              STARTS HERE.
            </h2>
          </div>

          <p className="outro-sub font-ui text-base md:text-lg text-warm-white/50 max-w-lg mx-auto leading-relaxed mb-12">
            The world is too beautiful to stay in one place. Let's find your next extraordinary chapter together.
          </p>

          <div className="outro-cta flex flex-wrap gap-4 justify-center">
            <button
              className="btn-primary group text-sm"
              data-cursor="EXPLORE"
            >
              START EXPLORING
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <button className="btn-secondary text-sm" data-cursor="CONTACT">
              <Mail size={14} />
              SPEAK TO US
            </button>
          </div>
        </div>

        {/* Bottom scroll-to-top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-10 right-10 w-12 h-12 border border-warm-white/20 flex items-center justify-center text-warm-white/40 hover:text-warm-white hover:border-warm-white/50 transition-all duration-300 cursor-none"
          data-cursor="TOP"
        >
          ↑
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-warm-white/10 py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 relative">
                  <div className="absolute inset-0 rounded-full border border-sunset opacity-60" />
                  <div className="absolute inset-1.5 rounded-full bg-sunset" />
                </div>
                <span className="font-ui font-black text-lg tracking-[0.25em] text-warm-white uppercase">ORBIVEX</span>
              </div>
              <p className="font-ui text-xs text-warm-white/30 leading-relaxed max-w-xs mb-5">
                Curated luxury travel experiences for those who seek the extraordinary. Go beyond ordinary.
              </p>
              <div className="flex gap-3">
                {[Camera, Share2, Play].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 border border-warm-white/15 flex items-center justify-center text-warm-white/40 hover:text-warm-white hover:border-warm-white/50 transition-all duration-300 cursor-none"
                    data-cursor="FOLLOW"
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Discover', links: ['Destinations', 'Experiences', 'Journeys', 'Hidden Gems'] },
              { title: 'Company', links: ['About Us', 'How it Works', 'Blog', 'Press'] },
              { title: 'Support', links: ['FAQ', 'Contact', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-ui text-[10px] font-bold tracking-[0.25em] uppercase text-warm-white/30 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="font-ui text-xs text-warm-white/50 hover:text-warm-white transition-colors duration-300 cursor-none">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rule-sunset" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <p className="font-ui text-xs text-warm-white/20">
              © 2026 ORBIVEX. All rights reserved. Made with 🧡 for dreamers.
            </p>
            <p className="font-ui text-xs text-warm-white/20 tracking-widest uppercase">
              Go Beyond Ordinary
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
