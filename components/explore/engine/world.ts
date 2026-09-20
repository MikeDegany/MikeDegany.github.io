import { projects } from "@/data/projects-list"
import { aboutBeats, aboutBeatText } from "@/data/about"
import { EDUCATION_ITEMS } from "@/data/education"
import { skills } from "@/data/skills"
import { contactLinks } from "@/data/contact"
import { rectSegments, rotRectSegments } from "./geometry"
import type { Beacon, Crate, DecorItem, Room, Segment, World } from "./types"

export const WORLD_W = 1000

const WALL_T = 14
const DOOR_W = 200

// Palette: navy + slate walls, amber lidar, site blue odometry. No cyan/teal anywhere.
export const PALETTE = {
  bg: "#03070f",
  wall: "#cbd5e1",
  wallFill: "#1e293b",
  title: "rgba(148,163,184,0.5)",
  text: "rgba(241,245,249,0.95)",
  muted: "rgba(148,163,184,0.85)",
  accent: "#fbbf24",
  blue: "#3b82f6",
  odom: "rgba(96,165,250,0.6)",
  loop: "rgba(251,146,60,0.85)",
  lidar: "rgba(251,191,36,0.16)",
  lidarFan: "rgba(251,191,36,0.05)",
  lidarHit: "#ff3d3d",
  goal: "#ffffff",
  path: "rgba(255,255,255,0.4)",
  demoPath: "rgba(251,191,36,0.4)",
  grid: "rgba(148,163,184,0.06)",
}

export const KIND_COLOR = {
  about: "#60a5fa",
  project: "#f59e0b",
  skills: "#a78bfa",
  education: "#34d399",
  interest: "#60a5fa",
  contact: "#f87171",
  nav: "#e2e8f0",
} as const

/** Rooms listed top → bottom. `door.x` is the left edge of the doorway in the wall ABOVE the room. */
type RoomSpec = { name: string; height: number; door: { x: number } | null; floor: string }
// Room heights below are computed from the underlying data arrays' length rather than hardcoded,
// so adding/removing a project, skill, or education entry on the main site grows/shrinks the
// matching room automatically instead of silently overlapping the next one. Each formula is
// back-solved to reproduce today's hand-tuned height at today's item count.
const ROOM_SPECS: RoomSpec[] = [
  { name: "CONTACT", height: 900, door: null, floor: "#1a3260" },
  { name: "EDUCATION", height: 100 + (Math.max(EDUCATION_ITEMS.length, 2) - 1) * 450, door: { x: 400 }, floor: "#17335f" },
  { name: "TECHNICAL SKILLS", height: 340 + (Math.ceil(skills.length / 3) - 1) * 190, door: { x: 700 }, floor: "#1d2e58" },
  { name: "PROJECTS", height: 660 + (Math.ceil(projects.length / 2) - 1) * 420, door: { x: 400 }, floor: "#183462" },
  { name: "ABOUT ME", height: 820, door: { x: 130 }, floor: "#1a305d" },
  { name: "HOME", height: 820, door: { x: 640 }, floor: "#1b3866" },
]

