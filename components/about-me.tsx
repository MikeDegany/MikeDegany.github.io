"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

// 1. Define constants OUTSIDE to prevent dependency issues
const PARAGRAPH_HEIGHT_MOBILE = 240
const PARAGRAPH_HEIGHT_DESKTOP = 280

const paragraphs = [
  "I am a Robotics Engineer specializing in autonomous systems, from perception to planning and control. My Ph.D. work focuses on building scalable 3D mapping and robust navigation solutions for autonomous vehicles.",
  "My research philosophy is built on one core principle: theoretical concepts must be proven with hands-on application. I've been fortunate to work in advanced labs where I moved my ideas from theory to reality.",
  "I have hands-on experience deploying code on full-scale autonomous vehicles, developing novel sensor fusion algorithms that reduced odometry error by 72%, and architecting a multi-robot mapping system that won a Best Paper Award.",
  "I am a Mechatronics engineer with wide knowledge about different fields such as Electronics, Robotics, Control engineering, Computer science, Mechanics, and System engineering graduated from Amirkabir University of Technology.",
  "I am a roboticist with a keen interest in Mobile Robots. Worked in the Mapping and Motion Planning area for mobile robots applications and introduced a novel approach for real-time motion planning in dynamic environments.",
  "I am an Electronic Engineer with specialization in Embedded Real-Time Systems, highly experienced with computer coding for different types of microcontrollers in multiple languages including Assembly, C/C++.",
]

export function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [sectionHeight, setSectionHeight] = useState(0)

  // Determine current height based on state
  const paragraphHeight = isMobile ? PARAGRAPH_HEIGHT_MOBILE : PARAGRAPH_HEIGHT_DESKTOP
  const totalTravelDistance = (paragraphs.length - 1) * paragraphHeight

  // 2. Handle Resize
  useEffect(() => {
    const handleResize = () => {
        // Check width
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
        
        // Recalculate section height needed
        const pHeight = mobile ? PARAGRAPH_HEIGHT_MOBILE : PARAGRAPH_HEIGHT_DESKTOP
        const travelDist = (paragraphs.length - 1) * pHeight
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

        <div className="container mx-auto px-6 md:px-4 max-w-7xl h-full flex flex-col justify-center">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-center h-full">
            
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
              <div className="relative h-[40vh] md:h-[60vh] flex flex-col justify-center">
                
                {/* Gradients */}
                <div className="absolute top-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-b from-white dark:from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-t from-white dark:from-background to-transparent z-20 pointer-events-none" />

                <div className="h-full w-full overflow-hidden relative">
                  <div 
                    className="absolute w-full will-change-transform"
                    // Add suppression here for the transform calculation
                    suppressHydrationWarning
                    style={{
                      transform: `translateY(calc(100px - ${scrollProgress * totalTravelDistance}px))` 
                    }}
                  >
                    {paragraphs.map((text, index) => {
                      const startOffset = 100 
                      const currentPos = (index * paragraphHeight) + (startOffset - (scrollProgress * totalTravelDistance))
                      const containerCenter = isMobile ? 200 : 300 
                      
                      const dist = Math.abs(currentPos - containerCenter + (paragraphHeight/2))
                      
                      let opacity = 1 - (dist / (isMobile ? 250 : 350))
                      opacity = Math.max(0.1, Math.min(1, opacity))
                      
                      const scale = 0.95 + (0.05 * opacity)

                      return (
                        <div 
                          key={index} 
                          className="flex items-center justify-center md:justify-start transition-all duration-100 ease-out"
                          suppressHydrationWarning
                          style={{ 
                            height: `${paragraphHeight}px`,
                            // Using toFixed helps prevent floating point mismatches
                            opacity: parseFloat(opacity.toFixed(2)),
                            transform: `scale(${scale.toFixed(3)})`
                          }}
                        >
                          <p className="text-lg md:text-2xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed drop-shadow-sm text-center md:text-left">
                            {text}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DESKTOP IMAGE */}
            <div className="hidden md:flex justify-center items-center h-full">
              <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
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