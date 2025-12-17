import { Hero } from "@/components/hero"
import { AboutMe } from "@/components/about-me"
import { Projects } from "@/components/projects"
import { Interests } from "@/components/interests"
import { Education } from "@/components/education"
import { PuzzleSkills } from "@/components/puzzle-skills"
import { Contact } from "@/components/contact"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Header />
      <DarkModeToggle />
      <Hero />
      <AboutMe />
      <Projects />
      <PuzzleSkills />
      <Education />
      <Interests />
      <Contact />
      <Footer />
    </div>
  )
}
