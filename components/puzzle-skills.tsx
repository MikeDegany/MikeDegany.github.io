"use client"

import { useState } from "react"

const skills = [
  { 
    id: 1, 
    name: "Control", 
    color: "#5C7691", 
    path: "M 140,120 L 140,65 Q 90,75 50,150 L 140,150 L 140,120 Z" 
  },
  { 
    id: 2, 
    name: "SLAM", 
    color: "#E5A84B", 
    path: "M 150,150 L 150,55 Q 250,25 350,55 L 350,150 L 150,150 Z" 
  },
  { 
    id: 3, 
    name: "ROS2", 
    color: "#39ADA8", 
    path: "M 360,150 L 360,65 Q 410,75 450,150 L 360,150 Z" 
  },
  { 
    id: 4, 
    name: "Motion Planning", 
    color: "#9DC46F", 
    path: "M 140,160 L 50,160 Q 30,220 50,280 L 140,280 L 140,160 Z" 
  },
  { 
    id: 5, 
    name: "Modern C++", 
    color: "#4A90E2", 
    path: "M 150,160 L 350,160 L 350,280 L 150,280 L 150,160 Z" 
  },
  { 
    id: 6, 
    name: "Python", 
    color: "#8B5CF6", 
    path: "M 360,160 L 455,160 Q 470,220 490,280 L 360,280 L 360,160 Z" 
  },
  { 
    id: 7, 
    name: "Computer Vision", 
    color: "#10B981", 
    path: "M 230,290 L 60,290 Q 95,340 120,400 L 230,400 L 230,290 Z" 
  },
  { 
    id: 8, 
    name: "Perception", 
    color: "#F59E0B", 
    path: "M 240,290 L 470,290 L 480,295 Q 450,310 460,340 Q 465,360 440,380 Q 440,400 425,400 L 240,400 L 240,290 Z" 
  },
  { 
    id: 9, 
    name: "Linux", 
    color: "#EF4444", 
    path: "M 125,415 L 420,415 Q 425,440 380,450 Q 340,440 320,450 L 310,480 L 125,430 Z" 
  },
  { 
    id: 10, 
    name: "Docker", 
    color: "#EC4899", 
    path: "M 110,440 L 95,490 L 85,490 L 100,440 Z",
    isLine: true
  },
  { 
    id: 11, 
    name: "Git", 
    color: "#14B8A6", 
    path: "M 320,490 L 320,540 L 310,540 L 310,490 Z",
    isLine: true
  },
]

interface PuzzlePieceProps {
  skill: typeof skills[0]
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function PuzzlePiece({ skill, isHovered, onHover, onLeave }: PuzzlePieceProps) {
  return (
    <path
      d={skill.path}
      fill={skill.color}
      stroke="#000000"
      strokeWidth={skill.isLine ? "6" : "8"}
      strokeLinecap="round"
      strokeLinejoin="round"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="cursor-pointer transition-all duration-200"
      style={{
        filter: isHovered ? "brightness(1.2) drop-shadow(0 4px 12px rgba(0,0,0,0.4))" : "brightness(1)",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        transformOrigin: "center",
        transformBox: "fill-box",
      }}
    />
  )
}

export function PuzzleSkills() {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)

  const hoveredSkillData = hoveredSkill ? skills.find((s) => s.id === hoveredSkill) : null

  return (
    <section id="puzzle-skills" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">TECHNICAL SKILLS</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Hover over each puzzle piece to reveal the skill</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-7xl mx-auto">
          {/* Puzzle Head SVG */}
          <div className="relative">
            <svg
              viewBox="0 0 500 600"
              className="w-full max-w-md h-auto drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Render all puzzle pieces */}
              {skills.map((skill) => (
                <PuzzlePiece
                  key={skill.id}
                  skill={skill}
                  isHovered={hoveredSkill === skill.id}
                  onHover={() => setHoveredSkill(skill.id)}
                  onLeave={() => setHoveredSkill(null)}
                />
              ))}
            </svg>
          </div>

          {/* Skill Display Panel */}
          <div className="w-full lg:w-96 h-64 flex items-center justify-center">
            <div
              className={`transition-all duration-500 ${
                hoveredSkillData
                  ? "opacity-100 scale-100 translate-x-0"
                  : "opacity-0 scale-95 -translate-x-4"
              }`}
            >
              {hoveredSkillData && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-4 border-blue-500 dark:border-blue-400">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-lg shadow-lg"
                      style={{ backgroundColor: hoveredSkillData.color }}
                    />
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-foreground">
                        {hoveredSkillData.name}
                      </h3>
                      {/* <p className="text-sm text-gray-500 dark:text-gray-400">Technical Skill</p> */}
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {/* <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <p className="text-gray-600 dark:text-gray-300">Core Technology</p>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <p className="text-gray-600 dark:text-gray-300">Production Ready</p>
                    </div> */}
                  </div>
                </div>
              )}
            </div>

            {/* Placeholder when nothing is hovered */}
            {!hoveredSkillData && (
              <div className="text-center opacity-50">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  Hover over a puzzle piece
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Skills Grid Below - Optional Quick Reference */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                  hoveredSkill === skill.id
                    ? "border-blue-500 dark:border-blue-400 shadow-lg scale-105"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md shadow-md flex-shrink-0"
                    style={{ backgroundColor: skill.color }}
                  />
                  <span className="font-semibold text-gray-900 dark:text-foreground">{skill.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

