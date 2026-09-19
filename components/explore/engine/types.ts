export type Vec2 = { x: number; y: number }
export type Pose = { x: number; y: number; theta: number }

/** Single input contract shared by keyboard, joystick and the autopilot. */
export type DriveInput = { throttle: number; steer: number }

export type RobotKind = "jackal" | "car"

/** Wall segment. `crate` is the index into World.crates when the segment belongs to a skill crate, else -1. */
export type Segment = { ax: number; ay: number; bx: number; by: number; room: number; crate: number }

export type BeaconKind = "about" | "project" | "skills" | "education" | "interest" | "contact" | "nav"

export interface Beacon {
  id: string
  kind: BeaconKind
  x: number
  y: number
  radius: number
  /** Autopilot visiting order. */
  order: number
  room: number
  title: string
  subtitle?: string
  lines?: string[]
  image?: string
  href?: string
  external?: boolean
  actionLabel?: string
  color: string
  /** Fiducial marker this beacon "detects" when docked (education stations). */
  marker?: { x: number; y: number; size: number; id: number }
}

export interface Crate {
  skillId: number
  name: string
  color: string
  x: number
  y: number
  w: number
  h: number
}

export interface Room {
  index: number
  name: string
  y0: number
  y1: number
}

export type IconName = "arm" | "car" | "chip" | "tower"

export type DecorItem =
  | { kind: "text"; text: string; x: number; y: number; size: number; color: string; weight?: number; align?: CanvasTextAlign; letterSpacing?: number; maxWidth?: number; maxLines?: number; angle?: number; ghost?: boolean; ghostColor?: string }
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string; stroke?: string; radius?: number; glow?: boolean; angle?: number; ghost?: boolean }
  | { kind: "circle"; x: number; y: number; r: number; fill: string; stroke?: string }
  | { kind: "image"; src: string; x: number; y: number; w: number; h: number; radius?: number }
  | { kind: "path"; points: Vec2[]; stroke: string; width: number; dash?: number[]; cap?: CanvasLineCap }
  | { kind: "chevrons"; x: number; y: number; angle: number; count: number; gap: number; size: number; color: string }
  | { kind: "hazard"; x: number; y: number; w: number; h: number }
  | { kind: "spotlight"; x: number; y: number; r: number; color: string }
  | { kind: "rack"; x: number; y: number; w: number; h: number }
  | { kind: "desk"; x: number; y: number; w: number; h: number; facing: 1 | -1 }
  | { kind: "pad"; x: number; y: number; r: number; color: string; pulse?: boolean }
  | { kind: "icon"; name: IconName; x: number; y: number; size: number; color: string }
  | { kind: "fiducial"; x: number; y: number; size: number; id: number }
  | { kind: "tick"; x: number; y: number; label: string; color: string }
  | { kind: "bbox"; x: number; y: number; w: number; h: number; label: string; color: string; conf?: number }
  | { kind: "svgicon"; path: string; x: number; y: number; size: number; color: string; bg: string }

export interface World {
  width: number
  height: number
  rooms: Room[]
  segments: Segment[]
  beacons: Beacon[]
  crates: Crate[]
  spawn: Pose
  decor: DecorItem[]
  /** Decor drawn every frame regardless of what has been scanned (doorway guidance). */
  alwaysDecor: DecorItem[]
  /** Floor tint per room index (top → bottom). */
  floors: string[]
}

export interface GameSnapshot {
  activeBeaconId: string | null
  roomsVisited: number
  roomCount: number
  skillsFound: number[]
  skillCount: number
  autopilot: boolean
  robot: RobotKind
  hasMoved: boolean
  navigating: boolean
}
