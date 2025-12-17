"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/data/projects-list"

interface RelatedProjectsProps {
  currentSlug: string
  projects: Project[]
}

export function RelatedProjects({ currentSlug, projects }: RelatedProjectsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 })
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect).on("select", onSelect)
  }, [emblaApi, onSelect])

  if (projects.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Related Projects</h2>
        <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <div className="hidden md:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 justify-between pointer-events-none px-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 bg-white/90 dark:bg-background/90 hover:bg-white dark:hover:bg-background shadow-lg pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            aria-label="Previous projects"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 bg-white/90 dark:bg-background/90 hover:bg-white dark:hover:bg-background shadow-lg pointer-events-auto disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            aria-label="Next projects"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Carousel Container */}
        <div className="overflow-hidden px-4 md:px-0" ref={emblaRef}>
          <div className="flex gap-6 md:gap-8 touch-pan-x">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_35%] min-w-0 cursor-pointer group select-none"
                aria-label={`View ${project.briefTitle}`}
              >
                <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:scale-[1.03] group-active:scale-[0.97] border border-gray-100 dark:border-border">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-muted">
                    <Image
                      src={project.thumbnail || "/placeholder.svg"}
                      alt={project.briefTitle}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 35vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-foreground mb-3 group-hover:font-bold transition-all duration-300 line-clamp-2">
                      {project.briefTitle}
                    </h3>
                    <p className="text-gray-600 dark:text-foreground/70 text-sm md:text-base leading-relaxed flex-1 line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Indicators */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {projects.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 dark:bg-muted-foreground transition-all"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

