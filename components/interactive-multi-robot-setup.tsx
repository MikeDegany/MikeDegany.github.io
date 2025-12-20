"use client"

import Image from "next/image"
import { useState } from "react"

export function InteractiveMultiRobotSetup() {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)

  const labels = [
    // Robot 1 - Bottom left
    { 
      id: "robot1", 
      text: "Robot 1", 
      labelTop: "856px", 
      labelLeft: "136px", 
      dotTop: "931px", 
      dotLeft: "321px",
      linePoints: "M 321 931 L 136 856"
    },
    // Robot 2 - Bottom right
    { 
      id: "robot2", 
      text: "Robot 2", 
      labelTop: "869px", 
      labelLeft: "935px", 
      dotTop: "926px", 
      dotLeft: "755px",
      linePoints: "M 755 926 L 935 869"
    },
    // Robot 3 - Top left
    { 
      id: "robot3", 
      text: "Robot 3", 
      labelTop: "640px", 
      labelLeft: "141px", 
      dotTop: "759px", 
      dotLeft: "172px",
      linePoints: "M 172 759 L 141 640"
    },
    // Robot 4 - Top right
    { 
      id: "robot4", 
      text: "Robot 4", 
      labelTop: "657px", 
      labelLeft: "944px", 
      dotTop: "696px", 
      dotLeft: "791px",
      linePoints: "M 791 696 L 944 657"
    },
    // Router - Center of the setup
    { 
      id: "router", 
      text: "High-Performance Router\n(Network Core) for\nMulti-Robot Communication", 
      labelTop: "729px", 
      labelLeft: "618px",
      dotTop: "660px",
      dotLeft: "498px",
      linePoints: ""
    },
    // Monitor - Top center
    { 
      id: "monitor", 
      text: "Collaborative Mapping\n(Dual SLAM View)", 
      labelTop: "387px", 
      labelLeft: "498px",
      dotTop: "311px",
      dotLeft: "497px",
      linePoints: "M 497 311 L 498 387"
    },
  ]

  return (
    <>
      {/* Title Section */}
      <header className="mb-12 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-foreground leading-normal mb-6">
          Best Paper Award: Multi-Robot Mapping and Navigation
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-foreground/80 leading-relaxed font-light">
          A Holistic Approach for Collaborative Exploration
        </p>
      </header>

      {/* Interactive Setup Image */}
      <div className="mb-16 max-w-5xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl shadow-xl">
          <div className="relative w-full">
            <Image
              src="/MultiTurtlebot.png"
              alt="Multi-Robot Setup with Interactive Labels"
              width={1400}
              height={800}
              className="w-full h-auto rounded-2xl"
              priority
            />
            
            {/* SVG for connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {labels.map((label) => {
                if (!label.linePoints) return null
                const isHovered = hoveredLabel === label.id
                const shouldDim = hoveredLabel !== null && hoveredLabel !== label.id
                
                return (
                  <path
                    key={`line-${label.id}`}
                    d={label.linePoints}
                    stroke={isHovered ? 'rgba(96, 165, 250, 0.9)' : 'rgba(148, 163, 184, 0.6)'}
                    strokeWidth={isHovered ? '2' : '1.5'}
                    fill="none"
                    style={{
                      opacity: shouldDim ? 0.2 : 1,
                      transition: 'all 0.3s ease',
                    }}
                  />
                )
              })}
            </svg>

            {/* Interactive Labels */}
            {labels.map((label) => {
              const isHovered = hoveredLabel === label.id
              const shouldDim = hoveredLabel !== null && hoveredLabel !== label.id
              
              return (
                <div key={label.id}>
                  {/* Connection dot - positioned ON the item */}
                  <div
                    className="absolute w-3 h-3 rounded-full bg-cyan-400 border-2 border-white shadow-lg transition-all duration-300 cursor-pointer z-10"
                    style={{
                      top: label.dotTop,
                      left: label.dotLeft,
                      transform: 'translate(-50%, -50%)',
                      opacity: shouldDim ? 0.3 : 1,
                      scale: isHovered ? '1.5' : '1',
                    }}
                    onMouseEnter={() => setHoveredLabel(label.id)}
                    onMouseLeave={() => setHoveredLabel(null)}
                  />
                  
                  {/* Label box - positioned OFF to the side */}
                  <div
                    className="absolute px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 z-20"
                    style={{
                      top: label.labelTop,
                      left: label.labelLeft,
                      transform: label.labelLeft === "50%" 
                        ? 'translate(-50%, -50%)' 
                        : (parseFloat(label.labelLeft) < 50 ? 'translate(0, -50%)' : 'translate(-100%, -50%)'),
                      backgroundColor: isHovered 
                        ? 'rgba(59, 130, 246, 0.95)' 
                        : 'rgba(15, 23, 42, 0.85)',
                      opacity: shouldDim ? 0.3 : 1,
                      boxShadow: isHovered 
                        ? '0 8px 32px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.5)',
                      scale: isHovered ? '1.08' : '1',
                      border: isHovered ? '2px solid rgba(96, 165, 250, 0.8)' : '1px solid rgba(148, 163, 184, 0.3)',
                    }}
                    onMouseEnter={() => setHoveredLabel(label.id)}
                    onMouseLeave={() => setHoveredLabel(null)}
                  >
                    <div 
                      className="text-white font-semibold text-center whitespace-pre-line transition-all duration-300"
                      style={{
                        fontSize: isHovered ? '0.9rem' : '0.8rem',
                        textShadow: isHovered ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
                      }}
                    >
                      {label.text}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
          Hover over the labels to highlight specific components
        </p>
      </div>

      {/* Content Body */}
      <article className="max-w-3xl mx-auto mb-16">
        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-800 dark:text-foreground/90">
          <p>
            Architected a scalable multi-robot collaborative SLAM system, enabling rapid exploration and mapping of large, unknown environments (e.g., warehouses, disaster sites).
          </p>
          <p>
            Enabled multi-robot mapping by establishing efficient wireless communication among robots and off-board computers and implementing shared SLAM system ensuring scalability and reliability.
          </p>
          <p>
            Utilized ROS2, DDS (Data Distribution Service) and/or Zenoh ensuring reliable, reducing latency by 25% and packet loss by 50% at high frequencies.
          </p>
          <p>
            Mitigated interference and minimized traffic by employing distinct domain IDs and namespaces and implementing Domain Bridge preventing data sharing bottleneck and ensuring stable operation on resource-constrained platforms.
          </p>
          <div className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
            <p className="font-semibold text-gray-900 dark:text-foreground">
              This work resulted in a Best Paper Award at the ISICN (2025) conference
            </p>
          </div>
        </div>
      </article>
    </>
  )
}
