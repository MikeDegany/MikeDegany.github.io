"use client"

import { useEffect, useRef, useState } from "react"

import {
  addSample,
  scaleGraph,
  EMPTY_GRAPH,
  HERO_POSE_GRAPH_PARAMS,
  type Graph,
} from "@/lib/pose-graph"

const { maxNodes: MAX_NODES } = HERO_POSE_GRAPH_PARAMS
/** Oldest nodes ramp down in opacity so eviction dissolves instead of popping. */
const FADE_TAIL = 12
/** Newest nodes/edges ramp from bright down to base, so recency reads as a gradient. */
const RECENT_SPAN = 6

const ODOM_RGB = [191, 219, 254]
const LOOP_RGB = [34, 211, 238]
const NODE_RGB = [219, 234, 254]
const HOT_RGB = [103, 232, 249]

const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`

export function HeroPoseGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<{ w: number; h: number } | null>(null)
  const [graph, setGraph] = useState<Graph>(EMPTY_GRAPH)

  useEffect(() => {
    const el = containerRef.current
    // The overlay itself is pointer-events-none, so it never receives mouse events —
    // listen on the panel that wraps it instead.
    const panel = el?.parentElement
    if (!el || !panel) return

    const initial = panel.getBoundingClientRect()
    sizeRef.current = { w: initial.width, h: initial.height }

    const handleMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height }
      setGraph((g) => addSample(g, e.clientX - rect.left, e.clientY - rect.top, HERO_POSE_GRAPH_PARAMS))
    }

    // Keep the graph anchored to the panel when it resizes.
    const ro = new ResizeObserver(() => {
      const rect = panel.getBoundingClientRect()
      const prev = sizeRef.current
      sizeRef.current = { w: rect.width, h: rect.height }
      if (!prev || !prev.w || !prev.h || !rect.width || !rect.height) return
      const sx = rect.width / prev.w
      const sy = rect.height / prev.h
      if (sx === 1 && sy === 1) return
      setGraph((g) => scaleGraph(g, sx, sy))
    })
    ro.observe(panel)

    panel.addEventListener("mousemove", handleMove)
    panel.addEventListener("mouseenter", handleMove)
    return () => {
      panel.removeEventListener("mousemove", handleMove)
      panel.removeEventListener("mouseenter", handleMove)
      ro.disconnect()
    }
  }, [])

  const { nodes, edges } = graph
  const index = new Map(nodes.map((n, i) => [n.id, i]))
  const nearCapacity = nodes.length >= MAX_NODES - FADE_TAIL
  const tail = (i: number) => (nearCapacity && i < FADE_TAIL ? (i + 1) / (FADE_TAIL + 1) : 1)

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {edges.map((e, j) => {
          const a = nodes[index.get(e.a) ?? -1]
          const b = nodes[index.get(e.b) ?? -1]
          if (!a || !b) return null

          const age = edges.length - 1 - j
          const glow = age < RECENT_SPAN ? 1 - age / RECENT_SPAN : 0
          const base = e.loop ? 0.55 : 0.35
          const fade = tail(Math.min(index.get(e.a)!, index.get(e.b)!))

          return (
            <line
              key={e.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={mix(e.loop ? LOOP_RGB : ODOM_RGB, HOT_RGB, glow)}
              strokeWidth={(e.loop ? 1.25 : 1) + 0.75 * glow}
              strokeLinecap="round"
              style={{
                opacity: (base + (0.95 - base) * glow) * fade,
                transition: "opacity 400ms linear, stroke 400ms linear",
                filter: glow > 0 ? `drop-shadow(0 0 ${3 + 4 * glow}px rgba(34,211,238,${0.35 + 0.45 * glow}))` : undefined,
              }}
            />
          )
        })}

        {nodes.map((n, i) => {
          const age = nodes.length - 1 - i
          const glow = age < RECENT_SPAN ? 1 - age / RECENT_SPAN : 0

          return (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={1.8 + 1.7 * glow}
              fill={mix(NODE_RGB, HOT_RGB, glow)}
              style={{
                opacity: (0.55 + 0.45 * glow) * tail(i),
                transition: "opacity 400ms linear, fill 400ms linear",
                filter: glow > 0 ? `drop-shadow(0 0 ${4 + 4 * glow}px rgba(34,211,238,${0.5 + 0.4 * glow}))` : undefined,
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
