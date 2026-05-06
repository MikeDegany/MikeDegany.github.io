export interface Project {
  slug: string
  title: string
  briefTitle: string
  description: string
  thumbnail: string
  image: string
  youtubeVideo?: string
}

export const projects: Project[] = [
  {
    slug: "multi-robot-mapping-navigation",
    title: "Best Paper Award: Multi-Robot Mapping and Navigation: A Holistic Approach for Collaborative Exploration",
    briefTitle: "Multi-Robot Mapping & Navigation (🏆Best Paper Award)",
    description: "A Holistic Approach for Collaborative Exploration",
    thumbnail: "/MultiTurtlebot-thumb.webp",
    image: "/MultiTurtlebot.webp",
    youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    slug: "motion-control-autonomous-vehicle",
    title: "Motion Control for real-platform AutonomousStuff retrofitted Vehicle",
    briefTitle: "Motion Control for Autonomous Vehicle",
    description: "Speed and Steering Controller for an autonomous cart",
    thumbnail: "/Gem-thumb.webp",
    image: "/Gem.webp",
    // youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    slug: "motion-planning-dynamic-environments",
    title: "Motion Planning for Autonomous Vehicles in Dynamic Environments",
    briefTitle: "Motion Planning in Dynamic Environments",
    description:
      "Developed a novel motion planning optimization technique that increased computational efficiency, enabling real-time trajectory execution on resource-constrained embedded platforms.",
    thumbnail: "/U-turn-thumb.webp",
    image: "/U-turn.webp",
  },
  {
    slug: "multi-sensor-fusion-odometry",
    title: "Helping Robots Find Their Way (Even in the Darkest Hallways)",
    briefTitle: "Helping Robots Find Their Way",
    description: 'The Challenge of "Sensory Confusion"',
    thumbnail: "/JackalonGrass.jpg",
    image: "/JackalonGrass.jpg",
  },
  {
    slug: "robotic-manipulator-path-execution",
    title: "Path Execution on Robotic Manipulator",
    briefTitle: "Robotic Manipulator Path Execution",
    description: "Simulated Kinovarobotics manipulator in Gazebo and Controlled in ROS",
    thumbnail: "/kinova-thumb.webp",
    image: "/kinova.webp",
  },
  {
    slug: "federated-gaussian-splatting-slam",
    title: "F3DGS: Federated 3D Gaussian Splatting for Decentralized Multi-AgentWorld Modeling",
    briefTitle: "Teaching Robots to Build 3D Worlds Together",
    description: "A federated 3D Gaussian Splatting framework for decentralized multi-agent 3D reconstruction",
    thumbnail: "/3dgsStreet-thumb.webp",
    image: "/3dgsStreet.webp",
  },
]

