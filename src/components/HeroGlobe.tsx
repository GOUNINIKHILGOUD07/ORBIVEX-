import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { createEarthTexture, createCloudTexture } from '../utils/earthTexture'

// Convert Lat/Lon to 3D sphere coordinate
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

// Generate smooth flight arc points
function createFlightArcPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  altitude = 0.12,
  segments = 48
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const p = new THREE.Vector3().lerpVectors(start, end, t)
    const arcHeight = Math.sin(Math.PI * t) * altitude
    p.normalize().multiplyScalar(start.length() + arcHeight)
    points.push(p)
  }
  return points
}

// Global Hubs
export const HERO_HUBS = [
  {
    id: 'iceland',
    name: 'ICELAND',
    subtitle: 'Reykjavik',
    lat: 64.9,
    lon: -18.5,
    labelOffset: [-65, -22],
  },
  {
    id: 'switzerland',
    name: 'SWITZERLAND',
    subtitle: 'Alps',
    lat: 46.8,
    lon: 8.2,
    labelOffset: [65, -20],
  },
  {
    id: 'dubai',
    name: 'DUBAI',
    subtitle: 'Emirates',
    lat: 25.2,
    lon: 55.3,
    labelOffset: [62, 4],
  },
  {
    id: 'tokyo',
    name: 'TOKYO',
    subtitle: 'Japan',
    lat: 35.7,
    lon: 139.7,
    labelOffset: [-68, 6],
  },
  {
    id: 'bali',
    name: 'BALI',
    subtitle: 'Indonesia',
    lat: -8.4,
    lon: 115.2,
    labelOffset: [62, 14],
  },
]

// Sleek Miniature 3D Passenger Jet
function AirplaneModel() {
  const airplaneGroup = useMemo(() => {
    const group = new THREE.Group()

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.2,
    })
    const darkGlass = new THREE.MeshBasicMaterial({ color: 0x0f172a })
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5 })

    // Fuselage body
    const bodyGeom = new THREE.CylinderGeometry(0.007, 0.007, 0.08, 12)
    bodyGeom.rotateX(Math.PI / 2)
    const body = new THREE.Mesh(bodyGeom, whiteMat)
    group.add(body)

    // Nose
    const noseGeom = new THREE.ConeGeometry(0.007, 0.022, 12)
    noseGeom.rotateX(Math.PI / 2)
    const nose = new THREE.Mesh(noseGeom, whiteMat)
    nose.position.z = 0.05
    group.add(nose)

    // Windshield
    const glassGeom = new THREE.BoxGeometry(0.008, 0.005, 0.012)
    const glass = new THREE.Mesh(glassGeom, darkGlass)
    glass.position.set(0, 0.005, 0.038)
    group.add(glass)

    // Swept wings
    const wingGeom = new THREE.BoxGeometry(0.11, 0.0018, 0.02)
    const wings = new THREE.Mesh(wingGeom, whiteMat)
    wings.position.set(0, 0, 0)
    group.add(wings)

    // Twin engines
    const leftEngine = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.016, 8), engineMat)
    leftEngine.rotateX(Math.PI / 2)
    leftEngine.position.set(-0.028, -0.005, 0)
    group.add(leftEngine)

    const rightEngine = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.016, 8), engineMat)
    rightEngine.rotateX(Math.PI / 2)
    rightEngine.position.set(0.028, -0.005, 0)
    group.add(rightEngine)

    // Tail fin
    const tailGeom = new THREE.BoxGeometry(0.0016, 0.02, 0.018)
    const tail = new THREE.Mesh(tailGeom, whiteMat)
    tail.position.set(0, 0.01, -0.038)
    group.add(tail)

    // Horizontal tail
    const hTailGeom = new THREE.BoxGeometry(0.04, 0.0014, 0.01)
    const hTail = new THREE.Mesh(hTailGeom, whiteMat)
    hTail.position.set(0, 0.006, -0.038)
    group.add(hTail)

    group.scale.set(0.55, 0.55, 0.55)
    return group
  }, [])

  return <primitive object={airplaneGroup} />
}

