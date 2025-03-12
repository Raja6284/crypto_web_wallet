import { mnemonicToSeed } from "bip39"
import { useEffect, useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Connection,clusterApiUrl } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";


export  default function SolanaWallet({mnemonic}){

    const [currentIndex,setCurrentIndex] = useState(0)
    //const [publicKeys,setPublicKeys] = useState([])
    const [wallets,setWallets] = useState([])

    

    async function getSolBalance(publicKey){
        const connection = await new Connection(clusterApiUrl("devnet"));
        console.log(connection)
        const balance = await connection.getBalance(publicKey)
        return balance
    }

    async  function GenerateSolanaWallet(){
        const seed = mnemonicToSeed(mnemonic)
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        const privateKey = bs58.encode(keypair.secretKey)
        // const a = bs58.decode(privateKey)
        // console.log(a.length)
        const publicKey = keypair.publicKey
        //getting initial balance 
        const balance = await getSolBalance(publicKey)

        // setWallets((prevWallet)=>[...prevWallet,{
        //     publicKey:publicKey.toBase58(),
        //     balance : balance / LAMPORTS_PER_SOL,
        //     index: currentIndex
        // }])


        setWallets((prevWallets) => [
            ...prevWallets,
            {
                publicKey,
                balance: balance / LAMPORTS_PER_SOL,
                index: currentIndex
            }
        ]);

        console.log(wallets)
        //console.log(`The private key is ${privateKey} \n The public key is ${publicKey}`)
        //console.log(`public key is : ${wallets.publicKey} and balance is ${wallets.balance}` )


        setCurrentIndex(currentIndex + 1);
        //setPublicKeys([...publicKeys, keypair.publicKey]);
    }

    return(
        <div className="mt-4">
            <button className="text-xl font-bold  rounded bg-gray-500 cursor-pointer "
            onClick={GenerateSolanaWallet}
            >
                Add Solana Wallet
            </button>

            <div className="mt-2 ">
                {wallets.map((p)=><div key={p}>{p.publicKey.toBase58()} and  {p.balance}</div>)}
            </div>
            
        </div>
    )
}