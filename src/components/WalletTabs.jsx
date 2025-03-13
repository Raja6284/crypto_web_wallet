

"use client"

export default function WalletTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex mb-6">
      <button
        className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
          activeTab === "ethereum"
            ? "bg-primary text-blue-color border-t border-l border-r border-theme"
            : "bg-tertiary text-secondary hover:text-primary"
        }`}
        onClick={() => setActiveTab("ethereum")}
      >
        <div className="flex items-center gap-2">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025" alt="Ethereum" className="w-5 h-5" />
          Ethereum
        </div>
      </button>

      <button
        className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
          activeTab === "solana"
            ? "bg-primary text-purple-color border-t border-l border-r border-theme"
            : "bg-tertiary text-secondary hover:text-primary"
        }`}
        onClick={() => setActiveTab("solana")}
      >
        <div className="flex items-center gap-2">
          <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=025" alt="Solana" className="w-5 h-5" />
          Solana
        </div>
      </button>
    </div>
  )
}



