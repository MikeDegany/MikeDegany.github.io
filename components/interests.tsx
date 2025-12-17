import Image from "next/image"

const interests = [
  {
    title: "Robotics",
    description: "Design, simulate, build robotic systems",
    image: "/robotmike.jpg",
  },
  {
    title: "Connected Autonomous Vehicles",
    description: "Perception, Planning and Control for self-driving cars",
    image: "/CAV.png",
  },
  {
    title: "Electronics",
    description: "Electronic circuits, Embedded systems, SCBs, etc.",
    image: "/electronics.png",
  },
]

export function Interests() {
  return (
    <section id="interests" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">INTERESTS</h2>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {interests.map((interest, index) => (
            <div key={index} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                <Image src={interest.image || "/placeholder.svg"} alt={interest.title} fill className="object-cover" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-foreground mb-2">{interest.title}</h3>
              <p className="text-gray-600 dark:text-foreground/70">{interest.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
