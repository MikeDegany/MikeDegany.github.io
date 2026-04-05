import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "F3DGS: Federated 3D Gaussian Splatting for Decentralized Multi-Agent World Modeling",
  body: (
    <>
      {/* Publication News Box */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-10">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">📢</span>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Publication News</h3>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed mb-4">
              I am thrilled to announce that our paper,{" "}
              <span className="font-semibold">F3DGS: Federated 3D Gaussian Splatting for Decentralized Multi-Agent World Modeling</span>,
              has been officially accepted to{" "}
              <span className="font-semibold">CVPR 2026 SPAR3D Workshop!</span>
            </p>
            <a
              href="https://arxiv.org/abs/2604.01605"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Read the Paper
            </a>
          </div>
        </div>
      </div>

      {/* Main Description */}
      <p className="leading-relaxed mb-8 text-base sm:text-lg">
        If you have been following the world of computer vision and robotics, you know that 3D Gaussian Splatting (3DGS)
        has completely changed the game for rendering photorealistic 3D scenes at lightning-fast speeds. But as we push to
        deploy fleets of autonomous robots in the real world, a massive roadblock has emerged. I am excited to share how
        our new framework, F3DGS, breaks right through it by tackling decentralized multi-agent 3D reconstruction.
      </p>

      {/* The Problem */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-foreground">
          The Problem: The Centralized Bottleneck
        </h2>
        <p className="leading-relaxed mb-6 text-base sm:text-lg">
          Right now, if you want to build a beautiful 3DGS map, the system is greedy. It demands centralized access to
          every single piece of training data. If you have a team of robots exploring a building, they currently have to
          beam all their high-resolution images back to a single main server to stitch the world together.
        </p>
        <p className="leading-relaxed mb-4 text-base sm:text-lg">
          In the real world, this centralized approach instantly hits three brick walls:
        </p>
        <ul className="space-y-4 mb-4 text-base sm:text-lg">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5"></span>
            <span><span className="font-semibold">Communication Overhead:</span> Sending thousands of high-res images over a local network quickly maxes out bandwidth and storage limits.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5"></span>
            <span><span className="font-semibold">Privacy Risks:</span> In many scenarios, sharing raw sensor data is not just difficult; it is complex to enforce due to strict data-sharing policies.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5"></span>
            <span><span className="font-semibold">Scalability Limitations:</span> Processing everything in one place creates a computational traffic jam that scales poorly as you add more robots to the fleet.</span>
          </li>
        </ul>
      </div>

      {/* The Solution */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-foreground">
          The Solution: Federated 3D Gaussian Splatting (F3DGS)
        </h2>
        <p className="leading-relaxed mb-4 text-base sm:text-lg">
          To solve this, we brought the concept of Federated Learning into the 3DGS universe.
        </p>
        <p className="leading-relaxed mb-4 text-base sm:text-lg">
          The core philosophy of F3DGS is simple: <span className="font-semibold">keep the data local, and share only the updates.</span>{" "}
          Instead of sending heavy raw images, our robots process their own observations locally and only send lightweight
          model updates back to the server.
        </p>
        <p className="leading-relaxed mb-4 text-base sm:text-lg">
          However, doing this with 3D map coordinates usually causes "geometric drift", the map gets scrambled as
          different robots optimize positions independently. Here is our secret sauce for fixing that:
        </p>
        <ul className="space-y-4 mb-4 text-base sm:text-lg">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5"></span>
            <span><span className="font-semibold">Building a Frozen Scaffold:</span> Before the robots start painting the details, we use LiDAR point clouds to build a globally shared, fixed geometric skeleton of the world.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5"></span>
            <span><span className="font-semibold">Decoupling Appearance from Geometry:</span> During the learning process, the physical 3D positions of the map are locked. The robots are only allowed to update the appearance attributes — things like color, opacity, and scale, using their local data. This guarantees the map stays perfectly aligned without geometric drift.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5"></span>
            <span><span className="font-semibold">Visibility-Aware Merging:</span> When the central server combines everyone's updates, it doesn't average them blindly. It uses a smart weighting system that gives more influence to the robot that had the clearest, most frequent view of a specific area.</span>
          </li>
        </ul>
      </div>

      {/* Results */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-foreground">
          The Results
        </h2>
        <p className="leading-relaxed text-base sm:text-lg">
          We tested F3DGS using a mobile robot equipped with synchronized LiDAR, RGB, and IMU measurements across
          multiple indoor sequences. The results were incredibly exciting. F3DGS achieved 3D reconstruction quality
          that is comparable to traditional, centralized training. We proved that you can successfully map a
          decentralized world without ever forcing agents to share their raw data.
        </p>
      </div>

      {/* What's Next */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-foreground">
          What's Next?
        </h2>
        <p className="leading-relaxed mb-3 text-base sm:text-lg">
          To help push this field forward, we are publicly releasing our source code, development kit, and the new
          multi-sequence <span className="font-semibold italic">"MeanGreen"</span> dataset.
        </p>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Stay tuned for the official repository links!
        </p>
      </div>
    </>
  ),
  images: ["/3dgsStreet.png"],
}
