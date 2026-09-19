import type { DriveInput, Pose, Vec2, World } from "./types"
import type { DriveModel, DriveState } from "./drive"
import { AckermannDrive } from "./drive"
import { clamp, wrapAngle } from "./geometry"

export const NAV_CELL = 10

/** Binary min-heap keyed on f-score. */
class Heap {
  private items: number[] = []
  constructor(private readonly f: Float32Array) {}
  get size() {
    return this.items.length
  }
  push(i: number) {
    const a = this.items
    a.push(i)
    let k = a.length - 1
    while (k > 0) {
      const p = (k - 1) >> 1
      if (this.f[a[p]] <= this.f[a[k]]) break
      ;[a[p], a[k]] = [a[k], a[p]]
      k = p
    }
  }
  pop(): number {
    const a = this.items
    const top = a[0]
    const last = a.pop()!
    if (a.length > 0) {
      a[0] = last
      let k = 0
      for (;;) {
        const l = k * 2 + 1
        const r = l + 1
        let m = k
        if (l < a.length && this.f[a[l]] < this.f[a[m]]) m = l
        if (r < a.length && this.f[a[r]] < this.f[a[m]]) m = r
        if (m === k) break
        ;[a[m], a[k]] = [a[k], a[m]]
        k = m
      }
    }
    return top
  }
}

/**
 * Static A* planner on a nav grid built from the true wall geometry, inflated by the
 * robot radius. The world never changes, so the grid is built once.
 */
export class Planner {
  readonly cols: number
  readonly rows: number
  readonly blocked: Uint8Array
  private readonly g: Float32Array
  private readonly f: Float32Array
  private readonly parent: Int32Array
  private readonly closed: Uint8Array
  private readonly opened: Uint8Array

  constructor(private readonly world: World, inflate: number) {
    this.cols = Math.ceil(world.width / NAV_CELL)
    this.rows = Math.ceil(world.height / NAV_CELL)
    const n = this.cols * this.rows
    this.blocked = new Uint8Array(n)
    this.g = new Float32Array(n)
    this.f = new Float32Array(n)
    this.parent = new Int32Array(n)
    this.closed = new Uint8Array(n)
    this.opened = new Uint8Array(n)
    this.rasterize(inflate)
    this.sealUnreachable()
  }

