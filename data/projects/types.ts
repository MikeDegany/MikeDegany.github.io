import { ReactNode } from "react"

export interface ProjectContent {
  title: string
  body: string | ReactNode
  images?: string[]
  videos?: {
    url: string
    title?: string
  }[]
}

