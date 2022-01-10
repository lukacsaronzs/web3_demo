import React, { ReactChildren, ReactNode, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'
import { MetaMaskInpageProvider } from '@metamask/providers';

import { Transaction, ContractTransaction } from '../models/Transaction';



export const TransactionContext = React.createContext(
    {
        connectWallet: async () => {}, 
        currentAccount: '', 
        formData: {addressTo: '', amount: '', keyword: '', message: ''},
        setFormData: (formData: any) => {},
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {},
        sendTransaction: () => {},
        transactions: [] as Transaction[]

});

const ethereum = window.ethereum as ethers.providers.ExternalProvider;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return {
        provider,
        signer,
        transactionContract
    };
}
export type Props = {
    children: ReactNode,
}


const TransactionProvider = (props: Props) => {
    const {children} = props;
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount') || 0);
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    const checkIfWalletConnected = async () => {
        try{
            if(!ethereum || !ethereum.request) return alert('Please install MetaMask!');

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if(accounts.length && accounts.length > 0){
                setCurrentAccount(accounts[0]);
    
                getAllTransactions();
            }
            else{
                console.log('No accounts found!');
            }
        }
        catch(error){
            throw new Error('No ethereum oject.')

        }
       
    }

    const connectWallet = async () => {
        try{
            if(!ethereum || !ethereum.request ) return alert('Please install MetaMask!');
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);

        }catch(error){
            throw new Error('No ethereum oject.')
        }
    }

    const sendTransaction = async () => {
        try{
            if(!ethereum || !ethereum.request ) return alert('Please install MetaMask!');

            const {addressTo, amount, keyword, message} = formData;
            const parsedAmount = ethers.utils.parseEther(amount);

            const {transactionContract} = getEthereumContract();

            await ethereum.request({ 
                method: 'eth_sendTransaction', 
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,

                }] 
            });
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);

            setIsLoading(false);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber);
        }
        catch(e){

        }
    }

    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const {transactionContract} = getEthereumContract();
    
            const availableTransactions = await transactionContract.getAllTransactions();
            console.log(availableTransactions);

            const structuredTransactions = availableTransactions.map((transaction: ContractTransaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
            
            setTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        checkIfWalletConnected();
    }, [])

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions}}>
            {children}
        </TransactionContext.Provider>
    )
};

export default TransactionProvider;