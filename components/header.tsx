"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Share2, Network } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [activeSection, setActiveSection] = useState("home")
  const [showCopyNotification, setShowCopyNotification] = useState(false)

  const navItems = [
    { name: "HOME", id: "home" },
    { name: "ABOUT ME", id: "about" },
    { name: "PROJECTS", id: "projects" },
    { name: "SKILLS", id: "skills" },
    { name: "EDUCATION", id: "education" },
    { name: "INTERESTS", id: "interests" },
    { name: "CONTACT", id: "contact" },
  ]

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText("mikedegany.github.io")
      setShowCopyNotification(true)
      setTimeout(() => setShowCopyNotification(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-background border-b border-gray-200 dark:border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 relative">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeSection === item.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-foreground"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 relative">
            <Button variant="ghost" size="icon" onClick={handleShareClick} title="Share website">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" asChild title="Go to contact">
              <Link href="/#contact">
                <Network className="h-4 w-4" />
              </Link>
            </Button>
            {showCopyNotification && (
              <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded shadow-lg whitespace-nowrap">
                URL copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
