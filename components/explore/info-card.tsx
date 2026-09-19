"use client"

import { ArrowUpRight, X } from "lucide-react"
import { skills } from "@/data/skills"
import type { Beacon } from "./engine/types"

export function InfoCard({
  beacon,
  skillsFound,
  isTouch,
  onEnter,
  onClose,
}: {
  beacon: Beacon
  skillsFound: number[]
  isTouch: boolean
  onEnter: () => void
  onClose: () => void
}) {
  const found = new Set(skillsFound)
  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-30 flex justify-center px-3 sm:justify-end sm:px-4">
      <div
        key={beacon.id}
        className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-2xl bg-slate-950/85 ring-1 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ boxShadow: `0 0 0 1px ${beacon.color}55, 0 20px 50px rgba(0,0,0,0.5)` }}
      >
        {beacon.image && beacon.kind !== "about" && (
          <div className="relative h-28 w-full overflow-hidden bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beacon.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: beacon.color }}>
                {beacon.kind === "nav" ? "waypoint" : beacon.kind}
              </div>
              <h3 className="mt-0.5 text-base font-bold leading-tight text-white">{beacon.title}</h3>
              {beacon.subtitle && <p className="mt-0.5 truncate text-xs text-slate-400">{beacon.subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mr-1 -mt-1 rounded-full p-1 text-slate-500 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {beacon.kind === "about" && beacon.image && (
            <div className="mt-3 flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beacon.image} alt="" loading="lazy" decoding="async" className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
              <ul className="space-y-1 text-xs text-slate-300">
                {beacon.lines?.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          )}

          {beacon.kind !== "about" && beacon.lines && beacon.lines.length > 0 && (
            <p className="mt-2 text-sm leading-snug text-slate-300">{beacon.lines.join(" ")}</p>
          )}

          {beacon.kind === "skills" && (
            <div className="mt-3">
              <div className="mb-1.5 text-xs text-slate-400">
                Identified <span className="text-white">{found.size}</span> of {skills.length} — sweep the crates with the lidar
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => {
                  const on = found.has(s.id)
                  return (
                    <span
                      key={s.id}
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                      style={{
                        backgroundColor: on ? s.color : "rgba(148,163,184,0.12)",
                        color: on ? "#0b1120" : "rgba(148,163,184,0.7)",
                        boxShadow: on ? `0 0 12px ${s.color}66` : undefined,
                      }}
                    >
                      {on ? s.name : "?"}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {beacon.href && (
            <button
              type="button"
              onClick={onEnter}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: beacon.color }}
            >
              {beacon.actionLabel ?? "Enter"}
              <ArrowUpRight className="h-4 w-4" />
              {!isTouch && <kbd className="ml-1 rounded bg-black/20 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
