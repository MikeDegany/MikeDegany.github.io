import Image from "next/image"

export function AboutMe() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">ABOUT ME</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-6 text-gray-700 dark:text-foreground/80 leading-relaxed">
            <p>
              - I am a Robotics Engineer specializing in autonomous systems, from perception to planning and control. My
              Ph.D. work focuses on building scalable 3D mapping and robust navigation solutions for autonomous
              vehicles.
            </p>
            <p>
              - My research philosophy is built on one core principle: theoretical concepts must be proven with hands-on
              application. I've been fortunate to work in advanced labs where I moved my ideas from theory to reality,
              developing, testing, and deploying systems on actual robotic platforms. This practical experience is what
              I believe is necessary to push the boundaries of what's possible in robotics.
            </p>
            <p>
              - I have hands-on experience deploying code on full-scale autonomous vehicles, developing novel sensor
              fusion algorithms that reduced odometry error by 72%, and architecting a multi-robot mapping system that
              won a Best Paper Award.
            </p>
            <p>
              - Mechatronics engineer with wide knowledge about different fields such as Electronics, Robotics, Control
              engineering, Computer science, Mechanics, and System engineering graduated from Amirkabir University of
              Technology (Tehran Polytechnic) for MSc.
            </p>
            <p>
              - A roboticist with a keen interest in Mobile Robots. Worked in the Mapping and Motion Planning area for
              mobile robots applications and introduced a novel approach for real-time motion planning in dynamic
              environments.
            </p>
            <p>
              -Electronic Engineer with specialization in Embedded Real-Time Systems, highly experienced with computer
              coding for different types of microcontrollers in multiple languages including Assembly, C/C++,... for
              both commercial and research projects.
            </p>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-[600px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-gray-100 dark:ring-border hover:ring-blue-200 dark:hover:ring-blue-400 transition-all duration-300 hover:shadow-3xl">
              <Image
                src="/about.jpeg"
                alt="Mike Degany in autonomous vehicle"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
