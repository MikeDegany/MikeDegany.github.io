"use client"

import { useState } from "react"

const skills = [
  { 
    id: 1, 
    name: "Control", 
    color: "#5C7691", 
    path: "M 140,120 L 140,65 Q 90,75 50,150 L 140,150 L 140,120 Z",
    labelX: 95,
    labelY: 110
  },
  { 
    id: 2, 
    name: "SLAM", 
    color: "#E5A84B", 
    path: "M 150,150 L 150,55 Q 250,25 350,55 L 350,150 L 150,150 Z",
    labelX: 250,
    labelY: 80
  },
  { 
    id: 3, 
    name: "ROS2", 
    color: "#39ADA8", 
    path: "M 360,150 L 360,65 Q 410,75 450,150 L 360,150 Z",
    labelX: 405,
    labelY: 110
  },
  { 
    id: 4, 
    name: "Motion Planning", 
    color: "#9DC46F", 
    path: "M 140,160 L 50,160 Q 30,220 50,280 L 140,280 L 140,160 Z",
    labelX: 95,
    labelY: 220
  },
  { 
    id: 5, 
    name: "Modern C++", 
    color: "#4A90E2", 
    path: "M 150,160 L 350,160 L 350,280 L 150,280 L 150,160 Z",
    labelX: 250,
    labelY: 220
  },
  { 
    id: 6, 
    name: "Python", 
    color: "#8B5CF6", 
    path: "M 360,160 L 455,160 Q 470,220 490,280 L 360,280 L 360,160 Z",
    labelX: 410,
    labelY: 220
  },
  { 
    id: 7, 
    name: "Computer Vision", 
    color: "#10B981", 
    path: "M 230,290 L 60,290 Q 95,340 120,400 L 230,400 L 230,290 Z",
    labelX: 145,
    labelY: 345
  },
  { 
    id: 8, 
    name: "Perception", 
    color: "#F59E0B", 
    path: "M 240,290 L 470,290 L 480,295 Q 450,310 460,340 Q 465,360 440,380 Q 440,400 425,400 L 240,400 L 240,290 Z",
    labelX: 355,
    labelY: 345
  },
  { 
    id: 9, 
    name: "Linux", 
    color: "#EF4444", 
    path: "M 125,415 L 420,415 Q 425,440 380,450 Q 340,440 320,450 L 310,480 L 125,430 Z",
    labelX: 270,
    labelY: 440
  },
  { 
    id: 10, 
    name: "Docker", 
    color: "#EC4899", 
    path: "M 110,440 L 95,490 L 85,490 L 100,440 Z",
    isLine: true,
    labelX: 95,
    labelY: 465
  },
  { 
    id: 11, 
    name: "Git", 
    color: "#14B8A6", 
    path: "M 320,490 L 320,540 L 310,540 L 310,490 Z",
    isLine: true,
    labelX: 315,
    labelY: 515
  },
]

interface PuzzlePieceProps {
  skill: typeof skills[0]
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}

function PuzzlePiece({ skill, isHovered, onHover, onLeave, onClick }: PuzzlePieceProps) {
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
      onClick={onClick}
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
  const [clickedSkill, setClickedSkill] = useState<number | null>(null)

  // Hover takes priority so it always works, clicked only shows when nothing is hovered
  const activeSkill = hoveredSkill || clickedSkill
  const hoveredSkillData = activeSkill ? skills.find((s) => s.id === activeSkill) : null

  const handleClick = (skillId: number) => {
    setClickedSkill(clickedSkill === skillId ? null : skillId)
  }

  return (
    <section id="puzzle-skills" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">TECHNICAL SKILLS</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="flex flex-col items-center justify-center gap-8 max-w-7xl mx-auto">
          {/* Puzzle Head SVG - Centered and Enlarged */}
          <div className="relative w-full max-w-3xl">
            <svg
              viewBox="0 0 500 600"
              className="w-full h-auto drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Render all puzzle pieces */}
              {skills.map((skill) => (
                <PuzzlePiece
                  key={skill.id}
                  skill={skill}
                  isHovered={activeSkill === skill.id}
                  onHover={() => setHoveredSkill(skill.id)}
                  onLeave={() => setHoveredSkill(null)}
                  onClick={() => handleClick(skill.id)}
                />
              ))}
              
              {/* Render skill label on hover/click */}
              {hoveredSkillData && (
                <g className="pointer-events-none">
                  {/* Label background - calculate based on text length with proper padding */}
                  <rect
                    x={hoveredSkillData.labelX - (hoveredSkillData.name.length * 6.5) - 12}
                    y={hoveredSkillData.labelY - 20}
                    width={hoveredSkillData.name.length * 13 + 24}
                    height="40"
                    rx="8"
                    fill="white"
                    stroke={hoveredSkillData.color}
                    strokeWidth="3"
                    filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                    className="animate-in fade-in zoom-in"
                    style={{ animationDuration: "150ms" }}
                  />
                  {/* Label text - properly centered */}
                  <text
                    x={hoveredSkillData.labelX}
                    y={hoveredSkillData.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={hoveredSkillData.color}
                    fontSize="20"
                    fontWeight="bold"
                    className="animate-in fade-in"
                    style={{ animationDuration: "150ms" }}
                  >
                    {hoveredSkillData.name}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Skills Tags - Compact Reference */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSkill === skill.id
                    ? "shadow-lg scale-110 ring-2 ring-blue-500 dark:ring-blue-400"
                    : "shadow-md hover:shadow-lg hover:scale-105"
                }`}
                style={{
                  backgroundColor: activeSkill === skill.id ? skill.color : `${skill.color}20`,
                  borderLeft: `4px solid ${skill.color}`,
                }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => handleClick(skill.id)}
              >
                <div
                  className="w-6 h-6 rounded-full shadow-sm flex-shrink-0"
                  style={{ backgroundColor: skill.color }}
                />
                <span className={`font-semibold text-sm whitespace-nowrap ${
                  activeSkill === skill.id 
                    ? "text-white" 
                    : "text-gray-900 dark:text-foreground"
                }`}>
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

