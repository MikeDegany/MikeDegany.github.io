import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Motion Planning for Autonomous Vehicles in Dynamic Environments",
  body: (
    <>
      <p className="leading-relaxed mb-6 text-lg">
        Navigating an empty road is simple; safely maneuvering through a chaotic environment filled with moving obstacles is a fundamental challenge for autonomous vehicles. This research focused on solving that problem without requiring a supercomputer in the trunk.
      </p>

      <p className="leading-relaxed mb-6 text-lg">
        I designed a robust, hierarchical motion planning architecture adaptable to various vehicle types. By combining an enhanced A* algorithm for global routing with a Timed Elastic Band (TEB) approach for local planning, the system can dynamically react to moving threats while adhering to different motion models.
      </p>

      <p className="leading-relaxed mb-6 text-lg">
        The core innovation of this work was a novel Trajectory Density optimization technique. Standard planners often waste computational resources by treating every meter of a path equally. My approach dynamically adjusts the number of waypoints—increasing density in curves for precision while reducing it in straight sections. This smart distribution significantly lowered the computational load, enabling complex, real-time trajectory execution even on resource-constrained embedded platforms.
      </p>
      <p className="leading-relaxed mb-6 text-lg">
        (The photo above is generate by AI, obviously😉)
      </p>
      {/* Publication Notice */}
      <div className="bg-green-50 dark:bg-gray-800 border-l-4 border-green-600 p-6 rounded-r-lg mt-8 mb-6">
        <p className="font-semibold text-gray-900 dark:text-foreground">
          Published in Scientific Computing and Bioinformatics (Springer, 2025)
        </p>
      </div>

      {/* Publication Button */}
      <div className="flex justify-center mt-6 mb-8">
        <a
          href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=liIpqPMAAAAJ&citation_for_view=liIpqPMAAAAJ:Se3iqnhoufwC"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          View Publication
        </a>
      </div>
    </>
  ),
  images: ["/RealTimeMotionPlanning.png"],
}

