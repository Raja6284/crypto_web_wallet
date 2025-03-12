import { mnemonicToSeed } from "bip39"
import { useEffect, useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Connection,clusterApiUrl } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Buffer } from "buffer";

export  default function SolanaWallet({mnemonic}){

    const [currentIndex,setCurrentIndex] = useState(0)
    //const [publicKeys,setPublicKeys] = useState([])
    const [wallets,setWallets] = useState([])

    const connection =  new Connection(clusterApiUrl("devnet"));

    async function getSolBalance(publicKey){
        const balance = await connection.getBalance(publicKey)
        return balance
    }


    async  function GenerateSolanaWallet(){
        try{

            //const seed = mnemonicToSeed(mnemonic)
            const seedBuffer = await mnemonicToSeed(mnemonic);
            const seedHex = Buffer.from(seedBuffer).toString('hex');
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seedHex).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            const privateKey = bs58.encode(keypair.secretKey)
            // const a = bs58.decode(privateKey)
            // console.log(a.length)
            const publicKey = keypair.publicKey
            //getting initial balance 
            const balance = await getSolBalance(publicKey)
            const solBalance = balance/LAMPORTS_PER_SOL

            //thsi will give stale closure problem
            // setWallets([...wallets,{
            //     publicKey:publicKey.toBase58(),
            //     balance : solBalance,
            //     index: currentIndex
            // }])
    
    
            setWallets(prevWallets => [
                ...prevWallets,
                {
                    publicKey:publicKey.toBase58(),
                    balance: solBalance,
                    index: currentIndex
                }
            ]);
    
            //console.log(wallets)
            //console.log(`The private key is ${privateKey} \n The public key is ${publicKey}`)
            //console.log(`public key is : ${wallets.publicKey} and balance is ${wallets.balance}` )
            setCurrentIndex(c => c + 1);
            //setPublicKeys([...publicKeys, keypair.publicKey]);
        }catch(err){
            console.log('Error while creatin solana wallet : ' + err)
        }


    }

    return(
        <div className="mt-4">
            <button className="text-xl font-bold  rounded bg-gray-500 cursor-pointer "
            onClick={GenerateSolanaWallet}
            >
                Add Solana Wallet
            </button>

            <div className="mt-2 ">
                {wallets.map((p)=><div key={p.publicKey}>{p.publicKey} and  {p.balance}</div>)}
            </div>
            
        </div>
    )
}