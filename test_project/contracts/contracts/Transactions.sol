// SPDX-Licence-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCounter;

    event Transfer(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        string message,
        string keyword
    );

    struct TransferType {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        string keyword;
        uint256 timestamp;
    }

    TransferType[] transactions;

    function addToBlockChain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        transactionCounter += 1;
        transactions.push(
            TransferType({
                sender: msg.sender,
                receiver: receiver,
                amount: amount,
                message: message,
                keyword: keyword,
                timestamp: block.timestamp
            })
        );

        emit Transfer(msg.sender, receiver, amount, message, keyword);
    }

    function getAllTransactions() public view returns (TransferType[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCounter;
    }
}
