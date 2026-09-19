import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Compass, Globe, Sparkles, BookOpen, Heart, ChevronRight } from 'lucide-react'

// Section ID map — matches all page section ids
const NAV_LINKS = [
  { label: 'Discover', id: 'discover' },
  { label: 'Destinations', id: 'destinations' },
  { label: 'Experiences', id: 'experiences' },
  { label: 'Lifestyle', id: 'lifestyle' },
  { label: 'Journal', id: 'journal' },
]

// Search suggestions for the live search overlay
const SEARCH_SUGGESTIONS = [
  { icon: '🏝️', label: 'Bali, Indonesia', tag: 'Tropical' },
  { icon: '🗼', label: 'Tokyo, Japan', tag: 'Culture' },
  { icon: '🏔️', label: 'Swiss Alps, Switzerland', tag: 'Adventure' },
  { icon: '🌅', label: 'Santorini, Greece', tag: 'Romantic' },
  { icon: '🦁', label: 'Serengeti, Tanzania', tag: 'Wildlife' },
  { icon: '🏙️', label: 'Dubai, UAE', tag: 'Luxury' },
  { icon: '❄️', label: 'Iceland, Northern Lights', tag: 'Nature' },
  { icon: '🎭', label: 'Paris, France', tag: 'Heritage' },
  { icon: '🌊', label: 'Maldives', tag: 'Beach' },
  { icon: '🎑', label: 'Kyoto, Japan', tag: 'Zen' },
]

