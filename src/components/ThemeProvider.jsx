

"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("isDarkTheme")

    if (savedTheme !== null) {
      return savedTheme === "true"
    }

    // Otherwise, check user's system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return true
    }

    // Default to light theme
    return false
  })

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem("isDarkTheme", isDark.toString())

    // Update document class
    if (isDark) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  const value = {
    isDark,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

