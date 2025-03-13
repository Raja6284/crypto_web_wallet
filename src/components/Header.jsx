

"use client"

import { useState, useEffect } from "react"
import { SunIcon, MoonIcon } from "./Icons"
import { useTheme } from "./ThemeProvider"

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-primary border-b border-theme shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-3xl mr-2">💰</div>
            <div>
              <h1 className="text-2xl font-bold text-primary">CryptoVault</h1>
              <p className="text-secondary text-sm">Multi-Chain Wallet</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-4">
              <div className="text-sm">
                <span className="bg-secondary px-3 py-1 rounded-full text-secondary">ETH: Sepolia Testnet</span>
              </div>
              <div className="text-sm">
                <span className="bg-secondary px-3 py-1 rounded-full text-secondary">SOL: Devnet</span>
              </div>
              <div className="text-sm">
                <span className="bg-secondary px-3 py-1 rounded-full text-secondary">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-secondary hover:bg-tertiary transition-colors duration-200"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-amber-color" />
              ) : (
                <MoonIcon className="w-5 h-5 text-secondary" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}