  /**
   * Cells the robot can never reach from spawn (obstacle interiors, slivers between a pedestal
   * and a wall) are marked blocked, so goals inside them snap to the nearest reachable cell.
   */
  private sealUnreachable() {
    const start = this.nearestFree(this.toCell(this.world.spawn), 6)
    if (start < 0) return
    const seen = new Uint8Array(this.cols * this.rows)
    const stack = [start]
    seen[start] = 1
    while (stack.length) {
      const i = stack.pop()!
      const x = i % this.cols
      const y = (i - x) / this.cols
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= this.cols || ny >= this.rows) continue
        const j = ny * this.cols + nx
        if (seen[j] || this.blocked[j]) continue
        seen[j] = 1
        stack.push(j)
      }
    }
    for (let i = 0; i < seen.length; i++) if (!seen[i]) this.blocked[i] = 1
  }

  private rasterize(inflate: number) {
    const r = Math.ceil(inflate / NAV_CELL)
    const stamp = (cx: number, cy: number) => {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const x = cx + dx
          const y = cy + dy
          if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) continue
          this.blocked[y * this.cols + x] = 1
        }
      }
    }
    for (const s of this.world.segments) {
      const len = Math.hypot(s.bx - s.ax, s.by - s.ay)
      const steps = Math.max(1, Math.ceil(len / (NAV_CELL / 2)))
      for (let k = 0; k <= steps; k++) {
        const t = k / steps
        stamp(Math.floor((s.ax + (s.bx - s.ax) * t) / NAV_CELL), Math.floor((s.ay + (s.by - s.ay) * t) / NAV_CELL))
      }
    }
    // Border
    for (let x = 0; x < this.cols; x++) {
      for (let dy = 0; dy <= r; dy++) {
        this.blocked[dy * this.cols + x] = 1
        this.blocked[(this.rows - 1 - dy) * this.cols + x] = 1
      }
    }
    for (let y = 0; y < this.rows; y++) {
      for (let dx = 0; dx <= r; dx++) {
        this.blocked[y * this.cols + dx] = 1
        this.blocked[y * this.cols + this.cols - 1 - dx] = 1
      }
    }
  }

  private toCell(p: Vec2): number {
    const cx = clamp(Math.floor(p.x / NAV_CELL), 0, this.cols - 1)
    const cy = clamp(Math.floor(p.y / NAV_CELL), 0, this.rows - 1)
    return cy * this.cols + cx
  }

  private toWorld(i: number): Vec2 {
    const cx = i % this.cols
    const cy = (i - cx) / this.cols
    return { x: (cx + 0.5) * NAV_CELL, y: (cy + 0.5) * NAV_CELL }
  }

  /** Nearest unblocked cell to `i`, searching outward in rings. */
  nearestFree(i: number, maxRing = 8): number {
    if (!this.blocked[i]) return i
    const cx = i % this.cols
    const cy = (i - cx) / this.cols
    for (let ring = 1; ring <= maxRing; ring++) {
      let best = -1
      let bestD = Infinity
      for (let dy = -ring; dy <= ring; dy++) {
        for (let dx = -ring; dx <= ring; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue
          const x = cx + dx
          const y = cy + dy
          if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) continue
          const j = y * this.cols + x
          if (this.blocked[j]) continue
          const d = dx * dx + dy * dy
          if (d < bestD) {
            bestD = d
            best = j
          }
        }
      }
      if (best >= 0) return best
    }
    return -1
  }

  isFree(p: Vec2): boolean {
    return !this.blocked[this.toCell(p)]
  }

  /** Bresenham line-of-sight test over the nav grid. */
  private lineFree(a: number, b: number): boolean {
    let x0 = a % this.cols
    let y0 = (a - x0) / this.cols
    const x1 = b % this.cols
    const y1 = (b - x1) / this.cols
    const dx = Math.abs(x1 - x0)
    const dy = Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx - dy
    for (;;) {
      if (this.blocked[y0 * this.cols + x0]) return false
      if (x0 === x1 && y0 === y1) return true
      const e2 = err * 2
      if (e2 > -dy) {
        err -= dy
        x0 += sx
      }
      if (e2 < dx) {
        err += dx
        y0 += sy
      }
    }
  }

  /** Returns a smoothed world-space path (excluding start), or null if unreachable. */
  plan(from: Vec2, to: Vec2): Vec2[] | null {
    const start = this.nearestFree(this.toCell(from), 6)
    const goal = this.nearestFree(this.toCell(to), 18)
    if (start < 0 || goal < 0) return null
    if (start === goal) return [this.toWorld(goal)]

    const { cols, rows, blocked, g, f, parent, closed, opened } = this
    closed.fill(0)
    opened.fill(0)
    const heap = new Heap(f)
    const gx = goal % cols
    const gy = (goal - gx) / cols
    const h = (i: number) => {
      const x = i % cols
      const y = (i - x) / cols
      const dx = Math.abs(x - gx)
      const dy = Math.abs(y - gy)
      return Math.max(dx, dy) + 0.4142 * Math.min(dx, dy)
    }
    g[start] = 0
    f[start] = h(start)
    parent[start] = -1
    heap.push(start)
    opened[start] = 1

    let found = false
    let expanded = 0
    while (heap.size > 0 && expanded < 200000) {
      const cur = heap.pop()
      if (cur === goal) {
        found = true
        break
      }
      if (closed[cur]) continue
      closed[cur] = 1
      expanded++
      const cx = cur % cols
      const cy = (cur - cx) / cols
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue
          const nx = cx + dx
          const ny = cy + dy
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
          const ni = ny * cols + nx
          if (blocked[ni] || closed[ni]) continue
          // No corner cutting through blocked orthogonal neighbours
          if (dx !== 0 && dy !== 0 && (blocked[cy * cols + nx] || blocked[ny * cols + cx])) continue
          const cost = g[cur] + (dx !== 0 && dy !== 0 ? 1.4142 : 1)
          if (!opened[ni] || cost < g[ni]) {
            g[ni] = cost
            f[ni] = cost + h(ni)
            parent[ni] = cur
            opened[ni] = 1
            heap.push(ni)
          }
        }
      }
    }
    if (!found) return null

    const cells: number[] = []
    for (let i = goal; i !== -1; i = parent[i]) cells.push(i)
    cells.reverse()

    // String-pulling: keep only the waypoints needed to keep line of sight
    const out: Vec2[] = []
    let anchor = 0
    for (let i = 2; i <= cells.length; i++) {
      if (i === cells.length || !this.lineFree(cells[anchor], cells[i])) {
        out.push(this.toWorld(cells[i - 1]))
        anchor = i - 1
      }
    }
    if (out.length === 0) out.push(this.toWorld(goal))
    // Only aim at the exact requested point when it's actually reachable; a click on an obstacle
    // ends at the nearest free cell beside it instead of driving into it.
    if (this.isFree(to)) out[out.length - 1] = { x: to.x, y: to.y }
    return out
  }
}

/**
 * Pure-pursuit path follower emitting the same DriveInput the keyboard would.
 * Works for both drive models; the car gets a reverse-arc when the target is behind it.
 */
