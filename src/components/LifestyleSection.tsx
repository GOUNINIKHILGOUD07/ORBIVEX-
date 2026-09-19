import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = [
  {
    id: 'mornings',
    label: 'Slow Mornings',
    desc: 'Coffee with mountain views. No alarm clocks. Just light spilling over the horizon.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80',
    size: 'large',
    position: 'col-span-2 row-span-2',
  },
  {
    id: 'remote',
    label: 'Remote Work',
    desc: 'Your office: a beachside café in Lisbon. Your commute: a 3-minute walk to the sea.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=80',
    size: 'small',
    position: 'col-span-1 row-span-1',
  },
  {
    id: 'food',
    label: 'Local Food',
    desc: 'Recipes older than empires. Flavors that geography cannot replicate.',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=700&q=80',
    size: 'small',
    position: 'col-span-1 row-span-1',
  },
  {
    id: 'markets',
    label: 'Night Markets',
    desc: 'A thousand lanterns. A thousand smells. The real city comes alive at night.',
    image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=700&q=80',
    size: 'medium',
    position: 'col-span-1 row-span-2',
  },
  {
    id: 'wellness',
    label: 'Wellness',
    desc: 'Ancient rituals in modern retreats. The body remembers what the mind forgets.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80',
    size: 'medium',
    position: 'col-span-1 row-span-1',
  },
  {
    id: 'adventure',
    label: 'Adventure',
    desc: 'Some journeys are measured not in miles, but in heartbeats.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=80',
    size: 'small',
    position: 'col-span-1 row-span-1',
  },
]

export default function LifestyleSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lifestyle-item', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="lifestyle"
      className="relative py-28 bg-charcoal-2 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-px h-3/4 bg-gradient-to-t from-sunset/20 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-px bg-sunset" />
              <span className="font-ui text-xs font-semibold tracking-[0.3em] uppercase text-sunset">Lifestyle</span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-black text-warm-white leading-tight">
              LIVE LIKE<br />
              <span className="text-gradient-sunset">YOU TRAVEL</span>
            </h2>
          </div>
          <p className="font-ui text-sm text-warm-white/40 max-w-xs mt-6 md:mt-0 leading-relaxed">
            Travel isn't just what you do on vacation. It's a way of seeing the world every single day.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-3 h-auto md:h-[680px]">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`lifestyle-item group relative overflow-hidden cursor-none ${
                i === 0 ? 'md:col-span-2 md:row-span-2' :
                i === 3 ? 'md:col-span-1 md:row-span-2' :
                'md:col-span-1 md:row-span-1'
              }`}
              data-cursor="VIEW"
              style={{ minHeight: i === 0 ? '320px' : '180px' }}
            >
              <div
                className="lifestyle-img absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

              {/* Hover border */}
              <div className="absolute inset-0 border border-transparent group-hover:border-sunset/30 transition-colors duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display text-lg md:text-xl font-bold text-warm-white mb-1">{item.label}</h3>
                <p className="font-ui text-xs text-warm-white/50 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-sm">
                  {item.desc}
                </p>
              </div>

              {/* Number */}
              <div className="absolute top-4 right-4 font-display text-4xl font-black text-warm-white/5">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        <div className="rule-sunset mt-14" />
        <div className="flex justify-between items-center mt-6">
          <p className="font-ui text-xs text-warm-white/30 tracking-widest uppercase">The Wanderly Lifestyle</p>
          <button className="btn-secondary py-2.5 px-5 text-[10px]" data-cursor="READ">
            Read The Magazine →
          </button>
        </div>
      </div>
    </section>
  )
}
