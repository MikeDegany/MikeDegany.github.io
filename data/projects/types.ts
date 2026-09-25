import { ReactNode } from "react"

export interface ProjectContent {
  title: string
  body: string | ReactNode
  images?: string[]
  // Optional: MP4 shown in place of the featured image (images[0] becomes its poster)
  featuredVideo?: string
  videos?: {
    url: string
    title?: string
  }[]
  // Optional: Custom component for complete layout control
  customComponent?: ReactNode
}

