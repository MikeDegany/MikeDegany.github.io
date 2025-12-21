import Image from "next/image"
import { LinkedInLogo3D, GitHubLogo3D } from "@/components/social-logos"

export function Hero() {
  return (
    <section id="home" className="pt-16">
      <div className="w-full">
        <div className="flex flex-col md:grid md:grid-cols-2 md:min-h-[600px]">
          {/* Image - appears first on mobile, left side on desktop */}
          <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 overflow-hidden h-[300px] md:h-auto">
            <Image src="/HomeImage.png" alt="Mike Degany with robot" fill className="object-cover object-top" />
            {/* Subtle top gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
            {/* Transparent triangle effect at bottom - narrow diagonal */}
            <svg className="absolute bottom-0 left-0 w-full h-20 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(0,0,0,0)', stopOpacity: 0 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(0,0,0,0.5)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <polygon points="0,40 100,0 100,100 0,100" fill="url(#triangleGradient)" />
            </svg>
          </div>

          {/* Content - appears second on mobile, right side on desktop */}
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-8 py-12 md:p-12">
            <div className="text-center text-white space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide inline-block text-3d-float transition-transform duration-300 hover:scale-110"
                  style={{
                    textShadow:
                      "0 2px 0 rgba(0,0,0,0.35), 0 6px 12px rgba(0,0,0,0.4), 0 14px 28px rgba(0,0,0,0.25)",
                    transform: "perspective(600px) rotateX(4deg)",
                    color: "#ffffff",
                  }}
                >
                  Mike Degany
                </h1>
                <div className="space-y-1.5 md:space-y-2">
                  <p
                    className="text-base sm:text-lg md:text-xl font-semibold transition-transform duration-300"
                    style={{
                      textShadow:
                        "0 1px 0 rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.35)",
                      transform: "perspective(500px) rotateX(3deg)",
                    }}
                  >
                    Robotics Software Engineer | Mechatronics Engineer 
                  </p>
                  <p
                    className="text-base sm:text-lg md:text-xl font-semibold transition-transform duration-300"
                    style={{
                      textShadow:
                        "0 1px 0 rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.35)",
                      transform: "perspective(500px) rotateX(3deg)",
                    }}
                  >
                    Computer Science and Engineering PhD Candidate 
                  </p>
                  <p
                    className="text-base sm:text-lg md:text-xl font-semibold transition-transform duration-300"
                    style={{
                      textShadow:
                        "0 1px 0 rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.35)",
                      transform: "perspective(500px) rotateX(3deg)",
                    }}
                  >
                    Autonomous Vehicles | SLAM & 3D Perception
                  </p>
                  <p
                    className="text-base sm:text-lg md:text-xl font-semibold transition-transform duration-300"
                    style={{
                      textShadow:
                        "0 1px 0 rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.35)",
                      transform: "perspective(500px) rotateX(3deg)",
                    }}
                  >
                    Modern C++ | Python
                  </p>

                </div>
              </div>

              <div className="flex gap-6 md:gap-8 justify-center pt-2 md:pt-4 items-center relative z-10">
                <LinkedInLogo3D />
                <GitHubLogo3D />
              </div>
            </div>

            {/* Diagonal overlay */}
            <svg className="absolute bottom-0 left-0 w-full h-32 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 100,50 100,100" className="fill-white dark:fill-background" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
