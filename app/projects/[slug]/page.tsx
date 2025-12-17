import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/data/projects-list"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { getProjectContent } from "@/data/projects"
import { RelatedProjects } from "@/components/related-projects"

// Generate static params for all projects
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js 16, params is a Promise
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  // Get project content from separate content files
  const projectContent = getProjectContent(slug)

  // Use content title if available, otherwise fall back to project title
  const displayTitle = projectContent?.title || project.title

  // Get other projects for the carousel (exclude current project)
  const otherProjects = projects.filter((p) => p.slug !== slug)

  return (
    <div className="min-h-screen bg-[#fef9e7] dark:bg-background transition-colors">
      <Header />
      <DarkModeToggle alwaysVisible />

      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link href="/#projects" className="inline-block mb-12">
            <Button variant="ghost" className="text-gray-700 dark:text-foreground hover:text-gray-900 dark:hover:text-foreground/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>

          {/* Title Section - Wider width */}
          <header className="mb-12 max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-foreground leading-normal mb-6">
              {displayTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-foreground/80 leading-relaxed font-light max-w-5xl">
              {project.description}
            </p>
          </header>

          {/* Featured Image from project or content - Same width as body */}
          {(projectContent?.images?.[0] || project.image) && (
            <div className="mb-16 max-w-3xl mx-auto">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
                <Image
                  src={projectContent?.images?.[0] || project.image || "/placeholder.svg"}
                  alt={displayTitle}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Additional Images from content */}
          {projectContent?.images && projectContent.images.length > 1 && (
            <div className="mb-16 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectContent.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl"
                  >
                    <Image
                      src={image}
                      alt={`${displayTitle} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Body - Narrower width for readability */}
          <article className="max-w-3xl mx-auto mb-16">
            <div className="prose prose-lg max-w-none text-gray-800 dark:text-foreground/90 text-base sm:text-lg">
              {projectContent?.body ? (
                <div className="leading-relaxed">{projectContent.body}</div>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 mt-12">Project Overview</h2>
                  <p className="leading-relaxed mb-12 text-base sm:text-lg">
                    Detailed information about this project will be added soon. This page demonstrates the structure for
                    presenting project details, including text descriptions, images, and embedded videos.
                  </p>
                </>
              )}
            </div>
          </article>

          {/* Videos from content - At the end, same width as body */}
          {projectContent?.videos && projectContent.videos.length > 0 && (
            <div className="max-w-3xl mx-auto mb-16">
              <div className="space-y-8">
                {projectContent.videos.map((video, index) => (
                  <div key={index} className="mb-8">
                    {video.title && (
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-foreground mb-4">
                        {video.title}
                      </h3>
                    )}
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={video.url}
                        title={video.title || displayTitle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback: YouTube Video from project if no content videos */}
          {!projectContent?.videos && project.youtubeVideo && (
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 dark:bg-gray-800 shadow-xl">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={project.youtubeVideo}
                  title={displayTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Related Projects Carousel */}
          {otherProjects.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-200 dark:border-border">
              <RelatedProjects currentSlug={slug} projects={otherProjects} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
