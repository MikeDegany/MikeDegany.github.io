import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Multi-modal Odometry System with Kinematic Constraints that Enhances Motion Estimation for Mobile Robots",
  body: (
    <>
      <h2 className="text-3xl font-bold mb-6 mt-12">Project Overview</h2>
      <p className="leading-relaxed mb-6 text-lg">
        A hierarchical sensor fusion (LiDAR, Inertial, Wheel Encoders) algorithm that reduced trajectory
        error by 72%, directly improving navigational reliability and operational safety for mobile robots.
      </p>
      <p className="leading-relaxed mb-12 text-lg">
        This system integrates multiple sensor modalities to provide robust and accurate odometry
        estimation, even in challenging environments where individual sensors may fail or provide
        unreliable data.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">Technical Approach</h2>
      <ul className="list-disc pl-6 space-y-3 mb-12 text-lg leading-relaxed">
        <li>Hierarchical sensor fusion architecture</li>
        <li>Kinematic constraint integration</li>
        <li>Real-time data processing and filtering</li>
        <li>Robust error handling and sensor failure recovery</li>
      </ul>
    </>
  ),
  images: ["/yellow-robot-on-grass-outdoor.jpg"],
}

