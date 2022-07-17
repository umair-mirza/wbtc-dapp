import React, {useState, useEffect} from "react"
import { ethers } from "ethers"


export default function TimeStamp({blockNumber}) {

    const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/DgAdzU8u-xc_khXj0ZM331lyOjKYL-kA")

    const [timeStamp, setTimeStamp] = useState("")

    useEffect(() => {
        getTime(blockNumber)
    }, [timeStamp])


    const getTime = async (blockNumber) => {
        //brackets are important
        const result = (await provider.getBlock(blockNumber)).timestamp
        setTimeStamp(result)
      }

    return (
        <span>{timeStamp}</span>
    )
}