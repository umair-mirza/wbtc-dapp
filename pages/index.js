import React, {useState, useEffect} from "react"
import { ethers } from "ethers"
import Head from 'next/head'
import wbtcAbi from "../abi/wbtc.json"
import TimeStamp from "../components/TimeStamp"


export default function Home() {
  const [contractName, setContractName] = useState('')
  const [contractSymbol, setContractSymbol] = useState('')
  const [mintTransactions, setMintTransactions] = useState([])
  const [timeStamp, setTimeStamp] = useState("")
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
      const filter = wbtcContract.filters.Mint();
      
      //Filter the last *** number of events
      const mintTx = await wbtcContract.queryFilter(filter, -1000000)
      const finalMintTx = mintTx.slice(-20)
      console.log(finalMintTx)

      setContractName(contractName)
      setContractSymbol(contractSymbol)
      setMintTransactions(finalMintTx)

    setLoading(false)
    } catch(err) {
      console.log(err)
    }
    
  }


  return (

    <div>
      <Head>
        <title>Mint and Burn Data</title>
        <meta name="description" content="Minting and Burning data of Ethereum based currencies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Mint and Burn Data</h1>

      <p>{contractName}</p>
      <p>{contractSymbol}</p>

      <h3>Last 20 Mint Transactions</h3>
      { !loading ? (
        mintTransactions.map((item, i) => {
          return <ul key={i}>
                  <li>Transaction Hash: {item.transactionHash}</li>
                  <li>To Address: {item.args[0]}</li>
                  <li>Amount: {ethers.utils.formatEther(item.args.amount)}</li>
                  <li>TimeStamp: <TimeStamp blockNumber={item.blockNumber} /></li>
                  <br />
                </ul>
        })
      ) : null
      }
      
    </div>
  )
}
