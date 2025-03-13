

export default function Footer() {
    return (
      <footer className="bg-primary border-t border-theme py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="text-3xl mr-2">💰</div>
                <div>
                  <h2 className="text-xl font-bold text-primary">CryptoVault</h2>
                  <p className="text-secondary text-sm">Secure Multi-Chain Wallet</p>
                </div>
              </div>
            </div>
  
            <div className="text-center md:text-right">
              <p className="text-secondary text-sm mb-2">This wallet is for educational purposes only.</p>
              <p className="text-tertiary text-xs">© {new Date().getFullYear()} Raja Kumar . All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  