// Flight Arc Lines and Cruising Airplane
function FlightNetwork({ radius }: { radius: number }) {
  const airplaneRef = useRef<THREE.Group>(null)
  const pulsesRef = useRef<THREE.Mesh[]>([])

  const routes = useMemo(() => {
    const pairs = [
      ['switzerland', 'iceland'],
      ['switzerland', 'dubai'],
      ['dubai', 'tokyo'],
      ['dubai', 'bali'],
      ['bali', 'tokyo'],
      ['iceland', 'dubai'],
    ]

    return pairs.map(([fromId, toId]) => {
      const fromHub = HERO_HUBS.find(h => h.id === fromId)!
      const toHub = HERO_HUBS.find(h => h.id === toId)!
      const vStart = latLonToVector3(fromHub.lat, fromHub.lon, radius)
      const vEnd = latLonToVector3(toHub.lat, toHub.lon, radius)
      const pts = createFlightArcPoints(vStart, vEnd, 0.11, 40)
      const curve = new THREE.CatmullRomCurve3(pts)
      const geom = new THREE.BufferGeometry().setFromPoints(pts)
      return { geom, curve, pts }
    })
  }, [radius])

  const mainFlightCurve = routes[1]?.curve // Switzerland -> Dubai main route

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()

    // Smooth airplane flight along curve
    if (airplaneRef.current && mainFlightCurve) {
      const t = (elapsed * 0.06) % 1
      const pos = mainFlightCurve.getPointAt(t)
      const tangent = mainFlightCurve.getTangentAt(t).normalize()

      airplaneRef.current.position.copy(pos)

      const up = pos.clone().normalize()
      const right = new THREE.Vector3().crossVectors(up, tangent).normalize()
      const correctedUp = new THREE.Vector3().crossVectors(tangent, right).normalize()

      const m = new THREE.Matrix4()
      m.makeBasis(right, correctedUp, tangent)
      airplaneRef.current.quaternion.setFromRotationMatrix(m)
    }

    // Animate glowing light pulses
    routes.forEach((route, idx) => {
      const pulse = pulsesRef.current[idx]
      if (pulse && route.curve) {
        const t = ((elapsed * 0.16) + (idx * 0.2)) % 1
        const p = route.curve.getPointAt(t)
        pulse.position.copy(p)
      }
    })
  })

  return (
    <group>
      {routes.map((route, i) => (
        <group key={i}>
          <primitive
            object={
              new THREE.Line(
                route.geom,
                new THREE.LineBasicMaterial({
                  color: new THREE.Color('#e8693a'),
                  transparent: true,
                  opacity: 0.7,
                  linewidth: 1.5,
                })
              )
            }
          />
          {/* Subtle light pulse */}
          <mesh ref={(el) => { if (el) pulsesRef.current[i] = el }}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* 3D Airplane */}
      <group ref={airplaneRef}>
        <AirplaneModel />
      </group>
    </group>
  )
}

// Destination Markers and Typographic Callouts
function DestinationMarkers({
  radius,
  activeHub,
  onHover,
}: {
  radius: number
  activeHub: string | null
  onHover: (id: string | null) => void
}) {
  const { camera } = useThree()
  const [visibilities, setVisibilities] = useState<Record<string, boolean>>({})

  const hubs = useMemo(() => {
    return HERO_HUBS.map(hub => ({
      ...hub,
      pos: latLonToVector3(hub.lat, hub.lon, radius + 0.008),
    }))
  }, [radius])

  // Fade out labels on back of Earth
  useFrame(() => {
    const updated: Record<string, boolean> = {}
    const camPos = camera.position.clone()

    hubs.forEach(hub => {
      const normal = hub.pos.clone().normalize()
      const toCam = camPos.clone().sub(hub.pos).normalize()
      updated[hub.id] = normal.dot(toCam) > 0.15
    })

    setVisibilities(prev => {
      for (const k of Object.keys(updated)) {
        if (updated[k] !== prev[k]) return updated
      }
      return prev
    })
  })

  return (
    <group>
      {hubs.map((hub) => {
        const isVisible = visibilities[hub.id] !== false
        const isHovered = activeHub === hub.id

        return (
          <group
            key={hub.id}
            position={hub.pos}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHover(hub.id)
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              onHover(null)
            }}
          >
            {/* Center bright pin */}
            <mesh>
              <sphereGeometry args={[0.016, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Glowing orange halo */}
            <mesh>
              <sphereGeometry args={[0.028, 16, 16]} />
              <meshBasicMaterial
                color="#e8693a"
                transparent
                opacity={isHovered ? 0.85 : 0.55}
              />
            </mesh>

            {/* Delicate pulse ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.026, 0.036, 24]} />
              <meshBasicMaterial
                color="#ffaa40"
                transparent
                opacity={isHovered ? 0.7 : 0.35}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Clean HTML Label with Leader Line */}
            <Html
              position={[0, 0, 0]}
              center
              distanceFactor={9}
              style={{
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                opacity: isVisible ? 1 : 0,
                transform: `scale(${isVisible ? 1 : 0.7})`,
              }}
            >
              <div
                className="flex items-center gap-1.5 select-none whitespace-nowrap"
                style={{
                  transform: `translate(${hub.labelOffset[0]}px, ${hub.labelOffset[1]}px)`,
                }}
              >
                <div
                  className={`h-px transition-all duration-300 ${
                    isHovered ? 'w-6 bg-sunset' : 'w-4 bg-warm-white/40'
                  }`}
                />
                <div
                  className={`px-2 py-0.5 rounded backdrop-blur-md transition-all duration-300 ${
                    isHovered
                      ? 'bg-charcoal/90 border border-sunset text-sunset shadow-lg shadow-sunset/30 scale-105'
                      : 'bg-charcoal/60 border border-warm-white/20 text-warm-white'
                  }`}
                >
                  <div className="font-ui text-[10px] font-bold tracking-[0.2em] uppercase leading-none">
                    {hub.name}
                  </div>
                </div>
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

// Atmospheric Glow
function AtmosphereGlow({ radius }: { radius: number }) {
  return (
    <group>
      {/* Cyan/Blue Inner Atmospheric Halo */}
      <Sphere args={[radius * 1.035, 64, 64]}>
        <meshPhongMaterial
          color="#1e7ec8"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Subtle Outer Halo */}
      <Sphere args={[radius * 1.08, 48, 48]}>
        <meshBasicMaterial
          color="#0f528a"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}

// Globe Mesh Component
function GlobeMesh({
  radius,
  activeHub,
  onHoverHub,
}: {
  radius: number
  activeHub: string | null
  onHoverHub: (id: string | null) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const { gl } = useThree()

  // Original Normal Blue Earth Texture & Clouds
  const earthTexture = useMemo(() => createEarthTexture(), [])
  const cloudTexture = useMemo(() => createCloudTexture(), [])

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      lastPointer.current = { x: clientX, y: clientY }
      velocity.current = { x: 0, y: 0 }
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !groupRef.current) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const dx = clientX - lastPointer.current.x
      const dy = clientY - lastPointer.current.y

      groupRef.current.rotation.y += dx * 0.007
      groupRef.current.rotation.x += dy * 0.005
      groupRef.current.rotation.x = Math.max(-0.65, Math.min(0.65, groupRef.current.rotation.x))

      velocity.current = { x: dx * 0.007, y: dy * 0.005 }
      lastPointer.current = { x: clientX, y: clientY }
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    canvas.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)

    canvas.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('touchend', onPointerUp)

    return () => {
      canvas.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      canvas.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
    }
  }, [gl])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (!isDragging.current) {
      groupRef.current.rotation.y += 0.0025 + velocity.current.x
      groupRef.current.rotation.x += velocity.current.y
      velocity.current.x *= 0.93
      velocity.current.y *= 0.93
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.04
    }
  })

  return (
    <group ref={groupRef} rotation={[0.2, 0.45, 0.05]}>
      {/* 1. Core High-Fidelity Blue Earth Sphere */}
      <Sphere args={[radius, 72, 72]}>
        <meshPhongMaterial
          map={earthTexture}
          shininess={28}
          specular={new THREE.Color('#215a8c')}
          emissive={new THREE.Color('#041220')}
          emissiveIntensity={0.25}
        />
      </Sphere>

      {/* 2. Atmospheric Clouds Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[radius * 1.014, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Flight Network & Airplane */}
      <FlightNetwork radius={radius} />

      {/* 4. Destination Markers & Labels */}
      <DestinationMarkers
        radius={radius}
        activeHub={activeHub}
        onHover={onHoverHub}
      />
    </group>
  )
}

export default function HeroGlobe() {
  const [activeHub, setActiveHub] = useState<string | null>(null)

  const activeHubData = useMemo(() => {
    return HERO_HUBS.find(h => h.id === activeHub)
  }, [activeHub])

  // Globe radius — slightly larger for the bigger container
  const radius = 1.0

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* Soft Ambient Radial Nebula Glow Behind Earth */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[85%] rounded-full bg-radial from-ocean/30 via-ocean/10 to-transparent blur-3xl transform-gpu" />
        <div className="w-[55%] h-[55%] rounded-full bg-radial from-sunset/20 to-transparent blur-3xl transform-gpu" />
      </div>

      {/* Three.js Canvas with generous camera frustum */}
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.95} color="#d4e8ff" />
        <directionalLight position={[6, 4, 4]} intensity={2.4} color="#fff8f0" />
        <directionalLight position={[-5, -2, -4]} intensity={1.6} color="#0088ff" />
        <pointLight position={[2.5, -2, 2.5]} intensity={1.2} color="#e8693a" />

        <GlobeMesh
          radius={radius}
          activeHub={activeHub}
          onHoverHub={setActiveHub}
        />
        <AtmosphereGlow radius={radius} />
      </Canvas>

      {/* Active Hub Pill */}
      {activeHubData && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-charcoal/90 border border-sunset/50 backdrop-blur-md text-xs font-ui tracking-wider text-warm-white flex items-center gap-2 shadow-lg shadow-sunset/10 pointer-events-none animate-fade-in z-20">
          <span className="w-2 h-2 rounded-full bg-sunset animate-ping" />
          <span className="font-bold text-sunset">{activeHubData.name}</span>
          <span className="text-warm-white/60">• Connected Hub</span>
        </div>
      )}

      {/* Interaction Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full border border-warm-white/10 bg-charcoal/60 backdrop-blur-sm pointer-events-none flex items-center gap-2 z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-warm-white/50">
          Drag to rotate • 3D Live Earth
        </span>
      </div>
    </div>
  )
}
