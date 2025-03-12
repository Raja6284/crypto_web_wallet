import { generateMnemonic } from "bip39"
import { useEffect, useState } from "react"
import SolanaWallet from "./components/SolanaWallet"
import EthWallet from "./components/EthWallet"

function App() {

  const [mnemonic, setMnemonic] = useState("")

  const [error,setError] = useState(null)
  
  let mnemonicArr = []
  mnemonicArr = mnemonic.split(" ")

  async function GenerateMnemonic() {
    try{
      const mn = await generateMnemonic() //returns a space seperated string of words, not an array
      setMnemonic(mn)
      setError(null)
    }catch(err){
      setError("Failed to generat mnemonic : " + err.message)
    }
  }

  useEffect(()=>{
    //cleraring error afteer after 5 seconds, for a better clean ui
    if(error){
      const timer = setTimeout(()=>setError(null),5*1000)
      return ()=>clearInterval(timer)
    }
  },[error])

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
          {
          mnemonicArr.map((mn) =>
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
        mnemonic.length > 0 && <SolanaWallet mnemonic={mnemonic} />
      }
      </div>
      

      <div>
      {
        mnemonic.length > 0 && <EthWallet mnemonic={mnemonic} />
      }
      </div>
      
      </div>
      

    </div>
  )
}

export default App
