import { ethers } from "ethers"

export type Transaction = {
    id: number,
    url: string,
    message: string,
    timestamp: string,
    addressFrom: string,
    amount: string,
    addressTo: string,
    keyword: string
}

export type ContractTransaction = {
    receiver: string,
    sender: string,
    timestamp: ethers.BigNumber,
    message: string,
    keyword: string,
    amount: ethers.BigNumber
}