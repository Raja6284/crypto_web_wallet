
"use client"

import { generateMnemonic } from "bip39"
import { useEffect, useState } from "react"
import SolanaWallet from "./components/SolanaWallet"
import EthWallet from "./components/EthWallet"
import { EyeIcon, EyeSlashIcon, ClipboardIcon, ShieldCheckIcon, ImportIcon } from "./components/Icons"
import Header from "./components/Header"
import Footer from "./components/Footer"
import WalletTabs from "./components/WalletTabs"
import ThemeProvider from "./components/ThemeProvider"
import ImportWalletModal from "./components/ImportWalletModal"

function App() {
  const [mnemonic, setMnemonic] = useState(() => {
    return localStorage.getItem("mnemonic") || ""
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "ethereum"
  })
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  let mnemonicArr = []
  mnemonicArr = mnemonic.split(" ").filter((word) => word.length > 0)

  async function generateNewMnemonic() {
    setIsLoading(true)
    try {
      const mn = await generateMnemonic()
      setMnemonic(mn)
      localStorage.setItem("mnemonic", mn)
      setError(null)
      setSuccess("New seed phrase generated successfully!")
    } catch (err) {
      setError("Failed to generate mnemonic: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(mnemonic)
    setSuccess("Seed phrase copied to clipboard!")
  }

  function clearWallet() {
    if (
      window.confirm("Are you sure you want to clear your wallet? This will remove all your addresses and seed phrase.")
    ) {
      localStorage.removeItem("mnemonic")
      localStorage.removeItem("ethWallets")
      localStorage.removeItem("solWallets")
      setMnemonic("")
      setSuccess("Wallet cleared successfully!")
    }
  }

  function handleImportWallet(phrase) {
    try {
      setMnemonic(phrase)
      localStorage.setItem("mnemonic", phrase)
      setIsImportModalOpen(false)
      setSuccess("Wallet imported successfully!")
    } catch (err) {
      setError("Failed to import wallet: " + err.message)
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab)
  }, [activeTab])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-secondary">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Seed Phrase Section */}
            <section className="mb-10">
              <div className="card">
                <div className="p-6 card-header">
                  <h2 className="text-2xl font-bold text-primary mb-2">Seed Phrase Management</h2>
                  <p className="text-secondary">
                    Your seed phrase is the master key to all your wallet addresses. Keep it secure!
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <button
                      className={`px-5 py-3 rounded-lg font-medium transition-all ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      } btn-blue flex items-center gap-2`}
                      onClick={generateNewMnemonic}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <ShieldCheckIcon className="w-5 h-5" />
                          Generate New Seed Phrase
                        </>
                      )}
                    </button>

                    <button
                      className="px-5 py-3 rounded-lg font-medium btn-blue flex items-center gap-2"
                      onClick={() => setIsImportModalOpen(true)}
                    >
                      <ImportIcon className="w-5 h-5" />
                      Import Wallet
                    </button>

                    {mnemonic && (
                      <>
                        <button
                          className="px-5 py-3 rounded-lg font-medium btn-green flex items-center gap-2"
                          onClick={copyToClipboard}
                        >
                          <ClipboardIcon className="w-5 h-5" />
                          Copy Phrase
                        </button>

                        <button
                          className="px-5 py-3 rounded-lg font-medium bg-secondary hover:bg-tertiary text-primary transition-all flex items-center gap-2"
                          onClick={() => setShowMnemonic(!showMnemonic)}
                        >
                          {showMnemonic ? (
                            <>
                              <EyeSlashIcon className="w-5 h-5" />
                              Hide Phrase
                            </>
                          ) : (
                            <>
                              <EyeIcon className="w-5 h-5" />
                              Show Phrase
                            </>
                          )}
                        </button>

                        <button className="px-5 py-3 rounded-lg font-medium btn-red" onClick={clearWallet}>
                          Clear Wallet
                        </button>
                      </>
                    )}
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-color bg-opacity-10 border border-red-color rounded-lg text-red-color">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-color bg-opacity-10 border border-green-color rounded-lg text-green-color">
                      {success}
                    </div>
                  )}

                  {mnemonic && showMnemonic && (
                    <div className="relative">
                      <div className="p-6 bg-tertiary rounded-xl border border-theme relative">
                        <div className="absolute top-0 right-0 bg-red-color text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                          SENSITIVE INFORMATION
                        </div>
                        <h3 className="text-lg font-semibold mb-4 text-secondary">Your Seed Phrase</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {mnemonicArr.map((word, index) => (
                            <div
                              key={index}
                              className="bg-primary border border-theme rounded-lg p-3 text-center relative"
                            >
                              <span className="absolute top-1 left-2 text-xs text-tertiary">{index + 1}</span>
                              <span className="font-medium text-primary">{word}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-amber-color text-sm">
                          <strong>Warning:</strong> Never share your seed phrase with anyone. Anyone with access to this
                          phrase can steal your funds.
                        </div>
                      </div>
                    </div>
                  )}

                  {!mnemonic && (
                    <div className="text-center p-8 bg-tertiary rounded-xl border border-theme">
                      <div className="text-5xl mb-4">🔐</div>
                      <h3 className="text-xl font-semibold mb-2 text-primary">No Seed Phrase Generated</h3>
                      <p className="text-secondary mb-4">
                        Generate a new seed phrase or import an existing one to create wallet addresses for Ethereum and
                        Solana.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Wallets Section */}
            {mnemonic && (
              <section>
                <WalletTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setError={setError}
                  setSuccess={setSuccess}
                />

                <div className="card">
                  <div className="p-6">
                    {activeTab === "ethereum" ? (
                      <EthWallet mnemonic={mnemonic} setError={setError} setSuccess={setSuccess} />
                    ) : (
                      <SolanaWallet mnemonic={mnemonic} setError={setError} setSuccess={setSuccess} />
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />

        <ImportWalletModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportWallet}
        />
      </div>
    </ThemeProvider>
  )
}

export default App

