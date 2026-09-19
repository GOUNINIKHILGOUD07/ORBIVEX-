import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import DestinationsSection from './components/DestinationsSection'
import GlobeSection from './components/GlobeSection'
import ExperiencesSection from './components/ExperiencesSection'
import VideoStorySection from './components/VideoStorySection'
import LifestyleSection from './components/LifestyleSection'
import TravelPlannerSection from './components/TravelPlannerSection'
import JournalSection from './components/JournalSection'
import OutroSection from './components/OutroSection'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    // Smooth scroll config for GSAP ScrollTrigger
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })
    
    // Refresh on load
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.killAll()
    }
  }, [])

  return (
    <div className="relative bg-charcoal overflow-x-hidden">
      {/* Custom cursor — hidden on mobile via CSS */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar />

      {/* Main sections */}
      <main>
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Destinations storytelling */}
        <DestinationsSection />

        {/* 3. Interactive 3D Globe */}
        <GlobeSection />

        {/* 4. Experiences */}
        <ExperiencesSection />

        {/* 5. Scroll-driven story */}
        <VideoStorySection />

        {/* 6. Lifestyle */}
        <LifestyleSection />

        {/* 7. Travel Planner */}
        <TravelPlannerSection />

        {/* 8. Journal */}
        <JournalSection />

        {/* 9. Outro + Footer */}
        <OutroSection />
      </main>
    </div>
  )
}
