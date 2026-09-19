"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Game } from "./engine/game"
import type { Beacon, GameSnapshot, RobotKind } from "./engine/types"
import { Banner, HelpOverlay, Hud } from "./hud"
import { InfoCard } from "./info-card"
import { Joystick, type JoyVector } from "./joystick"

const DRIVE_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"])

export function ExploreGame() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game | null>(null)
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null)

  const [snap, setSnap] = useState<GameSnapshot | null>(null)
  const [isTouch, setIsTouch] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [dismissedId, setDismissedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Keep the latest snapshot reachable from stable handlers
  const snapRef = useRef<GameSnapshot | null>(null)
  snapRef.current = snap

  // Everything opens in a new tab so the game (and its map) is still here when you come back.
  const enterBeacon = useCallback((b: Beacon) => {
    if (!b.href) return
    if (b.href.startsWith("mailto:")) window.location.href = b.href
    else window.open(b.href, "_blank", "noopener,noreferrer")
  }, [])

  // Boot the engine
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const game = new Game(canvas, {
      onSnapshot: setSnap,
      onEnter: enterBeacon,
    })
    gameRef.current = game

    const fit = () => {
      const r = wrap.getBoundingClientRect()
      game.resize(Math.max(1, r.width), Math.max(1, r.height), window.devicePixelRatio || 1)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)

    const onVis = () => {
      if (document.hidden) game.stop()
      else {
        game.resume()
        game.start()
      }
    }
    document.addEventListener("visibilitychange", onVis)

    const coarse = window.matchMedia?.("(pointer: coarse)")
    if (coarse?.matches) setIsTouch(true)
    const onTouch = () => setIsTouch(true)
    window.addEventListener("touchstart", onTouch, { passive: true, once: true })

    game.start()
    return () => {
      game.stop()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      window.removeEventListener("touchstart", onTouch)
      gameRef.current = null
    }
  }, [enterBeacon])

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const game = gameRef.current
      if (!game) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return
      if (DRIVE_KEYS.has(e.code)) {
        e.preventDefault()
        game.keys.add(e.code)
        return
      }
      switch (e.code) {
        case "Enter":
        case "Space":
        case "NumpadEnter":
          e.preventDefault()
          if (!game.interact()) game.noteUserInput()
          break
        case "Escape":
          setShowHelp(false)
          setDismissedId(snapRef.current?.activeBeaconId ?? null)
          break
        case "Digit1":
          game.switchRobot("jackal")
          break
        case "Digit2":
          game.switchRobot("car")
          break
        case "KeyH":
        case "Slash":
          setShowHelp((v) => !v)
          break
      }
    }
    const up = (e: KeyboardEvent) => {
      gameRef.current?.keys.delete(e.code)
    }
    const blur = () => gameRef.current?.keys.clear()
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    window.addEventListener("blur", blur)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
      window.removeEventListener("blur", blur)
    }
  }, [])

  // Reset dismissal when the beacon changes
  useEffect(() => {
    if (snap?.activeBeaconId !== dismissedId) setDismissedId(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap?.activeBeaconId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1600)
    return () => clearTimeout(t)
  }, [toast])

  const onJoy = useCallback((v: JoyVector) => {
    const game = gameRef.current
    if (!game) return
    game.joy = v
    if (v.active) game.noteUserInput()
  }, [])

  const onRobot = useCallback((k: RobotKind) => {
    gameRef.current?.switchRobot(k)
    gameRef.current?.noteUserInput()
  }, [])

  const game = gameRef.current
  const activeBeacon = snap?.activeBeaconId && game ? game.world.beacons.find((b) => b.id === snap.activeBeaconId) ?? null : null
  const showCard = activeBeacon && dismissedId !== activeBeacon.id

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 select-none overflow-hidden bg-[#050b18] text-white"
      style={{ overscrollBehavior: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        aria-label="Robot exploration map"
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          if (e.button !== 0 && e.pointerType === "mouse") return
          pointerStart.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
        }}
        onPointerUp={(e) => {
          const s = pointerStart.current
          pointerStart.current = null
          if (!s || s.id !== e.pointerId) return
          if (Math.hypot(e.clientX - s.x, e.clientY - s.y) > 10) return
          const game = gameRef.current
          if (!game) return
          const r = e.currentTarget.getBoundingClientRect()
          const ok = game.setGoalScreen(e.clientX - r.left, e.clientY - r.top)
          if (!ok) setToast("No path there")
        }}
        onPointerCancel={() => (pointerStart.current = null)}
      />

      <Hud snap={snap} onRobot={onRobot} onHelp={() => setShowHelp((v) => !v)} />

      {snap && !snap.hasMoved && !snap.autopilot && !showCard && (
        <Banner>{isTouch ? "Drag the stick to drive · tap anywhere to send the robot there" : "Use the arrow keys to drive · click anywhere to send the robot there"}</Banner>
      )}
      {snap?.autopilot && (
        <Banner tone="amber">Autopilot — {isTouch ? "touch the stick" : "press an arrow key"} to take control</Banner>
      )}
      {toast && <Banner tone="amber">{toast}</Banner>}

      {showCard && activeBeacon && (
        <InfoCard
          beacon={activeBeacon}
          skillsFound={snap?.skillsFound ?? []}
          isTouch={isTouch}
          onEnter={() => gameRef.current?.interact()}
          onClose={() => setDismissedId(activeBeacon.id)}
        />
      )}

      {isTouch && (
        <>
          <div className="absolute bottom-6 left-5 z-30" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <Joystick onChange={onJoy} />
          </div>
          <button
            type="button"
            onClick={() => gameRef.current?.interact()}
            disabled={!activeBeacon?.href}
            className="absolute bottom-8 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold text-slate-950 shadow-xl ring-2 ring-white/20 transition disabled:opacity-35 active:scale-95"
            style={{ backgroundColor: activeBeacon?.color ?? "#fbbf24", marginBottom: "env(safe-area-inset-bottom)" }}
            aria-label="Enter"
          >
            Enter
          </button>
        </>
      )}

      {showHelp && <HelpOverlay isTouch={isTouch} onClose={() => setShowHelp(false)} />}
    </div>
  )
}
