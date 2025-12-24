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
  const [mainText, setMainText] = useState("A meditation to clear your mind")
  const [subText, setSubText] = useState("Visualize gathering every worry and heavy thought into this sphere. When you are ready to cast them into the sun, click to release.")
  const [breathProgress, setBreathProgress] = useState(0) 

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // --- VIDEO SPEED CONTROL ---
  useEffect(() => {
    if (videoRef.current) {
      // 0.15 speed stretches a ~12s clip to ~80s (duration of the exercise)
      videoRef.current.playbackRate = 0.15 
    }
  }, [])

  // --- PARALLAX HANDLERS (MOUSE & GYROSCOPE) ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setViewPos({ x, y })
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return
      const x = Math.max(-1, Math.min(1, e.gamma / 45))
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
    setSubText("Prepare to let go.")

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
        setMainText("Watch your thoughts burn away...")
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
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        (DeviceOrientationEvent as any).requestPermission) {
      try {
        await (DeviceOrientationEvent as any).requestPermission()
      } catch (e) {
        console.log("Orientation permission denied/error", e)
      }
    }

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
    setMainText("A meditation to clear your mind")
    setSubText("Visualize gathering every worry and heavy thought into this sphere. When you are ready to cast them into the sun, click to release.")
    setBreathProgress(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // --- STYLES ---
  const videoStyle = {
    transform: `scale(${zoomLevel}) translate(${-viewPos.x * 30}px, ${-viewPos.y * 30}px)`,
    transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)" 
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
          className="w-full h-full object-cover"
          style={videoStyle}
        />
        
        {/* GLOBAL SHADOW: Applies to whole screen in PREPARE/DONE modes */}
        <div 
          className={`
            absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out 
            ${(status === 'PREPARE' || status === 'DONE') ? 'opacity-70' : 'opacity-0'}
          `} 
        />
      </div>

      {/* 3. SUBTLE TEXT GRADIENT (New Feature) */}
      {/* This sits ON TOP of the video but BEHIND the text. 
          It creates a smooth dark fade from the bottom up to ensure text readability 
          even when the screen is shiny/bright. */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-0" />

      {/* 4. TOP NAV */}
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

      {/* 5. MAIN CONTENT LAYER */}
      <div className="absolute inset-0 z-10">
        
        {/* A. SPHERE CONTAINER */}
        {status !== "DONE" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                onClick={status === "PREPARE" ? startSession : undefined}
                style={sphereStyle}
                className={`
                    relative w-[280px] h-[280px] rounded-full 
                    flex items-center justify-center
                    pointer-events-auto
                    group
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
            </div>
        )}

        {/* B. TEXT CONTAINER */}
        <div className="absolute bottom-24 left-0 w-full px-6 flex flex-col items-center justify-end text-center space-y-4 animate-in fade-in duration-700 z-20">
            {status !== "DONE" ? (
              <>
                <h2 className="text-2xl md:text-3xl font-light leading-relaxed text-white drop-shadow-lg transition-all duration-1000 max-w-4xl">
                  {mainText}
                </h2>
                
                <p className="text-blue-200/90 font-mono uppercase tracking-widest text-xs md:text-sm animate-in slide-in-from-bottom-2 fade-in duration-500 max-w-2xl mx-auto leading-relaxed drop-shadow-md" key={subText}>
                  {subText}
                </p>
                
                {status === "ACTIVE" && (
                  <div className="w-64 h-2 bg-white/10 mx-auto rounded-full overflow-hidden mt-6">
                    <div 
                      className="h-full bg-blue-400/80 transition-all duration-75 ease-linear"
                      style={{ width: `${breathProgress * 100}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6 animate-in zoom-in fade-in duration-1000 flex flex-col items-center pb-8">
                <h1 className="text-5xl md:text-7xl font-thin text-white tracking-widest drop-shadow-lg">Gone.</h1>
                <p className="text-xl text-blue-100 font-light drop-shadow-md">Hope you feel better.</p>
                
                <div className="pt-4 flex flex-col items-center gap-6">
                  <Button 
                    onClick={resetSession}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8 py-6 text-lg backdrop-blur-sm transition-all hover:scale-105"
                  >
                    Start Over
                  </Button>

                  <Link 
                    href="/" 
                    className="group flex flex-col items-center gap-2 text-white/50 hover:text-white transition-all duration-300"
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

      {status !== "DONE" && (
        <div className="absolute bottom-6 left-0 w-full text-center z-50 text-white/40 text-xs font-light tracking-wider drop-shadow-md">
          Made with ❤ by <Link href="/" className="hover:text-white transition-colors">Mike Degany</Link>
        </div>
      )}

    </div>
  )
}