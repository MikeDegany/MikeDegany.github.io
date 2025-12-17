"use client"

import { useState, useEffect, useRef } from "react"

const educationItems = [
  {
    degree: "Bachelor of Science: Electronics Engineering",
    institution: "Yazd University (2012 - 2016)",
    position: 0.1, // Position along the road path (0-1)
  },
  {
    degree: "Master of Science: Mechatronics Engineering",
    institution: "Amirkabir University of Technology (AUT) (2016 - 2019) - Distinguished Graduate Award (Ranked 3rd of Class)",
    position: 0.45, // Position along the road path (0-1)
  },
  {
    degree: "Doctor of Philosophy: Computer Science and Engineering",
    institution: "University of North Texas (UNT) Texas, USA (2022 - 2026)",
    position: 0.8, // Position along the road path (0-1) - This is where blue turns to green
  },
]

// Calculate point on a curved path (quadratic bezier)
function getPointOnPath(t: number, width: number, height: number) {
  // Create a more horizontal curved path similar to Waymo's design
  // Start from left (extended), curve slightly and go to the right (extended)
  // Extended road coordinates
  const startX = -width * 0.1
  const startY = height * 0.4
  const controlX = width * 0.5
  const controlY = height * 0.35 // Slight curve upward
  const endX = width * 1.1
  const endY = height * 0.45
  
  // Quadratic bezier formula
  const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX
  const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY
  
  // Calculate angle for car rotation
  const dx = 2 * (1 - t) * (controlX - startX) + 2 * t * (endX - controlX)
  const dy = 2 * (1 - t) * (controlY - startY) + 2 * t * (endY - controlY)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  
  return { x, y, angle }
}

