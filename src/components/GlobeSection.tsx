import { useRef, useEffect, Suspense, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X } from 'lucide-react'
import { createEarthTexture, createCloudTexture } from '../utils/earthTexture'

gsap.registerPlugin(ScrollTrigger)

// Lat/Lon to 3D sphere point
function latLonTo3D(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

const DESTINATIONS = [
  { name: 'Bali', lat: -8.3, lon: 115.1, info: 'Island of the Gods', temp: '28°C', tag: 'Culture' },
  { name: 'Kyoto', lat: 35.0, lon: 135.7, info: 'Ancient Imperial City', temp: '22°C', tag: 'Heritage' },
  { name: 'Switzerland', lat: 46.8, lon: 8.2, info: 'Alpine Paradise', temp: '-5°C', tag: 'Adventure' },
  { name: 'Dubai', lat: 25.2, lon: 55.3, info: 'City of the Future', temp: '25°C', tag: 'Luxury' },
  { name: 'Iceland', lat: 64.9, lon: -18.0, info: 'Land of Fire & Ice', temp: '2°C', tag: 'Nature' },
]

// Arc path between two 3D points
function arcPoints(start: THREE.Vector3, end: THREE.Vector3, segments = 40): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const point = new THREE.Vector3().lerpVectors(start, end, t)
    point.normalize().multiplyScalar(1.55 + Math.sin(Math.PI * t) * 0.25)
    points.push(point)
  }
  return points
}

