import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    id: 'adventure',
    label: 'Adventure',
    emoji: '⛰️',
    headline: 'PUSH YOUR LIMITS',
    sub: 'Summit glaciers. Dive coral reefs. Free-fall from the sky.',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    color: '#1a3d5c',
    accent: '#4a90d9',
    items: ['Rock Climbing', 'Skydiving', 'Glacier Trekking', 'Deep Sea Diving'],
  },
  {
    id: 'culture',
    label: 'Culture',
    emoji: '🏛️',
    headline: 'LIVE THE STORY',
    sub: 'Ancient ruins. Sacred rituals. Art that breathes.',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    color: '#4a2d1e',
    accent: '#c9a84c',
    items: ['Temple Tours', 'Local Festivals', 'Art Galleries', 'Historical Walks'],
  },
  {
    id: 'food',
    label: 'Food',
    emoji: '🍜',
    headline: 'TASTE THE WORLD',
    sub: 'Street markets. Michelin stars. Family recipes passed down for centuries.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    color: '#3d1a0d',
    accent: '#e8693a',
    items: ['Night Markets', 'Cooking Classes', 'Wine Tours', 'Fine Dining'],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    emoji: '🧘',
    headline: 'RESTORE YOUR SOUL',
    sub: 'Jungle retreats. Thermal springs. Ancient healing traditions.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    color: '#1a3d2e',
    accent: '#4caf7d',
    items: ['Yoga Retreats', 'Spa Journeys', 'Meditation', 'Forest Bathing'],
  },
  {
    id: 'nightlife',
    label: 'Nightlife',
    emoji: '✨',
    headline: 'OWN THE NIGHT',
    sub: 'Rooftop bars above city galaxies. Beachfire sessions. Dance until dawn.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    color: '#1a0d2e',
    accent: '#9b59b6',
    items: ['Rooftop Bars', 'Beach Clubs', 'Live Music', 'Sunset Cocktails'],
  },
]

export default function ExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exp-title', {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.exp-title', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const exp = experiences[active]

  return (
    <section ref={sectionRef} id="experiences" className="relative py-28 bg-charcoal overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-px bg-sunset" />
            <span className="font-ui text-xs font-semibold tracking-[0.3em] uppercase text-sunset">Experiences</span>
          </div>
          <h2 className="exp-title font-display text-[clamp(2.5rem,6vw,5rem)] font-black text-warm-white leading-tight">
            CHOOSE YOUR<br />
            <span className="text-gradient-sunset">ADVENTURE</span>
          </h2>
        </div>

        {/* Tab nav */}
        <div className="flex flex-wrap gap-3 mb-8">
          {experiences.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setActive(i)}
              data-cursor="VIEW"
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 cursor-none border ${
                active === i
                  ? 'bg-sunset border-sunset text-white'
                  : 'border-warm-white/20 text-warm-white/50 hover:border-warm-white/50 hover:text-warm-white'
              }`}
            >
              <span>{e.emoji}</span>
              {e.label}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div
          key={exp.id}
          className="relative overflow-hidden h-[520px] md:h-[580px] group"
          data-cursor="EXPLORE"
          style={{ background: exp.color }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${exp.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

          {/* Content */}
          <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{exp.emoji}</span>
              <span
                className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase border"
                style={{ borderColor: exp.accent + '60', color: exp.accent }}
              >
                {exp.label}
              </span>
            </div>
            <h3 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-black text-warm-white leading-none mb-4">
              {exp.headline}
            </h3>
            <p className="font-ui text-base text-warm-white/60 mb-7 leading-relaxed">
              {exp.sub}
            </p>

            {/* Items */}
            <div className="flex flex-wrap gap-2 mb-8">
              {exp.items.map(item => (
                <span
                  key={item}
                  className="px-4 py-2 text-xs font-medium tracking-wide text-warm-white/70 border border-warm-white/20 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <button
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-warm-white hover:text-sunset transition-colors duration-300 cursor-none group/btn"
              data-cursor="EXPLORE"
            >
              EXPLORE EXPERIENCES
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute bottom-10 right-10 text-right">
            <span className="font-display text-7xl font-black text-warm-white/10">
              {String(active + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="grid grid-cols-5 gap-0 mt-1">
          {experiences.map((e, i) => (
            <div
              key={e.id}
              className="h-0.5 transition-all duration-300 cursor-none"
              style={{ background: i === active ? exp.accent : 'rgba(245,240,235,0.1)' }}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
