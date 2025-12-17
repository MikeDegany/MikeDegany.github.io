import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Motion Control for real-platform AutonomousStuff retrofitted Vehicle",
  body: (
    <>
      <h2 className="text-3xl font-bold mb-6 mt-12">Project Goals</h2>
      <p className="leading-relaxed mb-12 text-lg">
        Design and implement a robust speed and steering controller for an AutonomousStuff retrofitted
        electric cart. The controller ensures smooth trajectory following while maintaining safety
        constraints.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">Implementation</h2>
      <ul className="list-disc pl-6 space-y-3 mb-12 text-lg leading-relaxed">
        <li>PID controller for speed regulation</li>
        <li>Stanley controller for lateral path tracking</li>
        <li>Real-time sensor integration (GPS, IMU, wheel encoders)</li>
        <li>Safety monitoring and emergency stop functionality</li>
      </ul>
    </>
  ),
  images: ["/REU2022.jpg"],
  // videos: [
  //   {
  //     url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  //     title: "Motion Control Demonstration",
  //   },
  // ],
}

