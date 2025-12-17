import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Path Execution on Robotic Manipulator",
  body: (
    <>
      <h2 className="text-3xl font-bold mb-6 mt-12">Project Overview</h2>
      <p className="leading-relaxed mb-6 text-lg">
        Simulated Kinova robotics manipulator in Gazebo and controlled in ROS. This project demonstrates
        advanced path planning and execution for robotic manipulators.
      </p>
      <p className="leading-relaxed mb-12 text-lg">
        The system enables precise control of a robotic arm through complex trajectories, with real-time
        monitoring and feedback for accurate task execution.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">Implementation Details</h2>
      <ul className="list-disc pl-6 space-y-3 mb-12 text-lg leading-relaxed">
        <li>Gazebo simulation environment setup</li>
        <li>ROS-based control system</li>
        <li>Path planning algorithms</li>
        <li>Real-time trajectory execution and monitoring</li>
      </ul>
    </>
  ),
  images: ["/kinova.png"],
}

