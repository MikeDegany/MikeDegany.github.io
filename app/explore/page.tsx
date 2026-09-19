import type { Metadata } from "next"
import { ExploreGame } from "@/components/explore/explore-game"

export const metadata: Metadata = {
  title: "Explore Mode — Mike Degany",
  description: "Drive a robot through Mike Degany's portfolio: lidar mapping, a live pose graph with loop closures, and autonomous navigation.",
}

export default function ExplorePage() {
  return <ExploreGame />
}
