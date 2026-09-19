import type { DriveInput, Pose, RobotKind } from "./types"
import { clamp } from "./geometry"

export interface DriveState {
  /** Forward speed, world units / s. */
  v: number
  /** Yaw rate, rad / s (diff drive) — derived for the car. */
  omega: number
  /** Steering angle, rad (car only). */
  delta: number
}

export interface DriveModel {
  readonly kind: RobotKind
  /** Body radius for collision, world units. */
  readonly radius: number
  readonly maxSpeed: number
  /** Whether the model can rotate without moving. */
  readonly turnsInPlace: boolean
  /** Advance the pose in place. */
  step(pose: Pose, state: DriveState, input: DriveInput, dt: number): void
}

const ACCEL = 1800
const DECEL = 2400

function approach(current: number, target: number, rate: number, dt: number): number {
  const d = target - current
  const step = rate * dt
  return Math.abs(d) <= step ? target : current + Math.sign(d) * step
}

/** ClearPath Jackal: differential drive — turns in place, steer = yaw. */
export class DiffDrive implements DriveModel {
  readonly kind: RobotKind = "jackal"
  readonly radius = 22
  readonly maxSpeed = 440
  readonly turnsInPlace = true
  private readonly maxOmega = 2.2

  step(pose: Pose, s: DriveState, input: DriveInput, dt: number): void {
    const targetV = clamp(input.throttle, -1, 1) * this.maxSpeed * (input.throttle < 0 ? 0.6 : 1)
    const accelerating = Math.abs(targetV) > Math.abs(s.v)
    s.v = approach(s.v, targetV, accelerating ? ACCEL : DECEL, dt)
    // Yaw responds quickly so arrow taps feel crisp.
    s.omega = approach(s.omega, clamp(input.steer, -1, 1) * this.maxOmega, 14, dt)
    s.delta = 0

    pose.theta += s.omega * dt
    pose.x += Math.cos(pose.theta) * s.v * dt
    pose.y += Math.sin(pose.theta) * s.v * dt
  }
}

/** Ackermann car: only turns while moving; steer = front wheel angle. */
export class AckermannDrive implements DriveModel {
  readonly kind: RobotKind = "car"
  readonly radius = 24
  readonly maxSpeed = 380
  readonly turnsInPlace = false
  readonly wheelbase = 40
  readonly maxDelta = 0.5
  /** Tightest circle the car can drive (at low speed), world units. */
  readonly minTurnRadius = this.wheelbase / Math.tan(this.maxDelta)

  /**
   * Speed-sensitive steering: full lock when crawling (tight turns, docking), a fraction of it at
   * top speed so the yaw rate stays gentle — like power steering that firms up with speed.
   */
  deltaLimitAt(v: number): number {
    // Full lock up to ~35 % of top speed, then taper to 40 % of it at full speed.
    const f = clamp((Math.abs(v) / this.maxSpeed - 0.35) / 0.65, 0, 1)
    return this.maxDelta * (1 - 0.6 * f)
  }

  step(pose: Pose, s: DriveState, input: DriveInput, dt: number): void {
    const targetV = clamp(input.throttle, -1, 1) * this.maxSpeed * (input.throttle < 0 ? 0.55 : 1)
    const accelerating = Math.abs(targetV) > Math.abs(s.v)
    s.v = approach(s.v, targetV, accelerating ? ACCEL : DECEL, dt)
    s.delta = approach(s.delta, clamp(input.steer, -1, 1) * this.maxDelta, 2.6, dt)
    const lim = this.deltaLimitAt(s.v)
    s.delta = clamp(s.delta, -lim, lim)

    s.omega = (s.v / this.wheelbase) * Math.tan(s.delta)
    pose.theta += s.omega * dt
    pose.x += Math.cos(pose.theta) * s.v * dt
    pose.y += Math.sin(pose.theta) * s.v * dt
  }
}

export function createDrive(kind: RobotKind): DriveModel {
  return kind === "car" ? new AckermannDrive() : new DiffDrive()
}
