"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- CONFIGURATION ---
const PREP_TIME = 4000 
const INHALE_TIME = 4000
const HOLD_TIME = 7000
const EXHALE_TIME = 8000
const CYCLE_DURATION = INHALE_TIME + HOLD_TIME + EXHALE_TIME

const TOTAL_CYCLES = 4 
const TOTAL_DURATION = TOTAL_CYCLES * CYCLE_DURATION

export default function RelaxPage() {
  // --- STATE ---
  const [status, setStatus] = useState<"PREPARE" | "GET_READY" | "ACTIVE" | "DONE">("PREPARE")
  const [isMuted, setIsMuted] = useState(false)
  
  // Parallax & Zoom (Shared for Mouse & Gyroscope)
  const [viewPos, setViewPos] = useState({ x: 0, y: 0 })
  const [zoomLevel, setZoomLevel] = useState(1.1)

  // Text State
  const [mainText, setMainText] = useState("Gather your thoughts into the sphere")
  const [subText, setSubText] = useState("Click the sphere when you are ready to let go")
  const [breathProgress, setBreathProgress] = useState(0) 

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // --- VIDEO SPEED CONTROL ---
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.1 
    }
  }, [])

  // --- PARALLAX HANDLERS (MOUSE & GYROSCOPE) ---
  useEffect(() => {
    // 1. Desktop Mouse Handler
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setViewPos({ x, y })
    }

    // 2. Mobile Gyroscope Handler
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return

      // Gamma: Left/Right tilt (-90 to 90). We clamp it to -45/45 for comfort.
      // Beta: Front/Back tilt (-180 to 180). We assume holding at ~45deg angle.
      
      const x = Math.max(-1, Math.min(1, e.gamma / 45))
      // Normalize Beta around 45 degrees (comfortable holding position)
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 45))

      setViewPos({ x, y })
    }

    const handleWheel = (e: WheelEvent) => {
      setZoomLevel(prev => {
        const newZoom = prev + (e.deltaY * -0.001)
        return Math.min(Math.max(newZoom, 1.1), 1.5)
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("deviceorientation", handleOrientation)
    window.addEventListener("wheel", handleWheel)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleOrientation)
      window.removeEventListener("wheel", handleWheel)
    }
  }, [])

  // --- "GET READY" TIMER ---
  useEffect(() => {
    if (status !== "GET_READY") return

    setMainText("Relax your shoulders...")
    setSubText("We will practice Dr. Weil's 4-7-8 Method")

    const timer = setTimeout(() => {
      setStatus("ACTIVE")
    }, PREP_TIME)

    return () => clearTimeout(timer)
  }, [status])


  // --- MAIN ACTIVE LOOP ENGINE ---
  useEffect(() => {
    if (status !== "ACTIVE") return

    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const now = Date.now()
      const totalElapsed = now - startTime
      
      if (totalElapsed >= TOTAL_DURATION) {
        setStatus("DONE")
        clearInterval(interval)
        return
      }

      const cycleElapsed = totalElapsed % CYCLE_DURATION
      
      if (cycleElapsed < INHALE_TIME) {
        setSubText("Inhale quietly through your nose")
        setBreathProgress(cycleElapsed / INHALE_TIME)
      } 
      else if (cycleElapsed < INHALE_TIME + HOLD_TIME) {
        setSubText("Hold your breath for a moment")
        setBreathProgress(1)
      } 
      else {
        setSubText("Exhale forcefully through your mouth")
        const exhaleElapsed = cycleElapsed - (INHALE_TIME + HOLD_TIME)
        setBreathProgress(1 - (exhaleElapsed / EXHALE_TIME))
      }

      if (totalElapsed < 15000) {
        setMainText("Watch your thought disappear...")
      } else if (totalElapsed < 40000) {
        setMainText("Everything you are worried about right now is happening on a tiny rock floating in a sunbeam.")
      } else if (totalElapsed < 65000) {
        setMainText("The universe is not judging you. It is too busy expanding.")
      } else {
        setMainText("Let it fade away completely...")
      }

    }, 50)

    return () => clearInterval(interval)
  }, [status])

  // --- INTERACTION HANDLERS ---
  const startSession = async () => {
    // 1. REQUEST IOS PERMISSION (Must happen on click)
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        (DeviceOrientationEvent as any).requestPermission) {
      try {
        await (DeviceOrientationEvent as any).requestPermission()
      } catch (e) {
        console.log("Orientation permission denied/error", e)
      }
    }

    // 2. START SESSION
    setStatus("GET_READY") 
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(e => console.log("Audio blocked:", e))
    }
    if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
    }
  }

  const resetSession = () => {
    setStatus("PREPARE")
    setMainText("Gather your thoughts into the sphere")
    setSubText("Click the sphere when you are ready to let go")
    setBreathProgress(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // --- STYLES ---
  const videoStyle = {
    // Uses viewPos which is updated by either Mouse OR Gyroscope
    transform: `scale(${zoomLevel}) translate(${-viewPos.x * 30}px, ${-viewPos.y * 30}px)`,
    transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)" // Smoother transition for gyro
  }

  const sphereStyle = {
    transition: status === "ACTIVE" ? `transform ${TOTAL_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none',
    transform: status === "ACTIVE" ? 'scale(0)' : 'scale(1)',
    cursor: status === "PREPARE" ? 'pointer' : 'default'
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none">
      {/* 1. AUDIO */}
      <audio ref={audioRef} src="/relax-sound.mp3" loop />

      {/* 2. VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          ref={videoRef}
          src="/sun-view.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-80"
          style={videoStyle}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 3. TOP NAV */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-50">
        <Link href="/">
          <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMuted(!isMuted)}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
      </div>

      {/* 4. MAIN CONTENT */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center justify-center max-w-4xl px-6 w-full">
          
          {/* THE SPHERE */}
          {status !== "DONE" && (
            <div 
              onClick={status === "PREPARE" ? startSession : undefined}
              style={sphereStyle}
              className={`
                relative w-[280px] h-[280px] rounded-full 
                flex items-center justify-center
                group mb-12
                ${status === "PREPARE" ? "animate-pulse hover:scale-105 transition-transform duration-500" : ""}
              `}
            >
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#4a4a4a,_#000000)]" />
              <div className="absolute inset-0 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]" />
              
              {status === "PREPARE" && (
                <p className="relative z-10 text-white font-medium tracking-wide group-hover:text-blue-200 transition-colors drop-shadow-md">
                  Tap to Release
                </p>
              )}
            </div>
          )}

          {/* TEXT AREA */}
          <div className="text-center space-y-4 animate-in fade-in duration-700 min-h-[200px] flex flex-col justify-center w-full">
            {status !== "DONE" ? (
              <>
                <h2 className="text-2xl md:text-4xl font-light leading-relaxed text-white drop-shadow-lg transition-all duration-1000">
                  {mainText}
                </h2>
                
                <p className="text-blue-200/80 font-mono uppercase tracking-widest text-sm md:text-base mt-4 animate-in slide-in-from-bottom-2 fade-in duration-500" key={subText}>
                  {subText}
                </p>
                
                {status === "ACTIVE" && (
                  <div className="w-32 h-0.5 bg-white/10 mx-auto rounded-full overflow-hidden mt-6">
                    <div 
                      className="h-full bg-blue-400/80 transition-all duration-75 ease-linear"
                      style={{ width: `${breathProgress * 100}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6 animate-in zoom-in fade-in duration-1000 flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl font-thin text-white tracking-widest">Gone.</h1>
                <p className="text-xl text-blue-100 font-light">Hope you feel better.</p>
                
                <div className="pt-8 flex flex-col items-center gap-8">
                  <Button 
                    onClick={resetSession}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8 py-6 text-lg backdrop-blur-sm transition-all hover:scale-105"
                  >
                    Start Over
                  </Button>

                  <Link 
                    href="/" 
                    className="group flex flex-col items-center gap-2 text-white/50 hover:text-white transition-all duration-300 mt-4"
                  >
                    <span className="text-lg font-light">Made with ❤ by</span>
                    <span className="text-2xl font-medium border-b border-transparent group-hover:border-white transition-all pb-1">
                      Mike Degany
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {status !== "DONE" && (
        <div className="absolute bottom-6 left-0 w-full text-center z-50 text-white/20 text-xs font-light tracking-wider">
          Made with ❤ by <Link href="/" className="hover:text-white transition-colors">Mike Degany</Link>
        </div>
      )}

    </div>
  )
}