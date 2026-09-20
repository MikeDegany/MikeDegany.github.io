import { addSample, EMPTY_GRAPH, type Graph, type PoseGraphParams } from "@/lib/pose-graph"
import { createDrive, type DriveModel, type DriveState } from "./drive"
import { clamp, damp, raySegment, resolveCircleSegment, wrapAngle } from "./geometry"
import { Mapper, MAP_SCALE, CELL } from "./mapper"
import { decorBounds, drawDecor, type Box } from "./decor"
import { applyObstacleAssist } from "./assist"
import { PathFollower, Planner } from "./planner"
import { drawCar, drawCompass, drawGoal, drawJackal, drawLabelPill } from "./render"
import type { Beacon, DriveInput, GameSnapshot, Pose, RobotKind, Segment, Vec2, World } from "./types"
import { buildWorld, PALETTE } from "./world"

const LIDAR_RAYS = 72
const LIDAR_RANGE = 300
const LIDAR_HZ = 30
const PHYSICS_DT = 1 / 120
const IDLE_BEFORE_DEMO = 18
const IDLE_BEFORE_FIRST_DEMO = 10
const DEMO_DWELL = 7
const MIN_SCALE = 0.55
const MAX_SCALE = 1.3

const GRAPH_PARAMS: PoseGraphParams = {
  minStep: 42,
  loopRadius: 95,
  loopSkip: 6,
  maxLoopsPerNode: 2,
  maxNodes: 400,
}

type AutopilotMode = "off" | "demo" | "goal"

export interface GameCallbacks {
  onSnapshot: (s: GameSnapshot) => void
  onEnter: (b: Beacon) => void
}

export class Game {
  readonly world: World
  readonly mapper: Mapper
  readonly planner: Planner
  readonly follower: PathFollower

  drive: DriveModel
  readonly pose: Pose
  readonly state: DriveState = { v: 0, omega: 0, delta: 0 }

  // Input (written by the React shell)
  readonly keys = new Set<string>()
  joy = { x: 0, y: 0, active: false }

  private graph: Graph = EMPTY_GRAPH
  private readonly rayHits = new Float32Array(LIDAR_RAYS * 2)
  private readonly rayHitFlag = new Uint8Array(LIDAR_RAYS)
  private lastScan = -1
  private scanSpin = 0

  private readonly segsByRoom: Segment[][]
  private readonly boundary: Segment[]
  private readonly candidates: Segment[][]
  private stuckSince = -1
  private replans = 0

  // Decor overlay: bounds + reveal time per item, lazily loaded images
  private readonly decorBoxes: Box[]
  private readonly decorRevealAt: Float64Array
  private readonly images = new Map<string, HTMLImageElement | null>()

  readonly skillsFound = new Set<number>()
  private readonly skillFoundAt = new Map<number, number>()
  private readonly beaconsVisited = new Set<string>()
  private readonly beaconsDiscovered = new Set<string>()
  private readonly roomsVisited = new Set<number>()
  private activeBeacon: Beacon | null = null

  private autopilot: AutopilotMode = "off"
  private demoTarget: Beacon | null = null
  private dwellUntil = 0
  private demoSkip = new Set<string>()
  private goal: Vec2 | null = null
  private goalSetAt = 0
  private lastUserInputAt = 0
  private hasMoved = false

  private time = 0
  private wheelSpin = 0
  private readonly cam = { x: 500, y: 470, scale: 1 }
  private view = { w: 1, h: 1, dpr: 1 }
  private reducedMotion = false
  private lastSnapshot: GameSnapshot | null = null
  private readonly input: DriveInput = { throttle: 0, steer: 0 }

  private raf = 0
  private lastFrame = 0
  private accumulator = 0
  private running = false