export class PathFollower {
  path: Vec2[] = []
  private idx = 0
  private reversing = false
  private tolerance = 22
  readonly lookahead = 64
  readonly arriveDist = 22

  constructor(private readonly drive: () => DriveModel) {}

  /** `tolerance` is how close counts as arrived (a beacon's vicinity radius for tour legs). */
  setPath(path: Vec2[], tolerance = this.arriveDist) {
    this.path = path
    this.idx = 0
    this.reversing = false
    this.tolerance = tolerance
  }

  get active() {
    return this.path.length > 0
  }

  get goal(): Vec2 | null {
    return this.path.length ? this.path[this.path.length - 1] : null
  }

  clear() {
    this.path = []
    this.idx = 0
    this.reversing = false
  }

  /** Returns null when the goal has been reached. */
  update(pose: Pose, state: DriveState, out: DriveInput): boolean {
    if (!this.path.length) return false
    const drive = this.drive()
    const goal = this.path[this.path.length - 1]
    const dGoal = Math.hypot(goal.x - pose.x, goal.y - pose.y)
    const goalAlpha = wrapAngle(Math.atan2(goal.y - pose.y, goal.x - pose.x) - pose.theta)
    // Inside the vicinity tolerance with the goal beside/behind us: good enough, stop here rather
    // than orbit (a car can't spiral into a point tighter than its turning radius).
    const closeEnough = dGoal < this.tolerance && Math.abs(goalAlpha) > 1.1
    if (dGoal < this.arriveDist || closeEnough) {
      this.clear()
      out.throttle = 0
      out.steer = 0
      return false
    }

    // Advance waypoint index when close to the current waypoint
    while (this.idx < this.path.length - 1) {
      const w = this.path[this.idx]
      if (Math.hypot(w.x - pose.x, w.y - pose.y) < this.lookahead * 0.8) this.idx++
      else break
    }

    // Lookahead target along the remaining path
    let target = this.path[this.idx]
    for (let i = this.idx; i < this.path.length; i++) {
      target = this.path[i]
      if (Math.hypot(target.x - pose.x, target.y - pose.y) >= this.lookahead) break
    }

    const alpha = wrapAngle(Math.atan2(target.y - pose.y, target.x - pose.x) - pose.theta)
    const dTarget = Math.max(1, Math.hypot(target.x - pose.x, target.y - pose.y))
    const slowForGoal = clamp(dGoal / 140, 0.35, 1)

    if (drive.turnsInPlace) {
      const absA = Math.abs(alpha)
      out.steer = clamp(alpha * 2.4, -1, 1)
      out.throttle = absA > 1.25 ? 0 : clamp((1 - absA * 0.9) * slowForGoal, 0.2, 1)
      return true
    }

    // Ackermann: pure pursuit curvature → steering angle
    const car = drive as AckermannDrive
    if (!this.reversing && Math.abs(alpha) > 2.0) this.reversing = true
    if (this.reversing && Math.abs(alpha) < 0.9) this.reversing = false

    if (this.reversing) {
      // Back up while steering away from the target so the nose swings toward it.
      out.throttle = -0.7
      out.steer = alpha > 0 ? -1 : 1
      return true
    }
    const kappa = (2 * Math.sin(alpha)) / dTarget
    const delta = Math.atan(kappa * car.wheelbase)
    out.steer = clamp(delta / car.maxDelta, -1, 1)
    const sharp = Math.abs(out.steer)
    out.throttle = clamp((1 - sharp * 0.55) * slowForGoal, 0.3, 1)
    // Autopilot drives the car at a cruising pace, and brakes ahead of sharp corners so the
    // speed-sensitive steering still has enough lock when it gets there.
    out.throttle = Math.min(out.throttle, 0.6)
    if (Math.abs(delta) > car.deltaLimitAt(state.v) * 0.9) out.throttle = Math.min(out.throttle, 0.3)
    if (this.idx < this.path.length - 1) {
      const wp = this.path[this.idx]
      const nxt = this.path[this.idx + 1]
      const a1 = Math.atan2(wp.y - pose.y, wp.x - pose.x)
      const a2 = Math.atan2(nxt.y - wp.y, nxt.x - wp.x)
      const turn = Math.abs(wrapAngle(a2 - a1))
      const braking = (state.v * state.v) / (2 * 2400) + 70
      if (turn > 0.5 && Math.hypot(wp.x - pose.x, wp.y - pose.y) < braking) out.throttle = Math.min(out.throttle, 0.3)
    }
    // Keep the car crawling around tight bends; state.v only used for smoothing decisions
    if (Math.abs(state.v) < 5 && sharp > 0.95) out.throttle = 0.5
    return true
  }
}
