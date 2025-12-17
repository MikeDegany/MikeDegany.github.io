import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Best Paper Award: Multi-Robot Mapping and Navigation: A Holistic Approach for Collaborative Exploration",
  body: (
    <>
      <p className="leading-relaxed mb-6 text-lg">
        Architected a scalable multi-robot collaborative SLAM system, enabling rapid exploration and mapping of large, unknown environments (e.g., warehouses, disaster sites).
      </p>
      <p className="leading-relaxed mb-6 text-lg">
        Enabled multi-robot mapping by establishing efficient wireless communication among robots and off-board computers and implementing shared SLAM system ensuring scalability and reliability.
      </p>
      <p className="leading-relaxed mb-6 text-lg">
        Utilized ROS2, DDS (Data Distribution Service) and/or Zenoh ensuring reliable, reducing latency by 25% and packet loss by 50% at high frequencies.
      </p>
      <p className="leading-relaxed mb-6 text-lg">
        Mitigated interference and minimized traffic by employing distinct domain IDs and namespaces and implementing Domain Bridge preventing data sharing bottleneck and ensuring stable operation on resource-constrained platforms.
      </p>
      <p className="leading-relaxed mb-12 text-lg font-semibold text-gray-900 dark:text-foreground">
        [Work resulted in a Best Paper Award at the ISICN (2025) conference]
      </p>
    </>
  ),
  images: ["/MultiTurtlebot.png"],
  videos: [
    {
      // url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Multi-Robot Mapping Demonstration Video Coming Soon!",
    },
  ],
}

