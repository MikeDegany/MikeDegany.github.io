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
      labelTop: "86.29%", 
      labelLeft: "13.71%", 
      dotTop: "93.85%", 
      dotLeft: "32.36%",
      linePoints: "M 321 931 L 136 856"
    },
    // Robot 2 - Bottom right
    { 
      id: "robot2", 
      text: "Robot 2", 
      labelTop: "87.60%", 
      labelLeft: "94.25%", 
      dotTop: "93.35%", 
      dotLeft: "76.11%",
      linePoints: "M 755 926 L 935 869"
    },
    // Robot 3 - Top left
    { 
      id: "robot3", 
      text: "Robot 3", 
      labelTop: "64.52%", 
      labelLeft: "14.21%", 
      dotTop: "76.51%", 
      dotLeft: "17.34%",
      linePoints: "M 172 759 L 141 640"
    },
    // Robot 4 - Top right
    { 
      id: "robot4", 
      text: "Robot 4", 
      labelTop: "66.23%", 
      labelLeft: "95.16%", 
      dotTop: "70.16%", 
      dotLeft: "79.74%",
      linePoints: "M 791 696 L 944 657"
    },
    // Router - Center of the setup
    { 
      id: "router", 
      text: "High-Performance Router\n(Network Core) for\nMulti-Robot Communication", 
      labelTop: "73.49%", 
      labelLeft: "62.30%",
      dotTop: "66.53%",
      dotLeft: "50.20%",
      linePoints: ""
    },
    // Monitor - Top center
    { 
      id: "monitor", 
      text: "Collaborative Mapping\n(Dual SLAM View)", 
      labelTop: "39.01%", 
      labelLeft: "50.20%",
      dotTop: "31.35%", 
      dotLeft: "50.10%",
      linePoints: "M 497 311 L 498 387"
    },
  ]

  return (
    <>
      {/* Title Section */}
      <header className="mb-12 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-foreground leading-normal mb-6">
        🏆Best Paper Award: Multi-Robot Mapping and Navigation
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-foreground/80 leading-relaxed font-light">
        Networking in Collaborative Multi-Robot Systems for Enhanced Mapping and Navigation
        </p>
      </header>

      {/* Interactive Setup Image (Hidden on mobile, shown on desktop) */}
      <div className="hidden md:block mb-16 max-w-5xl mx-auto">
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
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 992 992">
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
                        : 'translate(-100%, -50%)',
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

      {/* Static Image for Mobile (Shown on mobile, hidden on desktop) */}
      <div className="md:hidden mb-12 w-full">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl shadow-lg">
          <Image
            src="/multirobotSetup.png"
            alt="Multi-Robot Setup"
            width={1400}
            height={800}
            className="w-full h-auto rounded-xl"
            priority
          />
        </div>
      </div>

      {/* Content Body */}
      <article className="max-w-3xl mx-auto mb-16">
        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-800 dark:text-foreground/90">
          {/* Paper Abstract */}
          <div className="mb-8">
            <p className="mb-4">
              Multi-robot systems, with their ability to collaboratively navigate and map unknown environments, hold significant promise for a range of applications. In this paper, we strive to enhance the mapping and navigation capabilities of multiple robots to meet the rising demand for efficient multi-robot system and coordination to address real-world challenges.
            </p>
            <p className="mb-4">
              To achieve the objectives, multiple mobile robots are inter-connected using a Data Distribution Service (DDS) domain bridging approach within Robot Operating System 2 (ROS2) framework. This strategy leverages the capabilities of DDS to mitigate interference and minimize network traffic. We integrate the robot poses with corresponding laser scans to construct and optimize a pose graph in order to perform a graph-based Simultaneous Localization and Mapping (SLAM) technique leading to a collaborative map.
            </p>
            <p className="mb-4">
              The robots leverage a ROS2 navigation stack to concurrently traverse both mapped and unexplored areas, continuously updating the collaborative map as they discover new regions. We address networking challenges to ensure stable WiFi communication and effective robot collaboration; highlighting the critical role of network stability and synchronization in multi-robot environments, and offer a practical framework for researchers to optimize mapping and navigation in multi-robot systems.
            </p>
            <p className="mb-4">
              The results show significant advancements in indoor multi-robot mapping and navigation, with enhanced coordination and networking reducing downtime and operational risks; promising substantial benefits for various industries.
            </p>
          </div>

          {/* Key Technical Highlights */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-foreground">Key Technical Highlights</h3>
            <p className="mb-4">
              Architected a scalable multi-robot collaborative SLAM system, enabling rapid exploration and mapping of large, unknown environments (e.g., warehouses, disaster sites).
            </p>
            <p className="mb-4">
              Enabled multi-robot mapping by establishing efficient wireless communication among robots and off-board computers and implementing shared SLAM system ensuring scalability and reliability.
            </p>
            <p className="mb-4">
              Utilized ROS2, DDS (Data Distribution Service) and/or Zenoh ensuring reliable, reducing latency by 25% and packet loss by 50% at high frequencies.
            </p>
            <p>
              Mitigated interference and minimized traffic by employing distinct domain IDs and namespaces and implementing Domain Bridge preventing data sharing bottleneck and ensuring stable operation on resource-constrained platforms.
            </p>
          </div>

          {/* Best Paper Award Notice */}
          <div className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-600 p-6 rounded-r-lg mt-8">
            <p className="font-semibold text-gray-900 dark:text-foreground">
              This work resulted in a Best Paper Award at the ISICN (2025) conference
            </p>
          </div>

          {/* Publication Button */}
          <div className="flex justify-center mt-8">
            <a
              href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=liIpqPMAAAAJ&citation_for_view=liIpqPMAAAAJ:MXK_kJrjxJIC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Publication
            </a>
          </div>

          {/* Video Section */}
          <div className="mt-12 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-foreground text-center">Project Demonstration</h3>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/m7wOw3pMUOk"
                title="Multi-Robot Mapping and Navigation Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
