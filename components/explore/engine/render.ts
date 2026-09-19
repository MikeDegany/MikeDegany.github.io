import { roundRect } from "./mapper"
import { PALETTE } from "./world"

/** Jackal: yellow/black chassis, 4 wheels, lidar puck. Drawn facing +x, centred on the body. */
export function drawJackal(ctx: CanvasRenderingContext2D, wheelSpin: number) {
  // wheels
  ctx.fillStyle = "#0f172a"
  for (const sx of [-13, 11]) {
    for (const sy of [-21, 15]) {
      roundRect(ctx, sx, sy, 14, 7, 2)
      ctx.fill()
    }
  }
  // tread marks (animate with travel)
  ctx.strokeStyle = "rgba(255,255,255,0.35)"
  ctx.lineWidth = 1
  for (const sx of [-13, 11]) {
    for (const sy of [-21, 15]) {
      const o = ((wheelSpin % 6) + 6) % 6
      ctx.beginPath()
      ctx.moveTo(sx + o, sy)
      ctx.lineTo(sx + o, sy + 7)
      ctx.stroke()
    }
  }
  // body
  ctx.fillStyle = "#f5b301"
  roundRect(ctx, -22, -15, 44, 30, 5)
  ctx.fill()
  ctx.strokeStyle = "#111827"
  ctx.lineWidth = 2
  ctx.stroke()
  // black top plate
  ctx.fillStyle = "#111827"
  roundRect(ctx, -16, -10, 30, 20, 3)
  ctx.fill()
  // lidar puck (front)
  ctx.beginPath()
  ctx.arc(6, 0, 6, 0, Math.PI * 2)
  ctx.fillStyle = "#1e293b"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(6, 0, 4, 0, Math.PI * 2)
  ctx.strokeStyle = PALETTE.accent
  ctx.lineWidth = 1.5
  ctx.stroke()
  // headlights
  ctx.fillStyle = "#fef3c7"
  ctx.fillRect(20, -11, 3, 5)
  ctx.fillRect(20, 6, 3, 5)
}

/** Ackermann car: front wheels rotate with the steering angle. Facing +x. */
export function drawCar(ctx: CanvasRenderingContext2D, delta: number, wheelSpin: number) {
  const drawWheel = (x: number, y: number, angle: number) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.fillStyle = "#0f172a"
    roundRect(ctx, -7, -3.5, 14, 7, 2)
    ctx.fill()
    ctx.strokeStyle = "rgba(255,255,255,0.35)"
    ctx.lineWidth = 1
    const o = (((wheelSpin % 6) + 6) % 6) - 3
    ctx.beginPath()
    ctx.moveTo(o, -3.5)
    ctx.lineTo(o, 3.5)
    ctx.stroke()
    ctx.restore()
  }
  drawWheel(-16, -17, 0)
  drawWheel(-16, 17, 0)
  drawWheel(16, -17, delta)
  drawWheel(16, 17, delta)
  // body
  ctx.fillStyle = "#e2e8f0"
  roundRect(ctx, -28, -14, 56, 28, 7)
  ctx.fill()
  ctx.strokeStyle = "#94a3b8"
  ctx.lineWidth = 1.5
  ctx.stroke()
  // cabin + glass
  ctx.fillStyle = "#cbd5e1"
  roundRect(ctx, -14, -11, 30, 22, 4)
  ctx.fill()
  ctx.fillStyle = "rgba(96,165,250,0.6)"
  roundRect(ctx, 4, -9, 9, 18, 2)
  ctx.fill()
  ctx.fillStyle = "rgba(96,165,250,0.4)"
  roundRect(ctx, -14, -9, 6, 18, 2)
  ctx.fill()
  // roof lidar
  ctx.beginPath()
  ctx.arc(-2, 0, 5, 0, Math.PI * 2)
  ctx.fillStyle = "#1e293b"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(-2, 0, 3.2, 0, Math.PI * 2)
  ctx.strokeStyle = PALETTE.accent
  ctx.lineWidth = 1.5
  ctx.stroke()
  // headlights
  ctx.fillStyle = "#fde68a"
  ctx.beginPath()
  ctx.arc(27, -8, 2.5, 0, Math.PI * 2)
  ctx.arc(27, 8, 2.5, 0, Math.PI * 2)
  ctx.fill()
}

export function drawBeacon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  t: number,
  active: boolean,
  visited: boolean,
  reduced: boolean
) {
  const pulse = reduced ? 0 : (Math.sin(t * 3) + 1) / 2
  // Trigger zone
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.strokeStyle = color
  ctx.globalAlpha = active ? 0.9 : 0.28
  ctx.lineWidth = active ? 2.5 : 1.5
  ctx.setLineDash(active ? [] : [8, 10])
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
  // Core
  const r = 10 + pulse * 4
  ctx.beginPath()
  ctx.arc(x, y, r + 8, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.globalAlpha = 0.12 + pulse * 0.1
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.beginPath()
  ctx.moveTo(x, y - r)
  ctx.lineTo(x + r, y)
  ctx.lineTo(x, y + r)
  ctx.lineTo(x - r, y)
  ctx.closePath()
  ctx.fillStyle = visited ? "rgba(226,232,240,0.85)" : color
  ctx.fill()
  if (visited) {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

export function drawGoal(ctx: CanvasRenderingContext2D, x: number, y: number, age: number, reduced: boolean) {
  const ripple = reduced ? 0.5 : (age * 1.5) % 1
  ctx.beginPath()
  ctx.arc(x, y, 10 + ripple * 26, 0, Math.PI * 2)
  ctx.strokeStyle = PALETTE.goal
  ctx.globalAlpha = 1 - ripple
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.globalAlpha = 1
  ctx.beginPath()
  ctx.moveTo(x - 9, y)
  ctx.lineTo(x + 9, y)
  ctx.moveTo(x, y - 9)
  ctx.lineTo(x, y + 9)
  ctx.strokeStyle = PALETTE.goal
  ctx.lineWidth = 2.5
  ctx.stroke()
}

export function drawLabelPill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, scale: number, font = "600 15px Geist, ui-sans-serif, system-ui, sans-serif") {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.font = font
  const w = ctx.measureText(text).width + 20
  roundRect(ctx, -w / 2, -13, w, 26, 13)
  ctx.fillStyle = "rgba(5,11,24,0.85)"
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = "#f8fafc"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, 0, 1)
  ctx.restore()
}

/** Edge-of-screen compass arrow pointing at an off-screen objective (screen-space). */
export function drawCompass(ctx: CanvasRenderingContext2D, vw: number, vh: number, dirX: number, dirY: number, color: string, label: string) {
  const margin = 34
  const cx = vw / 2
  const cy = vh / 2
  // Intersect the ray from centre with the inset rectangle
  const hx = cx - margin
  const hy = cy - margin
  const tx = dirX !== 0 ? hx / Math.abs(dirX) : Infinity
  const ty = dirY !== 0 ? hy / Math.abs(dirY) : Infinity
  const t = Math.min(tx, ty)
  const x = cx + dirX * t
  const y = cy + dirY * t
  const ang = Math.atan2(dirY, dirX)
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(ang)
  ctx.beginPath()
  ctx.moveTo(14, 0)
  ctx.lineTo(-8, -9)
  ctx.lineTo(-3, 0)
  ctx.lineTo(-8, 9)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
  ctx.font = "600 12px Geist, ui-sans-serif, system-ui, sans-serif"
  ctx.fillStyle = "rgba(226,232,240,0.9)"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const lx = x - dirX * 34
  const ly = y - dirY * 34
  ctx.fillText(label, lx, ly)
}
