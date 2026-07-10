"use client"

import { useEffect, useState } from "react"
import { Lightbulb } from "lucide-react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    const html = document.documentElement
    if (isDark) {
      html.classList.remove("dark")
      setIsDark(false)
    } else {
      html.classList.add("dark")
      setIsDark(true)
    }
  }

  return (
    <button
      aria-label="Toggle theme"
      aria-pressed={!isDark}
      onClick={toggleTheme}
      className={[
        "h-10 w-10 rounded-full",
        "border transition-all duration-300",
        "backdrop-blur-md",
        "flex items-center justify-center",
        "hover:scale-110 focus:outline-none focus-visible:ring-2",
        !isDark
          ? "bg-white/60 border-slate-300/70 text-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.25)] focus-visible:ring-amber-400"
          : "bg-slate-900/20 border-slate-700/40 text-slate-300 shadow-[0_0_18px_rgba(59,130,246,0.25)] focus-visible:ring-blue-400",
      ].join(" ")}
      title={!isDark ? "Switch to dark theme" : "Switch to light theme"}
    >
      <Lightbulb
        className={[
          "h-5 w-5 transition-transform duration-300",
          !isDark ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] scale-105" : "opacity-90",
        ].join(" ")}
      />
    </button>
  )
}
