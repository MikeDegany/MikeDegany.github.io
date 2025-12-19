"use client"

import { useState, useEffect, useRef } from "react"

// --- Configuration ---
const SVG_WIDTH = 1200
const SVG_HEIGHT = 500 
const ROAD_WIDTH = 80

// Positions are 0 to 1 along the path
const EDUCATION_ITEMS = [
  {
    degree: "Bachelor of Science: Electronics Engineering",
    institution: "Yazd University (2012 - 2016)",
    // Adjusted from 0.15 to 0.2 to give the car a "runway" before the first stop
    pathT: 0.2, 
  },
  {
    degree: "Master of Science: Mechatronics Engineering",
    institution: "Amirkabir University of Technology (AUT) (2016 - 2019) - Distinguished Graduate Award (Ranked 3rd of Class)",
    pathT: 0.5, 
  },
  {
    degree: "Doctor of Philosophy: Computer Science and Engineering",
    institution: "University of North Texas (UNT) Texas, USA (2022 - 2026)",
    pathT: 0.82, 
  },
]

// --- Math Helpers ---
function getPointOnBezier(t: number, p0: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}) {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
  return { x, y }
}

function getAngleOnBezier(t: number, p0: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}) {
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

function splitBezier(t: number, p0: {x:number, y:number}, p1: {x:number, y:number}, p2: {x:number, y:number}) {
  const mid1 = { x: p0.x + t * (p1.x - p0.x), y: p0.y + t * (p1.y - p0.y) }
  const mid2 = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) }
  const splitPoint = { x: mid1.x + t * (mid2.x - mid1.x), y: mid1.y + t * (mid2.y - mid1.y) }
  return { mid1, mid2, splitPoint }
}

