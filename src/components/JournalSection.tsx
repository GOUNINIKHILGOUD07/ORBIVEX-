import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const articles = [
  {
    id: 'tokyo',
    title: '48 HOURS IN TOKYO',
    subtitle: 'The Ultimate City Sprint',
    category: 'City Guide',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80',
    excerpt: 'Two days isn\'t nearly enough. But if you do it right — navigating from Tsukiji to Shibuya to Shinjuku with the precision of a local — it becomes the most intensely alive 48 hours of your life.',
    featured: true,
  },
  {
    id: 'bali-quiet',
    title: 'THE QUIET SIDE OF BALI',
    subtitle: 'Beyond the Crowds',
    category: 'Hidden Gems',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=80',
    excerpt: 'Leave Seminyak\'s noise behind. Follow the mountain road north to Munduk, where waterfalls crash through coffee plantations and mornings smell of cloves and damp earth.',
    featured: false,
  },
  {
    id: 'northern-lights',
    title: 'CHASING THE NORTHERN LIGHTS',
    subtitle: 'Iceland in Winter',
    category: 'Adventure',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=80',
    excerpt: 'You stand in -15°C darkness, breath crystallizing, eyes scanning the sky. And then — a ripple of green. The universe winks at you. Nothing prepares you for the feeling.',
    featured: false,
  },
  {
    id: 'slow-travel',
    title: 'WHY SLOW TRAVEL IS THE FUTURE',
    subtitle: 'A Manifesto',
    category: 'Philosophy',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=80',
    excerpt: 'We\'ve been taught that more is better. More countries, more stamps, more content. But the travelers who come back changed aren\'t those who saw the most — they\'re those who stayed the longest.',
    featured: false,
  },
]

export default function JournalSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.journal-title', {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      gsap.from('.journal-card', {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const [featured, ...rest] = articles

  return (
    <section ref={sectionRef} id="journal" className="relative py-28 bg-charcoal-2 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sunset/30 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-px bg-sunset" />
              <span className="journal-title font-ui text-xs font-semibold tracking-[0.3em] uppercase text-sunset">Travel Journal</span>
            </div>
            <h2 className="journal-title font-display text-[clamp(2.5rem,6vw,5rem)] font-black text-warm-white leading-tight">
              STORIES FROM<br />
              <span className="text-gradient-sunset">THE ROAD</span>
            </h2>
          </div>
          <button className="journal-title btn-secondary py-3 px-6 text-[10px] mt-6 md:mt-0 self-start md:self-auto" data-cursor="READ">
            All Articles →
          </button>
        </div>

        {/* Featured Article */}
        <div
          className="journal-card group relative overflow-hidden cursor-none mb-3 h-[420px] md:h-[520px]"
          data-cursor="READ"
        >
          <div
            className="journal-img absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featured.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

          {/* Featured badge */}
          <div className="absolute top-8 left-8">
            <span className="px-3 py-1.5 text-[10px] font-bold tracking-[0.25em] uppercase bg-sunset text-white">
              Featured
            </span>
          </div>

          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-ui text-xs font-bold tracking-[0.2em] uppercase text-sunset">{featured.category}</span>
              <span className="w-1 h-1 rounded-full bg-warm-white/30" />
              <div className="flex items-center gap-1 text-warm-white/30">
                <Clock size={11} />
                <span className="font-ui text-xs">{featured.readTime}</span>
              </div>
            </div>
            <h3 className="font-display text-3xl md:text-5xl font-black text-warm-white leading-tight mb-2">
              {featured.title}
            </h3>
            <p className="font-display text-base text-warm-white/50 italic mb-4">{featured.subtitle}</p>
            <p className="font-ui text-sm text-warm-white/50 leading-relaxed mb-6 max-w-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {featured.excerpt}
            </p>
            <button
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-warm-white hover:text-sunset transition-colors duration-300 cursor-none"
              data-cursor="READ"
            >
              READ FULL STORY
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rest.map(article => (
            <div
              key={article.id}
              className="journal-card group relative overflow-hidden cursor-none h-72"
              data-cursor="READ"
            >
              <div
                className="journal-img absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${article.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-ui text-[10px] font-bold tracking-[0.2em] uppercase text-sunset">{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-warm-white/20" />
                  <div className="flex items-center gap-1 text-warm-white/30">
                    <Clock size={10} />
                    <span className="font-ui text-[10px]">{article.readTime}</span>
                  </div>
                </div>
                <h3 className="font-display text-lg font-black text-warm-white leading-tight mb-1">
                  {article.title}
                </h3>
                <p className="font-display text-xs text-warm-white/40 italic mb-3">{article.subtitle}</p>
                <p className="font-ui text-xs text-warm-white/40 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Hover arrow */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight size={14} className="text-sunset" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
