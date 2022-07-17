import React, {useState, useEffect} from "react"
import { ethers } from "ethers"
import Head from 'next/head'
import wbtcAbi from "../abi/wbtc.json"
import TimeStamp from "../components/TimeStamp"
import Spinner from "../components/Spinner"



export default function Home() {
  const [contractName, setContractName] = useState('')
  const [contractSymbol, setContractSymbol] = useState('')
  const [mintTransactions, setMintTransactions] = useState([])
  const [burnTransactions, setBurnTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const contractAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"

  const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/DgAdzU8u-xc_khXj0ZM331lyOjKYL-kA")

  const wbtcContract = new ethers.Contract(contractAddress, wbtcAbi, provider)

  useEffect(() => {
    main()
  }, [])

  const main = async () => {
    try {
      setLoading(true)
      const contractName = await wbtcContract.name()
      const contractSymbol = await wbtcContract.symbol()

      console.log("Latest Block:", await provider.getBlockNumber())
      
      //Listener for Minting Events
      // wbtcContract.on("Transfer", (from, to, amount, event) => {
      //   console.log(`${from} sent ${String(ethers.utils.formatEther(amount))} to ${to}`)
      // })

      //For quering historical events
      const mintFilter = wbtcContract.filters.Mint();
      const burnFilter = wbtcContract.filters.Burn();
      
      //Filter the last *** number of events
      const mintTx = await wbtcContract.queryFilter(mintFilter, -1000000)
      const finalMintTx = mintTx.slice(-20)

      const burnTx = await wbtcContract.queryFilter(burnFilter, -100000)
      const finalBurnTx = burnTx.slice(-20)

      setContractName(contractName)
      setContractSymbol(contractSymbol)
      setMintTransactions(finalMintTx)
      setBurnTransactions(finalBurnTx)

    setLoading(false)
    } catch(err) {
      console.log(err)
    }
    
  }


  return (

    <>
      <Head>
        <title>Mint and Burn Data</title>
        <meta name="description" content="Minting and Burning data of Ethereum based currencies" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>

      <h1 className="text-4xl md:text-6xl text-center mt-10 text-newYellow">Wrapped BTC - WBTC</h1>
      <h2 className="text-2xl md:text-3xl text-center mt-6 text-gray-100">Mint and Burn Data</h2>

      <div className="grid lg:grid-cols-2 gap-6 mt-6 mx-4 mb-6">
        <div className="flex flex-col items-center border-opacity-0 rounded-lg shadow-2xl shadow-slate-700">
          <div className="mb-4 text-newYellow text-xl md:text-3xl">
            <h3>Last 20 Mint Transactions</h3>
          </div>
          <div className="md:text-xl text-gray-100 opacity-80">
            <div className="flex flex-col divide-gray-100 divide-y">
              { !loading ? (
                mintTransactions.map((item, i) => {
                  return <ul className="mt-2" key={i}>
                          <li>Transaction Hash: {item.transactionHash}</li>
                          <li>To Address: {item.args[0]}</li>
                          <li>Amount: {ethers.utils.formatEther(item.args.amount)}</li>
                          <li>TimeStamp: <TimeStamp blockNumber={item.blockNumber} /></li>
                        </ul>
                })
              ) : <Spinner />
              }
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center border-opacity-0 rounded-lg shadow-2xl shadow-slate-700">
          <div className="mb-4 text-newYellow text-xl md:text-3xl">
            <h3>Last 20 Burn Transactions</h3>
          </div>
          <div className="md:text-xl text-gray-100 opacity-80">
            <div className="flex flex-col divide-gray-100 divide-y">
              { !loading ? (
                burnTransactions.map((item, i) => {
                  return <ul className="mt-2" key={i}>
                          <li>Transaction Hash: {item.transactionHash}</li>
                          <li>Burner Address: {item.args.burner}</li>
                          <li>Amount: {ethers.utils.formatEther(item.args.value)}</li>
                          <li>TimeStamp: <TimeStamp blockNumber={item.blockNumber} /></li>
                        </ul>
                })
              ) : <Spinner />
              }
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}
