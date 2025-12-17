import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Motion Planning for Autonomous Vehicles in Dynamic Environments",
  body: (
    <>
      <h2 className="text-3xl font-bold mb-6 mt-12">Project Overview</h2>
      <p className="leading-relaxed mb-6 text-lg">
        Developed a novel motion planning optimization technique that increased computational efficiency,
        enabling real-time trajectory execution on resource-constrained embedded platforms.
      </p>
      <p className="leading-relaxed mb-12 text-lg">
        This project focuses on creating efficient algorithms for autonomous vehicles to navigate
        through dynamic environments with moving obstacles, ensuring both safety and performance.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">Key Features</h2>
      <ul className="list-disc pl-6 space-y-3 mb-12 text-lg leading-relaxed">
        <li>Real-time trajectory planning and optimization</li>
        <li>Dynamic obstacle avoidance</li>
        <li>Computational efficiency for embedded systems</li>
        <li>Adaptive path planning based on environment changes</li>
      </ul>
    </>
  ),
  images: ["/robot-path-planning-trajectory.jpg"],
}

