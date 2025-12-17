import Link from "next/link"

export function Footer() {
  const navItems = [
    { name: "HOME", id: "home" },
    { name: "ABOUT ME", id: "about" },
    { name: "PROJECTS", id: "projects" },
    { name: "SKILLS", id: "skills" },
    { name: "EDUCATION", id: "education" },
    { name: "INTERESTS", id: "interests" },
    { name: "CONTACT", id: "contact" },
  ]

  return (
    <footer className="bg-gray-900 dark:bg-background border-t border-gray-800 dark:border-border text-gray-400 dark:text-foreground/70 py-8">
      <div className="container mx-auto px-4">
        <nav className="flex flex-wrap justify-center gap-6 mb-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              className="text-sm hover:text-white dark:hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="text-center text-sm">
          <p>&copy; 2025 Mike Degany. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