export function buildWorld(): World {
  const rooms: Room[] = []
  const segments: Segment[] = []
  const beacons: Beacon[] = []
  const crates: Crate[] = []
  const decor: DecorItem[] = []
  const alwaysDecor: DecorItem[] = []

  let y = 0
  ROOM_SPECS.forEach((spec, i) => {
    rooms.push({ index: i, name: spec.name, y0: y, y1: y + spec.height })
    y += spec.height
  })
  const height = y
  const R = Object.fromEntries(rooms.map((r) => [r.name, r])) as Record<string, Room>

  // Outer boundary (room -1 = always tested)
  segments.push(
    { ax: 0, ay: 0, bx: WORLD_W, by: 0, room: -1, crate: -1 },
    { ax: WORLD_W, ay: 0, bx: WORLD_W, by: height, room: -1, crate: -1 },
    { ax: WORLD_W, ay: height, bx: 0, by: height, room: -1, crate: -1 },
    { ax: 0, ay: height, bx: 0, by: 0, room: -1, crate: -1 }
  )

  // Dividing walls with a doorway, in the wall above each room (you travel upward)
  rooms.forEach((room, i) => {
    const spec = ROOM_SPECS[i]
    if (!spec.door) return
    const wy = room.y0 - WALL_T / 2
    const dx0 = spec.door.x
    const dx1 = spec.door.x + DOOR_W
    segments.push(...rectSegments(0, wy, dx0, WALL_T, i))
    segments.push(...rectSegments(dx1, wy, WORLD_W - dx1, WALL_T, i))
    // Walls are only ever shown through scanned occupancy cells; the doorway marker is always visible.
    alwaysDecor.push({ kind: "chevrons", x: dx0 + DOOR_W / 2, y: wy + WALL_T + 44, angle: -Math.PI / 2, count: 2, gap: 22, size: 16, color: "rgba(251,191,36,0.6)" })
  })

  // Room titles near the bottom edge (the side you enter from) + faint room numbers
  rooms.forEach((room, i) => {
    decor.push({
      kind: "text",
      text: room.name,
      x: WORLD_W / 2,
      y: room.y1 - 70,
      size: 60,
      color: PALETTE.title,
      weight: 800,
      align: "center",
      letterSpacing: 6,
    })
    decor.push({
      kind: "text",
      text: String(rooms.length - i).padStart(2, "0"),
      x: WORLD_W - 40,
      y: room.y0 + 60,
      size: 72,
      color: "rgba(148,163,184,0.12)",
      weight: 900,
      align: "right",
    })
  })

  const addObstacle = (room: number, x: number, y: number, w: number, h: number, item?: DecorItem) => {
    segments.push(...rectSegments(x, y, w, h, room))
    decor.push(item ?? { kind: "rect", x, y, w, h, fill: PALETTE.wallFill, stroke: PALETTE.wall, radius: 4 })
  }

  let order = 0
  let spawn = { x: 500, y: 0, theta: -Math.PI / 2 }

  // ─── HOME (bottom) ──────────────────────────────────────────────────────────
  {
    const r = R.HOME
    const spawnY = r.y0 + 600
    decor.push(
      { kind: "text", text: "Modern C++  |  Python", x: WORLD_W / 2, y: r.y0 + 150, size: 25, color: PALETTE.muted, weight: 600, align: "center" },
      { kind: "text", text: "Autonomous Vehicles  |  SLAM & 3D Perception", x: WORLD_W / 2, y: r.y0 + 186, size: 25, color: PALETTE.muted, weight: 600, align: "center" },
      { kind: "text", text: "Robotics Software Engineer  |  Mechatronics Engineer", x: WORLD_W / 2, y: r.y0 + 222, size: 25, color: PALETTE.muted, weight: 600, align: "center" },
      { kind: "text", text: "MIKE DEGANY", x: WORLD_W / 2, y: r.y0 + 300, size: 100, color: PALETTE.text, weight: 900, align: "center", letterSpacing: 4 }
    )
    spawn = { x: 500, y: spawnY, theta: -Math.PI / 2 }
  }

  // ─── ABOUT ──────────────────────────────────────────────────────────────────
  {
    const r = R["ABOUT ME"]
    const i = r.index
    // A profile "card" laid out on the floor: photo on the left, the about beats on the right.
    const cardX = 110
    const cardY = r.y0 + 150
    decor.push({ kind: "rect", x: cardX, y: cardY, w: 780, h: 400, fill: "rgba(15,23,42,0.82)", stroke: "rgba(148,163,184,0.4)", radius: 18 })
    addObstacle(i, cardX + 40, cardY + 60, 200, 250, { kind: "image", src: "/about.jpeg", x: cardX + 40, y: cardY + 60, w: 200, h: 250, radius: 14 })
    decor.push({ kind: "bbox", x: cardX + 30, y: cardY + 50, w: 220, h: 270, label: "person", color: KIND_COLOR.about, conf: 0.99 })
    decor.push({ kind: "text", text: "Mike Degany", x: cardX + 290, y: cardY + 70, size: 34, color: PALETTE.text, weight: 800 })
    decor.push({ kind: "text", text: "PhD Candidate · Vehicle Autonomy and Intelligence Lab @ UNT", x: cardX + 290, y: cardY + 108, size: 16, color: "rgba(226,232,240,0.9)", weight: 500, maxWidth: 460, maxLines: 2 })
    aboutBeats.slice(1).forEach((b, k) => {
      const yy = cardY + 170 + k * 100
      decor.push({ kind: "circle", x: cardX + 300, y: yy, r: 5, fill: KIND_COLOR.about })
      decor.push({ kind: "text", text: b.title.replace(/\s*\n\s*/g, " "), x: cardX + 320, y: yy, size: 24, color: PALETTE.text, weight: 700 })
      decor.push({ kind: "text", text: aboutBeatText(b), x: cardX + 320, y: yy + 32, size: 17, color: "rgba(226,232,240,0.95)", weight: 500, maxWidth: 440, maxLines: 2 })
    })
    beacons.push({
      id: "about",
      kind: "about",
      x: 500,
      y: cardY + 480,
      radius: 150,
      order: order++,
      room: i,
      title: "About me",
      subtitle: aboutBeats[0].title.replace(/\s*\n\s*/g, " "),
      lines: aboutBeats.map((b) => `${b.title.replace(/\s*\n\s*/g, " ")} — ${aboutBeatText(b)}`),
      image: "/about.jpeg",
      href: "/#about",
      actionLabel: "Read on the main site",
      color: KIND_COLOR.about,
    })
  }

  // ─── PROJECTS ───────────────────────────────────────────────────────────────
  {
    const r = R.PROJECTS
    const i = r.index
    const rowGap = 420
    // Visit order: bottom row first (nearest the entrance), left then right
    const ordered = projects.map((p, idx) => ({ p, idx })).sort((a, b) => Math.floor(b.idx / 2) - Math.floor(a.idx / 2) || a.idx - b.idx)
    for (const { p, idx } of ordered) {
      const left = idx % 2 === 0
      const row = Math.floor(idx / 2)
      const py = r.y0 + 170 + row * rowGap
      const pedX = left ? 60 : WORLD_W - 60 - 210
      decor.push({ kind: "spotlight", x: pedX + 105, y: py + 65, r: 190, color: "rgba(245,158,11,0.10)" })
      addObstacle(i, pedX, py, 210, 130, { kind: "rect", x: pedX, y: py, w: 210, h: 130, fill: "#0f172a", stroke: PALETTE.wall, radius: 6 })
      decor.push({ kind: "image", src: p.thumbnail, x: pedX + 8, y: py + 8, w: 194, h: 114, radius: 4 })
      decor.push({ kind: "text", text: p.title, x: pedX + 105, y: py + 152, size: 16, color: PALETTE.text, weight: 700, align: "center", maxWidth: 270, maxLines: 3 })
      beacons.push({
        id: `project-${p.slug}`,
        kind: "project",
        x: pedX + 105,
        y: py + 65,
        radius: 215,
        order: order++,
        room: i,
        title: p.briefTitle,
        subtitle: p.title,
        lines: [p.description],
        image: p.thumbnail,
        href: `/projects/${p.slug}`,
        actionLabel: "Open project",
        color: KIND_COLOR.project,
      })
    }
  }

  // ─── SKILLS (scattered, slightly askew containers) ──────────────────────────
  {
    const r = R["TECHNICAL SKILLS"]
    const i = r.index
    const TH = 56
    // Wide enough for the longest names (no canvas here, so estimate from character count)
    const widthFor = (name: string) => Math.max(150, Math.round(name.length * 18 * 0.62 + 36))
    // Irregular placement + small rotations so no two hallways look alike and neighbours peek
    // into view as you pass, packed procedurally (row by row, centered, deterministic jitter) so
    // it scales to any skill count instead of a hand-placed coordinate per skill. Gaps stay ≥ 130
    // so the planner (robot-radius inflated) can thread them; the row nearest each doorway dodges
    // that door's band (read from ROOM_SPECS, not hardcoded) so the entry/exit lanes stay clear.
    const perRow = 3
    const rowHeight = 190
    const topPad = 95
    const GAP = 50
    const DOOR_MARGIN = 40
    let seed = 1337
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
    const rows = Math.ceil(skills.length / perRow)
    const exitDoor = ROOM_SPECS[i].door // this room's own door — the lane out, near the top row
    const entryDoor = ROOM_SPECS[i + 1]?.door // the room after it in the array — the lane in, near the bottom row

    for (let row = 0; row < rows; row++) {
      const rowSkills = skills.slice(row * perRow, row * perRow + perRow)
      const widths = rowSkills.map((s) => widthFor(s.name))
      const totalW = widths.reduce((a, b) => a + b, 0) + GAP * (rowSkills.length - 1)

      let lo = 40, hi = WORLD_W - 40
      const nearDoor = row === 0 ? exitDoor : row === rows - 1 ? entryDoor : null
      if (nearDoor) {
        const bandLo = nearDoor.x - DOOR_MARGIN
        const bandHi = nearDoor.x + DOOR_W + DOOR_MARGIN
        // Push the row to whichever side of the door band leaves more room.
        if (bandLo - lo >= hi - bandHi) hi = bandLo
        else lo = bandHi
      }
      let cx = Math.max(lo, Math.min(hi - totalW, (lo + hi - totalW) / 2))

      rowSkills.forEach((sk) => {
        const TW = widthFor(sk.name)
        const centerX = cx + TW / 2
        const y = r.y0 + topPad + row * rowHeight + (rand() - 0.5) * 36
        const ang = (rand() - 0.5) * 0.32
        const crate: Crate = { skillId: sk.id, name: sk.name, color: sk.color, x: centerX - TW / 2, y: y - TH / 2, w: TW, h: TH }
        const idx = crates.push(crate) - 1
        segments.push(...rotRectSegments(centerX, y, TW, TH, ang, i, idx))
        decor.push({ kind: "rect", x: centerX - TW / 2, y: y - TH / 2, w: TW, h: TH, fill: sk.color, stroke: "rgba(255,255,255,0.55)", radius: 8, angle: ang })
        decor.push({ kind: "text", text: sk.name, x: centerX, y: y + 1, size: 18, color: "#0b1120", weight: 800, align: "center", maxWidth: TW - 14, maxLines: 1, angle: ang, ghost: true, ghostColor: sk.color })
        cx += TW + GAP
      })
    }
    beacons.push({
      id: "skills",
      kind: "skills",
      x: 500,
      y: r.y0 + topPad + ((rows - 1) * rowHeight) / 2,
      radius: 110,
      order: order++,
      room: i,
      title: "Skills yard",
      subtitle: "Objects identified by the lidar",
      color: KIND_COLOR.skills,
    })
  }

  // ─── EDUCATION (vector HD map: lane graph — boundaries, centerline, shape-point
  // vertices, graph nodes, arc-length station ticks) ──────────────────────────
  {
    const r = R.EDUCATION
    const i = r.index
    const top = r.y0 + 60
    const bottom = r.y1 - 40
    const HALF = 42 // half road width — kept narrow, real HD-map renders read as thin lines, not a wide filled band
    // Translucent rather than solid: the lane graph is background texture, not the focal content
    // (the degree/institution labels are) — kept soft the same way About's card panel/text sit at
    // reduced alpha instead of full opacity, without adding a background box behind it.
    const BOUNDARY = "rgba(74,222,128,0.55)" // road boundary (green)
    const DIVIDER = "rgba(251,146,60,0.55)" // lane centerline (orange, dashed)
    const NODE_COLOR = "#60a5fa" // graph node / label accent (blue) — kept solid, it colors actual content (years/award text, node markers)

    // Piecewise-straight reference path: waypoints at the entrance, each degree, and the
    // exit, connected by straight runs. A real vector map is digitized as explicit shape
    // points with straight segments between them, not a smooth parametric curve — and it
    // makes label clearance analyzable instead of accidental.
    const n = EDUCATION_ITEMS.length
    const AMP = 70
    const stationY = (k: number) => bottom - 200 - (k * (bottom - top - 400)) / (Math.max(n, 2) - 1)
    const stationX = (k: number) => 500 + (k % 2 === 0 ? -AMP : AMP)
    const waypoints = [
      { x: 500, y: bottom },
      ...Array.from({ length: n }, (_, k) => ({ x: stationX(k), y: stationY(k) })),
      { x: 500, y: top },
    ]
    const centre = (y: number) => {
      for (let idx = 0; idx < waypoints.length - 1; idx++) {
        const a = waypoints[idx], b = waypoints[idx + 1]
        if (y <= a.y && y >= b.y) return a.x + (b.x - a.x) * (a.y === b.y ? 0 : (a.y - y) / (a.y - b.y))
      }
      return 500
    }

    // Sparse lidar-point-cloud stipple behind the lane lines — the grayscale scatter texture
    // real HD-map renders are overlaid on. Deterministic (not Math.random) so the layout is
    // stable across renders. Pushed first so everything else draws on top of it.
    let seed = 1337
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
    for (let s = 0; s < 130; s++) {
      const px = 40 + rand() * (WORLD_W - 80)
      const py = top + rand() * (bottom - top)
      decor.push({ kind: "circle", x: px, y: py, r: 0.8 + rand() * 0.7, fill: `rgba(148,163,184,${(0.08 + rand() * 0.1).toFixed(2)})` })
    }

    const offsetPts = (off: number) => waypoints.map((w) => ({ x: w.x + off, y: w.y }))
    decor.push({ kind: "path", points: offsetPts(-HALF), stroke: BOUNDARY, width: 1.5 })
    decor.push({ kind: "path", points: offsetPts(HALF), stroke: BOUNDARY, width: 1.5 })
    decor.push({ kind: "path", points: offsetPts(0), stroke: DIVIDER, width: 1.5, dash: [14, 10] })

    // Explicit shape-point vertices along all three lines — the visual signature of vector
    // map data (Argoverse/nuScenes/Waymo-style renders), not a smoothly drawn road.
    const VTX_GAP = 90
    const VTX_DIVIDER = "rgba(251,146,60,0.4)"
    const VTX_BOUNDARY = "rgba(74,222,128,0.4)"
    for (const off of [-HALF, 0, HALF]) {
      for (let idx = 0; idx < waypoints.length - 1; idx++) {
        const a = waypoints[idx], b = waypoints[idx + 1]
        const steps = Math.max(1, Math.round(Math.abs(a.y - b.y) / VTX_GAP))
        for (let s = 0; s <= steps; s++) {
          const t = s / steps
          decor.push({ kind: "circle", x: a.x + (b.x - a.x) * t + off, y: a.y + (b.y - a.y) * t, r: off === 0 ? 1.2 : 1.5, fill: off === 0 ? VTX_DIVIDER : VTX_BOUNDARY })
        }
      }
    }

    // Lane direction arrows (travel is upward)
    for (let y = bottom - 120; y > top + 80; y -= 220) {
      for (const off of [-HALF / 2, HALF / 2]) {
        decor.push({ kind: "chevrons", x: centre(y) + off, y, angle: -Math.PI / 2, count: 1, gap: 0, size: 9, color: "rgba(255,255,255,0.35)" })
      }
    }

    // Legend — short line-style swatches, like a real map legend, not colored text alone.
    decor.push({ kind: "text", text: "HD MAP · VECTOR LANE GRAPH", x: 60, y: r.y0 + 60, size: 13, color: "rgba(226,232,240,0.55)", weight: 700, letterSpacing: 4 })
    decor.push({ kind: "path", points: [{ x: 60, y: r.y0 + 88 }, { x: 82, y: r.y0 + 88 }], stroke: BOUNDARY, width: 1.5 })
    decor.push({ kind: "text", text: "boundary", x: 90, y: r.y0 + 88, size: 12, color: "rgba(226,232,240,0.55)", weight: 600 })
    decor.push({ kind: "path", points: [{ x: 178, y: r.y0 + 88 }, { x: 200, y: r.y0 + 88 }], stroke: DIVIDER, width: 1.5, dash: [6, 5] })
    decor.push({ kind: "text", text: "centerline", x: 208, y: r.y0 + 88, size: 12, color: "rgba(226,232,240,0.55)", weight: 600 })
    decor.push({ kind: "circle", x: 306, y: r.y0 + 88, r: 3, fill: "rgba(96,165,250,0.55)" })
    decor.push({ kind: "text", text: "node", x: 316, y: r.y0 + 88, size: 12, color: "rgba(226,232,240,0.55)", weight: 600 })

    // Scale bar near the entrance for cartographic authenticity.
    const SCALE = 0.15
    const scaleLen = 100
    const sbY = bottom - 20
    decor.push({ kind: "path", points: [{ x: 60, y: sbY }, { x: 60 + scaleLen, y: sbY }], stroke: "rgba(226,232,240,0.5)", width: 2 })
    decor.push({ kind: "path", points: [{ x: 60, y: sbY - 6 }, { x: 60, y: sbY + 6 }], stroke: "rgba(226,232,240,0.5)", width: 2 })
    decor.push({ kind: "path", points: [{ x: 60 + scaleLen, y: sbY - 6 }, { x: 60 + scaleLen, y: sbY + 6 }], stroke: "rgba(226,232,240,0.5)", width: 2 })
    decor.push({ kind: "text", text: `≈ ${Math.round(scaleLen * SCALE)} m`, x: 60 + scaleLen / 2, y: sbY - 16, size: 11, color: "rgba(226,232,240,0.5)", align: "center", weight: 600 })

    // Arc-length station ticks (Frenet-style "s" coordinate), placed in the open gaps
    // between waypoints so they never fall inside a label's vertical span.
    let cum = 0
    for (let idx = 0; idx < waypoints.length - 1; idx++) {
      const a = waypoints[idx], b = waypoints[idx + 1]
      const segLen = Math.hypot(b.x - a.x, b.y - a.y)
      const midY = (a.y + b.y) / 2
      decor.push({ kind: "tick", x: centre(midY) - HALF - 26, y: midY, label: `${Math.round((cum + segLen / 2) * SCALE)} m`, color: "rgba(226,232,240,0.5)" })
      cum += segLen
    }

    const short: Record<string, string> = { "Bachelor of Science": "B.Sc.", "Master of Science": "M.Sc.", "Doctor of Philosophy": "Ph.D." }
    EDUCATION_ITEMS.forEach((item, k) => {
      const yy = stationY(k)
      const cx = stationX(k)
      const isPhd = k === n - 1
      const [degree, field] = item.degree.split(": ")
      const years = item.institution.match(/\((\d{4}) - (\d{4})\)/)
      const stripped = item.institution.replace(/\s*\(\d{4} - \d{4}\)/, "")
      const where = stripped.split(" - ")[0]
      const award = stripped.includes(" - ") ? stripped.split(" - ").slice(1).join(" - ") : ""
      const poiColor = isPhd ? "#22c55e" : NODE_COLOR
      const right = k % 2 === 0
      const anchorX = right ? cx + HALF : cx - HALF

      // Each degree is a lane-graph node — the vertex where the reference path changes
      // heading — not a pedestrian crossing. A small square marker + compact ID tag.
      decor.push({ kind: "rect", x: anchorX - 4, y: yy - 4, w: 8, h: 8, fill: poiColor, radius: 2 })
      decor.push({ kind: "text", text: `NODE ${String(k + 1).padStart(2, "0")}`, x: anchorX + (right ? 12 : -12), y: yy - 18, size: 10, color: "rgba(226,232,240,0.55)", weight: 700, letterSpacing: 1, align: right ? "left" : "right" })

      // Label clearance computed over the label's full vertical span (not just at yy) so the
      // boundary line — still transitioning between waypoints across that span — never
      // crosses the text, regardless of how steep the adjacent segment is.
      const labelSpan = { top: yy - 50, bot: yy + 80 }
      const edgeX = right
        ? Math.max(centre(labelSpan.top), centre(yy), centre(labelSpan.bot)) + HALF
        : Math.min(centre(labelSpan.top), centre(yy), centre(labelSpan.bot)) - HALF
      const bx = right ? Math.min(edgeX + 30, 1000 - 30 - 300) : Math.max(edgeX - 30 - 300, 30)
      const bw = 300

      decor.push({ kind: "path", points: [{ x: anchorX, y: yy }, { x: bx, y: yy }], stroke: "rgba(226,232,240,0.5)", width: 1.5, dash: [4, 6] })
      decor.push({ kind: "text", text: years ? `${years[1]} – ${years[2]}` : "", x: bx, y: yy - 38, size: 14, color: poiColor, weight: 700, letterSpacing: 2 })
      decor.push({ kind: "text", text: `${short[degree] ?? degree}  ${field}`, x: bx, y: yy - 6, size: 21, color: PALETTE.text, weight: 800, maxWidth: bw, maxLines: 2 })
      decor.push({ kind: "text", text: where, x: bx, y: yy + 38, size: 15, color: "rgba(226,232,240,0.9)", weight: 500, maxWidth: bw, maxLines: 1 })
      if (award) decor.push({ kind: "text", text: award, x: bx, y: yy + 64, size: 13, color: poiColor, weight: 600, maxWidth: bw, maxLines: 1 })

      beacons.push({
        id: `education-${k}`,
        kind: "education",
        x: cx,
        y: yy,
        radius: 150,
        order: order++,
        room: i,
        title: `${short[degree] ?? degree} ${field}`,
        subtitle: years ? `${years[1]} – ${years[2]}` : undefined,
        lines: award ? [where, award] : [where],
        color: poiColor,
      })
    })
  }

  // ─── CONTACT (top) ──────────────────────────────────────────────────────────
  {
    const r = R.CONTACT
    const i = r.index
    decor.push({ kind: "text", text: "dock on a pad and press Enter", x: WORLD_W / 2, y: r.y1 - 130, size: 19, color: PALETTE.muted, weight: 500, align: "center" })
    contactLinks.forEach((c, k) => {
      const x = 200 + k * 200
      const yy = r.y0 + 520
      decor.push({ kind: "svgicon", path: c.iconPath, x, y: yy, size: 96, color: "#ffffff", bg: c.color })
      decor.push({ kind: "text", text: c.label, x, y: yy + 82, size: 21, color: PALETTE.text, weight: 700, align: "center" })
      beacons.push({
        id: `contact-${c.id}`,
        kind: "contact",
        x,
        y: yy,
        radius: 95,
        order: order++,
        room: i,
        title: c.label,
        subtitle: c.href.replace(/^mailto:/, "").replace(/^https?:\/\//, ""),
        href: c.href,
        external: true,
        actionLabel: c.id === "email" ? "Send an email" : `Open ${c.label}`,
        color: c.color,
      })
    })
    // Past the contact pads, at the very end: a docking bay. Robots dock against a fiducial,
    // so the AprilTag on the back wall is the way back to the regular site.
    const dockY = r.y0 + 90
    addObstacle(i, 380, dockY, 20, 200, { kind: "rect", x: 380, y: dockY, w: 20, h: 200, fill: "#334155", stroke: PALETTE.wall, radius: 4 })
    addObstacle(i, 600, dockY, 20, 200, { kind: "rect", x: 600, y: dockY, w: 20, h: 200, fill: "#334155", stroke: PALETTE.wall, radius: 4 })
    addObstacle(i, 380, dockY, 240, 20, { kind: "rect", x: 380, y: dockY, w: 240, h: 20, fill: "#334155", stroke: PALETTE.wall, radius: 4 })
    decor.push({ kind: "rect", x: 400, y: dockY + 20, w: 200, h: 180, fill: "rgba(251,191,36,0.06)" })
    decor.push({ kind: "fiducial", x: 500, y: dockY + 82, size: 96, id: 7 })
    decor.push({ kind: "text", text: "DOCK", x: 500, y: dockY + 160, size: 14, color: PALETTE.accent, weight: 700, align: "center", letterSpacing: 5 })
    decor.push({ kind: "text", text: "Main site", x: 500, y: dockY + 330, size: 21, color: PALETTE.text, weight: 700, align: "center" })
    beacons.push({
      id: "nav-home", // trigger sits on the AprilTag (dockY + 82), not the "DOCK" text (dockY + 160)
      kind: "nav",
      x: 500,
      y: dockY + 82,
      radius: 120,
      order: order++,
      room: i,
      title: "Mission complete",
      subtitle: "Thanks for exploring",
      lines: ["The regular site opens in a new tab, so you can come back and keep driving."],
      href: "/",
      actionLabel: "Open the main site",
      color: KIND_COLOR.nav,
    })
  }

  return {
    width: WORLD_W,
    height,
    rooms,
    segments,
    beacons,
    crates,
    spawn,
    decor,
    alwaysDecor,
    floors: ROOM_SPECS.map((s) => s.floor),
  }
}
