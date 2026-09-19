import * as THREE from 'three'

/**
 * Creates a high-fidelity procedural equirectangular Earth texture
 * Width: 2048, Height: 1024 (2:1 standard sphere UV ratio)
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // --- 1. DEEP OCEAN BASE GRADIENT ---
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height)
  oceanGrad.addColorStop(0, '#04101e')     // Arctic deep
  oceanGrad.addColorStop(0.2, '#08203a')
  oceanGrad.addColorStop(0.5, '#0c2a4c')   // Equator sapphire
  oceanGrad.addColorStop(0.8, '#08203a')
  oceanGrad.addColorStop(1, '#04101e')     // Antarctic deep
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, width, height)

  // Ocean wave / current subtle patterns
  ctx.fillStyle = 'rgba(20, 70, 120, 0.08)'
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * height
    const h = 8 + Math.random() * 24
    ctx.fillRect(0, y, width, h)
  }

  // Helper: Convert Lat (-90 to +90) & Lon (-180 to +180) to Canvas (x, y)
  const mapPoint = (lat: number, lon: number): [number, number] => {
    const x = ((lon + 180) / 360) * width
    const y = ((90 - lat) / 180) * height
    return [x, y]
  }

  // Helper: Draw a closed polygon path from [lat, lon] coordinates
  const drawLandmass = (
    coords: [number, number][],
    fillColor: string,
    strokeColor = 'rgba(40, 180, 220, 0.45)',
    shelfColor = 'rgba(20, 140, 190, 0.25)'
  ) => {
    if (coords.length < 3) return

    // Draw continental shelf / shallow coastal water glow first
    ctx.beginPath()
    coords.forEach(([lat, lon], idx) => {
      const [x, y] = mapPoint(lat, lon)
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.strokeStyle = shelfColor
    ctx.lineWidth = 14
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Draw crisp coastline
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 4
    ctx.stroke()

    // Fill the landmass with base color
    ctx.fillStyle = fillColor
    ctx.fill()
  }

  // --- 2. CONTINENTAL LANDMASSES WITH DETAILED REALISTIC OUTLINES ---

  // NORTH AMERICA & CENTRAL AMERICA
  drawLandmass([
    [72, -165], [71, -156], [68, -135], [70, -125], [60, -90], [55, -82],
    [58, -76], [62, -65], [52, -55], [47, -53], [44, -64], [41, -70],
    [32, -80], [25, -80], [29, -84], [29, -94], [22, -97], [18, -95],
    [16, -93], [14, -87], [10, -84], [8, -78],  [7, -81],  [9, -83],
    [13, -87], [16, -92], [20, -105], [23, -110], [30, -114], [34, -120],
    [38, -123], [48, -124], [54, -130], [59, -140], [60, -150], [56, -160],
    [64, -166], [66, -168]
  ], '#2a5a3a', 'rgba(50, 200, 240, 0.4)')

  // BAJA CALIFORNIA
  drawLandmass([
    [32, -116], [28, -114], [23, -110], [24, -111], [29, -115], [32, -117]
  ], '#7a6f4d')

  // GREENLAND
  drawLandmass([
    [83, -30], [80, -15], [70, -22], [60, -43], [65, -53], [76, -65],
    [82, -60], [83, -40]
  ], '#dcebf2', 'rgba(160, 220, 255, 0.6)')

  // SOUTH AMERICA
  drawLandmass([
    [12, -72], [10, -62], [6, -53], [0, -50], [-5, -35], [-12, -37],
    [-22, -41], [-30, -50], [-35, -57], [-45, -65], [-54, -68], [-55, -73],
    [-46, -75], [-35, -72], [-20, -70], [-10, -78], [-4, -81], [2, -78],
    [8, -77], [10, -75]
  ], '#275232', 'rgba(40, 210, 230, 0.45)')

  // EUROPE
  drawLandmass([
    [71, 26], [68, 14], [60, 5], [54, 9], [53, 5], [49, -1], [46, -1],
    [43, -9], [37, -9], [36, -5], [37, 0], [43, 3], [43, 7], [41, 15],
    [38, 16], [40, 19], [38, 24], [41, 28], [46, 31], [46, 37], [53, 36],
    [56, 21], [60, 28], [65, 25], [70, 30]
  ], '#36613c', 'rgba(60, 210, 240, 0.4)')

  // BRITISH ISLES & IRELAND
  drawLandmass([
    [58, -5], [54, 0], [51, 1], [50, -5], [53, -4], [57, -6]
  ], '#346337')
  drawLandmass([
    [55, -7], [52, -6], [51, -10], [54, -10]
  ], '#346337')

  // SCANDINAVIAN PENINSULA
  drawLandmass([
    [71, 28], [67, 14], [59, 11], [56, 13], [59, 18], [65, 22], [70, 28]
  ], '#3d5c41')

  // AFRICA
  drawLandmass([
    [35, -6], [37, 10], [33, 11], [32, 24], [31, 32], [28, 34],
    [22, 37], [12, 44], [12, 51], [2, 45], [-5, 40], [-11, 40],
    [-20, 36], [-28, 32], [-34, 26], [-34, 19], [-28, 16], [-17, 12],
    [-8, 13], [4, 9], [5, 1], [5, -4], [4, -7], [6, -11], [11, -15],
    [15, -17], [21, -17], [28, -13], [33, -9]
  ], '#545935', 'rgba(60, 190, 220, 0.4)')

  // MADAGASCAR
  drawLandmass([
    [-12, 49], [-16, 50], [-25, 47], [-25, 44], [-17, 44], [-12, 48]
  ], '#36613c')

  // ASIA & RUSSIA
  drawLandmass([
    [75, 40], [77, 105], [74, 135], [71, 179], [66, 170], [60, 163],
    [54, 156], [50, 142], [42, 131], [38, 128], [35, 129], [38, 120],
    [31, 122], [22, 114], [21, 108], [11, 107], [8, 103], [2, 102],
    [8, 98], [15, 96], [22, 89], [16, 82], [8, 77], [13, 74], [21, 69],
    [25, 62], [25, 57], [27, 51], [30, 48], [37, 36], [42, 30], [42, 41],
    [47, 48], [47, 53], [54, 60], [68, 60], [71, 55]
  ], '#375739', 'rgba(50, 210, 240, 0.4)')

  // ARABIAN PENINSULA
  drawLandmass([
    [30, 34], [31, 40], [28, 48], [24, 57], [22, 59], [17, 54],
    [13, 48], [13, 44], [20, 40], [27, 35]
  ], '#8c764e')

  // JAPAN ARCHIPELAGO
  drawLandmass([
    [45, 142], [43, 145], [41, 141], [38, 141], [35, 136], [33, 131],
    [32, 130], [35, 133], [39, 139], [42, 140]
  ], '#2e5a32')

  // INDONESIA & PHILIPPINES (Islands)
  drawLandmass([[-5, 106], [-7, 107], [-8, 114], [-6, 113], [-6, 106]], '#2e5a32') // Java
  drawLandmass([[5, 96], [0, 100], [-5, 104], [-4, 102], [2, 97]], '#28532c') // Sumatra
  drawLandmass([[7, 117], [1, 118], [-4, 115], [-2, 110], [4, 109]], '#28532c') // Borneo
  drawLandmass([[-2, 131], [-5, 141], [-9, 147], [-5, 141], [-1, 135]], '#28532c') // New Guinea
  drawLandmass([[18, 121], [14, 121], [10, 124], [7, 126], [7, 122], [14, 120]], '#2a582f') // Philippines

  // AUSTRALIA
  drawLandmass([
    [-11, 136], [-15, 136], [-12, 142], [-15, 145], [-24, 153], [-32, 152],
    [-38, 147], [-38, 140], [-35, 136], [-32, 132], [-32, 125], [-35, 118],
    [-32, 115], [-22, 114], [-15, 124], [-12, 130], [-13, 136]
  ], '#7a623f', 'rgba(60, 200, 230, 0.4)')

  // NEW ZEALAND
  drawLandmass([
    [-35, 173], [-38, 178], [-41, 175], [-46, 168], [-43, 171], [-37, 175]
  ], '#2f5933')

  // ANTARCTICA (Across full southern latitudes)
  ctx.beginPath()
  const [antStartLeftX, antStartLeftY] = mapPoint(-64, -180)
  ctx.moveTo(antStartLeftX, antStartLeftY)
  for (let lon = -180; lon <= 180; lon += 10) {
    const lat = -64 - Math.sin((lon * Math.PI) / 60) * 8 + (Math.cos((lon * Math.PI) / 30) * 4)
    const [x, y] = mapPoint(lat, lon)
    ctx.lineTo(x, y)
  }
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  const antGrad = ctx.createLinearGradient(0, height - 160, 0, height)
  antGrad.addColorStop(0, '#e8f4fa')
  antGrad.addColorStop(0.3, '#d4eaf5')
  antGrad.addColorStop(1, '#b0d6ec')
  ctx.fillStyle = antGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(180, 230, 255, 0.8)'
  ctx.lineWidth = 5
  ctx.stroke()

  // --- 3. BIOMES & TERRAIN SHADING (DESERTS & FORESTS) ---

  // Sahara & Arabian Desert
  const saharaPoints: [number, number][] = [
    [32, -10], [30, 32], [28, 55], [18, 55], [14, 38], [15, 5], [20, -12]
  ]
  const [saharaX, saharaY] = mapPoint(24, 18)
  const saharaGrad = ctx.createRadialGradient(saharaX, saharaY, 10, saharaX, saharaY, 260)
  saharaGrad.addColorStop(0, 'rgba(195, 155, 95, 0.85)')
  saharaGrad.addColorStop(0.6, 'rgba(170, 130, 75, 0.6)')
  saharaGrad.addColorStop(1, 'rgba(120, 110, 50, 0)')
  ctx.fillStyle = saharaGrad
  ctx.beginPath()
  saharaPoints.forEach(([lat, lon], idx) => {
    const [x, y] = mapPoint(lat, lon)
    if (idx === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()

  // Australian Outback Desert
  const [ozX, ozY] = mapPoint(-25, 134)
  const ozGrad = ctx.createRadialGradient(ozX, ozY, 10, ozX, ozY, 150)
  ozGrad.addColorStop(0, 'rgba(180, 105, 55, 0.85)')
  ozGrad.addColorStop(0.7, 'rgba(140, 85, 45, 0.5)')
  ozGrad.addColorStop(1, 'rgba(100, 70, 40, 0)')
  ctx.fillStyle = ozGrad
  ctx.beginPath()
  ctx.arc(ozX, ozY, 120, 0, Math.PI * 2)
  ctx.fill()

  // Gobi & Central Asian Deserts
  const [gobiX, gobiY] = mapPoint(42, 100)
  const gobiGrad = ctx.createRadialGradient(gobiX, gobiY, 5, gobiX, gobiY, 130)
  gobiGrad.addColorStop(0, 'rgba(175, 145, 95, 0.75)')
  gobiGrad.addColorStop(1, 'rgba(80, 100, 60, 0)')
  ctx.fillStyle = gobiGrad
  ctx.beginPath()
  ctx.arc(gobiX, gobiY, 110, 0, Math.PI * 2)
  ctx.fill()

  // Amazon Rainforest Rich Emerald Highlight
  const [amzX, amzY] = mapPoint(-3, -62)
  const amzGrad = ctx.createRadialGradient(amzX, amzY, 5, amzX, amzY, 140)
  amzGrad.addColorStop(0, 'rgba(25, 100, 45, 0.85)')
  amzGrad.addColorStop(0.7, 'rgba(20, 75, 35, 0.5)')
  amzGrad.addColorStop(1, 'rgba(20, 50, 30, 0)')
  ctx.fillStyle = amzGrad
  ctx.beginPath()
  ctx.arc(amzX, amzY, 120, 0, Math.PI * 2)
  ctx.fill()

  // Congo Basin Rainforest
  const [cngX, cngY] = mapPoint(0, 22)
  const cngGrad = ctx.createRadialGradient(cngX, cngY, 5, cngX, cngY, 90)
  cngGrad.addColorStop(0, 'rgba(20, 95, 40, 0.85)')
  cngGrad.addColorStop(1, 'rgba(30, 60, 30, 0)')
  ctx.fillStyle = cngGrad
  ctx.beginPath()
  ctx.arc(cngX, cngY, 80, 0, Math.PI * 2)
  ctx.fill()

  // Snow & Ice mountain ridges (Himalayas, Andes, Rockies)
  const drawRidge = (coords: [number, number][], width = 3) => {
    ctx.beginPath()
    coords.forEach(([lat, lon], idx) => {
      const [x, y] = mapPoint(lat, lon)
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = 'rgba(240, 250, 255, 0.75)'
    ctx.lineWidth = width
    ctx.stroke()
  }
  // Himalayas
  drawRidge([[28, 77], [30, 82], [28, 88], [27, 95]], 4)
  // Andes
  drawRidge([[-10, -76], [-20, -68], [-33, -70], [-45, -72]], 3)
  // Rockies
  drawRidge([[55, -125], [48, -115], [38, -106]], 3)
  // Alps
  drawRidge([[45, 6], [46, 10], [47, 13]], 3)

  // --- 4. CARTOGRAPHIC LATITUDE & LONGITUDE GRID LINES ---
  ctx.lineWidth = 1
  // Latitude parallels
  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = mapPoint(lat, 0)
    ctx.strokeStyle = lat === 0 ? 'rgba(232, 105, 58, 0.45)' : 'rgba(80, 190, 255, 0.12)'
    ctx.lineWidth = lat === 0 ? 2 : 1
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  // Longitude meridians
  for (let lon = -180; lon < 180; lon += 30) {
    const [x] = mapPoint(0, lon)
    ctx.strokeStyle = lon === 0 ? 'rgba(232, 105, 58, 0.35)' : 'rgba(80, 190, 255, 0.12)'
    ctx.lineWidth = lon === 0 ? 1.5 : 1
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // --- 5. GLOWING GLOBAL CITY NODES / TRAVEL HOTSPOTS ---
  const cities = [
    { name: 'London', lat: 51.5, lon: -0.1 },
    { name: 'Paris', lat: 48.8, lon: 2.3 },
    { name: 'New York', lat: 40.7, lon: -74.0 },
    { name: 'Tokyo', lat: 35.7, lon: 139.7 },
    { name: 'Dubai', lat: 25.2, lon: 55.3 },
    { name: 'Singapore', lat: 1.3, lon: 103.8 },
    { name: 'Sydney', lat: -33.8, lon: 151.2 },
    { name: 'Rio', lat: -22.9, lon: -43.2 },
    { name: 'Cape Town', lat: -33.9, lon: 18.4 },
    { name: 'Reykjavik', lat: 64.1, lon: -21.9 },
    { name: 'Bali', lat: -8.4, lon: 115.2 },
    { name: 'Cairo', lat: 30.0, lon: 31.2 },
    { name: 'Mumbai', lat: 19.0, lon: 72.8 },
    { name: 'Los Angeles', lat: 34.0, lon: -118.2 },
  ]

  cities.forEach(city => {
    const [cx, cy] = mapPoint(city.lat, city.lon)
    // Soft outer gold glow
    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, 14)
    g.addColorStop(0, 'rgba(255, 205, 110, 0.95)')
    g.addColorStop(0.4, 'rgba(232, 105, 58, 0.6)')
    g.addColorStop(1, 'rgba(232, 105, 58, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, 14, 0, Math.PI * 2)
    ctx.fill()

    // Sharp bright pinpoint center
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Create and configure Three.js CanvasTexture
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

/**
 * Creates a procedural swirling cloud texture for atmospheric depth
 */
