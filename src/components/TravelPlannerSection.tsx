import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Calendar, Users, Star, Sun, Thermometer } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type Step = 'destination' | 'dates' | 'companions' | 'interests'

const DEST_TYPES = [
  { id: 'beach', label: 'Tropical Beach', emoji: '🏖️' },
  { id: 'mountain', label: 'Mountain Peaks', emoji: '⛰️' },
  { id: 'city', label: 'City Escape', emoji: '🏙️' },
  { id: 'jungle', label: 'Jungle Retreat', emoji: '🌿' },
  { id: 'desert', label: 'Desert Safari', emoji: '🏜️' },
  { id: 'arctic', label: 'Arctic Wonder', emoji: '❄️' },
]
const DURATIONS = ['5 Days', '7 Days', '10 Days', '14 Days', '21 Days']
const COMPANIONS = [
  { id: 'solo', label: 'Solo', emoji: '🧍' },
  { id: 'couple', label: 'Couple', emoji: '👫' },
  { id: 'friends', label: 'Friends', emoji: '👥' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
]
const INTERESTS = [
  { id: 'adventure', label: 'Adventure', emoji: '⛺' },
  { id: 'relaxation', label: 'Relaxation', emoji: '💆' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'luxury', label: 'Luxury', emoji: '💎' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
]

const RESULT_MAP: Record<string, {
  destination: string
  image: string
  activities: string[]
  budget: string
  weather: string
  rating: number
  itinerary: { day: number; title: string; desc: string }[]
}> = {
  beach: {
    destination: '7 DAYS IN BALI',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80',
    activities: ['Temple Sunrise', 'Rice Terrace Walk', 'Surf Lesson', 'Cooking Class', 'Sunset at Tanah Lot'],
    budget: '$1,800 – $2,400',
    weather: '28°C · Sunny',
    rating: 4.9,
    itinerary: [
      { day: 1, title: 'Arrival & Seminyak', desc: 'Check in, beachside sunset cocktails' },
      { day: 2, title: 'Ubud Highlands', desc: 'Tegalalang Rice Terrace, Monkey Forest' },
      { day: 3, title: 'Temple Circuit', desc: 'Besakih, Kehen, Tirta Empul' },
      { day: 4, title: 'Surf & Chill', desc: 'Morning surf lesson, spa afternoon' },
      { day: 5, title: 'Nusa Penida', desc: 'Kelingking Beach, Angel Billabong' },
    ],
  },
  mountain: {
    destination: '10 DAYS IN SWITZERLAND',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=80',
    activities: ['Jungfrau Summit', 'Alpine Skiing', 'Lake Thun', 'Glacier Hike', 'Chamonix Day'],
    budget: '$3,200 – $4,500',
    weather: '-2°C · Snow',
    rating: 4.8,
    itinerary: [
      { day: 1, title: 'Zürich Arrival', desc: 'Old town walk, fondue dinner' },
      { day: 2, title: 'Jungfraujoch', desc: 'Top of Europe, glacier views' },
      { day: 3, title: 'Zermatt', desc: 'Matterhorn base, ski runs' },
      { day: 4, title: 'Lake Lucerne', desc: 'Boat cruise, Chapel Bridge' },
      { day: 5, title: 'Geneva Day', desc: 'Jet d\'Eau, chocolate tasting' },
    ],
  },
  city: {
    destination: '5 DAYS IN TOKYO',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&q=80',
    activities: ['Tsukiji Market', 'Shibuya Crossing', 'Mt Fuji Day', 'Akihabara', 'Teamlab'],
    budget: '$2,100 – $2,800',
    weather: '22°C · Clear',
    rating: 5.0,
    itinerary: [
      { day: 1, title: 'Shinjuku & Shibuya', desc: 'Arrival, neon nights, ramen' },
      { day: 2, title: 'Temples & Markets', desc: 'Senso-ji, Tsukiji, sushi breakfast' },
      { day: 3, title: 'Mt Fuji Day Trip', desc: 'Fuji Five Lakes, onsen evening' },
      { day: 4, title: 'Akihabara & Harajuku', desc: 'Pop culture, fashion, crepes' },
      { day: 5, title: 'Teamlab & Departure', desc: 'Digital art, farewell ramen' },
    ],
  },
  default: {
    destination: '7 DAYS IN BALI',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80',
    activities: ['Temple Sunrise', 'Rice Terrace Walk', 'Surf Lesson', 'Cooking Class', 'Sunset'],
    budget: '$1,800 – $2,400',
    weather: '28°C · Sunny',
    rating: 4.9,
    itinerary: [
      { day: 1, title: 'Arrival & Seminyak', desc: 'Check in, beachside sunset cocktails' },
      { day: 2, title: 'Ubud Highlands', desc: 'Tegalalang Rice Terrace, Monkey Forest' },
      { day: 3, title: 'Temple Circuit', desc: 'Besakih, Kehen, Tirta Empul' },
      { day: 4, title: 'Surf & Chill', desc: 'Morning surf lesson, spa afternoon' },
      { day: 5, title: 'Nusa Penida', desc: 'Kelingking Beach, Angel Billabong' },
    ],
  },
}

const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: 'destination', label: 'Destination', icon: <MapPin size={14} /> },
  { key: 'dates', label: 'Duration', icon: <Calendar size={14} /> },
  { key: 'companions', label: 'With', icon: <Users size={14} /> },
  { key: 'interests', label: 'Interests', icon: <Star size={14} /> },
]

