export type Pt = { x: number; y: number }

/** Point on a quadratic bezier at t in [0, 1]. */
export function getPointOnBezier(t: number, p0: Pt, p1: Pt, p2: Pt): Pt {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
  return { x, y }
}

/** Tangent angle (degrees) of a quadratic bezier at t. */
export function getAngleOnBezier(t: number, p0: Pt, p1: Pt, p2: Pt): number {
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

/** de Casteljau split of a quadratic bezier at t. */
export function splitBezier(t: number, p0: Pt, p1: Pt, p2: Pt) {
  const mid1 = { x: p0.x + t * (p1.x - p0.x), y: p0.y + t * (p1.y - p0.y) }
  const mid2 = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) }
  const splitPoint = { x: mid1.x + t * (mid2.x - mid1.x), y: mid1.y + t * (mid2.y - mid1.y) }
  return { mid1, mid2, splitPoint }
}