export function Education() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeBubbleIndex, setActiveBubbleIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // -- Path Definition --
  const p0 = { x: -SVG_WIDTH * 0.1, y: SVG_HEIGHT * 0.7 } 
  const p1 = { x: SVG_WIDTH * 0.5, y: SVG_HEIGHT * 0.4 } 
  const p2 = { x: SVG_WIDTH * 1.1, y: SVG_HEIGHT * 0.7 } 

  // -- Scroll Logic --
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // --- REFINED TRIGGERS ---
      
      // Start: When the section header is 60% down the screen (closer to middle).
      // This delays the start so the car doesn't move while the section is barely visible at the bottom.
      const startTrigger = windowHeight * 0.6
      
      // End: When the section header hits the top of the viewport (0) or slightly above (-50).
      // This ensures the car keeps moving until the section is fully scrolled through.
      const endTrigger = -50 

      const currentPos = rect.top
      
      // Calculate progress
      let progress = (startTrigger - currentPos) / (startTrigger - endTrigger)
      
      // Clamp strictly between 0 and 1
      progress = Math.max(0, Math.min(1, progress))

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() 
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // -- Derived Calculations --
  useEffect(() => {
    let active = null
    for (let i = 0; i < EDUCATION_ITEMS.length; i++) {
        // Trigger bubble slightly before reaching the milestone
        if (scrollProgress >= EDUCATION_ITEMS[i].pathT - 0.05) {
            active = i
        }
    }
    setActiveBubbleIndex(active)
  }, [scrollProgress])

  const lastItemT = EDUCATION_ITEMS[2].pathT
  const carT = Math.min(scrollProgress, lastItemT)
  const carPos = getPointOnBezier(carT, p0, p1, p2)
  const carAngle = getAngleOnBezier(carT, p0, p1, p2)
  const splitData = splitBezier(lastItemT, p0, p1, p2)
  
  const bluePathString = `M ${p0.x} ${p0.y} Q ${splitData.mid1.x} ${splitData.mid1.y} ${splitData.splitPoint.x} ${splitData.splitPoint.y}`
  const greenPathString = `M ${splitData.splitPoint.x} ${splitData.splitPoint.y} Q ${splitData.mid2.x} ${splitData.mid2.y} ${p2.x} ${p2.y}`

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-background dark:via-background dark:to-background relative"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-white dark:text-foreground mb-2">EDUCATION</h2>
          <div className="w-16 h-1 bg-blue-500 dark:bg-blue-400 mx-auto" />
        </div>

        {/* SVG Container */}
        <div className="relative w-full max-w-6xl mx-auto aspect-[1200/500]">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Roads */}
            <path
              d={bluePathString}
              stroke="#3b82f6"
              strokeWidth={ROAD_WIDTH}
              fill="none"
              strokeLinecap="round"
              className="drop-shadow-lg opacity-90"
            />
             <path
              d={bluePathString}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeDasharray="15 15"
              opacity={0.4}
            />
            <path
              d={greenPathString}
              stroke="#22c55e"
              strokeWidth={ROAD_WIDTH}
              fill="none"
              strokeLinecap="round"
              className="drop-shadow-lg opacity-90"
            />
            <path
              d={greenPathString}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeDasharray="15 15"
              opacity={0.4}
            />

            {/* Milestones & Bubbles */}
            {EDUCATION_ITEMS.map((item, index) => {
              const pos = getPointOnBezier(item.pathT, p0, p1, p2)
              const isPhd = index === 2
              const isActive = activeBubbleIndex === index
              
              return (
                <g key={index}>
                  {/* Milestone Dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill={isPhd ? "#22c55e" : "#3b82f6"}
                    stroke="white"
                    strokeWidth="3"
                  />

                  {/* Pop-up Bubble */}
                  <g transform={`translate(${pos.x}, ${pos.y})`}>
                    <foreignObject
                      x="-150" 
                      y="-240" 
                      width="300"
                      height="200"
                      className="overflow-visible"
                    >
                      <div 
                        className={`
                          transition-all duration-500 ease-out transform
                          ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}
                        `}
                      >
                         <div className="relative flex flex-col items-center">
                            <div className="
                                bg-white dark:bg-slate-800 
                                p-4 rounded-xl shadow-2xl 
                                border-l-4 
                                w-full
                                backdrop-blur-sm
                            "
                            style={{ 
                                borderLeftColor: isPhd ? '#22c55e' : '#3b82f6' 
                            }}
                            >
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-2">
                                  {item.degree}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                  {item.institution}
                                </p>
                            </div>

                            {/* Arrow */}
                            <div 
                              className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] mt-[-1px]"
                              style={{ 
                                  borderTopColor: '#ffffff',
                                  filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' 
                              }}
                            ></div>
                            <div 
                              className="hidden dark:block absolute bottom-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px]"
                              style={{ borderTopColor: '#1e293b' }} 
                            ></div>
                         </div>
                      </div>
                    </foreignObject>
                  </g>
                </g>
              )
            })}

            {/* Car */}
            <g
              transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carAngle})`}
              className="will-change-transform"
            >
               <ellipse cx="0" cy="18" rx="30" ry="10" fill="black" opacity="0.3" blur="2" />
               <rect x="-28" y="-15" width="56" height="30" rx="8" fill="white" stroke="#94a3b8" strokeWidth="1" />
               <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#e2e8f0" />
               <rect x="-16" y="-8" width="20" height="16" rx="2" fill="#bfdbfe" opacity="0.6" />
               <g transform="translate(0, 0)">
                  <circle r="12" fill="#1e293b" />
                  <circle r="8" fill="#0f172a" />
                  <circle r="10" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.8">
                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1s" repeatCount="indefinite" />
                  </circle>
               </g>
               <rect x="-22" y="-18" width="12" height="4" fill="#334155" rx="2" />
               <rect x="10" y="-18" width="12" height="4" fill="#334155" rx="2" />
               <rect x="-22" y="14" width="12" height="4" fill="#334155" rx="2" />
               <rect x="10" y="14" width="12" height="4" fill="#334155" rx="2" />
               <circle cx="28" cy="-8" r="3" fill="#fbbf24" opacity="0.8" />
               <circle cx="28" cy="8" r="3" fill="#fbbf24" opacity="0.8" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}