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
    thumbnail: "/MultiTurtlebot.png",
    image: "/MultiTurtlebot.png",
    youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    slug: "motion-control-autonomous-vehicle",
    title: "Motion Control for real-platform AutonomousStuff retrofitted Vehicle",
    briefTitle: "Motion Control for Autonomous Vehicle",
    description: "Speed and Steering Controller for an autonomous cart",
    thumbnail: "/CAVGEM.png",
    image: "/CAVGEM.png",
    // youtubeVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    slug: "motion-planning-dynamic-environments",
    title: "Motion Planning for Autonomous Vehicles in Dynamic Environments",
    briefTitle: "Motion Planning in Dynamic Environments",
    description:
      "Developed a novel motion planning optimization technique that increased computational efficiency, enabling real-time trajectory execution on resource-constrained embedded platforms.",
    thumbnail: "/TrajDensity.png",
    image: "/TrajDensity.png",
  },
  {
    slug: "multi-modal-odometry-system",
    title: "Multi-modal Odometry System with Kinematic Constraints that Enhances Motion Estimation for Mobile Robots",
    briefTitle: "Multi-modal Odometry System",
    description:
      "A hierarchical sensor fusion (LiDAR, Inertial, Wheel Encoders) algorithm that reduced trajectory error by 72%, directly improving navigational reliability and operational safety for mobile robots.",
    thumbnail: "/JackalonGrass.jpg",
    image: "/JackalonGrass.jpg",
  },
  {
    slug: "robotic-manipulator-path-execution",
    title: "Path Execution on Robotic Manipulator",
    briefTitle: "Robotic Manipulator Path Execution",
    description: "Simulated Kinovarobotics manipulator in Gazebo and Controlled in ROS",
    thumbnail: "/kinova.png",
    image: "/kinova.png",
  },
  {
    slug: "federated-3d-reconstruction-mapping",
    title: "Federated approach for 3D reconstruction and Mapping for Connected Autonomous Vehicles",
    briefTitle: "Federated 3D Reconstruction & Mapping",
    description: "3D Gaussian Splatting meets SLAM",
    thumbnail: "/3dgsStreet.png",
    image: "/3dgsStreet.png",
  },
]

