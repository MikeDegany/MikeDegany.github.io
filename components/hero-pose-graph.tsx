"use client"

import { useEffect, useRef, useState } from "react"

type GNode = { id: number; x: number; y: number }
type GEdge = { id: string; a: number; b: number; loop: boolean }
type Graph = { nodes: GNode[]; edges: GEdge[]; nextId: number }

/** Cursor must travel at least this far from the last node before a new one is sampled. */
const MIN_STEP = 34
/** A new node links back to older nodes within this distance (loop closure). */
const LOOP_RADIUS = 70
/** The most recent nodes are skipped when looking for loop closures — they're sequential neighbours. */
const LOOP_SKIP = 4
/** Caps loop edges per node so scribbling in one spot doesn't turn into a hairball. */
const MAX_LOOPS_PER_NODE = 2
/** FIFO cap on the graph size. */
const MAX_NODES = 120
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

const EMPTY: Graph = { nodes: [], edges: [], nextId: 0 }

function addSample(g: Graph, x: number, y: number): Graph {
  const { nodes, edges, nextId } = g

  if (nodes.length === 0) {
    return { nodes: [{ id: nextId, x, y }], edges, nextId: nextId + 1 }
  }

  const last = nodes[nodes.length - 1]
  if (Math.hypot(x - last.x, y - last.y) < MIN_STEP) return g

  const node: GNode = { id: nextId, x, y }
  const fresh: GEdge[] = [{ id: `${last.id}-${node.id}`, a: last.id, b: node.id, loop: false }]

  // Loop closures: older nodes that the cursor has come back around to.
  nodes
    .slice(0, Math.max(0, nodes.length - LOOP_SKIP))
    .map((n) => ({ n, d: Math.hypot(x - n.x, y - n.y) }))
    .filter((c) => c.d <= LOOP_RADIUS)
    .sort((a, b) => a.d - b.d)
    .slice(0, MAX_LOOPS_PER_NODE)
    .forEach((c) => fresh.push({ id: `${c.n.id}-${node.id}`, a: c.n.id, b: node.id, loop: true }))

  let nextNodes = [...nodes, node]
  let nextEdges = [...edges, ...fresh]

  if (nextNodes.length > MAX_NODES) {
    const dropped = new Set(nextNodes.slice(0, nextNodes.length - MAX_NODES).map((n) => n.id))
    nextNodes = nextNodes.slice(nextNodes.length - MAX_NODES)
    nextEdges = nextEdges.filter((e) => !dropped.has(e.a) && !dropped.has(e.b))
  }

  return { nodes: nextNodes, edges: nextEdges, nextId: nextId + 1 }
}

export function HeroPoseGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<{ w: number; h: number } | null>(null)
  const [graph, setGraph] = useState<Graph>(EMPTY)

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
      setGraph((g) => addSample(g, e.clientX - rect.left, e.clientY - rect.top))
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
      setGraph((g) =>
        g.nodes.length === 0
          ? g
          : { ...g, nodes: g.nodes.map((n) => ({ ...n, x: n.x * sx, y: n.y * sy })) }
      )
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
