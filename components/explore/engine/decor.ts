import type { DecorItem, IconName } from "./types"
import { roundRect } from "./mapper"

const FONT = "Geist, ui-sans-serif, system-ui, sans-serif"
const pathCache = new Map<string, Path2D>()

export type Box = { x0: number; y0: number; x1: number; y1: number }

/** Approximate world-space bounds of a decor item (used for culling and reveal checks). */
export function decorBounds(d: DecorItem): Box {
  switch (d.kind) {
    case "text": {
      const w = d.maxWidth ?? d.text.length * d.size * 0.58
      const lines = d.maxLines ?? 1
      const h = d.size * 1.2 * lines
      const x0 = d.align === "center" ? d.x - w / 2 : d.align === "right" ? d.x - w : d.x
      return { x0, y0: d.y - d.size * 0.6, x1: x0 + w, y1: d.y - d.size * 0.6 + h }
    }
    case "rect": {
      if (!d.angle) return { x0: d.x, y0: d.y, x1: d.x + d.w, y1: d.y + d.h }
      const r = Math.hypot(d.w, d.h) / 2
      const cx = d.x + d.w / 2
      const cy = d.y + d.h / 2
      return { x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r }
    }
    case "image":
    case "hazard":
    case "rack":
    case "desk":
      return { x0: d.x, y0: d.y, x1: d.x + d.w, y1: d.y + d.h }
    case "circle":
    case "spotlight":
    case "pad":
      return { x0: d.x - d.r, y0: d.y - d.r, x1: d.x + d.r, y1: d.y + d.r }
    case "icon":
    case "fiducial":
      return { x0: d.x - d.size / 2, y0: d.y - d.size / 2, x1: d.x + d.size / 2, y1: d.y + d.size / 2 }
    case "path": {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const p of d.points) {
        if (p.x < x0) x0 = p.x
        if (p.y < y0) y0 = p.y
        if (p.x > x1) x1 = p.x
        if (p.y > y1) y1 = p.y
      }
      const m = d.width / 2
      return { x0: x0 - m, y0: y0 - m, x1: x1 + m, y1: y1 + m }
    }
    case "chevrons": {
      const r = d.size + d.count * d.gap
      return { x0: d.x - r, y0: d.y - r, x1: d.x + r, y1: d.y + r }
    }
    case "tick":
      return { x0: d.x - 40, y0: d.y - 10, x1: d.x + 40, y1: d.y + 30 }
    case "bbox":
      return { x0: d.x, y0: d.y - 22, x1: d.x + d.w, y1: d.y + d.h }
    case "svgicon":
      return { x0: d.x - d.size / 2, y0: d.y - d.size / 2, x1: d.x + d.size / 2, y1: d.y + d.size / 2 }
  }
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let cur = ""
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (ctx.measureText(test).width <= maxWidth || !cur) cur = test
    else {
      lines.push(cur)
      cur = w
    }
  }
  if (cur) lines.push(cur)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    let last = kept[maxLines - 1]
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1)
    kept[maxLines - 1] = `${last}…`
    return kept
  }
  return lines
}

/** Deterministic 5×5 AprilTag-ish bit pattern for a given id. */
export function fiducialBits(id: number): number[] {
  const bits: number[] = []
  let s = (id + 1) * 2654435761 >>> 0
  for (let i = 0; i < 25; i++) {
    s = (s ^ (s << 13)) >>> 0
    s = (s ^ (s >>> 17)) >>> 0
    s = (s ^ (s << 5)) >>> 0
    bits.push(s & 1)
  }
  // Force a corner asymmetry so tags are never rotationally ambiguous
  bits[0] = 1
  bits[4] = 0
  bits[20] = 0
  bits[24] = 1
  return bits
}

