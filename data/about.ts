export type AboutBeat =
  | { title: string; description: string }
  | { title: string; descriptionLines: [string, string] }

export const aboutBeats: AboutBeat[] = [
  {
    title: "Autonomous Systems \n Engineer",
    descriptionLines: [
      "PhD Candidate",
      "Vehicle Autonomy and Intelligence Lab @ UNT",
    ],
  },
  { title: "Full-Stack Autonomy", description: "From perception to drive-by-wire." },
  // { title: "Bridge-Builder", description: "Translating complex theory into real-world application." },
  // { title: "Systems Architect", description: "Designing robust, scalable autonomous solutions." },
  { title: "Spatial Intelligence", description: "Advancing the frontier of 3D Spatial Perception." },
  // { title: "Research Leader", description: "Driving innovation through cross-functional collaboration." },
]

/** Flattened description for places that render plain text (e.g. the explore game). */
export function aboutBeatText(beat: AboutBeat): string {
  return "descriptionLines" in beat ? beat.descriptionLines.join(" — ") : beat.description
}
