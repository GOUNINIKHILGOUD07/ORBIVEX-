import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, ArrowUpRight, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const destinations = [
  {
    id: 'bali',
    name: 'BALI',
    country: 'Indonesia',
    tagline: 'Island of the Gods',
    description: 'Ancient temples veiled in mist. Rice terraces carved by time. A spiritual sanctuary where every sunrise feels like a revelation.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #071f12 0%, #123d24 50%, #05140b 100%)',
    accentColor: '#2d6a4f',
    season: 'Apr – Oct',
    temp: '28°C',
    tag: 'Culture & Wellness',
    badge: 'Trending Now',
  },
  {
    id: 'kyoto',
    name: 'KYOTO',
    country: 'Japan',
    tagline: 'Where Time Stands Still',
    description: 'Bamboo groves whisper ancient secrets. Cherry blossoms paint the sky pink. A city that breathes ceremony, zen mindfulness, and timeless grace.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #240d15 0%, #3d1723 50%, #12060a 100%)',
    accentColor: '#9b5d5d',
    season: 'Mar – May',
    temp: '22°C',
    tag: 'Heritage',
    badge: 'Seasonal Bloom',
  },
  {
    id: 'switzerland',
    name: 'SWITZERLAND',
    country: 'Europe',
    tagline: 'Peaks Beyond Imagination',
    description: 'Glacial lakes mirror snow-capped giants. Alpine villages frozen in perfection. Nature at its most breathtakingly pure and majestic.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #0a1b2d 0%, #153252 50%, #06101c 100%)',
    accentColor: '#2c4a6e',
    season: 'Dec – Feb',
    temp: '-5°C',
    tag: 'Alpine Adventure',
    badge: 'Winter Escape',
  },
  {
    id: 'dubai',
    name: 'DUBAI',
    country: 'UAE',
    tagline: 'Where Future is Now',
    description: 'Towers pierce clouds above golden dunes. Ultramodern luxury meets ancient desert soul. A city that constantly reimagines what is possible.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #2a1b07 0%, #4a3110 50%, #140d03 100%)',
    accentColor: '#8b6914',
    season: 'Nov – Apr',
    temp: '25°C',
    tag: 'Ultra Luxury',
    badge: 'Signature Stay',
  },
  {
    id: 'iceland',
    name: 'ICELAND',
    country: 'North Atlantic',
    tagline: 'Land of Fire & Ice',
    description: 'Aurora curtains dance above frozen tundra. Geysers erupt with primordial force. Earth at its most raw, untouched, and utterly magnificent.',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=85&auto=format&fit=crop',
    fallbackBg: 'linear-gradient(135deg, #061924 0%, #0f3042 50%, #030c12 100%)',
    accentColor: '#1a4a6e',
    season: 'Sep – Mar',
    temp: '2°C',
    tag: 'Pristine Nature',
    badge: 'Aurora Season',
  },
]

