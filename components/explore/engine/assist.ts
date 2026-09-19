import { clamp, wrapAngle } from "./geometry"
import type { DriveInput, Pose } from "./types"

/**
 * Reactive obstacle assist driven by the last lidar scan (no extra work per frame):
 *  - eases the throttle off when something is close in the direction of travel, and
 *  - nudges the steering away from the nearer side wall.
 * `gain` scales the steering nudge (lighter for a human driver, firmer for the autopilot).
 */
export function applyObstacleAssist(
  input: DriveInput,
  pose: Pose,
  hits: Float32Array,
  hitFlag: Uint8Array,
  rays: number,
  radius: number,
  gain: number
) {
  if (input.throttle === 0) return
  const dir = input.throttle > 0 ? pose.theta : pose.theta + Math.PI
  const { x, y } = pose
  let ahead = Infinity
  let left = Infinity
  let right = Infinity
  for (let k = 0; k < rays; k++) {
    if (!hitFlag[k]) continue
    const hx = hits[k * 2] - x
    const hy = hits[k * 2 + 1] - y
    const d = Math.hypot(hx, hy)
    const rel = wrapAngle(Math.atan2(hy, hx) - dir)
    const a = Math.abs(rel)
    if (a < 0.55 && d < ahead) ahead = d
    if (a < 1.25) {
      if (rel > 0 && d < right) right = d
      if (rel < 0 && d < left) left = d
    }
  }
  const brakeZone = radius + 46
  if (ahead < brakeZone) input.throttle *= clamp((ahead - radius - 4) / (brakeZone - radius), 0.2, 1)

  const sideZone = radius + 34
  const pushL = left < sideZone ? 1 - (left - radius) / (sideZone - radius) : 0
  const pushR = right < sideZone ? 1 - (right - radius) / (sideZone - radius) : 0
  if (pushL || pushR) {
    // Positive steer = turn right. A wall on the left pushes right, and vice versa.
    // When reversing the geometry flips, so the sign flips with the throttle.
    const s = (pushL - pushR) * gain * Math.sign(input.throttle)
    input.steer = clamp(input.steer + s, -1, 1)
  }
}
