import express from "express";
import {
  createTransaction,
  getPendingTransactions,
  editTransaction,
  deleteTransaction,
  mineBlock,
  getBlockchain,
  clearBlockchain,
} from "../controllers/blockchainController.js";

const router = express.Router();

// Route to create a new transaction
router.post("/transactions/new", createTransaction);

// Route to get all pending transactions
router.get("/pending-transactions", getPendingTransactions);

// Route to edit an existing transaction
router.put("/transactions/:id", editTransaction);

// Route to delete a pending transaction
router.delete("/transactions/:id", deleteTransaction);

// Route to mine a new block
router.get("/mine", mineBlock);

// Route to get the entire blockchain
router.get("/chain", getBlockchain);

// Route to clear the entire blockchain
router.post("/clear", clearBlockchain);

export default router;
