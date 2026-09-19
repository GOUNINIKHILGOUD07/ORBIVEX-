import { useEffect, useRef, useState } from 'react'

interface CursorState {
  x: number
  y: number
  label: string
  hovering: boolean
}

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>({ x: -100, y: -100, label: '', hovering: false })
  const posRef = useRef({ x: -100, y: -100 })
  const outerPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(undefined)

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window) return

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      // Inner dot follows immediately
      if (innerRef.current) {
        innerRef.current.style.left = `${e.clientX}px`
        innerRef.current.style.top = `${e.clientY}px`
      }
      if (labelRef.current) {
        labelRef.current.style.left = `${e.clientX}px`
        labelRef.current.style.top = `${e.clientY + 30}px`
      }
    }

    // Outer ring lags behind with RAF lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const animateOuter = () => {
      outerPosRef.current.x = lerp(outerPosRef.current.x, posRef.current.x, 0.12)
      outerPosRef.current.y = lerp(outerPosRef.current.y, posRef.current.y, 0.12)
      if (outerRef.current) {
        outerRef.current.style.left = `${outerPosRef.current.x}px`
        outerRef.current.style.top = `${outerPosRef.current.y}px`
      }
      rafRef.current = requestAnimationFrame(animateOuter)
    }
    rafRef.current = requestAnimationFrame(animateOuter)

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const label = target.closest('[data-cursor]')?.getAttribute('data-cursor') || ''
      setState(s => ({ ...s, hovering: true, label }))
    }

    const onLeave = () => {
      setState(s => ({ ...s, hovering: false, label: '' }))
    }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter as EventListener)
      el.addEventListener('mouseleave', onLeave)
    })

    // Also listen for dynamically added elements via mutation
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-cursor]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter as EventListener)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter as EventListener)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={outerRef}
        className={`cursor-outer ${state.hovering ? 'hovering' : ''}`}
        style={{ left: '-100px', top: '-100px' }}
      />
      <div
        ref={innerRef}
        className={`cursor-inner ${state.hovering ? 'hovering' : ''}`}
        style={{ left: '-100px', top: '-100px' }}
      />
      <div
        ref={labelRef}
        className={`cursor-label ${state.label ? 'visible' : ''}`}
        style={{ left: '-100px', top: '-100px' }}
      >
        {state.label}
      </div>
    </>
  )
}
