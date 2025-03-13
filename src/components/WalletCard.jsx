

"use client"

import { formatDistanceToNow } from "date-fns"
import { ClipboardIcon, CheckCircleIcon, TrashIcon, CurrencyDollarIcon, ExternalLinkIcon, KeyIcon } from "./Icons"

export default function WalletCard({
  type,
  wallet,
  onCopy,
  onRemove,
  isCopied,
  onAirdrop,
  isAirdropping,
  showPrivateKey,
  togglePrivateKey,
  copyPrivateKey,
  isPrivateKeyCopied,
}) {
  const isEthereum = type === "ethereum"
  const isSolana = type === "solana"

  const getExplorerUrl = () => {
    if (isEthereum) {
      return `https://sepolia.etherscan.io/address/${wallet.publicKey}`
    } else if (isSolana) {
      return `https://explorer.solana.com/address/${wallet.publicKey}?cluster=devnet`
    }
    return "#"
  }

  const formatBalance = (balance) => {
    return Number.parseFloat(balance).toFixed(6)
  }

  const getLastUpdated = () => {
    if (!wallet.lastUpdated) return "Never"
    return formatDistanceToNow(new Date(wallet.lastUpdated), { addSuffix: true })
  }

  return (
    <div
      className={`card ${isEthereum ? "eth-card" : "sol-card"}`}
      style={{
        borderColor: isEthereum ? "var(--blue-color)" : "var(--purple-color)",
        backgroundColor: isEthereum ? "rgba(59, 130, 246, 0.05)" : "rgba(139, 92, 246, 0.05)",
      }}
    >
      <div
        className="p-4 card-header"
        style={{
          backgroundColor: isEthereum ? "rgba(59, 130, 246, 0.1)" : "rgba(139, 92, 246, 0.1)",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-primary">
              {isEthereum ? "Ethereum" : "Solana"} Wallet #{wallet.index + 1}
            </h3>
            <div className="text-sm text-secondary">{wallet.network}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCopy}
              className="p-2 rounded-full hover:bg-tertiary transition-colors"
              title="Copy Address"
            >
              {isCopied ? (
                <CheckCircleIcon className="w-5 h-5 text-green-color" />
              ) : (
                <ClipboardIcon className="w-5 h-5 text-secondary" />
              )}
            </button>
            <a
              href={getExplorerUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-tertiary transition-colors"
              title="View on Explorer"
            >
              <ExternalLinkIcon className="w-5 h-5 text-secondary" />
            </a>
            <button
              onClick={togglePrivateKey}
              className="p-2 rounded-full hover:bg-tertiary transition-colors"
              title={showPrivateKey ? "Hide Private Key" : "Show Private Key"}
            >
              <KeyIcon className="w-5 h-5 text-secondary" />
            </button>
            <button
              onClick={onRemove}
              className="p-2 rounded-full hover:bg-red-color hover:bg-opacity-10 transition-colors"
              title="Remove Wallet"
            >
              <TrashIcon className="w-5 h-5 text-secondary hover:text-red-color" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="text-sm text-secondary mb-1">Address</div>
          <div className="font-mono text-sm bg-tertiary p-3 rounded-lg break-all">{wallet.publicKey}</div>
        </div>

        {showPrivateKey && (
          <div className="mb-4 relative">
            <div className="text-sm text-secondary mb-1 flex items-center">
              <span className="mr-2">Private Key</span>
              <span className="bg-red-color bg-opacity-10 text-red-color text-xs px-2 py-0.5 rounded-full">
                SENSITIVE
              </span>
            </div>
            <div className="font-mono text-sm bg-tertiary p-3 rounded-lg break-all border border-red-color">
              {wallet.privateKey}
            </div>
            <button
              onClick={copyPrivateKey}
              className="absolute right-3 top-8 p-1 rounded-full hover:bg-tertiary transition-colors"
              title="Copy Private Key"
            >
              {isPrivateKeyCopied ? (
                <CheckCircleIcon className="w-5 h-5 text-green-color" />
              ) : (
                <ClipboardIcon className="w-5 h-5 text-secondary" />
              )}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-secondary mb-1">Balance</div>
            <div className="text-2xl font-bold text-primary">
              {formatBalance(wallet.balance)} {isEthereum ? "ETH" : "SOL"}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary mb-1">Last Updated</div>
            <div className="text-sm text-primary">{getLastUpdated()}</div>
          </div>
        </div>

        {isSolana && (
          <button
            onClick={onAirdrop}
            disabled={isAirdropping}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
              isAirdropping ? "opacity-70 cursor-not-allowed" : ""
            } btn-amber flex items-center justify-center gap-2`}
          >
            {isAirdropping ? (
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
                Requesting...
              </>
            ) : (
              <>
                <CurrencyDollarIcon className="w-5 h-5" />
                Request 1 SOL Airdrop
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}



