


"use client"

import { useState } from "react"
import { validateMnemonic } from "bip39"

export default function ImportWalletModal({ isOpen, onClose, onImport }) {
  const [phrase, setPhrase] = useState("")
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate mnemonic
    if (!phrase.trim()) {
      setError("Please enter a seed phrase")
      return
    }

    // Check if it's a valid BIP39 mnemonic
    if (!validateMnemonic(phrase.trim())) {
      setError("Invalid seed phrase. Please enter a valid BIP39 mnemonic.")
      return
    }

    onImport(phrase.trim())
    setPhrase("")
    setError("")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 card-header">
          <h2 className="text-2xl font-bold text-primary">Import Wallet</h2>
          <p className="text-secondary text-sm mt-1">Enter your seed phrase to import an existing wallet</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="seed-phrase" className="block text-sm font-medium text-secondary mb-2">
              Seed Phrase
            </label>
            <textarea
              id="seed-phrase"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Enter your 12 or 24 word seed phrase, separated by spaces"
              className="w-full p-3 border border-theme rounded-md bg-tertiary text-primary focus:ring-2 focus:ring-blue-color focus:border-transparent"
              rows={4}
            />
            {error && <p className="mt-2 text-sm text-red-color">{error}</p>}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-theme rounded-md text-secondary hover:bg-tertiary transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 btn-blue rounded-md">
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

