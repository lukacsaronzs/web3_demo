import { ethers } from "hardhat";

const main = async () => {
  const Transactions = await ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy("Hello, Hardhat!");

  await transactions.deployed();

  console.log("Transactions deployed to:", transactions.address);
};

const runMain = async () => {
  try {
    await main();
  } catch (e) {
    console.log(e);
  }
};

runMain();