// Quick-launch categories
const QUICK_CATEGORIES = [
  { icon: <Globe size={16} />, label: 'All Destinations', id: 'destinations' },
  { icon: <Sparkles size={16} />, label: 'Experiences', id: 'experiences' },
  { icon: <Heart size={16} />, label: 'Lifestyle', id: 'lifestyle' },
  { icon: <BookOpen size={16} />, label: 'Journal', id: 'journal' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [getStartedOpen, setGetStartedOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 120)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  // Escape key closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
        setGetStartedOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMenuOpen(false)
      setSearchOpen(false)
      setGetStartedOpen(false)
    }
  }, [])

  const filteredSuggestions = searchQuery.length > 0
    ? SEARCH_SUGGESTIONS.filter(s =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SUGGESTIONS

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'navbar-glass py-3' : 'py-5'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* ── Brand Logo ── */}
          <button
            className="flex items-center gap-2.5 select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Go to top"
          >
            {/* Animated brand mark */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-sunset opacity-70 animate-pulse" />
              <Compass size={16} className="text-sunset group-hover:rotate-45 transition-transform duration-500" />
            </div>
            {/* Unique brand name: ORBIVEX */}
            <div className="flex flex-col leading-none">
              <span className="font-ui font-black text-[18px] tracking-[0.22em] text-warm-white uppercase group-hover:text-sunset transition-colors duration-300">
                ORBIVEX
              </span>
              <span className="font-ui text-[8px] tracking-[0.3em] text-warm-white/40 uppercase">
                Beyond Ordinary
              </span>
            </div>
          </button>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="font-ui text-[11px] font-medium tracking-[0.18em] uppercase text-warm-white/60 hover:text-warm-white transition-colors duration-300 relative group py-1"
                aria-label={`Go to ${link.label}`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-sunset transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* ── Right Action Icons ── */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => {
                setSearchOpen(true)
                setMenuOpen(false)
                setGetStartedOpen(false)
              }}
              className="p-2 text-warm-white/60 hover:text-warm-white hover:bg-warm-white/8 rounded-lg transition-all duration-300"
              aria-label="Open search"
            >
              <Search size={18} strokeWidth={1.6} />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => {
                setMenuOpen(v => !v)
                setSearchOpen(false)
              }}
              className="p-2 text-warm-white/60 hover:text-warm-white hover:bg-warm-white/8 rounded-lg transition-all duration-300 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
            </button>

            {/* GET STARTED button */}
            <button
              onClick={() => {
                setGetStartedOpen(v => !v)
                setMenuOpen(false)
                setSearchOpen(false)
              }}
              className="hidden md:flex btn-primary py-2.5 px-5 text-[10px] items-center gap-1.5 relative"
              aria-label="Get Started"
            >
              <Sparkles size={11} />
              GET STARTED
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════
          SEARCH OVERLAY — Full-screen immersive search
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-charcoal/97 backdrop-blur-xl flex flex-col"
          >
            {/* Search Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-warm-white/8">
              <div className="flex items-center gap-3">
                <Compass size={20} className="text-sunset" />
                <span className="font-ui font-black text-lg tracking-[0.2em] text-warm-white uppercase">ORBIVEX</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-warm-white/60 hover:text-warm-white hover:bg-warm-white/8 rounded-lg transition-all duration-200"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-6 pt-10 pb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-white/30" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && filteredSuggestions.length > 0) {
                      scrollTo('destinations')
                    }
                  }}
                  placeholder="Search destinations, experiences, moods…"
                  className="w-full bg-warm-white/5 border border-warm-white/12 rounded-xl px-12 py-4 text-warm-white placeholder-warm-white/25 font-ui text-base tracking-wide focus:outline-none focus:border-sunset/60 focus:bg-warm-white/8 transition-all duration-300"
                  aria-label="Search input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-white/40 hover:text-warm-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Quick categories */}
            {!searchQuery && (
              <div className="px-6 max-w-2xl mx-auto w-full mb-6">
                <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-warm-white/30 mb-3">Quick Explore</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => scrollTo(cat.id)}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-warm-white/5 border border-warm-white/10 rounded-full text-warm-white/70 hover:text-warm-white hover:border-sunset/50 hover:bg-sunset/8 font-ui text-xs tracking-wide transition-all duration-200"
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions List */}
            <div className="flex-1 overflow-y-auto px-6">
              <div className="max-w-2xl mx-auto">
                {searchQuery && filteredSuggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-ui text-warm-white/40 text-sm">No destinations found for "{searchQuery}"</p>
                    <button
                      onClick={() => scrollTo('destinations')}
                      className="mt-4 btn-primary text-[10px] px-6 py-2.5 inline-flex items-center gap-2"
                    >
                      Browse All Destinations <ChevronRight size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-warm-white/30 mb-3">
                      {searchQuery ? `Results for "${searchQuery}"` : 'Popular Destinations'}
                    </p>
                    <div className="space-y-1">
                      {filteredSuggestions.map((item, i) => (
                        <motion.button
                          key={item.label}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          onClick={() => scrollTo('destinations')}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-warm-white/6 group transition-all duration-200 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-ui text-sm text-warm-white/80 group-hover:text-warm-white transition-colors">
                              {item.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-ui text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-sunset/12 text-sunset border border-sunset/20">
                              {item.tag}
                            </span>
                            <ChevronRight size={14} className="text-warm-white/20 group-hover:text-sunset group-hover:translate-x-0.5 transition-all duration-200" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Search Footer */}
            <div className="border-t border-warm-white/8 px-6 py-4 flex items-center justify-between">
              <p className="font-ui text-[10px] tracking-[0.2em] uppercase text-warm-white/25">
                Press <kbd className="px-1.5 py-0.5 bg-warm-white/8 rounded text-warm-white/40 font-mono text-[10px]">ESC</kbd> to close
              </p>
              <button
                onClick={() => scrollTo('destinations')}
                className="font-ui text-[10px] tracking-[0.2em] uppercase text-sunset hover:text-sunset/80 flex items-center gap-1.5 transition-colors"
              >
                View All <ChevronRight size={11} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          GET STARTED PANEL — Dropdown action panel
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {getStartedOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGetStartedOpen(false)}
              className="fixed inset-0 z-[55] bg-charcoal/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed top-20 right-4 sm:right-6 z-[56] w-72 bg-charcoal-2 border border-warm-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
            >
              {/* Panel Header */}
              <div className="px-5 py-4 border-b border-warm-white/8 bg-gradient-to-r from-sunset/8 to-transparent">
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles size={14} className="text-sunset" />
                  <span className="font-ui font-bold text-xs tracking-[0.2em] uppercase text-sunset">Get Started</span>
                </div>
                <p className="font-ui text-[11px] text-warm-white/50">Your journey begins here</p>
              </div>

              {/* Actions */}
              <div className="p-3 space-y-1">
                <button
                  onClick={() => scrollTo('planner')}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-sunset/10 group transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-sunset/15 flex items-center justify-center text-sunset group-hover:bg-sunset/25 transition-colors">
                    <Compass size={15} />
                  </div>
                  <div>
                    <div className="font-ui text-xs font-semibold text-warm-white group-hover:text-sunset transition-colors">Plan a Trip</div>
                    <div className="font-ui text-[10px] text-warm-white/40">AI-powered itinerary builder</div>
                  </div>
                  <ChevronRight size={13} className="ml-auto text-warm-white/20 group-hover:text-sunset group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => scrollTo('destinations')}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-warm-white/5 group transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-warm-white/8 flex items-center justify-center text-warm-white/70 group-hover:bg-warm-white/15 transition-colors">
                    <Globe size={15} />
                  </div>
                  <div>
                    <div className="font-ui text-xs font-semibold text-warm-white">Explore Destinations</div>
                    <div className="font-ui text-[10px] text-warm-white/40">120+ curated locations</div>
                  </div>
                  <ChevronRight size={13} className="ml-auto text-warm-white/20 group-hover:text-warm-white/60 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => scrollTo('experiences')}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-warm-white/5 group transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-warm-white/8 flex items-center justify-center text-warm-white/70 group-hover:bg-warm-white/15 transition-colors">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <div className="font-ui text-xs font-semibold text-warm-white">Experiences</div>
                    <div className="font-ui text-[10px] text-warm-white/40">Adventure, Culture & more</div>
                  </div>
                  <ChevronRight size={13} className="ml-auto text-warm-white/20 group-hover:text-warm-white/60 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => scrollTo('journal')}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-warm-white/5 group transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-warm-white/8 flex items-center justify-center text-warm-white/70 group-hover:bg-warm-white/15 transition-colors">
                    <BookOpen size={15} />
                  </div>
                  <div>
                    <div className="font-ui text-xs font-semibold text-warm-white">Travel Journal</div>
                    <div className="font-ui text-[10px] text-warm-white/40">Stories from the world</div>
                  </div>
                  <ChevronRight size={13} className="ml-auto text-warm-white/20 group-hover:text-warm-white/60 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* CTA footer */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => scrollTo('planner')}
                  className="w-full btn-primary justify-center text-[10px] py-3 gap-2"
                >
                  <Sparkles size={11} />
                  BUILD MY ITINERARY →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          MOBILE MENU — Full-screen overlay
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-charcoal/97 backdrop-blur-xl flex flex-col md:hidden"
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-warm-white/8">
              <div className="flex items-center gap-2.5">
                <Compass size={18} className="text-sunset" />
                <span className="font-ui font-black text-base tracking-[0.2em] text-warm-white uppercase">ORBIVEX</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-warm-white/60 hover:text-warm-white rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  onClick={() => scrollTo(link.id)}
                  className="flex items-center justify-between py-4 border-b border-warm-white/8 group"
                >
                  <span className="font-display text-2xl font-light text-warm-white group-hover:text-sunset transition-colors duration-300">
                    {link.label}
                  </span>
                  <ChevronRight size={18} className="text-warm-white/20 group-hover:text-sunset group-hover:translate-x-1 transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            {/* Mobile footer actions */}
            <div className="px-8 pb-10 space-y-3">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setSearchOpen(true)
                }}
                className="w-full flex items-center gap-3 py-3 border border-warm-white/15 rounded-xl text-warm-white/70 hover:text-warm-white hover:border-warm-white/30 justify-center font-ui text-sm tracking-wider transition-all"
              >
                <Search size={15} /> Search Destinations
              </button>
              <button
                onClick={() => scrollTo('planner')}
                className="w-full btn-primary justify-center gap-2"
              >
                <Sparkles size={13} />
                GET STARTED →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
