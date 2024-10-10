import Blockchain from "../models/blockchain.js";
import { v4 as uuidv4 } from "uuid";

const blockchain = new Blockchain();

// Function to create a new transaction
export const createTransaction = (req, res) => {
  const {
    sender,
    recipient,
    product,
    quantity,
    location,
    status,
    temperature,
    deliveryDate,
  } = req.body;

  const newTransaction = {
    _id: uuidv4(),
    sender,
    recipient,
    product,
    quantity,
    location,
    status,
    temperature,
    deliveryDate,
  };

  blockchain.pendingTransactions.push(newTransaction);
  blockchain.savePendingTransactions();

  res.json({
    message: "Transaction has been added successfully.",
    transaction: newTransaction,
  });
};

// Function to get all pending transactions
export const getPendingTransactions = (req, res) => {
  res.json({ transactions: blockchain.pendingTransactions });
};

// Function to edit an existing transaction
export const editTransaction = (req, res) => {
  const { id } = req.params;
  const {
    sender,
    recipient,
    product,
    quantity,
    location,
    status,
    temperature,
    deliveryDate,
  } = req.body;

  const transactionIndex = blockchain.pendingTransactions.findIndex(
    (tx) => tx._id === id
  );

  if (transactionIndex !== -1) {
    blockchain.pendingTransactions[transactionIndex] = {
      ...blockchain.pendingTransactions[transactionIndex],
      sender,
      recipient,
      product,
      quantity,
      location,
      status,
      temperature,
      deliveryDate,
    };
    blockchain.savePendingTransactions();
    res.json({ message: "Transaction updated successfully." });
  } else {
    res.status(404).json({ message: "Transaction not found." });
  }
};

// Function to delete a pending transaction
export const deleteTransaction = (req, res) => {
  const { id } = req.params;

  const transactionIndex = blockchain.pendingTransactions.findIndex(
    (tx) => tx._id === id
  );

  if (transactionIndex !== -1) {
    blockchain.pendingTransactions.splice(transactionIndex, 1);
    blockchain.savePendingTransactions();
    res.json({ message: "Transaction deleted successfully." });
  } else {
    res.status(404).json({ message: "Transaction not found." });
  }
};

// Function to mine a new block
export const mineBlock = (req, res) => {
  const lastBlock = blockchain.getLastBlock();
  const lastProof = lastBlock.proof;
  const proof = blockchain.proofOfWork(lastProof);

  // Reward for mining
  blockchain.createTransaction(
    "0",
    "miner_address",
    "Reward",
    "1",
    "Blockchain Network",
    "Mined",
    "N/A",
    Date.now()
  );

  // Add the pending transactions to a new block
  const previousHash = blockchain.hash(lastBlock);
  const block = blockchain.createBlock(proof, previousHash);

  res.json({
    message: "New Block Forged",
    block: block,
  });
};

// Function to get the entire blockchain
export const getBlockchain = (req, res) => {
  res.json({
    chain: blockchain.chain,
    length: blockchain.chain.length,
  });
};

// Function to clear the entire blockchain
export const clearBlockchain = (req, res) => {
  blockchain.clearBlockchain();
  res.json({
    message: "Blockchain and pending transactions have been cleared and reset.",
  });
};
