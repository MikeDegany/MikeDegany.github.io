"use client"

import { useState } from "react"
import { skills } from "@/data/skills"

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
    // <section id="puzzle-skills" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-gray-900">
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-gray-900">

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