function EarthGlobe({ onSelect, selected }: { onSelect: (idx: number | null) => void; selected: number | null }) {
  const groupRef = useRef<THREE.Group>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const { gl } = useThree()

  // Synchronously generate high-fidelity procedural Earth and Cloud textures
  const earthTexture = useMemo(() => createEarthTexture(), [])
  const cloudTexture = useMemo(() => createCloudTexture(), [])

  // Drag to rotate
  useEffect(() => {
    const canvas = gl.domElement
    const onDown = (e: MouseEvent) => {
      isDragging.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      velocity.current = { x: 0, y: 0 }
    }
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current || !groupRef.current) return
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      groupRef.current.rotation.y += dx * 0.006
      groupRef.current.rotation.x += dy * 0.004
      groupRef.current.rotation.x = Math.max(-0.8, Math.min(0.8, groupRef.current.rotation.x))
      velocity.current = { x: dx * 0.006, y: dy * 0.004 }
      lastMouse.current = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => { isDragging.current = false }

    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [gl])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (!isDragging.current) {
      groupRef.current.rotation.y += 0.003 + velocity.current.x
      groupRef.current.rotation.x += velocity.current.y
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.04
    }
  })

  const markerPositions = DESTINATIONS.map(d => latLonTo3D(d.lat, d.lon, 1.51))

  // Arc paths between consecutive markers
  const arcs = DESTINATIONS.slice(0, -1).map((_, i) => ({
    points: arcPoints(
      new THREE.Vector3(...markerPositions[i]),
      new THREE.Vector3(...markerPositions[i + 1])
    ),
  }))

  return (
    <group ref={groupRef}>
      {/* 1. High-Fidelity Textured Earth */}
      <Sphere args={[1.5, 80, 80]}>
        <meshPhongMaterial
          map={earthTexture}
          shininess={25}
          specular={new THREE.Color('#1f4d75')}
          emissive={new THREE.Color('#03101d')}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* 2. Swirling Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.516, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Atmospheric Outer Glow */}
      <Sphere args={[1.58, 64, 64]}>
        <meshPhongMaterial
          color="#1e7ec8"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* 4. Flight Arc Lines */}
      {arcs.map((arc, i) => (
        <Line
          key={i}
          points={arc.points}
          color="#e8693a"
          lineWidth={1.5}
          transparent
          opacity={0.7}
          dashed
          dashScale={2}
          dashSize={0.06}
          gapSize={0.04}
        />
      ))}

      {/* 5. Destination markers */}
      {markerPositions.map((pos, i) => {
        const isSelected = selected === i
        return (
          <group key={i} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation()
                onSelect(i)
              }}
              renderOrder={2}
            >
              <sphereGeometry args={[isSelected ? 0.05 : 0.038, 16, 16]} />
              <meshBasicMaterial color={isSelected ? '#ffffff' : '#ff7a45'} />
            </mesh>
            <mesh renderOrder={1}>
              <sphereGeometry args={[isSelected ? 0.09 : 0.07, 16, 16]} />
              <meshBasicMaterial
                color="#e8693a"
                transparent
                opacity={isSelected ? 0.6 : 0.25}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function GlobeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<number | null>(0) // Default selected Bali
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!ctx) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.globe-title', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.globe-title', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const dest = selected !== null ? DESTINATIONS[selected] : null

  return (
    <section ref={sectionRef} id="globe" className="relative py-28 bg-charcoal-2 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ocean/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-6 h-px bg-sunset" />
            <span className="font-ui text-xs font-semibold tracking-[0.3em] uppercase text-sunset">
              Interactive Globe
            </span>
            <div className="w-6 h-px bg-sunset" />
          </div>
          <h2 className="globe-title font-display text-[clamp(2rem,5vw,4rem)] font-black text-warm-white">
            EXPLORE THE WORLD
          </h2>
          <p className="globe-title font-ui text-sm text-warm-white/40 mt-3 max-w-md mx-auto">
            Drag the 3D Earth to rotate. Click glowing markers to discover destinations.
          </p>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center gap-10">
          {/* Globe Canvas */}
          <div className="relative w-full lg:w-2/3 h-[500px] lg:h-[620px]" data-cursor="DRAG">
            {webglSupported ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-warm-white/30 font-ui text-sm">
                    Loading Globe...
                  </div>
                }
              >
                <Canvas
                  camera={{ position: [0, 0, 5.0], fov: 42 }}
                  gl={{ antialias: true, alpha: true }}
                  style={{ background: 'transparent' }}
                >
                  <ambientLight intensity={0.9} color="#cce4ff" />
                  <directionalLight position={[6, 4, 5]} intensity={2.2} color="#fff8f0" />
                  <directionalLight position={[-6, -3, -4]} intensity={1.5} color="#0077ee" />
                  <pointLight position={[3, 2, 2]} intensity={1.2} color="#e8693a" />
                  <EarthGlobe onSelect={setSelected} selected={selected} />
                </Canvas>
              </Suspense>
            ) : (
              // Fallback
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-2 border-sunset/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌍</div>
                    <p className="font-ui text-sm text-warm-white/40">WebGL not supported</p>
                  </div>
                </div>
              </div>
            )}

            {/* Destination markers overlay labels */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 justify-center pointer-events-none">
              {DESTINATIONS.map((d, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase border transition-all pointer-events-auto cursor-none ${
                    selected === i
                      ? 'border-sunset bg-sunset text-charcoal'
                      : 'border-sunset/30 text-sunset/70 hover:border-sunset/60'
                  }`}
                  onClick={() => setSelected(i)}
                  data-cursor="VIEW"
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="w-full lg:w-1/3">
            {dest ? (
              <div className="relative p-8 border border-warm-white/10 bg-charcoal-3/50 backdrop-blur-sm">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-warm-white/30 hover:text-warm-white cursor-none transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-sunset animate-pulse" />
                  <span className="font-ui text-xs font-bold tracking-[0.25em] uppercase text-sunset">
                    {dest.tag}
                  </span>
                </div>
                <h3 className="font-display text-5xl font-black text-warm-white mb-1">
                  {dest.name}
                </h3>
                <p className="font-ui text-sm text-warm-white/50 italic mb-6">{dest.info}</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-t border-warm-white/10">
                    <span className="font-ui text-xs tracking-[0.2em] uppercase text-warm-white/30">
                      Avg Temperature
                    </span>
                    <span className="font-ui text-sm font-semibold text-warm-white">
                      {dest.temp}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-warm-white/10">
                    <span className="font-ui text-xs tracking-[0.2em] uppercase text-warm-white/30">
                      Category
                    </span>
                    <span className="font-ui text-sm font-semibold text-warm-white">{dest.tag}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-warm-white/10 border-b border-warm-white/10">
                    <span className="font-ui text-xs tracking-[0.2em] uppercase text-warm-white/30">
                      Status
                    </span>
                    <span className="font-ui text-xs font-bold text-emerald-400 tracking-wider">
                      AVAILABLE
                    </span>
                  </div>
                </div>
                <button
                  className="btn-primary w-full mt-6 justify-center text-[10px]"
                  data-cursor="EXPLORE"
                >
                  PLAN YOUR TRIP →
                </button>
              </div>
            ) : (
              <div className="p-8 border border-warm-white/10 border-dashed text-center">
                <div className="w-12 h-12 rounded-full border border-sunset/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🌍</span>
                </div>
                <p className="font-ui text-sm text-warm-white/30 leading-relaxed">
                  Click on a glowing marker or destination tab to explore
                </p>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: 'Countries', value: '74' },
                { label: 'Cities', value: '120+' },
                { label: 'Experiences', value: '500+' },
                { label: 'Reviews', value: '50K+' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 border border-warm-white/08 bg-charcoal-3/30 text-center"
                >
                  <div className="font-display text-2xl font-bold text-warm-white">
                    {stat.value}
                  </div>
                  <div className="font-ui text-[10px] tracking-[0.2em] uppercase text-warm-white/30 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
