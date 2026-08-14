"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reserve the slot before hydration so the header doesn't shift when it appears.
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
        theme === "dark"
          ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
          : "bg-slate-800 hover:bg-slate-900 text-yellow-300"
      }`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        boxShadow:
          theme === "dark"
            ? "0 2px 10px rgba(250, 204, 21, 0.35)"
            : "0 2px 10px rgba(30, 41, 59, 0.35)",
      }}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
