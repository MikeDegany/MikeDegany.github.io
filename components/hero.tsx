import { LinkedInLogo3D, GitHubLogo3D } from "@/components/social-logos"

export function Hero() {
  return (
    <section id="home" className="pt-16">
      <div className="w-full">
        <div className="flex flex-col md:grid md:grid-cols-2 md:min-h-[360px]">
          {/* Text panel */}
          <div className="relative isolate overflow-hidden flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0a1830] via-[#0f2744] to-[#173a63] p-8 py-12 md:p-12 space-y-4 md:space-y-6 text-white">
            {/* Decorative glow accents */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden />

            <div className="relative z-10 space-y-2 md:space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide transition-transform duration-300 hover:scale-105">
                Mike Degany
              </h1>
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-base sm:text-lg md:text-xl font-semibold text-blue-100/80 transition-colors duration-300 hover:text-white">
                  Robotics Software Engineer | Mechatronics Engineer
                </p>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-blue-100/80 transition-colors duration-300 hover:text-white">
                  Computer Science and Engineering PhD Candidate
                </p>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-blue-100/80 transition-colors duration-300 hover:text-white">
                  Autonomous Vehicles | SLAM & 3D Perception
                </p>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-blue-100/80 transition-colors duration-300 hover:text-white">
                  Modern C++ | Python
                </p>
              </div>
            </div>

            <div className="relative z-10 flex gap-6 md:gap-8 items-center justify-center">
              <LinkedInLogo3D />
              <GitHubLogo3D />
            </div>
          </div>

          {/* Video panel */}
          <div className="group relative min-h-[200px] md:min-h-0 overflow-hidden">
            <video
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
            >
              <source src="/videos/hero-jackals.mp4" type="video/mp4" />
            </video>
            {/* Cinematic transparent black tint over the whole video */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden />
            {/* Solid opaque diagonal cut at the bottom */}
            <svg
              className="pointer-events-none absolute bottom-0 left-0 w-full h-24 md:h-32"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <polygon points="0,100 100,55 100,100" className="fill-white dark:fill-black" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
