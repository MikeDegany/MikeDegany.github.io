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

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate effective scroll distance
      // The container is sticky, so we track when the top of the container
      // moves from 0 (start of stick) to -(containerHeight - windowHeight) (end of stick)
      const totalScrollableHeight = rect.height - windowHeight
      
      // We are interested in the range where rect.top is between 0 and -totalScrollableHeight
      let progress = -rect.top / totalScrollableHeight
      
      // Clamp between 0 and 1
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    // 1. THE TRACK: A tall container that defines how long the scroll lasts
    // 'h-[300vh]' means the user has to scroll 3 full screen heights to get past this section
    <section ref={containerRef} className="relative h-[300vh] bg-white dark:bg-background">
      
      {/* 2. THE CAMERA: Sticky container that holds the view in place */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        
        {/* Header Section (Static within the sticky view) */}
        <div className="container mx-auto px-4 absolute top-10 left-0 right-0 z-10 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">ABOUT ME</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* LEFT COLUMN: SCROLLING TEXT */}
            <div className="relative h-[60vh] flex flex-col justify-center">
              
              {/* Top Fade Gradient */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-background to-transparent z-20 pointer-events-none" />
              
              {/* Bottom Fade Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-background to-transparent z-20 pointer-events-none" />

              {/* The Mask Window */}
              <div className="h-full w-full overflow-hidden relative">
                <div 
                  className="absolute w-full will-change-transform"
                  style={{
                    // We translate the text up based on scroll progress
                    // We start slightly lower (100px) and scroll up through the list
                    transform: `translateY(calc(100px - ${scrollProgress * (paragraphs.length * 280)}px))` 
                  }}
                >
                  {paragraphs.map((text, index) => {
                    // Logic to calculate opacity based on "center focus"
                    // 1. Calculate the current Y position of this specific paragraph
                    // 2. Compare it to the center of the viewing window
                    
                    const paragraphHeight = 280 // Estimated height + margin in pixels
                    const startOffset = 100 // Matches the translateY calc above
                    
                    // Current position of this item relative to the mask top
                    const currentPos = (index * paragraphHeight) + (startOffset - (scrollProgress * (paragraphs.length * paragraphHeight)))
                    
                    // Center of the container (assuming 60vh container, approx 400-500px on desktop)
                    // We can estimate the center point for the fade math
                    const containerCenter = 300 
                    
                    // Distance from center
                    const dist = Math.abs(currentPos - containerCenter + (paragraphHeight/2))
                    
                    // Calculate Opacity: 1 at center, 0 at edges (300px away)
                    let opacity = 1 - (dist / 350) 
                    opacity = Math.max(0.1, Math.min(1, opacity)) // Clamp opacity

                    // Scale effect for extra polish
                    const scale = 0.9 + (0.1 * opacity)

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
                        <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
                          {text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: STATIC IMAGE */}
            <div className="hidden md:flex justify-center items-center h-full">
              <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <Image
                  src="/about.jpeg" // Ensure this matches your public folder path
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay for cinematic look */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}