export default function DestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dest-heading-word', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }, sectionRef)

    // Ensure ScrollTrigger positions are accurate
    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="relative py-28 bg-charcoal overflow-hidden select-none"
    >
      {/* Background accent glow */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-sunset/15 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-ocean/10 blur-3xl pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-sunset" />
              <span className="font-ui text-xs font-semibold tracking-[0.3em] uppercase text-sunset">
                Featured Destinations
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-black text-warm-white leading-tight">
              {'WHERE WILL YOU'.split(' ').map((w, i) => (
                <span key={i} className="dest-heading-word inline-block mr-3">{w}</span>
              ))}
              <br />
              {'GO NEXT?'.split(' ').map((w, i) => (
                <span key={i + 10} className="dest-heading-word inline-block mr-3 text-gradient-sunset">{w}</span>
              ))}
            </h2>
          </div>
          <p className="font-ui text-sm sm:text-base text-warm-white/50 max-w-sm mt-4 md:mt-0 leading-relaxed">
            Five of the world's most extraordinary destinations, each with its own irreplaceable story and transformative spirit.
          </p>
        </div>

        {/* Responsive Accordion Grid */}
        <div className="flex flex-col lg:flex-row gap-3 min-h-[500px] lg:h-[600px] w-full">
          {destinations.map((dest, idx) => {
            const isActive = activeIdx === idx
            return (
              <div
                key={dest.id}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                data-cursor="VIEW"
                className={`group relative rounded-lg overflow-hidden border transition-all duration-700 cursor-pointer ${
                  isActive
                    ? 'border-sunset/50 shadow-2xl shadow-sunset/10'
                    : 'border-warm-white/10 hover:border-warm-white/30'
                }`}
                style={{
                  // Responsive sizing: full height flex on desktop, vertical expansion on mobile
                  flex: isActive ? '5 1 0%' : '1 1 0%',
                  minHeight: isActive ? '360px' : '72px',
                  background: dest.fallbackBg,
                }}
              >
                {/* Background Image with Fallback */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${dest.image})`,
                    backgroundColor: 'transparent',
                  }}
                />

                {/* Atmospheric Dark Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isActive
                      ? 'bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/20'
                      : 'bg-gradient-to-t from-black/85 via-black/60 to-black/40 group-hover:bg-black/40'
                  }`}
                />

                {/* Collapsed State (Desktop Vertical Tag / Mobile Row) */}
                <div
                  className={`absolute inset-0 flex transition-opacity duration-500 ${
                    isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  {/* Desktop: Vertical Ribbon */}
                  <div className="hidden lg:flex w-full h-full flex-col items-center justify-between py-8 px-2">
                    <span className="font-ui text-[10px] font-bold tracking-[0.25em] text-sunset uppercase">
                      0{idx + 1}
                    </span>
                    <span
                      className="font-display text-lg font-bold text-warm-white tracking-[0.2em] uppercase whitespace-nowrap"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {dest.name}
                    </span>
                    <span className="font-ui text-[10px] text-warm-white/40 tracking-wider">
                      {dest.temp}
                    </span>
                  </div>

                  {/* Mobile: Horizontal Strip */}
                  <div className="flex lg:hidden w-full h-full items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-ui text-xs font-bold text-sunset">0{idx + 1}</span>
                      <span className="font-display text-lg font-bold text-warm-white">{dest.name}</span>
                      <span className="font-ui text-xs text-warm-white/40">• {dest.country}</span>
                    </div>
                    <span className="font-ui text-xs text-sunset/80 font-medium tracking-wider">
                      TAP TO EXPAND →
                    </span>
                  </div>
                </div>

                {/* Expanded State (Full Luxury Destination Presentation) */}
                <div
                  className={`absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-end transition-all duration-700 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="absolute top-6 sm:top-8 left-6 sm:left-8 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-sunset/20 border border-sunset/40 text-sunset backdrop-blur-md">
                      <Sparkles size={11} />
                      {dest.badge}
                    </span>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-warm-white/10 border border-warm-white/15 text-warm-white/80 backdrop-blur-md">
                      {dest.tag}
                    </span>
                  </div>

                  {/* Main Destination Info */}
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-sunset" />
                      <span className="font-ui text-xs font-semibold tracking-[0.25em] uppercase text-sunset">
                        {dest.country}
                      </span>
                    </div>

                    <h3 className="font-display text-4xl sm:text-6xl font-black text-warm-white tracking-tight leading-none mb-2">
                      {dest.name}
                    </h3>
                    <p className="font-ui text-sm sm:text-base text-warm-white/70 italic mb-4 font-light">
                      "{dest.tagline}"
                    </p>

                    <p className="font-ui text-xs sm:text-sm text-warm-white/80 leading-relaxed mb-6 line-clamp-3 sm:line-clamp-none max-w-lg">
                      {dest.description}
                    </p>

                    {/* Stats & CTA Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-warm-white/15">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="font-ui text-[10px] uppercase tracking-widest text-warm-white/40">Best Season</div>
                          <div className="font-ui text-xs sm:text-sm font-semibold text-warm-white">{dest.season}</div>
                        </div>
                        <div className="w-px h-6 bg-warm-white/20" />
                        <div>
                          <div className="font-ui text-[10px] uppercase tracking-widest text-warm-white/40">Average Temp</div>
                          <div className="font-ui text-xs sm:text-sm font-semibold text-warm-white">{dest.temp}</div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          document.getElementById('globe')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="btn-primary py-2.5 px-5 text-[10px] tracking-widest group"
                        data-cursor="EXPLORE"
                      >
                        EXPLORE ON 3D GLOBE
                        <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-warm-white/10 text-xs font-ui">
          <p className="text-warm-white/40">
            Showing 5 hand-picked luxury destinations • Hover or click to explore
          </p>
          <button
            onClick={() => document.getElementById('globe')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sunset hover:text-warm-white transition-colors uppercase tracking-widest font-semibold flex items-center gap-1.5"
            data-cursor="VIEW"
          >
            Explore Interactive 3D World →
          </button>
        </div>
      </div>
    </section>
  )
}
