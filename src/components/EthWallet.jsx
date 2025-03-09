import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet,HDNodeWallet } from "ethers";


export default function EthWallet({mnemonic}){
    const [currentIndex,setCurrentIndex] = useState(0)
    const [addresses,setAddresses] = useState([])


    async function AddEthereumWallet(){
        const seed = await mnemonicToSeed(mnemonic);
                const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
                 const hdNode = HDNodeWallet.fromSeed(seed);
                 const child = hdNode.derivePath(derivationPath);
                 const privateKey = child.privateKey;
                 const wallet = new Wallet(privateKey);
                 setCurrentIndex(currentIndex + 1);
                setAddresses([...addresses, wallet.address]);
    }

    return (
        <div className="mt-4">
            <button 
            className="text-xl font-bold  rounded bg-gray-500 cursor-pointer "
            onClick={AddEthereumWallet}
            >
            Add Ethereum Wallet
            </button>

            <div className="mt-2 ">
                {addresses.map((p)=><div>{p}</div>)}
            </div>
        </div>
    )
}