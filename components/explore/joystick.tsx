"use client"

import { useRef, useState } from "react"

const BASE = 124
const KNOB = 52
const RANGE = (BASE - KNOB) / 2

export type JoyVector = { x: number; y: number; active: boolean }

/** One-thumb analog stick. Reports a unit-circle vector; y is negative when pushed up. */
export function Joystick({ onChange }: { onChange: (v: JoyVector) => void }) {
  const baseRef = useRef<HTMLDivElement>(null)
  const pointerId = useRef<number | null>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  const update = (clientX: number, clientY: number) => {
    const el = baseRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    let dx = clientX - (r.left + r.width / 2)
    let dy = clientY - (r.top + r.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > RANGE) {
      dx = (dx / len) * RANGE
      dy = (dy / len) * RANGE
    }
    setKnob({ x: dx, y: dy })
    // Small dead-zone so a resting thumb doesn't creep
    const nx = dx / RANGE
    const ny = dy / RANGE
    const mag = Math.hypot(nx, ny)
    if (mag < 0.12) onChange({ x: 0, y: 0, active: true })
    else onChange({ x: nx, y: ny, active: true })
  }

  const release = () => {
    pointerId.current = null
    setKnob({ x: 0, y: 0 })
    onChange({ x: 0, y: 0, active: false })
  }

  return (
    <div
      ref={baseRef}
      role="slider"
      aria-label="Drive joystick"
      aria-valuenow={0}
      className="relative rounded-full select-none touch-none"
      style={{
        width: BASE,
        height: BASE,
        background: "radial-gradient(circle at 50% 45%, rgba(148,163,184,0.18), rgba(15,23,42,0.55) 70%)",
        boxShadow: "inset 0 0 0 2px rgba(148,163,184,0.35), 0 8px 30px rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
      onPointerDown={(e) => {
        pointerId.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        if (pointerId.current !== e.pointerId) return
        update(e.clientX, e.clientY)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      {/* Direction ticks */}
      {[0, 90, 180, 270].map((deg) => (
        <div
          key={deg}
          className="absolute left-1/2 top-1/2 w-1 h-2.5 rounded-full bg-slate-300/40"
          style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-${BASE / 2 - 9}px)` }}
        />
      ))}
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: KNOB,
          height: KNOB,
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          background: "radial-gradient(circle at 40% 35%, #fde68a, #d97706 75%)",
          boxShadow: "0 4px 14px rgba(251,191,36,0.45), inset 0 -3px 6px rgba(0,0,0,0.35)",
          transition: pointerId.current === null ? "transform 120ms ease-out" : undefined,
        }}
      />
    </div>
  )
}
