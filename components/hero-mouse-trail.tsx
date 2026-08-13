"use client"

import { useEffect, useRef, useState } from "react"

type Point = { x: number; y: number; t: number }

const TRAIL_LIFETIME_MS = 600
const MAX_POINTS = 24

export function HeroMouseTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    const el = containerRef.current
    const panel = el?.parentElement
    if (!el || !panel) return

    let raf = 0

    const prune = () => {
      const now = performance.now()
      setPoints((prev) => {
        const fresh = prev.filter((p) => now - p.t < TRAIL_LIFETIME_MS)
        return fresh.length === prev.length ? prev : fresh
      })
      raf = requestAnimationFrame(prune)
    }
    raf = requestAnimationFrame(prune)

    const handleMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect()
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() }
      setPoints((prev) => [...prev, point].slice(-MAX_POINTS))
    }

    const handleLeave = () => setPoints([])

    panel.addEventListener("mousemove", handleMove)
    panel.addEventListener("mouseleave", handleLeave)
    return () => {
      panel.removeEventListener("mousemove", handleMove)
      panel.removeEventListener("mouseleave", handleLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  const now = performance.now()

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="heroTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {points.length > 1 &&
          points.slice(1).map((p, i) => {
            const prev = points[i]
            const age = now - p.t
            const opacity = Math.max(0, 1 - age / TRAIL_LIFETIME_MS)
            return (
              <line
                key={p.t}
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                stroke="url(#heroTrailGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={opacity * 0.8}
                style={{ filter: "drop-shadow(0 0 6px rgba(56,189,248,0.8))" }}
              />
            )
          })}
      </svg>
    </div>
  )
}
