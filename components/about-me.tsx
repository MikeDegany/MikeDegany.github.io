"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const paragraphs = [
  "I am a Robotics Engineer specializing in autonomous systems, from perception to planning and control. My Ph.D. work focuses on building scalable 3D mapping and robust navigation solutions for autonomous vehicles.",
  "My research philosophy is built on one core principle: theoretical concepts must be proven with hands-on application. I've been fortunate to work in advanced labs where I moved my ideas from theory to reality.",
  "I have hands-on experience deploying code on full-scale autonomous vehicles, developing novel sensor fusion algorithms that reduced odometry error by 72%, and architecting a multi-robot mapping system that won a Best Paper Award.",
  "Mechatronics engineer with wide knowledge about different fields such as Electronics, Robotics, Control engineering, Computer science, Mechanics, and System engineering graduated from Amirkabir University of Technology.",
  "A roboticist with a keen interest in Mobile Robots. Worked in the Mapping and Motion Planning area for mobile robots applications and introduced a novel approach for real-time motion planning in dynamic environments.",
  "Electronic Engineer with specialization in Embedded Real-Time Systems, highly experienced with computer coding for different types of microcontrollers in multiple languages including Assembly, C/C++.",
]

export function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile to adjust spacing math
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      const totalScrollableHeight = rect.height - windowHeight
      
      // Calculate progress 0 to 1
      let progress = -rect.top / totalScrollableHeight
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() 

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    // TRACK: Shorter on mobile (220vh) to reduce thumb fatigue, taller on desktop (300vh)
    <section 
      ref={containerRef} 
      className="relative h-[220vh] md:h-[300vh] bg-white dark:bg-background overflow-clip"
    >
      
      {/* MOBILE BACKGROUND IMAGE: Faded watermark that only appears on small screens */}
      <div className="absolute inset-0 md:hidden z-0">
        <Image
          src="/about.jpeg"
          alt="Background"
          fill
          className="object-cover opacity-[0.08] dark:opacity-[0.15]" 
        />
      </div>

      {/* CAMERA: Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center z-10">
        
        {/* Header */}
        <div className="absolute top-8 left-0 right-0 z-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-2">ABOUT ME</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="container mx-auto px-6 md:px-4 max-w-7xl h-full flex flex-col justify-center">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-center h-[70vh] md:h-auto">
            
            {/* LEFT COLUMN: SCROLLING TEXT */}
            <div className="relative h-full md:h-[60vh] flex flex-col justify-center">
              
              {/* GRADIENTS: Thinner on mobile (h-16) to show more text */}
              <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-b from-white dark:from-background to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-white dark:from-background to-transparent z-20 pointer-events-none" />

              {/* MASK WINDOW */}
              <div className="h-full w-full overflow-hidden relative">
                <div 
                  className="absolute w-full will-change-transform"
                  style={{
                    // Math adjustments:
                    // Mobile needs slightly more spacing per item (300px) because text wraps more lines
                    // Desktop can use tighter spacing (280px)
                    transform: `translateY(calc(100px - ${scrollProgress * (paragraphs.length * (isMobile ? 320 : 280))}px))` 
                  }}
                >
                  {paragraphs.map((text, index) => {
                    const paragraphHeight = isMobile ? 320 : 280
                    const startOffset = 100
                    
                    const currentPos = (index * paragraphHeight) + (startOffset - (scrollProgress * (paragraphs.length * paragraphHeight)))
                    
                    // Center point calculation
                    // On mobile, the "center" of the view might feel slightly higher due to address bars
                    const containerCenter = isMobile ? 280 : 300 
                    
                    const dist = Math.abs(currentPos - containerCenter + (paragraphHeight/2))
                    
                    // Fade math
                    let opacity = 1 - (dist / (isMobile ? 300 : 350))
                    opacity = Math.max(0.1, Math.min(1, opacity))
                    
                    const scale = 0.95 + (0.05 * opacity)

                    return (
                      <div 
                        key={index} 
                        className="flex items-center justify-start transition-all duration-100 ease-out"
                        style={{ 
                          height: `${paragraphHeight}px`,
                          opacity: opacity,
                          transform: `scale(${scale})`
                        }}
                      >
                        <p className="text-lg md:text-2xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed drop-shadow-sm">
                          {text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DESKTOP IMAGE (Hidden on Mobile) */}
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