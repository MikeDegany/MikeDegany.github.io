"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

// 1. Define constants OUTSIDE to prevent dependency issues
const PARAGRAPH_HEIGHT_MOBILE = 280
const PARAGRAPH_HEIGHT_DESKTOP = 300

type AboutBeat =
  | { title: string; description: string }
  | { title: string; descriptionLines: [string, string] }

const aboutBeats: AboutBeat[] = [
  {
    title: "Autonomous Systems \n Engineer",
    descriptionLines: [
      "PhD Candidate",
      "Vehicle Autonomy and Intelligence Lab @ UNT",
    ],
  },
  { title: "Full-Stack Autonomy", description: "From perception to drive-by-wire." },
  // { title: "Bridge-Builder", description: "Translating complex theory into real-world application." },
  // { title: "Systems Architect", description: "Designing robust, scalable autonomous solutions." },
  { title: "Spatial Intelligence", description: "Advancing the frontier of 3D Spatial Perception." },
  // { title: "Research Leader", description: "Driving innovation through cross-functional collaboration." },
]

function BeatDescription({ beat }: { beat: AboutBeat }) {
  const baseClass =
    "mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 text-pretty leading-snug"

  if ("descriptionLines" in beat) {
    return (
      <p className={baseClass}>
        {beat.descriptionLines[0]}
        <br />
        <span className="mt-1 inline-block text-lg sm:text-xl md:text-2xl font-normal text-gray-600 dark:text-gray-400">
          {beat.descriptionLines[1]}
        </span>
      </p>
    )
  }

  return <p className={baseClass}>{beat.description}</p>
}

export function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [sectionHeight, setSectionHeight] = useState(0)

  // Determine current height based on state
  const paragraphHeight = isMobile ? PARAGRAPH_HEIGHT_MOBILE : PARAGRAPH_HEIGHT_DESKTOP
  const totalTravelDistance = (aboutBeats.length - 1) * paragraphHeight

  // 2. Handle Resize
  useEffect(() => {
    const handleResize = () => {
      // Check width
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Recalculate section height needed
      const pHeight = mobile ? PARAGRAPH_HEIGHT_MOBILE : PARAGRAPH_HEIGHT_DESKTOP
      const travelDist = (aboutBeats.length - 1) * pHeight
      setSectionHeight(window.innerHeight + travelDist)
    }

    // Run once on mount to set initial correct sizes
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 3. Handle Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const totalScrollableHeight = rect.height - windowHeight

      // If content fits without scroll, progress is 0
      if (totalScrollableHeight <= 0) {
        setScrollProgress(0)
        return
      }

      let progress = -rect.top / totalScrollableHeight
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sectionHeight])

  return (
    <section
      id="about"
      ref={containerRef}
      // Use suppressHydrationWarning to ignore mismatches on the dynamic height
      suppressHydrationWarning
      style={{ height: sectionHeight > 0 ? `${sectionHeight}px` : '300vh' }}
      className="relative bg-white dark:bg-background overflow-clip"
    >

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center z-10">

        {/* Header */}
        <div className="absolute top-6 md:top-8 left-0 right-0 z-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-2">ABOUT ME</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 h-full flex flex-col justify-center">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center h-full">

            {/* LEFT COLUMN */}
            <div className="relative h-full flex flex-col justify-center md:justify-center pt-24 md:pt-0">

              {/* MOBILE IMAGE SECTION */}
              <div className="md:hidden flex justify-center mb-6 shrink-0 relative z-30">
                <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
                  <Image
                    src="/about.jpeg"
                    alt="Profile"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* SCROLLING TEXT CONTAINER */}
              <div className="relative h-[44vh] md:h-[58vh] min-h-[220px] md:min-h-[320px] flex flex-col justify-center">

                {/* Gradients */}
                <div className="absolute top-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-b from-white dark:from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-t from-white dark:from-background to-transparent z-20 pointer-events-none" />

                <div className="h-full w-full overflow-hidden relative">
                  <div
                    className="absolute w-full will-change-transform"
                    // Add suppression here for the transform calculation
                    suppressHydrationWarning
                    style={{
                      transform: `translateY(calc(72px - ${scrollProgress * totalTravelDistance}px))`,
                    }}
                  >
                    {aboutBeats.map((beat, index) => {
                      const startOffset = 72
                      const currentPos =
                        index * paragraphHeight + (startOffset - scrollProgress * totalTravelDistance)
                      const containerCenter = isMobile ? 200 : 300

                      const dist = Math.abs(currentPos - containerCenter + paragraphHeight / 2)

                      let opacity = 1 - dist / (isMobile ? 260 : 360)
                      opacity = Math.max(0.2, Math.min(1, opacity))

                      const scale = 0.95 + 0.05 * opacity

                      return (
                        <div
                          key={beat.title}
                          className="flex items-center justify-center transition-all duration-100 ease-out"
                          suppressHydrationWarning
                          style={{
                            height: `${paragraphHeight}px`,
                            opacity: parseFloat(opacity.toFixed(2)),
                            transform: `scale(${scale.toFixed(3)})`,
                          }}
                        >
                          <div className="w-full max-w-2xl mx-auto px-1 sm:px-2 text-center">
                            <h3 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance text-gray-950 dark:text-white drop-shadow-sm">
                              {beat.title}
                            </h3>
                            <BeatDescription beat={beat} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DESKTOP IMAGE */}
            <div className="hidden md:flex justify-center items-center h-full md:pl-2">
              <div className="relative w-full max-w-[min(520px,calc(50vw-3rem))] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <Image
                  src="/about.jpeg"
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}