export default function TravelPlannerSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState<Step>('destination')
  const [selections, setSelections] = useState({
    destination: '',
    duration: '7 Days',
    companion: '',
    interests: [] as string[],
  })
  const [result, setResult] = useState<typeof RESULT_MAP[string] | null>(null)
  const [generating, setGenerating] = useState(false)

  const stepIndex = steps.findIndex(s => s.key === currentStep)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.planner-title', {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.planner-title', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const toggleInterest = (id: string) => {
    setSelections(s => ({
      ...s,
      interests: s.interests.includes(id) ? s.interests.filter(i => i !== id) : [...s.interests, id],
    }))
  }

  const generate = () => {
    setGenerating(true)
    setTimeout(() => {
      const key = selections.destination || 'default'
      setResult(RESULT_MAP[key] || RESULT_MAP.default)
      setGenerating(false)
    }, 2000)
  }

  const reset = () => {
    setResult(null)
    setSelections({ destination: '', duration: '7 Days', companion: '', interests: [] })
    setCurrentStep('destination')
  }

  return (
    <section ref={sectionRef} id="planner" className="relative py-28 bg-charcoal overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-sunset/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-6 h-px bg-sunset" />
            <span className="planner-title font-ui text-xs font-semibold tracking-[0.3em] uppercase text-sunset">Travel Planner</span>
            <div className="w-6 h-px bg-sunset" />
          </div>
          <h2 className="planner-title font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black text-warm-white leading-tight">
            BUILD YOUR ESCAPE
          </h2>
          <p className="planner-title font-ui text-sm text-warm-white/40 max-w-md mx-auto mt-4">
            Tell us your dream. We'll craft the perfect journey.
          </p>
        </div>

        {!result ? (
          <div className="max-w-3xl mx-auto">
            {/* Step progress */}
            <div className="flex items-center gap-0 mb-10">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center flex-1">
                  <button
                    onClick={() => i <= stepIndex && setCurrentStep(s.key)}
                    className={`flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase cursor-none transition-colors duration-300 ${
                      i <= stepIndex ? 'text-sunset' : 'text-warm-white/20'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] transition-all duration-300 ${
                      i < stepIndex ? 'bg-sunset border-sunset text-white' :
                      i === stepIndex ? 'border-sunset text-sunset' :
                      'border-warm-white/15 text-warm-white/20'
                    }`}>
                      {i < stepIndex ? '✓' : i + 1}
                    </div>
                    <span className="hidden md:inline">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-colors duration-500 ${i < stepIndex ? 'bg-sunset' : 'bg-warm-white/10'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="min-h-[260px]"
              >
                {currentStep === 'destination' && (
                  <div>
                    <h3 className="font-display text-2xl font-bold text-warm-white mb-6">Where do you want to go?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {DEST_TYPES.map(d => (
                        <button
                          key={d.id}
                          onClick={() => setSelections(s => ({ ...s, destination: d.id }))}
                          data-cursor="SELECT"
                          className={`planner-chip p-4 text-left cursor-none transition-all duration-300 ${selections.destination === d.id ? 'selected' : ''}`}
                        >
                          <div className="text-2xl mb-2">{d.emoji}</div>
                          <div className="font-ui text-xs font-semibold tracking-wide text-warm-white/80">{d.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {currentStep === 'dates' && (
                  <div>
                    <h3 className="font-display text-2xl font-bold text-warm-white mb-6">How long will you travel?</h3>
                    <div className="flex flex-wrap gap-3">
                      {DURATIONS.map(d => (
                        <button
                          key={d}
                          onClick={() => setSelections(s => ({ ...s, duration: d }))}
                          data-cursor="SELECT"
                          className={`planner-chip px-6 py-3 text-sm font-semibold cursor-none ${selections.duration === d ? 'selected' : ''}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <p className="font-ui text-xs text-warm-white/30 mt-6 italic">* Custom durations available on request</p>
                  </div>
                )}
                {currentStep === 'companions' && (
                  <div>
                    <h3 className="font-display text-2xl font-bold text-warm-white mb-6">Who's coming with you?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {COMPANIONS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelections(s => ({ ...s, companion: c.id }))}
                          data-cursor="SELECT"
                          className={`planner-chip p-5 text-center cursor-none ${selections.companion === c.id ? 'selected' : ''}`}
                        >
                          <div className="text-3xl mb-2">{c.emoji}</div>
                          <div className="font-ui text-xs font-semibold tracking-wide text-warm-white/80">{c.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {currentStep === 'interests' && (
                  <div>
                    <h3 className="font-display text-2xl font-bold text-warm-white mb-2">What excites you most?</h3>
                    <p className="font-ui text-xs text-warm-white/40 mb-6">Select all that apply</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {INTERESTS.map(interest => (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          data-cursor="SELECT"
                          className={`planner-chip p-4 text-left cursor-none ${selections.interests.includes(interest.id) ? 'selected' : ''}`}
                        >
                          <div className="text-xl mb-1">{interest.emoji}</div>
                          <div className="font-ui text-xs font-semibold tracking-wide text-warm-white/80">{interest.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-warm-white/10">
              <button
                onClick={() => {
                  const prev = steps[stepIndex - 1]
                  if (prev) setCurrentStep(prev.key)
                }}
                disabled={stepIndex === 0}
                className="font-ui text-xs font-bold tracking-[0.2em] uppercase text-warm-white/30 hover:text-warm-white transition-colors disabled:opacity-0 cursor-none"
              >
                ← Back
              </button>
              {stepIndex < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(steps[stepIndex + 1].key)}
                  className="btn-primary py-3 px-8 text-[10px]"
                  data-cursor="NEXT"
                >
                  NEXT STEP →
                </button>
              ) : (
                <button
                  onClick={generate}
                  className="btn-primary py-3 px-8 text-[10px]"
                  data-cursor="GENERATE"
                  disabled={generating}
                >
                  {generating ? 'CRAFTING YOUR ESCAPE...' : 'GENERATE MY ESCAPE ✨'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Result Card */
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-sm border border-warm-white/10">
              {/* Header image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{ backgroundImage: `url(${result.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-sunset animate-pulse" />
                    <span className="font-ui text-xs font-bold tracking-[0.3em] uppercase text-sunset">Your Personalized Escape</span>
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl font-black text-warm-white">{result.destination}</h3>
                </div>
              </div>

              {/* Details */}
              <div className="bg-charcoal-3 p-8">
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-0 mb-8 border border-warm-white/10">
                  <div className="p-4 text-center border-r border-warm-white/10">
                    <Thermometer size={16} className="text-sunset mx-auto mb-2" />
                    <div className="font-ui text-xs text-warm-white/30 tracking-widest uppercase mb-1">Weather</div>
                    <div className="font-ui text-sm font-bold text-warm-white">{result.weather}</div>
                  </div>
                  <div className="p-4 text-center border-r border-warm-white/10">
                    <Sun size={16} className="text-sunset mx-auto mb-2" />
                    <div className="font-ui text-xs text-warm-white/30 tracking-widest uppercase mb-1">Budget</div>
                    <div className="font-ui text-sm font-bold text-warm-white">{result.budget}</div>
                  </div>
                  <div className="p-4 text-center">
                    <Star size={16} className="text-sunset mx-auto mb-2" />
                    <div className="font-ui text-xs text-warm-white/30 tracking-widest uppercase mb-1">Rating</div>
                    <div className="font-ui text-sm font-bold text-warm-white">{result.rating}★</div>
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-8">
                  <h4 className="font-ui text-xs font-bold tracking-[0.25em] uppercase text-warm-white/40 mb-3">Top Activities</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.activities.map(a => (
                      <span key={a} className="px-3 py-1.5 text-xs font-medium text-warm-white/70 border border-warm-white/15">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mini itinerary */}
                <div className="mb-8">
                  <h4 className="font-ui text-xs font-bold tracking-[0.25em] uppercase text-warm-white/40 mb-4">Itinerary Preview</h4>
                  <div className="space-y-3">
                    {result.itinerary.map(day => (
                      <div key={day.day} className="flex gap-4 items-start">
                        <div className="w-8 h-8 border border-sunset/40 flex items-center justify-center text-xs font-bold text-sunset flex-shrink-0">
                          {day.day}
                        </div>
                        <div>
                          <div className="font-ui text-sm font-semibold text-warm-white">{day.title}</div>
                          <div className="font-ui text-xs text-warm-white/40">{day.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="btn-primary flex-1 justify-center text-[10px]" data-cursor="BOOK">
                    BOOK THIS ESCAPE →
                  </button>
                  <button onClick={reset} className="btn-secondary flex-1 justify-center text-[10px]" data-cursor="RESTART">
                    BUILD ANOTHER
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
