export type Interest = {
  title: string
  description: string
  image: string
}

export const interests: Interest[] = [
  {
    title: "Robotics",
    description: "Design, simulate, build robotic systems",
    image: "/robotmike.jpg",
  },
  {
    title: "Connected Autonomous Vehicles",
    description: "Perception, Planning and Control for self-driving cars",
    image: "/CAV.png",
  },
  {
    title: "Electronics",
    description: "Electronic circuits, Embedded systems, SCBs, etc.",
    image: "/electronics.png",
  },
]
