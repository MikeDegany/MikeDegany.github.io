import type { World } from "./types"
import { PALETTE } from "./world"

export const CELL = 10 // world units per occupancy cell
export const MAP_SCALE = 0.5 // map-canvas pixels per world unit
const CELL_PX = CELL * MAP_SCALE

export const UNKNOWN = 0
export const FREE = 1
export const OCCUPIED = 2

/**
 * Occupancy grid + the "discovered" map image (floor / wall cells only — all decor is
 * drawn as a crisp vector overlay by the game once an item is revealed).
 * Only dirty cells are painted each tick; the layer is never redrawn from scratch.
 */
export class Mapper {
  readonly cols: number
  readonly rows: number
  readonly grid: Uint8Array
  readonly layer: HTMLCanvasElement
  private readonly layerCtx: CanvasRenderingContext2D
  private readonly rowFloor: string[]
  private dirty: number[] = []
  private dirtyFlag: Uint8Array
  knownCells = 0

  constructor(world: World, floors: string[]) {
    this.cols = Math.ceil(world.width / CELL)
    this.rows = Math.ceil(world.height / CELL)
    this.grid = new Uint8Array(this.cols * this.rows)
    this.dirtyFlag = new Uint8Array(this.cols * this.rows)

    this.layer = document.createElement("canvas")
    this.layer.width = Math.ceil(world.width * MAP_SCALE)
    this.layer.height = Math.ceil(world.height * MAP_SCALE)
    this.layerCtx = this.layer.getContext("2d")!

    // Per-row floor tint so each room reads as a different space
    this.rowFloor = new Array(this.rows)
    for (let r = 0; r < this.rows; r++) {
      const y = (r + 0.5) * CELL
      const room = world.rooms.findIndex((rm) => y < rm.y1)
      this.rowFloor[r] = floors[room < 0 ? floors.length - 1 : room] ?? floors[0]
    }
  }

  cellIndex(x: number, y: number): number {
    const cx = Math.floor(x / CELL)
    const cy = Math.floor(y / CELL)
    if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return -1
    return cy * this.cols + cx
  }

  isKnownAt(x: number, y: number): boolean {
    const i = this.cellIndex(x, y)
    return i >= 0 && this.grid[i] !== UNKNOWN
  }

  private mark(i: number, state: number) {
    if (i < 0) return
    const cur = this.grid[i]
    // Occupied wins over free so wall cells don't flicker back to floor.
    if (cur === state || (cur === OCCUPIED && state === FREE)) return
    if (cur === UNKNOWN) this.knownCells++
    this.grid[i] = state
    if (!this.dirtyFlag[i]) {
      this.dirtyFlag[i] = 1
      this.dirty.push(i)
    }
  }

  /** Mark cells along a ray free, and the end cell occupied when the ray hit something. */
  markRay(x0: number, y0: number, x1: number, y1: number, hit: boolean) {
    let cx = Math.floor(x0 / CELL)
    let cy = Math.floor(y0 / CELL)
    // A hit exactly on x = width / y = height would land one cell past the grid; clamp it.
    const ex = Math.min(this.cols - 1, Math.max(0, Math.floor(x1 / CELL)))
    const ey = Math.min(this.rows - 1, Math.max(0, Math.floor(y1 / CELL)))
    const dx = Math.abs(ex - cx)
    const dy = Math.abs(ey - cy)
    const sx = cx < ex ? 1 : -1
    const sy = cy < ey ? 1 : -1
    let err = dx - dy
    let guard = dx + dy + 2
    while (guard-- > 0) {
      const last = cx === ex && cy === ey
      if (cx >= 0 && cy >= 0 && cx < this.cols && cy < this.rows) {
        this.mark(cy * this.cols + cx, last && hit ? OCCUPIED : FREE)
      }
      if (last) break
      const e2 = err * 2
      if (e2 > -dy) {
        err -= dy
        cx += sx
      }
      if (e2 < dx) {
        err += dx
        cy += sy
      }
    }
  }

  /** Paint every dirty cell into the layer. Cheap: a handful of rects per tick. */
  flush() {
    if (this.dirty.length === 0) return
    const ctx = this.layerCtx
    for (let k = 0; k < this.dirty.length; k++) {
      const i = this.dirty[k]
      this.dirtyFlag[i] = 0
      const state = this.grid[i]
      if (state === UNKNOWN) continue
      const cx = i % this.cols
      const cy = (i - cx) / this.cols
      ctx.fillStyle = state === OCCUPIED ? PALETTE.wall : this.rowFloor[cy]
      ctx.fillRect(cx * CELL_PX, cy * CELL_PX, CELL_PX, CELL_PX)
    }
    this.dirty.length = 0
  }
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  if (r <= 0) {
    ctx.rect(x, y, w, h)
    return
  }
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