  constructor(private readonly canvas: HTMLCanvasElement, private readonly cb: GameCallbacks, robot: RobotKind = "jackal") {
    this.world = buildWorld()
    this.mapper = new Mapper(this.world, this.world.floors)
    this.decorBoxes = this.world.decor.map(decorBounds)
    this.decorRevealAt = new Float64Array(this.world.decor.length).fill(-1)
    this.drive = createDrive(robot)
    this.planner = new Planner(this.world, this.drive.radius + 22)
    this.follower = new PathFollower(() => this.drive)
    this.pose = { ...this.world.spawn }
    this.cam.x = this.pose.x
    this.cam.y = this.pose.y

    this.segsByRoom = this.world.rooms.map(() => [])
    this.boundary = []
    for (const s of this.world.segments) {
      if (s.room < 0) this.boundary.push(s)
      else this.segsByRoom[s.room].push(s)
    }
    // Per-room candidate lists (boundary + this room ± 1), built once so the hot loops never allocate.
    this.candidates = this.world.rooms.map((_, i) => {
      const list = [...this.boundary]
      for (let r = Math.max(0, i - 1); r <= Math.min(this.segsByRoom.length - 1, i + 1); r++) list.push(...this.segsByRoom[r])
      return list
    })
    this.reducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  }

  // ─── lifecycle ──────────────────────────────────────────────────────────────

