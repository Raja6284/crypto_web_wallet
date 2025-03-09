import { generateMnemonic } from "bip39"
import { useState } from "react"
import SolanaWallet from "./components/SolanaWallet"
import EthWallet from "./components/EthWallet"

function App() {

  const [mnemonic, setMnemonic] = useState([])
  let [mn, setMn] = useState("")

  async function GenerateMnemonic() {
    const mn = await generateMnemonic() //returns a space seperated string of words, not an array
    setMn(mn)
    setMnemonic(mn.split(" "))
  }

  for (let i = 0; i < mnemonic.length; i++) {
    console.log(mnemonic[i])
  }

  return (
    <div className="bg-slate-500 min-h-screen flex flex-col items-center  p-4">

      <div className=" text-2xl font-bold">
        <button
          className="border bg-purple-400 rounded px-4 py-2 m-2 transition-all hover:bg-purple-500"
          onClick={GenerateMnemonic}
        >
          Generate mnemonic
        </button>
      </div>

      {
        mnemonic.length > 0 &&
        <div className="mt-4 flex flex-wrap justify-center gap-2 border p-4 rounded bg-gray-400 w-full max-w-3xl ">
          {mnemonic.map((mn) =>
            <div key={mn} className="border rounded px-3 py-2 bg-black text-white text-center w-full sm:w-auto ">{mn}
            </div>)}

          <button
            className="border bg-purple-400 rounded px-4 py-2 m-2 transition-all hover:bg-purple-500"
            onClick={() => navigator.clipboard.writeText(mnemonic)}
          >
            Copy Phrase
          </button>
        </div>
      }

      <div className="flex gap-4">
      <div>
      {
        mnemonic.length > 0 && <SolanaWallet mnemonic={mn} />
      }
      </div>
      

      <div>
      {
        mnemonic.length > 0 && <EthWallet mnemonic={mn} />
      }
      </div>
      
      </div>
      

    </div>
  )
}

export default App
