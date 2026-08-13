import { LinkedInLogo3D, GitHubLogo3D } from "@/components/social-logos"

export function Hero() {
  return (
    <section id="home" className="pt-16">
      <div className="w-full">
        <div className="flex flex-col">
          {/* Content */}
          <div className="relative isolate flex min-h-[420px] md:min-h-[600px] items-center justify-center overflow-hidden p-8 py-12 md:p-12">
            <video
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
            >
              <source src="/videos/hero-jackals.mp4" type="video/mp4" />
            </video>
            {/* Semi-transparent overlay between video and text (~55%) */}
            <div
              className="absolute inset-0 pointer-events-none bg-black/55"
              aria-hidden
            />
            <div className="relative z-10 text-center text-white space-y-4 md:space-y-6">
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
            <svg
              className="pointer-events-none absolute bottom-0 left-0 z-20 w-full h-32"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <polygon points="0,100 100,50 100,100" className="fill-white dark:fill-background" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