  start() {
    if (this.running) return
    this.running = true
    this.lastFrame = performance.now()
    const frame = (now: number) => {
      if (!this.running) return
      const dt = Math.min(0.1, (now - this.lastFrame) / 1000)
      this.lastFrame = now
      this.accumulator += dt
      let steps = 0
      while (this.accumulator >= PHYSICS_DT && steps < 12) {
        this.update(PHYSICS_DT)
        this.accumulator -= PHYSICS_DT
        steps++
      }
      this.render()
      this.raf = requestAnimationFrame(frame)
    }
    this.raf = requestAnimationFrame(frame)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  /** Called when the tab regains visibility so a long pause doesn't produce a giant dt. */
  resume() {
    this.lastFrame = performance.now()
    this.accumulator = 0
  }

  resize(w: number, h: number, dpr: number) {
    this.view = { w, h, dpr: Math.min(2, dpr) }
    this.canvas.width = Math.round(w * this.view.dpr)
    this.canvas.height = Math.round(h * this.view.dpr)
    this.cam.scale = clamp(w / this.world.width, MIN_SCALE, MAX_SCALE)
  }

  // ─── external API ───────────────────────────────────────────────────────────

  switchRobot(kind: RobotKind) {
    if (this.drive.kind === kind) return
    this.drive = createDrive(kind)
    this.state.v = 0
    this.state.omega = 0
    this.state.delta = 0
    this.emitSnapshot()
  }

  get robotKind() {
    return this.drive.kind
  }

  /** Interact with the active beacon (Enter / on-screen button). */
  interact(): boolean {
    if (!this.activeBeacon || !this.activeBeacon.href) return false
    this.noteUserInput()
    this.cb.onEnter(this.activeBeacon)
    return true
  }

  screenToWorld(sx: number, sy: number): Vec2 {
    const { w, h } = this.view
    return {
      x: (sx - w / 2) / this.cam.scale + this.cam.x,
      y: (sy - h / 2) / this.cam.scale + this.cam.y,
    }
  }

  /** Click / tap to set a navigation goal. Returns false if unreachable. */
  setGoalScreen(sx: number, sy: number): boolean {
    const p = this.screenToWorld(sx, sy)
    if (p.x < 0 || p.y < 0 || p.x > this.world.width || p.y > this.world.height) return false
    this.noteUserInput()
    const path = this.planner.plan(this.pose, p)
    if (!path) return false
    this.goal = path[path.length - 1]
    this.goalSetAt = this.time
    this.follower.setPath(path)
    this.replans = 0
    this.autopilot = "goal"
    this.demoTarget = null
    this.emitSnapshot()
    return true
  }

  noteUserInput() {
    this.lastUserInputAt = this.time
  }

  // ─── simulation ─────────────────────────────────────────────────────────────

  private readUserInput(out: DriveInput): boolean {
    let th = 0
    let st = 0
    const k = this.keys
    if (k.has("ArrowUp") || k.has("KeyW")) th += 1
    if (k.has("ArrowDown") || k.has("KeyS")) th -= 1
    if (k.has("ArrowLeft") || k.has("KeyA")) st -= 1
    if (k.has("ArrowRight") || k.has("KeyD")) st += 1
    if (this.joy.active) {
      if (this.drive.turnsInPlace) {
        // Point-and-go: steer toward the screen direction the stick is pushed, not the robot's own heading.
        const mag = clamp(Math.hypot(this.joy.x, this.joy.y), 0, 1)
        if (mag > 0) {
          const alpha = wrapAngle(Math.atan2(this.joy.y, this.joy.x) - this.pose.theta)
          const absA = Math.abs(alpha)
          st = clamp(alpha * 2.4, -1, 1)
          th = absA > 1.25 ? 0 : clamp((1 - absA * 0.9) * mag, 0, 1)
        }
      } else {
        // Car: joystick stays relative to the robot's own heading, like a steering wheel + pedal.
        th += -this.joy.y
        st += this.joy.x
      }
    }
    // Reversing with the stick/keys steers like a car: swap so "left" still moves the nose left.
    out.throttle = clamp(th, -1, 1)
    out.steer = clamp(st, -1, 1)
    return th !== 0 || st !== 0
  }

  private update(dt: number) {
    this.time += dt
    const input = this.input

    const userActive = this.readUserInput(input)
    if (userActive) {
      this.lastUserInputAt = this.time
      this.hasMoved = true
      if (this.follower.active || this.autopilot !== "off") {
        this.follower.clear()
        this.autopilot = "off"
        this.demoTarget = null
        this.goal = null
      }
    } else if (this.follower.active) {
      this.follower.update(this.pose, this.state, input)
      this.watchForStuck()
      if (!this.follower.active) {
        // Arrived
        if (this.autopilot === "goal") {
          this.autopilot = "off"
          this.goal = null
        } else if (this.autopilot === "demo") {
          this.dwellUntil = this.time + DEMO_DWELL
        }
      }
    } else {
      input.throttle = 0
      input.steer = 0
    }

    // Reactive assist: firm for the diff-drive, light for a human driving the car, and off for the
    // car's autopilot — its pure-pursuit controller commits to arcs and destabilises if a wall
    // keeps re-steering or braking it mid-turn (it has its own corner braking instead).
    if (this.drive.turnsInPlace || !this.follower.active) {
      applyObstacleAssist(input, this.pose, this.rayHits, this.rayHitFlag, LIDAR_RAYS, this.drive.radius, this.drive.turnsInPlace ? (this.follower.active ? 0.9 : 0.45) : 0.2)
    }
    const prevX = this.pose.x
    const prevY = this.pose.y
    this.drive.step(this.pose, this.state, input, dt)
    this.collide()
    this.pose.theta = wrapAngle(this.pose.theta)
    this.wheelSpin += Math.hypot(this.pose.x - prevX, this.pose.y - prevY) * 0.5

    this.graph = addSample(this.graph, this.pose.x, this.pose.y, GRAPH_PARAMS)

    if (this.time - this.lastScan >= 1 / LIDAR_HZ) {
      this.lastScan = this.time
      this.scan()
    }

    this.updateRoomsAndBeacons()
    this.updateAutopilot()
    this.updateCamera(dt)
    this.emitSnapshot()
  }

  /** If the follower isn't making progress (wedged on a corner), replan once or twice, then give up. */
  private watchForStuck() {
    const moving = Math.abs(this.state.v) > 12
    if (moving) {
      this.stuckSince = -1
      return
    }
    if (this.stuckSince < 0) {
      this.stuckSince = this.time
      return
    }
    if (this.time - this.stuckSince < 1.4) return
    this.stuckSince = -1
    const goal = this.follower.goal
    if (goal && this.replans < 2) {
      this.replans++
      const path = this.planner.plan(this.pose, goal)
      if (path) {
        this.follower.setPath(path)
        return
      }
    }
    this.replans = 0
    this.follower.clear()
    if (this.autopilot === "demo") {
      if (this.demoTarget) this.demoSkip.add(this.demoTarget.id)
      this.dwellUntil = this.time
    } else {
      this.autopilot = "off"
      this.goal = null
    }
  }

  private roomIndexAt(y: number): number {
    const rooms = this.world.rooms
    for (let i = 0; i < rooms.length; i++) if (y < rooms[i].y1) return i
    return rooms.length - 1
  }

  private nearbySegments(room: number): Segment[] {
    return this.candidates[room]
  }

  private collide() {
    const r = this.drive.radius
    const segs = this.nearbySegments(this.roomIndexAt(this.pose.y))
    // Two passes so corners resolve cleanly
    for (let pass = 0; pass < 2; pass++) {
      let any = false
      for (let i = 0; i < segs.length; i++) {
        if (resolveCircleSegment(this.pose, r, segs[i])) any = true
      }
      if (!any) break
    }
    // Bleed speed when pushing into a wall so the robot doesn't "vibrate"
    this.pose.x = clamp(this.pose.x, r, this.world.width - r)
    this.pose.y = clamp(this.pose.y, r, this.world.height - r)
  }

  private scan() {
    const { x, y } = this.pose
    const segs = this.nearbySegments(this.roomIndexAt(y))
    // Ray angles are fixed in the world frame so hit points stay put between scans.
    for (let k = 0; k < LIDAR_RAYS; k++) {
      const a = this.scanSpin + (k / LIDAR_RAYS) * Math.PI * 2
      const dx = Math.cos(a)
      const dy = Math.sin(a)
      let best = LIDAR_RANGE
      let hitSeg: Segment | null = null
      for (let i = 0; i < segs.length; i++) {
        const t = raySegment(x, y, dx, dy, segs[i], best)
        if (t >= 0) {
          best = t
          hitSeg = segs[i]
        }
      }
      const hx = x + dx * best
      const hy = y + dy * best
      this.rayHits[k * 2] = hx
      this.rayHits[k * 2 + 1] = hy
      this.rayHitFlag[k] = hitSeg ? 1 : 0
      this.mapper.markRay(x, y, hx, hy, hitSeg !== null)
      if (hitSeg && hitSeg.crate >= 0) {
        const crate = this.world.crates[hitSeg.crate]
        if (!this.skillsFound.has(crate.skillId)) {
          this.skillsFound.add(crate.skillId)
          this.skillFoundAt.set(crate.skillId, this.time)
        }
      }
    }
    this.mapper.flush()
  }

  private updateRoomsAndBeacons() {
    const room = this.roomIndexAt(this.pose.y)
    this.roomsVisited.add(room)

    let nearest: Beacon | null = null
    let nearestD = Infinity
    for (const b of this.world.beacons) {
      if (Math.abs(b.room - room) > 1) continue
      const d = Math.hypot(b.x - this.pose.x, b.y - this.pose.y)
      if (!this.beaconsDiscovered.has(b.id) && (d < LIDAR_RANGE * 0.9 || this.mapper.isKnownAt(b.x, b.y))) {
        this.beaconsDiscovered.add(b.id)
      }
      const enter = this.activeBeacon?.id === b.id ? b.radius + 18 : b.radius
      if (d < enter && d < nearestD) {
        nearest = b
        nearestD = d
      }
    }
    if (nearest !== this.activeBeacon) {
      this.activeBeacon = nearest
      if (nearest) this.beaconsVisited.add(nearest.id)
    }
  }

  /** Nearest unvisited beacon to the robot (ties broken by mission order). */
  private nearestUnvisited(skip?: Set<string>): Beacon | null {
    let best: Beacon | null = null
    let bestD = Infinity
    for (const b of this.world.beacons) {
      if (this.beaconsVisited.has(b.id) || skip?.has(b.id)) continue
      const d = Math.hypot(b.x - this.pose.x, b.y - this.pose.y) + b.order * 0.01
      if (d < bestD) {
        bestD = d
        best = b
      }
    }
    return best
  }

  private nextDemoBeacon(): Beacon | null {
    return this.nearestUnvisited(this.demoSkip)
  }

  /** The beacon the compass points at: the nearest unvisited one, same rule as the autopilot. */
  private objective(): Beacon | null {
    return this.nearestUnvisited()
  }

  private updateAutopilot() {
    const idle = this.time - this.lastUserInputAt
    const threshold = this.hasMoved ? IDLE_BEFORE_DEMO : IDLE_BEFORE_FIRST_DEMO

    if (this.autopilot === "off") {
      if (!this.follower.active && idle > threshold) {
        this.startDemoLeg()
      }
      return
    }

    if (this.autopilot === "demo" && !this.follower.active && this.time >= this.dwellUntil) {
      this.startDemoLeg()
    }
  }

  private startDemoLeg() {
    const target = this.nextDemoBeacon()
    if (!target) {
      this.autopilot = "off"
      this.demoTarget = null
      // Everything visited: sit still rather than loop forever.
      this.lastUserInputAt = this.time
      return
    }
    const path = this.planner.plan(this.pose, target)
    if (!path) {
      this.demoSkip.add(target.id)
      return
    }
    this.follower.setPath(path, Math.min(target.radius * 0.8, 60))
    this.replans = 0
    this.autopilot = "demo"
    this.demoTarget = target
    this.goal = null
    this.dwellUntil = Infinity
  }

  private updateCamera(dt: number) {
    const { w, h } = this.view
    const s = this.cam.scale
    const ahead = 40
    const tx = this.pose.x + Math.cos(this.pose.theta) * ahead
    const ty = this.pose.y + Math.sin(this.pose.theta) * ahead
    const k = damp(6, dt)
    this.cam.x += (tx - this.cam.x) * k
    this.cam.y += (ty - this.cam.y) * k
    // Clamp so we never look past the world edge (or centre when the world is narrower)
    const halfW = w / 2 / s
    const halfH = h / 2 / s
    if (halfW * 2 >= this.world.width) this.cam.x = this.world.width / 2
    else this.cam.x = clamp(this.cam.x, halfW, this.world.width - halfW)
    this.cam.y = clamp(this.cam.y, halfH, this.world.height - halfH)
  }

  private emitSnapshot() {
    const s: GameSnapshot = {
      activeBeaconId: this.activeBeacon?.id ?? null,
      roomsVisited: this.roomsVisited.size,
      roomCount: this.world.rooms.length,
      skillsFound: this.lastSnapshot && this.lastSnapshot.skillsFound.length === this.skillsFound.size ? this.lastSnapshot.skillsFound : [...this.skillsFound],
      skillCount: this.world.crates.length,
      autopilot: this.autopilot === "demo",
      robot: this.drive.kind,
      hasMoved: this.hasMoved,
      navigating: this.follower.active,
    }
    const p = this.lastSnapshot
    if (
      p &&
      p.activeBeaconId === s.activeBeaconId &&
      p.roomsVisited === s.roomsVisited &&
      p.skillsFound === s.skillsFound &&
      p.autopilot === s.autopilot &&
      p.robot === s.robot &&
      p.hasMoved === s.hasMoved &&
      p.navigating === s.navigating
    ) {
      return
    }
    this.lastSnapshot = s
    this.cb.onSnapshot(s)
  }

  // ─── rendering ──────────────────────────────────────────────────────────────

  private render() {
    const ctx = this.canvas.getContext("2d")
    if (!ctx) return
    const { w, h, dpr } = this.view
    const s = this.cam.scale
    const t = this.time

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = PALETTE.bg
    ctx.fillRect(0, 0, w, h)

    // World transform
    const ox = w / 2 - this.cam.x * s
    const oy = h / 2 - this.cam.y * s
    ctx.setTransform(dpr * s, 0, 0, dpr * s, ox * dpr, oy * dpr)

    // Visible world rect
    const vx0 = this.cam.x - w / 2 / s
    const vy0 = this.cam.y - h / 2 / s
    const vx1 = this.cam.x + w / 2 / s
    const vy1 = this.cam.y + h / 2 / s

    // Discovered map layer (blit only the visible region)
    const ms = MAP_SCALE
    const sx = Math.max(0, vx0) * ms
    const sy = Math.max(0, vy0) * ms
    const sw = (Math.min(this.world.width, vx1) - Math.max(0, vx0)) * ms
    const sh = (Math.min(this.world.height, vy1) - Math.max(0, vy0)) * ms
    if (sw > 0 && sh > 0) {
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(this.mapper.layer, sx, sy, sw, sh, Math.max(0, vx0), Math.max(0, vy0), sw / ms, sh / ms)
    }

    // Pose graph sits underneath panels and obstacles (it's on the floor)
    this.drawGraph(ctx, vy0, vy1)

    // Revealed decor (crisp vector overlay, fades in as it's scanned)
    this.drawDecorOverlay(ctx, vx0, vy0, vx1, vy1)

    // Lidar: sweep + hit points
    this.drawLidar(ctx)

    // Goal + path
    if (this.follower.active && this.follower.path.length) {
      ctx.beginPath()
      ctx.moveTo(this.pose.x, this.pose.y)
      for (const p of this.follower.path) ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = this.autopilot === "demo" ? PALETTE.demoPath : PALETTE.path
      ctx.lineWidth = 2
      ctx.setLineDash([10, 10])
      ctx.stroke()
      ctx.setLineDash([])
    }
    if (this.goal) drawGoal(ctx, this.goal.x, this.goal.y, t - this.goalSetAt, this.reducedMotion)

    // Fiducial detection box on the active education station
    const ab = this.activeBeacon
    if (ab?.marker) {
      const m = ab.marker
      const pad = 10 + (this.reducedMotion ? 0 : Math.sin(t * 4) * 2)
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 2.5
      ctx.strokeRect(m.x - m.size / 2 - pad, m.y - m.size / 2 - pad, m.size + pad * 2, m.size + pad * 2)
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
        ctx.beginPath()
        ctx.arc(m.x + (sx * m.size) / 2, m.y + (sy * m.size) / 2, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#22c55e"
        ctx.fill()
      }
      drawLabelPill(ctx, `tag ${m.id} detected`, m.x, m.y - m.size / 2 - pad - 20, "#22c55e", 1)
    }

    // Robot
    ctx.save()
    ctx.translate(this.pose.x, this.pose.y)
    ctx.rotate(this.pose.theta)
    if (this.drive.kind === "car") drawCar(ctx, this.state.delta, this.wheelSpin)
    else drawJackal(ctx, this.wheelSpin)
    ctx.restore()

    // Screen-space overlays
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.drawCompassIfNeeded(ctx, vx0, vy0, vx1, vy1)
  }

  private ensureImage(src: string) {
    if (this.images.has(src)) return
    this.images.set(src, null)
    const img = new Image()
    img.decoding = "async"
    img.onload = () => this.images.set(src, img)
    img.src = src
  }

  /** An item is revealed once any point around its bbox (pushed one cell out) is a known cell. */
  private isRevealed(k: number): boolean {
    if (this.decorRevealAt[k] >= 0) return true
    const b = this.decorBoxes[k]
    const m = CELL + 2
    const mx = (b.x0 + b.x1) / 2
    const my = (b.y0 + b.y1) / 2
    // Floor markings reveal when their centre has been scanned; obstacles (whose interior is
    // never scanned) need three perimeter samples so a single grazing ray doesn't expose them.
    let known = this.mapper.isKnownAt(mx, my)
    if (!known) {
      let n = 0
      if (this.mapper.isKnownAt(b.x0 - m, b.y0 - m)) n++
      if (this.mapper.isKnownAt(b.x1 + m, b.y0 - m)) n++
      if (this.mapper.isKnownAt(b.x0 - m, b.y1 + m)) n++
      if (this.mapper.isKnownAt(b.x1 + m, b.y1 + m)) n++
      if (this.mapper.isKnownAt(mx, b.y0 - m)) n++
      if (this.mapper.isKnownAt(mx, b.y1 + m)) n++
      if (this.mapper.isKnownAt(b.x0 - m, my)) n++
      if (this.mapper.isKnownAt(b.x1 + m, my)) n++
      known = n >= 3
    }
    if (known) this.decorRevealAt[k] = this.time
    return known
  }

  private drawDecorOverlay(ctx: CanvasRenderingContext2D, vx0: number, vy0: number, vx1: number, vy1: number) {
    for (const d of this.world.alwaysDecor) {
      const b = decorBounds(d)
      if (b.y1 < vy0 || b.y0 > vy1) continue
      drawDecor(ctx, d, this.time, this.images, this.reducedMotion)
    }
    const decor = this.world.decor
    for (let k = 0; k < decor.length; k++) {
      const b = this.decorBoxes[k]
      if (b.y1 < vy0 || b.y0 > vy1 || b.x1 < vx0 || b.x0 > vx1) continue
      const d = decor[k]
      if (d.kind === "image") this.ensureImage(d.src)
      if (!this.isRevealed(k)) {
        // Unscanned skill names preview faintly in their own color so there's something to be
        // curious about; the crate itself stays hidden until scanned, like everything else undiscovered.
        if (d.kind === "text" && d.ghost) {
          ctx.globalAlpha = 0.45
          drawDecor(ctx, d.ghostColor ? { ...d, color: d.ghostColor } : d, this.time, this.images, this.reducedMotion)
        }
        continue
      }
      const age = this.time - this.decorRevealAt[k]
      const alpha = this.reducedMotion ? 1 : clamp(age / 0.4, 0, 1)
      ctx.globalAlpha = alpha
      drawDecor(ctx, d, this.time, this.images, this.reducedMotion)
    }
    ctx.globalAlpha = 1
  }

  /** The scan itself: just the return points where rays hit something. */
  private drawLidar(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(0,0,0,0.6)"
    for (let k = 0; k < LIDAR_RAYS; k++) {
      if (!this.rayHitFlag[k]) continue
      ctx.fillRect(this.rayHits[k * 2] - 3.5, this.rayHits[k * 2 + 1] - 3.5, 7, 7)
    }
    ctx.fillStyle = PALETTE.lidarHit
    for (let k = 0; k < LIDAR_RAYS; k++) {
      if (!this.rayHitFlag[k]) continue
      ctx.fillRect(this.rayHits[k * 2] - 2.5, this.rayHits[k * 2 + 1] - 2.5, 5, 5)
    }
  }

  private drawGraph(ctx: CanvasRenderingContext2D, vy0: number, vy1: number) {
    const { nodes, edges } = this.graph
    if (nodes.length < 2) return
    const idx = new Map<number, number>()
    for (let i = 0; i < nodes.length; i++) idx.set(nodes[i].id, i)

    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (const e of edges) {
      if (e.loop) continue
      const a = nodes[idx.get(e.a)!]
      const b = nodes[idx.get(e.b)!]
      if (!a || !b || (a.y < vy0 && b.y < vy0) || (a.y > vy1 && b.y > vy1)) continue
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
    }
    ctx.strokeStyle = PALETTE.odom
    ctx.stroke()

    ctx.beginPath()
    for (const e of edges) {
      if (!e.loop) continue
      const a = nodes[idx.get(e.a)!]
      const b = nodes[idx.get(e.b)!]
      if (!a || !b || (a.y < vy0 && b.y < vy0) || (a.y > vy1 && b.y > vy1)) continue
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
    }
    ctx.strokeStyle = PALETTE.loop
    ctx.lineWidth = 1.6
    ctx.stroke()

    ctx.fillStyle = "rgba(191,219,254,0.85)"
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i]
      if (n.y < vy0 || n.y > vy1) continue
      ctx.fillRect(n.x - 2, n.y - 2, 4, 4)
    }
    const last = nodes[nodes.length - 1]
    ctx.beginPath()
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = PALETTE.accent
    ctx.fill()
  }

  private drawCompassIfNeeded(ctx: CanvasRenderingContext2D, vx0: number, vy0: number, vx1: number, vy1: number) {
    const target = this.autopilot === "demo" ? this.demoTarget : this.objective()
    if (!target) return
    const inView = target.x > vx0 + 40 && target.x < vx1 - 40 && target.y > vy0 + 40 && target.y < vy1 - 40
    if (inView) return
    const dx = target.x - this.cam.x
    const dy = target.y - this.cam.y
    const len = Math.hypot(dx, dy) || 1
    const label = target.kind === "project" ? "next project" : target.kind === "nav" ? "exit" : target.kind
    drawCompass(ctx, this.view.w, this.view.h, dx / len, dy / len, target.color, label)
  }
}
