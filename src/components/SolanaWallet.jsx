import { mnemonicToSeed } from "bip39"
import { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export  default function SolanaWallet({mnemonic}){

    const [currentIndex,setCurrentIndex] = useState(0)
    const [publicKeys,setPublicKeys] = useState([])


    function GenerateSolanaWallet(){
        const seed = mnemonicToSeed(mnemonic)
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, keypair.publicKey]);
    }

    return(
        <div className="mt-4">
            <button className="text-xl font-bold  rounded bg-gray-500 cursor-pointer "
            onClick={GenerateSolanaWallet}
            >
                Add Solana Wallet
            </button>

            <div className="mt-2 ">
                {publicKeys.map((p)=><div key={p}>{p.toBase58()}</div>)}
            </div>
            
        </div>
    )
}