function drawIcon(ctx: CanvasRenderingContext2D, name: IconName, size: number, color: string) {
  const s = size / 2
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = Math.max(2, size * 0.07)
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  switch (name) {
    case "arm": {
      // Base, two links, gripper
      ctx.beginPath()
      ctx.moveTo(-s * 0.7, s * 0.8)
      ctx.lineTo(s * 0.1, s * 0.8)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-s * 0.3, s * 0.8)
      ctx.lineTo(-s * 0.1, 0)
      ctx.lineTo(s * 0.5, -s * 0.4)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(-s * 0.1, 0, size * 0.07, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(s * 0.5, -s * 0.4)
      ctx.lineTo(s * 0.8, -s * 0.7)
      ctx.moveTo(s * 0.5, -s * 0.4)
      ctx.lineTo(s * 0.85, -s * 0.25)
      ctx.stroke()
      break
    }
    case "car": {
      roundRect(ctx, -s * 0.85, -s * 0.15, s * 1.7, s * 0.55, size * 0.06)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-s * 0.5, -s * 0.15)
      ctx.lineTo(-s * 0.3, -s * 0.5)
      ctx.lineTo(s * 0.35, -s * 0.5)
      ctx.lineTo(s * 0.55, -s * 0.15)
      ctx.stroke()
      for (const wx of [-s * 0.5, s * 0.5]) {
        ctx.beginPath()
        ctx.arc(wx, s * 0.45, size * 0.11, 0, Math.PI * 2)
        ctx.stroke()
      }
      // roof lidar
      ctx.beginPath()
      ctx.arc(0, -s * 0.62, size * 0.06, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case "chip": {
      roundRect(ctx, -s * 0.5, -s * 0.5, s, s, size * 0.04)
      ctx.stroke()
      roundRect(ctx, -s * 0.22, -s * 0.22, s * 0.44, s * 0.44, 2)
      ctx.fill()
      for (let i = -1; i <= 1; i++) {
        const o = i * s * 0.28
        ctx.beginPath()
        ctx.moveTo(o, -s * 0.5)
        ctx.lineTo(o, -s * 0.8)
        ctx.moveTo(o, s * 0.5)
        ctx.lineTo(o, s * 0.8)
        ctx.moveTo(-s * 0.5, o)
        ctx.lineTo(-s * 0.8, o)
        ctx.moveTo(s * 0.5, o)
        ctx.lineTo(s * 0.8, o)
        ctx.stroke()
      }
      break
    }
    case "tower": {
      ctx.beginPath()
      ctx.moveTo(-s * 0.35, s * 0.9)
      ctx.lineTo(0, -s * 0.5)
      ctx.lineTo(s * 0.35, s * 0.9)
      ctx.moveTo(-s * 0.22, s * 0.35)
      ctx.lineTo(s * 0.22, s * 0.35)
      ctx.moveTo(-s * 0.12, -s * 0.1)
      ctx.lineTo(s * 0.12, -s * 0.1)
      ctx.stroke()
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath()
        ctx.arc(0, -s * 0.55, s * 0.18 * r, -Math.PI * 0.8, -Math.PI * 0.2)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.arc(0, -s * 0.55, size * 0.05, 0, Math.PI * 2)
      ctx.fill()
      break
    }
  }
}

/**
 * Draws one decor item in world space at the current transform. `t` is game time (for pulses),
 * `images` is a cache the caller fills lazily.
 */
export function drawDecor(
  ctx: CanvasRenderingContext2D,
  d: DecorItem,
  t: number,
  images: Map<string, HTMLImageElement | null>,
  reduced: boolean
) {
  switch (d.kind) {
    case "text": {
      ctx.font = `${d.weight ?? 600} ${d.size}px ${FONT}`
      ctx.fillStyle = d.color
      ctx.textAlign = d.align ?? "left"
      ctx.textBaseline = "middle"
      const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
      if (d.letterSpacing && "letterSpacing" in c) c.letterSpacing = `${d.letterSpacing}px`
      let ox = d.x
      let oy = d.y
      if (d.angle) {
        ctx.save()
        ctx.translate(d.x, d.y)
        ctx.rotate(d.angle)
        ox = 0
        oy = 0
      }
      if (d.maxWidth) {
        const lines = wrapLines(ctx, d.text, d.maxWidth, d.maxLines ?? 2)
        const lh = d.size * 1.2
        lines.forEach((ln, i) => ctx.fillText(ln, ox, oy + i * lh))
      } else {
        ctx.fillText(d.text, ox, oy)
      }
      if (d.angle) ctx.restore()
      if ("letterSpacing" in c) c.letterSpacing = "0px"
      break
    }
    case "rect": {
      if (d.glow) {
        ctx.shadowColor = d.stroke ?? d.fill
        ctx.shadowBlur = 14
      }
      let rx = d.x
      let ry = d.y
      if (d.angle) {
        ctx.save()
        ctx.translate(d.x + d.w / 2, d.y + d.h / 2)
        ctx.rotate(d.angle)
        rx = -d.w / 2
        ry = -d.h / 2
      }
      ctx.fillStyle = d.fill
      roundRect(ctx, rx, ry, d.w, d.h, d.radius ?? 0)
      ctx.fill()
      ctx.shadowBlur = 0
      if (d.stroke) {
        ctx.strokeStyle = d.stroke
        ctx.lineWidth = 2
        ctx.stroke()
      }
      if (d.angle) ctx.restore()
      break
    }
    case "circle": {
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = d.fill
      ctx.fill()
      if (d.stroke) {
        ctx.strokeStyle = d.stroke
        ctx.lineWidth = 2
        ctx.stroke()
      }
      break
    }
    case "path": {
      ctx.beginPath()
      d.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
      ctx.strokeStyle = d.stroke
      ctx.lineWidth = d.width
      ctx.lineCap = d.cap ?? "butt"
      ctx.setLineDash(d.dash ?? [])
      ctx.stroke()
      ctx.setLineDash([])
      break
    }
    case "chevrons": {
      ctx.save()
      ctx.translate(d.x, d.y)
      ctx.rotate(d.angle)
      ctx.strokeStyle = d.color
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      for (let i = 0; i < d.count; i++) {
        const o = i * d.gap
        ctx.beginPath()
        ctx.moveTo(o - d.size * 0.6, -d.size)
        ctx.lineTo(o + d.size * 0.4, 0)
        ctx.lineTo(o - d.size * 0.6, d.size)
        ctx.stroke()
      }
      ctx.restore()
      break
    }
    case "image": {
      const img = images.get(d.src)
      ctx.save()
      roundRect(ctx, d.x, d.y, d.w, d.h, d.radius ?? 0)
      ctx.clip()
      if (img && img.complete && img.naturalWidth > 0) {
        const s = Math.max(d.w / img.naturalWidth, d.h / img.naturalHeight)
        const iw = img.naturalWidth * s
        const ih = img.naturalHeight * s
        ctx.drawImage(img, d.x + (d.w - iw) / 2, d.y + (d.h - ih) / 2, iw, ih)
      } else {
        ctx.fillStyle = "rgba(148,163,184,0.15)"
        ctx.fillRect(d.x, d.y, d.w, d.h)
      }
      ctx.restore()
      break
    }
    case "hazard": {
      ctx.save()
      roundRect(ctx, d.x, d.y, d.w, d.h, 3)
      ctx.clip()
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(d.x, d.y, d.w, d.h)
      ctx.fillStyle = "#fbbf24"
      const step = 18
      for (let k = -d.h; k < d.w + d.h; k += step * 2) {
        ctx.beginPath()
        ctx.moveTo(d.x + k, d.y)
        ctx.lineTo(d.x + k + step, d.y)
        ctx.lineTo(d.x + k + step - d.h, d.y + d.h)
        ctx.lineTo(d.x + k - d.h, d.y + d.h)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 2
      roundRect(ctx, d.x, d.y, d.w, d.h, 3)
      ctx.stroke()
      break
    }
    case "spotlight": {
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r)
      g.addColorStop(0, d.color)
      g.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case "rack": {
      ctx.fillStyle = "#1e293b"
      roundRect(ctx, d.x, d.y, d.w, d.h, 3)
      ctx.fill()
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.strokeStyle = "rgba(148,163,184,0.5)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = d.x + 14; x < d.x + d.w; x += 14) {
        ctx.moveTo(x, d.y + 3)
        ctx.lineTo(x, d.y + d.h - 3)
      }
      ctx.stroke()
      // a few boxes on the shelf
      ctx.fillStyle = "#475569"
      for (let x = d.x + 20; x < d.x + d.w - 30; x += 46) {
        ctx.fillRect(x, d.y + d.h * 0.3, 22, d.h * 0.4)
      }
      break
    }
    case "desk": {
      ctx.fillStyle = "#334155"
      roundRect(ctx, d.x, d.y, d.w, d.h, 4)
      ctx.fill()
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 2
      ctx.stroke()
      // monitor
      const mx = d.x + d.w / 2
      const my = d.y + (d.facing === 1 ? d.h * 0.3 : d.h * 0.7)
      ctx.fillStyle = "#0f172a"
      roundRect(ctx, mx - 22, my - 7, 44, 14, 2)
      ctx.fill()
      ctx.fillStyle = "#60a5fa"
      ctx.fillRect(mx - 19, my - 4, 38, 8)
      // keyboard
      ctx.fillStyle = "#475569"
      const ky = d.y + (d.facing === 1 ? d.h * 0.72 : d.h * 0.28)
      roundRect(ctx, mx - 18, ky - 4, 36, 8, 2)
      ctx.fill()
      break
    }
    case "pad": {
      const pulse = d.pulse && !reduced ? (Math.sin(t * 2.2) + 1) / 2 : 0.5
      ctx.strokeStyle = d.color
      for (let k = 1; k <= 3; k++) {
        ctx.globalAlpha = 0.18 + 0.22 * (k === 3 ? pulse : 1 - k * 0.2)
        ctx.lineWidth = k === 3 ? 3 : 1.5
        ctx.beginPath()
        ctx.arc(d.x, d.y, (d.r * k) / 3, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = d.color
      ctx.globalAlpha = 0.08
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
      // corner brackets
      ctx.lineWidth = 2
      const b = d.r * 0.72
      const l = d.r * 0.22
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
        ctx.beginPath()
        ctx.moveTo(d.x + sx * b, d.y + sy * (b - l))
        ctx.lineTo(d.x + sx * b, d.y + sy * b)
        ctx.lineTo(d.x + sx * (b - l), d.y + sy * b)
        ctx.stroke()
      }
      break
    }
    case "icon": {
      ctx.save()
      ctx.translate(d.x, d.y)
      drawIcon(ctx, d.name, d.size, d.color)
      ctx.restore()
      break
    }
    case "fiducial": {
      const bits = fiducialBits(d.id)
      const cell = d.size / 7
      const x0 = d.x - d.size / 2
      const y0 = d.y - d.size / 2
      ctx.fillStyle = "#f8fafc"
      ctx.fillRect(x0, y0, d.size, d.size)
      ctx.fillStyle = "#0b0f19"
      ctx.fillRect(x0 + cell, y0 + cell, d.size - cell * 2, d.size - cell * 2)
      ctx.fillStyle = "#f8fafc"
      for (let i = 0; i < 25; i++) {
        if (!bits[i]) continue
        const cx = i % 5
        const cy = (i - cx) / 5
        ctx.fillRect(x0 + cell * (cx + 1), y0 + cell * (cy + 1), cell, cell)
      }
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 1.5
      ctx.strokeRect(x0, y0, d.size, d.size)
      break
    }
    case "bbox": {
      // Object-detection style box: thin frame, corner brackets, class tag with confidence
      ctx.strokeStyle = d.color
      ctx.lineWidth = 1.5
      ctx.globalAlpha *= 0.9
      ctx.setLineDash([6, 6])
      ctx.strokeRect(d.x, d.y, d.w, d.h)
      ctx.setLineDash([])
      ctx.lineWidth = 3
      const l = Math.min(18, d.w * 0.2, d.h * 0.2)
      for (const [sx, sy] of [[0, 0], [1, 0], [1, 1], [0, 1]] as const) {
        const cx = d.x + sx * d.w
        const cy = d.y + sy * d.h
        ctx.beginPath()
        ctx.moveTo(cx, cy + (sy ? -l : l))
        ctx.lineTo(cx, cy)
        ctx.lineTo(cx + (sx ? -l : l), cy)
        ctx.stroke()
      }
      ctx.font = `700 13px ${FONT}`
      const tag = d.conf !== undefined ? `${d.label} ${d.conf.toFixed(2)}` : d.label
      const tw = ctx.measureText(tag).width + 14
      ctx.fillStyle = d.color
      ctx.fillRect(d.x, d.y - 20, tw, 20)
      ctx.fillStyle = "#0b0f19"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(tag, d.x + 7, d.y - 10)
      break
    }
    case "svgicon": {
      // Brand tile: rounded square in the brand colour with the 24-unit glyph drawn on top.
      ctx.fillStyle = d.bg
      roundRect(ctx, d.x - d.size / 2, d.y - d.size / 2, d.size, d.size, d.size * 0.22)
      ctx.fill()
      ctx.strokeStyle = "rgba(255,255,255,0.35)"
      ctx.lineWidth = 2
      ctx.stroke()
      let p2d = pathCache.get(d.path)
      if (!p2d) {
        p2d = new Path2D(d.path)
        pathCache.set(d.path, p2d)
      }
      const glyph = d.size * 0.56
      ctx.save()
      ctx.translate(d.x - glyph / 2, d.y - glyph / 2)
      ctx.scale(glyph / 24, glyph / 24)
      ctx.fillStyle = d.color
      ctx.fill(p2d)
      ctx.restore()
      break
    }
    case "tick": {
      ctx.strokeStyle = d.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(d.x, d.y - 8)
      ctx.lineTo(d.x, d.y + 8)
      ctx.stroke()
      ctx.font = `500 13px ${FONT}`
      ctx.fillStyle = d.color
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(d.label, d.x, d.y + 12)
      break
    }
  }
}
