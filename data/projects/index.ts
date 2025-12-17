import { ProjectContent } from "./types"

// Import all project content files
import { content as multiRobotMapping } from "./multi-robot-mapping-navigation"
import { content as motionControl } from "./motion-control-autonomous-vehicle"
import { content as motionPlanning } from "./motion-planning-dynamic-environments"
import { content as multiModalOdometry } from "./multi-modal-odometry-system"
import { content as roboticManipulator } from "./robotic-manipulator-path-execution"
import { content as federated3D } from "./federated-3d-reconstruction-mapping"

// Map project slugs to their content
export const projectContents: Record<string, ProjectContent> = {
  "multi-robot-mapping-navigation": multiRobotMapping,
  "motion-control-autonomous-vehicle": motionControl,
  "motion-planning-dynamic-environments": motionPlanning,
  "multi-modal-odometry-system": multiModalOdometry,
  "robotic-manipulator-path-execution": roboticManipulator,
  "federated-3d-reconstruction-mapping": federated3D,
}

// Helper function to get project content by slug
export function getProjectContent(slug: string): ProjectContent | undefined {
  return projectContents[slug]
}