export function Education() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeBubble, setActiveBubble] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Get section boundaries
      const sectionTop = rect.top
      const sectionBottom = rect.bottom
      
      /* 
       * CAR ANIMATION LOGIC - REDESIGNED FROM SCRATCH
       * 
       * Goal: Car starts when section becomes visible, ends when user scrolls past it
       * 
       * Trigger points:
       * - START (progress = 0): When section BOTTOM enters viewport
       *   → sectionBottom = windowHeight (bottom edge touches bottom of screen)
       * 
       * - END (progress = 1): When section TOP exits viewport  
       *   → sectionTop = 0 (top edge touches top of screen)
       * 
       * Total animation range: from sectionBottom=windowHeight to sectionTop=0
       * Total distance: windowHeight (the viewport height the section travels through)
       */
      
      let progress = 0
      
      // Section hasn't entered viewport yet (completely below screen)
      if (sectionBottom > windowHeight) {
        progress = 0
      }
      // Section has completely exited viewport (scrolled past - above screen)
      else if (sectionTop < 0) {
        progress = 1
      }
      // Section is visible or passing through viewport
      else {
        // Animation starts when bottom enters (sectionBottom = windowHeight)
        // Animation ends when top exits (sectionTop = 0)
        
        // Simple calculation using sectionTop:
        // - When sectionTop = windowHeight (section just entering): progress = 0
        // - When sectionTop = 0 (section exiting): progress = 1
        
        progress = 1 - (sectionTop / windowHeight) 
        
        // Safety clamp
        progress = Math.max(0, Math.min(1, progress)) - 0.5
      }
      
      setScrollProgress(progress)

      // Show bubble when car reaches milestone
      let newActiveBubble: number | null = null
      for (let i = educationItems.length - 1; i >= 0; i--) {
        const milestonePos = educationItems[i].position
        if (progress >= milestonePos - 0.05) {
          newActiveBubble = i
          break
        }
      }
      setActiveBubble(newActiveBubble)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const svgWidth = 1200
  const svgHeight = 450
  const roadWidth = 80

  // Visible road range constants (milestones appear in this range of the extended road)
  const visibleStart = 0.15
  const visibleEnd = 0.85

  // Generate path for the road - more horizontal, extended at front and back
  // Extended road: start earlier and end later
  const startX = -svgWidth * 0.1 // Extend road to the left (off-screen start)
  const startY = svgHeight * 0.4
  const controlX = svgWidth * 0.5
  const controlY = svgHeight * 0.35
  const endX = svgWidth * 1.1 // Extend road to the right (off-screen end)
  const endY = svgHeight * 0.45
  const roadPath = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`

  // Get car position and angle - map scroll progress to visible road range
  const carProgressOnRoad = visibleStart + scrollProgress * (visibleEnd - visibleStart)
  const carPos = getPointOnPath(carProgressOnRoad, svgWidth, svgHeight)
  
  // PhD position is where blue turns to green
  const phdPosition = educationItems[2].position
  
  // Calculate PhD point on the path
  const phdPoint = getPointOnPath(phdPosition, svgWidth, svgHeight)
  
  // Create path segments: blue path (start to PhD) and green path (PhD to end)
  // For quadratic bezier, we need to split at the PhD position
  // Using De Casteljau's algorithm to split the curve
  // Map PhD position to visible road range - same calculation as milestones
  const adjustedPhdPosition = visibleStart + phdPosition * (visibleEnd - visibleStart)
  const t = adjustedPhdPosition
  const midX1 = startX + t * (controlX - startX)
  const midY1 = startY + t * (controlY - startY)
  const midX2 = controlX + t * (endX - controlX)
  const midY2 = controlY + t * (endY - controlY)
  const splitX = midX1 + t * (midX2 - midX1)
  const splitY = midY1 + t * (midY2 - midY1)
  
  // Blue path: from start to PhD position
  const bluePath = `M ${startX} ${startY} Q ${midX1} ${midY1} ${splitX} ${splitY}`
  // Green path: from PhD position to end
  const greenPath = `M ${splitX} ${splitY} Q ${midX2} ${midY2} ${endX} ${endY}`

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-background dark:via-background dark:to-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white dark:text-foreground mb-2">EDUCATION</h2>
          <div className="w-16 h-1 bg-blue-500 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="relative" style={{ minHeight: "300px" }}>
            <svg
              ref={svgRef}
              width="100%"
              height="300"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Road path - Blue section (before PhD) */}
              <path
                d={bluePath}
                stroke="#3b82f6"
                strokeWidth={roadWidth}
                fill="none"
                strokeLinecap="round"
                opacity={0.9}
                className="drop-shadow-lg"
              />

              {/* Road path - Green section (after PhD milestone) */}
              <path
                d={greenPath}
                stroke="#22c55e"
                strokeWidth={roadWidth}
                fill="none"
                strokeLinecap="round"
                opacity={0.9}
                className="drop-shadow-lg"
              />

              {/* Road center line - Blue section */}
              <path
                d={bluePath}
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10 10"
                opacity={0.3}
              />
              {/* Road center line - Green section */}
              <path
                d={greenPath}
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10 10"
                opacity={0.3}
              />

              {/* Milestones */}
              {educationItems.map((item, index) => {
                // Map milestone position to visible road range - same calculation as bubbles
                const adjustedPosition = visibleStart + item.position * (visibleEnd - visibleStart)
                const pos = getPointOnPath(adjustedPosition, svgWidth, svgHeight)
                const isPhd = index === 2 // PhD is the transition point
                return (
                  <g key={index}>
                    {/* Milestone marker */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="20"
                      fill={isPhd ? "#22c55e" : "#3b82f6"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="drop-shadow-lg"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="8"
                      fill="#ffffff"
                    />
                  </g>
                )
              })}

              {/* Autonomous Vehicle - Detailed design */}
              <g
                transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carPos.angle})`}
                className="transition-transform duration-150 ease-out"
              >
                {/* Car shadow */}
                <ellipse
                  cx="0"
                  cy="18"
                  rx="30"
                  ry="10"
                  fill="#000000"
                  opacity="0.25"
                />
                
                {/* Main car body */}
                <rect
                  x="-28"
                  y="-8"
                  width="56"
                  height="32"
                  rx="8"
                  fill="#ffffff"
                  className="drop-shadow-lg"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                />
                
                {/* Car roof base */}
                <rect
                  x="-24"
                  y="-12"
                  width="48"
                  height="8"
                  rx="4"
                  fill="#f9fafb"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                
                {/* LIDAR sensor dome (main autonomous sensor) */}
                <ellipse
                  cx="0"
                  cy="-18"
                  rx="16"
                  ry="12"
                  fill="#1f2937"
                  className="drop-shadow-md"
                />
                <ellipse
                  cx="0"
                  cy="-18"
                  rx="12"
                  ry="8"
                  fill="#111827"
                />
                {/* LIDAR rotating ring */}
                <ellipse
                  cx="0"
                  cy="-18"
                  rx="14"
                  ry="10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                
                {/* Front-facing cameras (small sensors on front) */}
                <circle cx="-8" cy="-6" r="3" fill="#1f2937" />
                <circle cx="8" cy="-6" r="3" fill="#1f2937" />
                <circle cx="-8" cy="-6" r="1.5" fill="#60a5fa" />
                <circle cx="8" cy="-6" r="1.5" fill="#60a5fa" />
                
                {/* Side sensors (on roof edges) */}
                <rect x="-22" y="-14" width="4" height="6" rx="1" fill="#374151" />
                <rect x="18" y="-14" width="4" height="6" rx="1" fill="#374151" />
                
                {/* Windshield */}
                <rect
                  x="-22"
                  y="-6"
                  width="44"
                  height="14"
                  rx="3"
                  fill="#bfdbfe"
                  opacity="0.5"
                />
                <rect
                  x="-20"
                  y="-4"
                  width="40"
                  height="10"
                  rx="2"
                  fill="#dbeafe"
                  opacity="0.3"
                />
                
                {/* Front grille/bumper */}
                <rect
                  x="-28"
                  y="-8"
                  width="10"
                  height="32"
                  rx="8"
                  fill="#f3f4f6"
                />
                <line x1="-26" y1="0" x2="-26" y2="20" stroke="#d1d5db" strokeWidth="1" />
                <line x1="-22" y1="0" x2="-22" y2="20" stroke="#d1d5db" strokeWidth="1" />
                
                {/* Rear bumper */}
                <rect
                  x="18"
                  y="-8"
                  width="10"
                  height="32"
                  rx="8"
                  fill="#f3f4f6"
                />
                
                {/* Side mirrors */}
                <ellipse cx="-26" cy="2" rx="3" ry="5" fill="#e5e7eb" />
                <ellipse cx="26" cy="2" rx="3" ry="5" fill="#e5e7eb" />
                
                {/* Wheels - detailed autonomous vehicle style */}
                <circle cx="-16" cy="16" r="10" fill="#1f2937" className="drop-shadow-md" />
                <circle cx="16" cy="16" r="10" fill="#1f2937" className="drop-shadow-md" />
                
                {/* Wheel rims */}
                <circle cx="-16" cy="16" r="6" fill="#4b5563" />
                <circle cx="16" cy="16" r="6" fill="#4b5563" />
                
                {/* Wheel centers with hub detail */}
                <circle cx="-16" cy="16" r="3.5" fill="#6b7280" />
                <circle cx="16" cy="16" r="3.5" fill="#6b7280" />
                <circle cx="-16" cy="16" r="2" fill="#9ca3af" />
                <circle cx="16" cy="16" r="2" fill="#9ca3af" />
                
                {/* Wheel spokes (radial pattern) */}
                {[0, 45, 90, 135].map((angle) => {
                  const rad = (angle * Math.PI) / 180
                  const x1 = -16 + Math.cos(rad) * 2
                  const y1 = 16 + Math.sin(rad) * 2
                  const x2 = -16 + Math.cos(rad) * 5
                  const y2 = 16 + Math.sin(rad) * 5
                  return (
                    <g key={`left-${angle}`}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5" />
                    </g>
                  )
                })}
                {[0, 45, 90, 135].map((angle) => {
                  const rad = (angle * Math.PI) / 180
                  const x1 = 16 + Math.cos(rad) * 2
                  const y1 = 16 + Math.sin(rad) * 2
                  const x2 = 16 + Math.cos(rad) * 5
                  const y2 = 16 + Math.sin(rad) * 5
                  return (
                    <g key={`right-${angle}`}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="1.5" />
                    </g>
                  )
                })}
                
                {/* Side panels/doors */}
                <rect x="-20" y="4" width="40" height="12" rx="2" fill="#f9fafb" opacity="0.5" />
                <line x1="-20" y1="10" x2="20" y2="10" stroke="#e5e7eb" strokeWidth="1" />
              </g>
            </svg>

            {/* Education info bubbles - positioned using SVG coordinates */}
            <svg
              width="100%"
              height="300"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="absolute inset-0 pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              {educationItems.map((item, index) => {
                // Map milestone position to visible road range - use exact same calculation as milestones
                const adjustedPosition = visibleStart + item.position * (visibleEnd - visibleStart)
                const pos = getPointOnPath(adjustedPosition, svgWidth, svgHeight)
                const isActive = activeBubble === index
                const isPhd = index === 2
                
                // Position bubbles directly centered on top of milestones
                const bubbleX = 1.28 * pos.x - 168 // Center horizontally exactly on milestone
                const bubbleY = pos.y - 50 // Position above the milestone
                
                return (
                  <g key={index} opacity={isActive ? 1 : 0} className="transition-opacity duration-500">
                    {/* Modern bubble with rounded corners */}
                    <foreignObject
                      x={bubbleX - 200}
                      y={bubbleY - 120}
                      width="400"
                      height="240"
                      className="pointer-events-auto"
                    >
                      <div className="relative">
                        {/* Modern bubble box with gradient and shadow */}
                        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 relative backdrop-blur-sm">
                          {/* Arrow pointing down to milestone - perfectly centered */}
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className={`w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-transparent ${
                              isPhd 
                                ? "border-t-green-500 dark:border-t-green-400" 
                                : "border-t-blue-500 dark:border-t-blue-400"
                            }`}></div>
                          </div>
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 leading-tight break-words">
                              {item.degree}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed break-words whitespace-normal">
                              {item.institution}
                            </p>
                          </div>
                          
                          {/* Subtle glow effect */}
                          <div className={`absolute inset-0 rounded-2xl opacity-20 blur-xl ${
                            isPhd ? "bg-green-400" : "bg-blue-400"
                          }`}></div>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
