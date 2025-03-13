
"use client"

import { useState, useEffect } from "react"
import { mnemonicToSeed } from "bip39"
import { Wallet, HDNodeWallet } from "ethers"
import { Network, Alchemy } from "alchemy-sdk"
import { PlusCircleIcon, RefreshIcon } from "./Icons"
import WalletCard from "./WalletCard"

const settings = {
  apiKey: import.meta.env.API_KEY || "demo", // Replace with your Alchemy API Key
  network: Network.ETH_SEPOLIA, // Replace with your network
}

const alchemy = new Alchemy(settings)

async function getEthBalance({ publicKey }) {
  try {
    const balance = await alchemy.core.getBalance(publicKey)
    return balance
  } catch (error) {
    console.error("Error fetching ETH balance:", error)
    return "0"
  }
}

export default function EthWallet({ mnemonic, setError, setSuccess }) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedWallets = localStorage.getItem("ethWallets")
    const wallets = savedWallets ? JSON.parse(savedWallets) : []
    return wallets.length > 0 ? Math.max(...wallets.map((w) => w.index)) + 1 : 0
  })
  const [wallets, setWallets] = useState(() => {
    const savedWallets = localStorage.getItem("ethWallets")
    return savedWallets ? JSON.parse(savedWallets) : []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(null)
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(null)
  const [showPrivateKey, setShowPrivateKey] = useState({})

  useEffect(() => {
    localStorage.setItem("ethWallets", JSON.stringify(wallets))
  }, [wallets])

  async function addEthereumWallet() {
    setIsLoading(true)
    try {
      const seed = await mnemonicToSeed(mnemonic)
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`
      const hdNode = HDNodeWallet.fromSeed(seed)
      const child = hdNode.derivePath(derivationPath)
      const privateKey = child.privateKey
      const wallet = new Wallet(privateKey)

      const publicKey = wallet.address

      const balance = await getEthBalance({ publicKey })
      const balanceInEth = Number.parseFloat(balance.toString()) / 1e18

      setWallets((prevWallets) => [
        ...prevWallets,
        {
          publicKey,
          privateKey,
          balance: balanceInEth,
          index: currentIndex,
          network: "Sepolia Testnet",
          lastUpdated: new Date().toISOString(),
        },
      ])

      setCurrentIndex((c) => c + 1)
      setSuccess("Ethereum wallet created successfully!")
    } catch (err) {
      console.error("Error while creating ethereum wallet:", err)
      setError("Failed to create Ethereum wallet: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function refreshBalances() {
    if (wallets.length === 0) return

    setIsRefreshing(true)
    try {
      const updatedWallets = await Promise.all(
        wallets.map(async (wallet) => {
          const balance = await getEthBalance({ publicKey: wallet.publicKey })
          const balanceInEth = Number.parseFloat(balance.toString()) / 1e18

          return {
            ...wallet,
            balance: balanceInEth,
            lastUpdated: new Date().toISOString(),
          }
        }),
      )

      setWallets(updatedWallets)
      setSuccess("Balances refreshed successfully!")
    } catch (err) {
      console.error("Error refreshing balances:", err)
      setError("Failed to refresh balances: " + err.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  function copyAddress(address) {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  function copyPrivateKey(privateKey) {
    navigator.clipboard.writeText(privateKey)
    setCopiedPrivateKey(privateKey)
    setTimeout(() => setCopiedPrivateKey(null), 2000)
  }

  function togglePrivateKey(publicKey) {
    setShowPrivateKey((prev) => ({
      ...prev,
      [publicKey]: !prev[publicKey],
    }))
  }

  function removeWallet(index) {
    if (window.confirm("Are you sure you want to remove this wallet?")) {
      setWallets(wallets.filter((_, i) => i !== index))
      setSuccess("Wallet removed successfully!")
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          className={`px-5 py-3 rounded-lg font-medium transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          } btn-blue flex items-center gap-2`}
          onClick={addEthereumWallet}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <PlusCircleIcon className="w-5 h-5" />
              Add Ethereum Wallet
            </>
          )}
        </button>

        {wallets.length > 0 && (
          <button
            className={`px-5 py-3 rounded-lg font-medium transition-all ${
              isRefreshing ? "opacity-70 cursor-not-allowed" : ""
            } btn-green flex items-center gap-2`}
            onClick={refreshBalances}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <RefreshIcon className="w-5 h-5" />
                Refresh Balances
              </>
            )}
          </button>
        )}
      </div>

      {wallets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {wallets.map((wallet, index) => (
            <WalletCard
              key={wallet.publicKey}
              type="ethereum"
              wallet={wallet}
              onCopy={() => copyAddress(wallet.publicKey)}
              onRemove={() => removeWallet(index)}
              isCopied={copiedAddress === wallet.publicKey}
              showPrivateKey={showPrivateKey[wallet.publicKey]}
              togglePrivateKey={() => togglePrivateKey(wallet.publicKey)}
              copyPrivateKey={() => copyPrivateKey(wallet.privateKey)}
              isPrivateKeyCopied={copiedPrivateKey === wallet.privateKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-tertiary rounded-xl border border-theme">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="text-xl font-semibold mb-2 text-primary">No Ethereum Wallets</h3>
          <p className="text-secondary mb-4">Click the "Add Ethereum Wallet" button to create your first wallet.</p>
        </div>
      )}
    </div>
  )
}

