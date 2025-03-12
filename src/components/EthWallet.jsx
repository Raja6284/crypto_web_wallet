import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";




// Setup: npm install alchemy-sdk
// Github: https://github.com/alchemyplatform/alchemy-sdk-js
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: import.meta.env.API_KEY , // Replace with your Alchemy API Key.
    network: Network.ETH_SEPOLIA, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Optional config object, but defaults to demo api-key and eth-mainnet.
async function getEthBalance({publicKey}) {
    console.log(`this is received public key : ${publicKey}`)
    const balance = await alchemy.core.getBalance(publicKey)

    return balance
}


export default function EthWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    //const [addresses, setAddresses] = useState([])
    const [wallets, setWallets] = useState([])


    async function AddEthereumWallet() {
        try{

            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new Wallet(privateKey);
    
            
            console.log(wallet)
            const publicKey = wallet.address
            //const privateKey = wallet.privateKey
            console.log(`public key is ${publicKey} \n private key is ${privateKey}`)
            
            let balance = await getEthBalance({publicKey:publicKey})

            const balanceInEth = parseFloat(balance.toString()) / 1e18

            setWallets((wallets)=>[...wallets, {
                publicKey: publicKey,
                privateKey: privateKey,
                balance: balanceInEth,
                index: currentIndex
            }])
    
            setCurrentIndex(currentIndex + 1);
            //setAddresses([...addresses, wallet.address]);
        }catch(err){
            console.log("error while creating wallet : " + err)
        }
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
                {wallets.map((p) => <div key={p}>{p.publicKey} and {p.balance}</div>)}
            </div>
        </div>
    )
}