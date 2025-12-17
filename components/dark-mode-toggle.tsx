"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function DarkModeToggle({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!alwaysVisible) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 100)
      }

      window.addEventListener("scroll", handleScroll)
      // Check initial scroll position
      handleScroll()
      return () => window.removeEventListener("scroll", handleScroll)
    } else {
      setIsScrolled(true)
    }
  }, [alwaysVisible])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-[100] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 ${
        theme === "dark"
          ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-yellow-400/50"
          : "bg-slate-800 hover:bg-slate-900 text-yellow-300 shadow-slate-800/50"
      } ${alwaysVisible || isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px] pointer-events-none"}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        boxShadow: theme === "dark" 
          ? "0 4px 20px rgba(250, 204, 21, 0.4), 0 0 0 1px rgba(250, 204, 21, 0.1)" 
          : "0 4px 20px rgba(30, 41, 59, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.1)"
      }}
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </button>
  )
}