export function createCloudTexture(): THREE.CanvasTexture {
  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Clear transparent
  ctx.clearRect(0, 0, width, height)

  // Draw procedural atmospheric wisps & cloud bands
  const cloudBands = [
    { y: 120, h: 45, amp: 18, freq: 0.015, alpha: 0.35 },  // Northern mid-latitudes
    { y: 200, h: 30, amp: 12, freq: 0.025, alpha: 0.25 },  // Subtropical
    { y: 256, h: 40, amp: 22, freq: 0.018, alpha: 0.45 },  // Intertropical Convergence Zone (equator)
    { y: 310, h: 25, amp: 15, freq: 0.02,  alpha: 0.25 },  // Subtropical south
    { y: 390, h: 50, amp: 25, freq: 0.014, alpha: 0.40 },  // Roaring Forties storm track
  ]

  cloudBands.forEach(band => {
    ctx.fillStyle = `rgba(255, 255, 255, ${band.alpha})`
    ctx.beginPath()
    ctx.moveTo(0, band.y)
    for (let x = 0; x <= width; x += 16) {
      const wave = Math.sin(x * band.freq) * band.amp + Math.cos(x * band.freq * 2.1) * (band.amp * 0.5)
      ctx.lineTo(x, band.y + wave)
    }
    for (let x = width; x >= 0; x -= 16) {
      const wave = Math.sin(x * band.freq + 1) * band.amp + Math.cos(x * band.freq * 1.8) * (band.amp * 0.4)
      ctx.lineTo(x, band.y + band.h + wave)
    }
    ctx.closePath()
    ctx.fill()

    // Add fluffy cumulus patches
    for (let i = 0; i < 18; i++) {
      const px = Math.random() * width
      const py = band.y + (Math.random() - 0.5) * band.h * 1.4
      const pr = 12 + Math.random() * 26
      const radGrad = ctx.createRadialGradient(px, py, 0, px, py, pr)
      radGrad.addColorStop(0, `rgba(255, 255, 255, ${band.alpha * 0.8})`)
      radGrad.addColorStop(0.6, `rgba(255, 255, 255, ${band.alpha * 0.4})`)
      radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = radGrad
      ctx.beginPath()
      ctx.arc(px, py, pr, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  // Cyclone / hurricane swirl near Caribbean / Pacific
  const drawSwirl = (cx: number, cy: number, radius: number) => {
    const sGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius)
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)')
    sGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)')
    sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = sGrad
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  drawSwirl(280, 160, 45) // North Atlantic
  drawSwirl(740, 180, 50) // West Pacific typhoon
  drawSwirl(860, 360, 40) // South Pacific

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}

/**
 * Creates a high-fidelity Night Earth texture matching the reference design:
 * Deep sapphire oceans, dark continents, glowing golden/amber city lights across Europe, Middle East, Japan, Bali, etc.,
 * and subtle atmospheric cartographic grid lines.
 */
export function createNightEarthTexture(): THREE.CanvasTexture {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // --- 1. MIDNIGHT OCEAN BASE ---
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height)
  oceanGrad.addColorStop(0, '#02050e')     // Arctic dark
  oceanGrad.addColorStop(0.2, '#040b18')
  oceanGrad.addColorStop(0.5, '#07152b')   // Deep sapphire equator
  oceanGrad.addColorStop(0.8, '#040b18')
  oceanGrad.addColorStop(1, '#02050e')     // Antarctic dark
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, width, height)

  // Soft bathymetric ocean depth glow
  ctx.fillStyle = 'rgba(10, 35, 65, 0.12)'
  for (let i = 0; i < 30; i++) {
    const y = (i / 30) * height
    ctx.fillRect(0, y, width, 18)
  }

  // Helper: Convert Lat (-90 to +90) & Lon (-180 to +180) to Canvas (x, y)
  const mapPoint = (lat: number, lon: number): [number, number] => {
    const x = ((lon + 180) / 360) * width
    const y = ((90 - lat) / 180) * height
    return [x, y]
  }

  // Helper: Draw continent with illuminated coastline glow and dark land
  const drawNightLandmass = (
    coords: [number, number][],
    landColor = '#0b131e',
    coastalGlow = 'rgba(56, 189, 248, 0.28)',
    coastlineColor = 'rgba(56, 189, 248, 0.5)'
  ) => {
    if (coords.length < 3) return

    // Coastal shelf glow
    ctx.beginPath()
    coords.forEach(([lat, lon], idx) => {
      const [x, y] = mapPoint(lat, lon)
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.strokeStyle = coastalGlow
    ctx.lineWidth = 8
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Crisp illuminated coastline
    ctx.strokeStyle = coastlineColor
    ctx.lineWidth = 1.8
    ctx.stroke()

    // Fill dark continental landmass
    ctx.fillStyle = landColor
    ctx.fill()
  }

  // --- 2. CONTINENTAL LANDMASSES ---
  // North America
  drawNightLandmass([
    [72, -165], [71, -156], [68, -135], [70, -125], [60, -90], [55, -82],
    [58, -76], [62, -65], [52, -55], [47, -53], [44, -64], [41, -70],
    [32, -80], [25, -80], [29, -84], [29, -94], [22, -97], [18, -95],
    [16, -93], [14, -87], [10, -84], [8, -78],  [7, -81],  [9, -83],
    [13, -87], [16, -92], [20, -105], [23, -110], [30, -114], [34, -120],
    [38, -123], [48, -124], [54, -130], [59, -140], [60, -150], [56, -160],
    [64, -166], [66, -168]
  ], '#0a121c')

  // Greenland
  drawNightLandmass([
    [83, -30], [80, -15], [70, -22], [60, -43], [65, -53], [76, -65],
    [82, -60], [83, -40]
  ], '#101a24', 'rgba(100, 200, 255, 0.25)', 'rgba(120, 210, 255, 0.4)')

  // Iceland (Crisply highlighted)
  drawNightLandmass([
    [66.5, -24.5], [66.5, -13.5], [63.4, -13.5], [63.8, -22.5]
  ], '#121e2c', 'rgba(232, 105, 58, 0.4)', 'rgba(255, 160, 80, 0.8)')

  // South America
  drawNightLandmass([
    [12, -72], [10, -62], [6, -53], [0, -50], [-5, -35], [-12, -37],
    [-22, -41], [-30, -50], [-35, -57], [-45, -65], [-54, -68], [-55, -73],
    [-46, -75], [-35, -72], [-20, -70], [-10, -78], [-4, -81], [2, -78],
    [8, -77], [10, -75]
  ], '#091019')

  // Europe (Rich illuminated coastline)
  drawNightLandmass([
    [71, 26], [68, 14], [60, 5], [54, 9], [53, 5], [49, -1], [46, -1],
    [43, -9], [37, -9], [36, -5], [37, 0], [43, 3], [43, 7], [41, 15],
    [38, 16], [40, 19], [38, 24], [41, 28], [46, 31], [46, 37], [53, 36],
    [56, 21], [60, 28], [65, 25], [70, 30]
  ], '#0d1624', 'rgba(56, 189, 248, 0.35)', 'rgba(80, 200, 255, 0.6)')

  // British Isles
  drawNightLandmass([
    [58, -5], [54, 0], [51, 1], [50, -5], [53, -4], [57, -6]
  ], '#0d1624')
  drawNightLandmass([
    [55, -7], [52, -6], [51, -10], [54, -10]
  ], '#0d1624')

  // Scandinavia
  drawNightLandmass([
    [71, 28], [67, 14], [59, 11], [56, 13], [59, 18], [65, 22], [70, 28]
  ], '#0c1520')

  // Africa
  drawNightLandmass([
    [35, -6], [37, 10], [33, 11], [32, 24], [31, 32], [28, 34],
    [22, 37], [12, 44], [12, 51], [2, 45], [-5, 40], [-11, 40],
    [-20, 36], [-28, 32], [-34, 26], [-34, 19], [-28, 16], [-17, 12],
    [-8, 13], [4, 9], [5, 1], [5, -4], [4, -7], [6, -11], [11, -15],
    [15, -17], [21, -17], [28, -13], [33, -9]
  ], '#0a111a')

  // Madagascar
  drawNightLandmass([
    [-12, 49], [-16, 50], [-25, 47], [-25, 44], [-17, 44], [-12, 48]
  ], '#0a111a')

  // Asia & Russia
  drawNightLandmass([
    [75, 40], [77, 105], [74, 135], [71, 179], [66, 170], [60, 163],
    [54, 156], [50, 142], [42, 131], [38, 128], [35, 129], [38, 120],
    [31, 122], [22, 114], [21, 108], [11, 107], [8, 103], [2, 102],
    [8, 98], [15, 96], [22, 89], [16, 82], [8, 77], [13, 74], [21, 69],
    [25, 62], [25, 57], [27, 51], [30, 48], [37, 36], [42, 30], [42, 41],
    [47, 48], [47, 53], [54, 60], [68, 60], [71, 55]
  ], '#0b1420', 'rgba(56, 189, 248, 0.3)', 'rgba(80, 200, 255, 0.55)')

  // Arabian Peninsula (Dubai region)
  drawNightLandmass([
    [30, 34], [31, 40], [28, 48], [24, 57], [22, 59], [17, 54],
    [13, 48], [13, 44], [20, 40], [27, 35]
  ], '#0d1520', 'rgba(232, 105, 58, 0.35)', 'rgba(255, 160, 80, 0.65)')

  // Japan (Tokyo area)
  drawNightLandmass([
    [45, 142], [43, 145], [41, 141], [38, 141], [35, 136], [33, 131],
    [32, 130], [35, 133], [39, 139], [42, 140]
  ], '#101c2a', 'rgba(232, 105, 58, 0.4)', 'rgba(255, 170, 80, 0.8)')

  // Indonesia & Bali Islands
  drawNightLandmass([[-5, 106], [-7, 107], [-8, 114], [-6, 113], [-6, 106]], '#0e1a26', 'rgba(232, 105, 58, 0.4)') // Java & Bali
  drawNightLandmass([[5, 96], [0, 100], [-5, 104], [-4, 102], [2, 97]], '#0c1622') // Sumatra
  drawNightLandmass([[7, 117], [1, 118], [-4, 115], [-2, 110], [4, 109]], '#0c1622') // Borneo
  drawNightLandmass([[-2, 131], [-5, 141], [-9, 147], [-5, 141], [-1, 135]], '#0c1622') // New Guinea
  drawNightLandmass([[18, 121], [14, 121], [10, 124], [7, 126], [7, 122], [14, 120]], '#0c1622') // Philippines

  // Australia
  drawNightLandmass([
    [-11, 136], [-15, 136], [-12, 142], [-15, 145], [-24, 153], [-32, 152],
    [-38, 147], [-38, 140], [-35, 136], [-32, 132], [-32, 125], [-35, 118],
    [-32, 115], [-22, 114], [-15, 124], [-12, 130], [-13, 136]
  ], '#0a1018')

  // New Zealand
  drawNightLandmass([
    [-35, 173], [-38, 178], [-41, 175], [-46, 168], [-43, 171], [-37, 175]
  ], '#0a121c')

  // --- 3. SUBTLE CARTOGRAPHIC LAT/LON GRID ---
  ctx.lineWidth = 1
  for (let lat = -75; lat <= 75; lat += 30) {
    const [, y] = mapPoint(lat, 0)
    ctx.strokeStyle = lat === 0 ? 'rgba(232, 105, 58, 0.25)' : 'rgba(56, 189, 248, 0.08)'
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  for (let lon = -180; lon < 180; lon += 45) {
    const [x] = mapPoint(0, lon)
    ctx.strokeStyle = lon === 0 ? 'rgba(232, 105, 58, 0.2)' : 'rgba(56, 189, 248, 0.08)'
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // --- 4. GLOWING CITY NIGHT LIGHTS CLUSTERS ---
  // Helper to draw cluster of glowing city lights
  const drawCityGlow = (
    lat: number,
    lon: number,
    radius: number,
    color = 'rgba(255, 150, 50, 0.65)',
    intensity = 1.0
  ) => {
    const [cx, cy] = mapPoint(lat, lon)
    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius)
    g.addColorStop(0, `rgba(255, 235, 180, ${0.95 * intensity})`)
    g.addColorStop(0.3, color)
    g.addColorStop(0.7, `rgba(232, 105, 58, ${0.25 * intensity})`)
    g.addColorStop(1, 'rgba(232, 105, 58, 0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()

    // Sharp white-gold core
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(cx, cy, Math.max(1.5, radius * 0.18), 0, Math.PI * 2)
    ctx.fill()
  }

  // Key Hubs from reference image (Vibrant large glow)
  drawCityGlow(64.1, -21.9, 14, '#ffa726', 1.2)  // Iceland (Reykjavik)
  drawCityGlow(46.8, 8.2, 18, '#ff9100', 1.3)    // Switzerland (Zurich / Alps)
  drawCityGlow(25.2, 55.3, 20, '#ff9100', 1.4)   // Dubai (UAE)
  drawCityGlow(35.7, 139.7, 22, '#ff9100', 1.4)  // Tokyo (Japan)
  drawCityGlow(-8.4, 115.2, 16, '#ff9100', 1.2)  // Bali (Indonesia)

  // Western & Central Europe constellation of city lights
  const europeCities = [
    [51.5, -0.1, 14], [48.8, 2.3, 14], [52.5, 13.4, 11], [45.4, 9.2, 12],
    [48.1, 11.6, 11], [40.4, -3.7, 11], [41.4, 2.2, 10], [52.4, 4.9, 11],
    [50.8, 4.3, 10], [48.2, 16.4, 10], [41.9, 12.5, 11], [50.1, 8.7, 11]
  ]
  europeCities.forEach(([lat, lon, r]) => drawCityGlow(lat, lon, r, '#ffab40', 0.85))

  // Middle East & Gulf network
  const gulfCities = [
    [24.5, 54.4, 13], [25.3, 51.5, 12], [24.7, 46.7, 13], [29.4, 48.0, 11],
    [32.1, 34.8, 12], [30.0, 31.2, 14], [21.5, 39.2, 11], [23.6, 58.5, 10]
  ]
  gulfCities.forEach(([lat, lon, r]) => drawCityGlow(lat, lon, r, '#ffa000', 0.9))

  // Asia & Far East mega-clusters
  const asiaCities = [
    [34.7, 135.5, 14], [35.2, 136.9, 12], [37.5, 127.0, 15], [31.2, 121.5, 16],
    [39.9, 116.4, 15], [22.3, 114.2, 14], [23.1, 113.3, 13], [25.0, 121.5, 12],
    [1.3, 103.8, 14], [-6.2, 106.8, 13], [13.7, 100.5, 12], [3.1, 101.7, 11]
  ]
  asiaCities.forEach(([lat, lon, r]) => drawCityGlow(lat, lon, r, '#ff9100', 0.9))

  // India & Americas
  const otherHubs = [
    [19.0, 72.8, 14], [28.6, 77.2, 14], [12.9, 77.6, 12], [40.7, -74.0, 16],
    [34.0, -118.2, 14], [41.8, -87.6, 13], [25.8, -80.2, 12], [-23.5, -46.6, 13],
    [-33.8, 151.2, 13], [-37.8, 144.9, 12]
  ]
  otherHubs.forEach(([lat, lon, r]) => drawCityGlow(lat, lon, r, '#ffb74d', 0.8))

  // Scattered realistic micro-lights across populated coastlines
  ctx.fillStyle = 'rgba(255, 200, 100, 0.7)'
  const random = (seed: number) => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
  let s = 42
  for (let i = 0; i < 240; i++) {
    // Generate cluster in Mediterranean/Europe
    const eLat = 38 + random(s++) * 20
    const eLon = -5 + random(s++) * 35
    const [ex, ey] = mapPoint(eLat, eLon)
    ctx.fillRect(ex, ey, 1.5, 1.5)
  }
  for (let i = 0; i < 180; i++) {
    // Generate cluster in East/South Asia
    const aLat = 10 + random(s++) * 35
    const aLon = 75 + random(s++) * 65
    const [ax, ay] = mapPoint(aLat, aLon)
    ctx.fillRect(ax, ay, 1.5, 1.5)
  }

  // Create Three.js CanvasTexture
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
