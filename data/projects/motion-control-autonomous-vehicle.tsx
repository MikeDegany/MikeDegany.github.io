import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Motion Control for real-platform AutonomousStuff retrofitted Vehicle",
  body: (
    <>
      <p className="leading-relaxed mb-6 text-lg">
        The goal of this project was to bridge the gap between high-level software commands and physical motion, essentially giving a retrofitted GEM e4 electric cart its "nervous system." Instead of purchasing and relying on expensive proprietary solutions, we aimed to design and implement a custom interface that would make the vehicle fully controllable, ensuring it could execute speed and steering commands smoothly while strictly adhering to comfort constraints.
      </p>

      <p className="leading-relaxed mb-6 text-lg">
        I had the privilege of leading a team of exceptional talents from around the country during an NSF Research Experience for Undergraduates (REU). I continued the development alongside Casey, a Master's student who joined the project later, to finalize the implementation and ensure a successful deployment. We developed a robust Speed and Steering Control (SSC) package, implementing a multi-level Schmitt switching PID controller and integrating core hardware like Velodyne LiDARs, Xsens GNSS/INS, and the PACMod drive-by-wire interface.
      </p>

      <p className="leading-relaxed mb-6 text-lg">
        The project demanded rigorous validation beyond the lab. We committed to extensive field testing, happily enduring rainstorms, blazing sunshine, and whatever weather came our way to ensure the system was battle-tested and reliable.
      </p>

      <p className="leading-relaxed mb-6 text-lg">
        The result is an open-source package that democratizes access to this technology, providing a free, robust alternative to commercial software suites that typically cost a couple of thousand dollars.
      </p>
      <p className="leading-relaxed mb-6 text-lg">
      (Note: Some of the students from the team are not included in the photo above.)
      </p>
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

