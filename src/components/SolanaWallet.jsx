

"use client"

import { mnemonicToSeed } from "bip39"
import { useEffect, useState } from "react"
import { derivePath } from "ed25519-hd-key"
import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import nacl from "tweetnacl"
import bs58 from "bs58"
import { Buffer } from "buffer"
import { PlusCircleIcon, RefreshIcon } from "./Icons"
import WalletCard from "./WalletCard"

export default function SolanaWallet({ mnemonic, setError, setSuccess }) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedWallets = localStorage.getItem("solWallets")
    const wallets = savedWallets ? JSON.parse(savedWallets) : []
    return wallets.length > 0 ? Math.max(...wallets.map((w) => w.index)) + 1 : 0
  })
  const [wallets, setWallets] = useState(() => {
    const savedWallets = localStorage.getItem("solWallets")
    return savedWallets ? JSON.parse(savedWallets) : []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAirdropping, setIsAirdropping] = useState(false)
  const [airdropWallet, setAirdropWallet] = useState(null)
  const [copiedAddress, setCopiedAddress] = useState(null)
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(null)
  const [showPrivateKey, setShowPrivateKey] = useState({})

  const connection = new Connection(clusterApiUrl("devnet"))

  useEffect(() => {
    localStorage.setItem("solWallets", JSON.stringify(wallets))
  }, [wallets])

  async function getSolBalance(publicKey) {
    try {
      const balance = await connection.getBalance(publicKey)
      return balance
    } catch (error) {
      console.error("Error fetching SOL balance:", error)
      return 0
    }
  }

  async function generateSolanaWallet() {
    setIsLoading(true)
    try {
      const seedBuffer = await mnemonicToSeed(mnemonic)
      const seedHex = Buffer.from(seedBuffer).toString("hex")
      const path = `m/44'/501'/${currentIndex}'/0'`
      const derivedSeed = derivePath(path, seedHex).key
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
      const keypair = Keypair.fromSecretKey(secret)
      const privateKey = bs58.encode(keypair.secretKey)
      const publicKey = keypair.publicKey

      // Getting initial balance
      const balance = await getSolBalance(publicKey)
      const solBalance = balance / LAMPORTS_PER_SOL

      setWallets((prevWallets) => [
        ...prevWallets,
        {
          publicKey: publicKey.toBase58(),
          privateKey,
          balance: solBalance,
          index: currentIndex,
          network: "Devnet",
          lastUpdated: new Date().toISOString(),
        },
      ])

      setCurrentIndex((c) => c + 1)
      setSuccess("Solana wallet created successfully!")
    } catch (err) {
      console.error("Error while creating solana wallet:", err)
      setError("Failed to create Solana wallet: " + err.message)
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
          const publicKeyObj = new PublicKey(wallet.publicKey)
          const balance = await getSolBalance(publicKeyObj)
          const solBalance = balance / LAMPORTS_PER_SOL

          return {
            ...wallet,
            balance: solBalance,
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

  async function requestAirdrop(publicKey, index) {
    setIsAirdropping(true)
    setAirdropWallet(publicKey)
    try {
      const publicKeyObj = new PublicKey(publicKey)
      const signature = await connection.requestAirdrop(publicKeyObj, LAMPORTS_PER_SOL)

      await connection.confirmTransaction(signature)

      // Update the balance after airdrop
      const balance = await getSolBalance(publicKeyObj)
      const solBalance = balance / LAMPORTS_PER_SOL

      setWallets(
        wallets.map((wallet, i) =>
          wallet.publicKey === publicKey
            ? { ...wallet, balance: solBalance, lastUpdated: new Date().toISOString() }
            : wallet,
        ),
      )

      setSuccess("Airdrop of 1 SOL successful!")
    } catch (err) {
      console.error("Error requesting airdrop:", err)
      setError("Failed to request airdrop: " + err.message)
    } finally {
      setIsAirdropping(false)
      setAirdropWallet(null)
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
          } btn-purple flex items-center gap-2`}
          onClick={generateSolanaWallet}
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
              Add Solana Wallet
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
              type="solana"
              wallet={wallet}
              onCopy={() => copyAddress(wallet.publicKey)}
              onRemove={() => removeWallet(index)}
              isCopied={copiedAddress === wallet.publicKey}
              onAirdrop={() => requestAirdrop(wallet.publicKey, index)}
              isAirdropping={isAirdropping && airdropWallet === wallet.publicKey}
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
          <h3 className="text-xl font-semibold mb-2 text-primary">No Solana Wallets</h3>
          <p className="text-secondary mb-4">Click the "Add Solana Wallet" button to create your first wallet.</p>
        </div>
      )}
    </div>
  )
}

