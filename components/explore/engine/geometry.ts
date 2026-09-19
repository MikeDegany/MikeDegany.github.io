import type { Segment } from "./types"

export const TWO_PI = Math.PI * 2

export function wrapAngle(a: number): number {
  while (a > Math.PI) a -= TWO_PI
  while (a < -Math.PI) a += TWO_PI
  return a
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Frame-rate independent exponential approach factor. */
export function damp(rate: number, dt: number): number {
  return 1 - Math.exp(-rate * dt)
}

/**
 * Ray (ox,oy)+(dx,dy)*t vs segment. Returns t in [0, maxT) of the nearest hit or -1.
 * dx,dy must be a unit vector.
 */
export function raySegment(ox: number, oy: number, dx: number, dy: number, s: Segment, maxT: number): number {
  const ex = s.bx - s.ax
  const ey = s.by - s.ay
  const denom = dx * ey - dy * ex
  if (Math.abs(denom) < 1e-9) return -1
  const fx = s.ax - ox
  const fy = s.ay - oy
  const t = (fx * ey - fy * ex) / denom
  if (t < 0 || t >= maxT) return -1
  const u = (fx * dy - fy * dx) / denom
  if (u < 0 || u > 1) return -1
  return t
}

/** Pushes a circle out of a segment. Returns true if a correction was applied. */
export function resolveCircleSegment(c: { x: number; y: number }, r: number, s: Segment): boolean {
  const ex = s.bx - s.ax
  const ey = s.by - s.ay
  const len2 = ex * ex + ey * ey
  let t = len2 > 0 ? ((c.x - s.ax) * ex + (c.y - s.ay) * ey) / len2 : 0
  t = clamp(t, 0, 1)
  const px = s.ax + ex * t
  const py = s.ay + ey * t
  let nx = c.x - px
  let ny = c.y - py
  const d2 = nx * nx + ny * ny
  if (d2 >= r * r) return false
  const d = Math.sqrt(d2)
  if (d < 1e-6) {
    // Centre exactly on the segment: push along the segment normal.
    const l = Math.sqrt(len2) || 1
    nx = -ey / l
    ny = ex / l
  } else {
    nx /= d
    ny /= d
  }
  const push = r - d
  c.x += nx * push
  c.y += ny * push
  return true
}

/** Segments of a rectangle rotated by `angle` about its centre. */
export function rotRectSegments(cx: number, cy: number, w: number, h: number, angle: number, room: number, crate = -1): Segment[] {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const pt = (dx: number, dy: number) => ({ x: cx + dx * c - dy * s, y: cy + dx * s + dy * c })
  const p = [pt(-w / 2, -h / 2), pt(w / 2, -h / 2), pt(w / 2, h / 2), pt(-w / 2, h / 2)]
  return p.map((a, i) => {
    const b = p[(i + 1) % 4]
    return { ax: a.x, ay: a.y, bx: b.x, by: b.y, room, crate }
  })
}

export function rectSegments(x: number, y: number, w: number, h: number, room: number, crate = -1): Segment[] {
  return [
    { ax: x, ay: y, bx: x + w, by: y, room, crate },
    { ax: x + w, ay: y, bx: x + w, by: y + h, room, crate },
    { ax: x + w, ay: y + h, bx: x, by: y + h, room, crate },
    { ax: x, ay: y + h, bx: x, by: y, room, crate },
  ]
}
