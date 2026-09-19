export type Skill = {
  id: number
  name: string
  color: string
  /** SVG path of the puzzle piece in the TECHNICAL SKILLS head (500×600 viewBox). */
  path: string
  labelX: number
  labelY: number
  isLine?: boolean
}

export const skills: Skill[] = [
  { // Control
    id: 1,
    name: "Control",
    color: "#5C7691",
    path: "M 140,120 L 140,32 Q 80,70 50,150 L 140,150 L 140,120 Z",
    labelX: 95,
    labelY: 110,
  },
  { // Machine Learning
    id: 2,
    name: "Machine Learning",
    color: "#F59E0B",
    path: "M 150,150 L 150,27 Q 250,-20 350,27 L 350,150 L 150,150 Z",
    labelX: 250,
    labelY: 80,
  },
  { // ROS2
    id: 3,
    name: "ROS2",
    color: "#39ADA8",
    path: "M 360,150 L 360,32 Q 410,55 450,150 L 360,150 Z",
    labelX: 405,
    labelY: 110,
  },
  { // Motion Planning
    id: 4,
    name: "Motion Planning",
    color: "#9DC46F",
    path: "M 140,160 L 48,160 Q 30,220 54,280 L 140,280 L 140,160 Z",
    labelX: 95,
    labelY: 220,
  },
  { // Modern C++
    id: 5,
    name: "Modern C++",
    color: "#4A90E2",
    path: "M 150,160 L 350,160 L 350,280 L 249,280 L 249,231 L 150,231 L 150,160 Z",
    labelX: 270,
    labelY: 200,
  },
  { // CMake
    id: 12,
    name: "CMake",
    color: "#2E7DAF",
    path: "M 150,240 L 240,240 L 240,280 L 150,280 L 150,240 Z",
    labelX: 195,
    labelY: 260,
  },
  { // Perception
    id: 6,
    name: "Perception",
    color: "#8B5CF6",
    path: "M 360,160 452 160 452 193 Q 467 223 490 280 L 360 280 360 160Z",
    labelX: 410,
    labelY: 220,
  },
  { // Computer Vision
    id: 7,
    name: "Computer Vision",
    color: "#10B981",
    path: "M 230,290 L 60,290 Q 95,340 120,400 L 230,400 L 230,290 Z",
    labelX: 145,
    labelY: 345,
  },
  { // SLAM
    id: 13,
    name: "SLAM",
    color: "#F97316",
    path: "M 240,290 L 320,290 L 320,400 L 240,400 L 240,290 Z",
    labelX: 300,
    labelY: 345,
  },
  { // Python
    id: 8,
    name: "Python",
    color: "#E5A84B",
    path: "M 360,290 L 489,290 L 459,305 L 449,329 L 453,347 Q 458,355 444,360 L 455,369 L 443,380 L 440,400 L 330,400 L 330,290 Z",
    labelX: 415,
    labelY: 345,
  },
  { // Linux
    id: 9,
    name: "Linux",
    color: "#EF4444",
    path: "M123 410H125L435 410Q425 440 380 450Q340 440 320 450L310 480L125 430Z",
    labelX: 270,
    labelY: 440,
  },
  { // Docker
    id: 10,
    name: "Docker",
    color: "#EC4899",
    path: "M 120,440 L 105,490 L 93,490 L 107,440 Z",
    isLine: true,
    labelX: 95,
    labelY: 465,
  },
  { // Git
    id: 11,
    name: "Git",
    color: "#14B8A6",
    path: "M 320,490 L 320,540 L 310,540 L 305,490 Z",
    isLine: true,
    labelX: 315,
    labelY: 515,
  },
]
