"use client"

import Link from "next/link"
import Image from "next/image"
import { Bot, Car, CircleHelp, X } from "lucide-react"
import type { GameSnapshot, RobotKind } from "./engine/types"

export function Hud({
  snap,
  onRobot,
  onHelp,
}: {
  snap: GameSnapshot | null
  onRobot: (k: RobotKind) => void
  onHelp: () => void
}) {
  const robot = snap?.robot ?? "jackal"
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-slate-950/70 pl-1 pr-3 py-1 ring-1 ring-white/10 backdrop-blur">
        <Link href="/" className="flex items-center gap-2" title="Back to the main site">
          <Image src="/logo.png" alt="Mike Degany" width={30} height={30} className="rounded-full" />
          <span className="hidden sm:inline text-xs font-semibold tracking-widest text-slate-200">EXPLORE MODE</span>
        </Link>
      </div>

      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-300 ring-1 ring-white/10 backdrop-blur">
        <span className="tabular-nums">
          <span className="text-amber-300">{snap?.roomsVisited ?? 0}</span>/{snap?.roomCount ?? 6} sections
        </span>
        <span className="text-slate-600">·</span>
        <span className="tabular-nums">
          <span className="text-violet-300">{snap?.skillsFound.length ?? 0}</span>/{snap?.skillCount ?? 13} skills
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-slate-950/70 p-1 ring-1 ring-white/10 backdrop-blur">
        <button
          type="button"
          onClick={() => onRobot("jackal")}
          title="Jackal — differential drive (1)"
          aria-pressed={robot === "jackal"}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${robot === "jackal" ? "bg-amber-400 text-slate-900" : "text-slate-300 hover:bg-white/10"}`}
        >
          <Bot className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onRobot("car")}
          title="Car — Ackermann steering (2)"
          aria-pressed={robot === "car"}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${robot === "car" ? "bg-slate-200 text-slate-900" : "text-slate-300 hover:bg-white/10"}`}
        >
          <Car className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onHelp}
          title="Help (H)"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function HelpOverlay({ isTouch, onClose }: { isTouch: boolean; onClose: () => void }) {
  const rows: [string, string][] = isTouch
    ? [
        ["Joystick", "Drive the robot"],
        ["Tap the map", "Send the robot there autonomously"],
        ["Enter button", "Open the link at the pad you're on"],
        ["Top-right", "Switch between Jackal and car"],
      ]
    : [
        ["↑ ↓ ← → / WASD", "Drive the robot"],
        ["Click the map", "Send the robot there autonomously"],
        ["Enter / Space", "Open the link at the beacon you're on"],
        ["1 / 2", "Jackal (differential) / car (Ackermann)"],
        ["Esc", "Dismiss a card"],
        ["H", "Toggle this help"],
      ]
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 p-5 ring-1 ring-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">How this works</h2>
            <p className="mt-1 text-sm text-slate-400">
              You are driving a robot through my portfolio. Its lidar builds the map as you go, and the trail behind it is a
              pose graph — the orange links are loop closures. Stop still for a few seconds and it will show you around on its own.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close help">
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="divide-y divide-white/5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-2">
              <dt className="font-mono text-xs text-amber-300">{k}</dt>
              <dd className="text-right text-slate-300">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export function Banner({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "amber" }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-20 flex justify-center px-4">
      <div
        className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium ring-1 backdrop-blur ${
          tone === "amber"
            ? "bg-amber-500/15 text-amber-200 ring-amber-400/40"
            : "bg-blue-500/15 text-blue-100 ring-blue-400/40"
        }`}
      >
        {children}
      </div>
    </div>
  )
}
