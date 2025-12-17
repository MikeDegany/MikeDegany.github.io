"use client"

import { useEffect, useState, useRef } from "react"

const skills = [
  { name: "C/C++ Programming", percentage: 90 },
  { name: "ROS (Robot Operating System)", percentage: 94 },
  { name: "Motion Planning", percentage: 96 },
  { name: "SLAM", percentage: 86 },
  { name: "Python", percentage: 80 },
  { name: "Embedded systems", percentage: 94 },
  { name: "Computational Intelligence", percentage: 87 },
  { name: "System engineering", percentage: 67 },
]

function CircularProgress({
  percentage,
  name,
}: {
  percentage: number
  name: string
}) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (circleRef.current) {
      observer.observe(circleRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setProgress(percentage)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [percentage, isVisible])

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center" ref={circleRef}>
      <div className="relative w-40 h-40">
        <svg className="transform -rotate-90 w-40 h-40">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-200 dark:text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-blue-600 dark:text-blue-400 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-foreground">{percentage}%</span>
        </div>
      </div>
      <h3 className="mt-4 text-center font-bold text-gray-900 dark:text-foreground text-lg">{name}</h3>
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">SKILLS</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {skills.slice(0, 4).map((skill, index) => (
              <CircularProgress key={index} percentage={skill.percentage} name={skill.name} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {skills.slice(4).map((skill, index) => (
              <CircularProgress key={index} percentage={skill.percentage} name={skill.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
