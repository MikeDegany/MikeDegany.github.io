"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export function Header() {
  const [activeSection, setActiveSection] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu on Escape, or if the viewport grows to desktop width
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    const desktop = window.matchMedia("(min-width: 768px)")
    const onResize = () => desktop.matches && setMenuOpen(false)
    window.addEventListener("keydown", onKey)
    desktop.addEventListener("change", onResize)
    return () => {
      window.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", onResize)
    }
  }, [menuOpen])

  const navItems = [
    { name: "HOME", id: "home" },
    { name: "ABOUT ME", id: "about" },
    { name: "PROJECTS", id: "projects" },
    { name: "SKILLS", id: "skills" },
    { name: "EDUCATION", id: "education" },
    { name: "INTERESTS", id: "interests" },
    { name: "CONTACT", id: "contact" },
    { name: "EXPLORE", id: "explore", href: "/explore" },
  ]

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
                href={item.href ?? `/#${item.id}`}
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

          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <button
              type="button"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-md text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted transition-colors"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 dark:border-border bg-white dark:bg-background shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="container mx-auto px-4 py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href ?? `/#${item.id}`}
                className={`py-3 text-sm font-medium border-b last:border-b-0 border-gray-100 dark:border-border transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeSection === item.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-foreground"
                }`}
                onClick={() => {
                  setActiveSection(item.id)
                  setMenuOpen(false)
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
