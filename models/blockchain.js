import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Handle `__dirname` in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the data files
const chainPath = path.join(__dirname, "../data/blockChainData.json");
const pendingTxPath = path.join(__dirname, "../data/supplyChainData.json");

class Blockchain {
  constructor() {
    if (fs.existsSync(chainPath) && fs.existsSync(pendingTxPath)) {
      // Load blockchain and pending transactions from files if available
      const chainBuffer = fs.readFileSync(chainPath, "utf-8");
      const pendingTxBuffer = fs.readFileSync(pendingTxPath, "utf-8");

      this.chain = JSON.parse(chainBuffer) || [];
      this.pendingTransactions = JSON.parse(pendingTxBuffer) || [];
    } else {
      // If no data exists, initialize with a genesis block
      this.chain = [];
      this.pendingTransactions = [
        { product: "Genesis Block for Transaction Initialization" },
      ];
      this.createBlock(1, "0"); // Create Genesis Block
    }
  }

  createBlock(proof, previousHash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      proof: proof,
      previous_hash: previousHash,
    };

    // Add the new block to the chain and clear pending transactions
    this.chain.push(block);
    this.pendingTransactions = [];

    // Save updated blockchain and clear pending transactions in files
    this.saveBlockchain();
    this.savePendingTransactions();

    return block;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createTransaction(
    sender,
    recipient,
    product,
    quantity,
    location,
    status,
    temperature,
    deliveryDate
  ) {
    this.pendingTransactions.push({
      sender,
      recipient,
      product,
      quantity,
      location,
      status,
      temperature,
      deliveryDate,
    });
    this.savePendingTransactions();
    return this.getLastBlock().index + 1;
  }

  proofOfWork(lastProof) {
    let proof = 0;
    while (!this.validProof(lastProof, proof)) {
      proof++;
    }
    return proof;
  }

  hash(block) {
    const blockString = JSON.stringify(block);
    return crypto.createHash("sha256").update(blockString).digest("hex");
  }

  validProof(lastProof, proof) {
    const guess = `${lastProof}${proof}`;
    const guessHash = crypto.createHash("sha256").update(guess).digest("hex");
    return guessHash.startsWith("0000");
  }

  saveBlockchain() {
    fs.writeFileSync(chainPath, JSON.stringify(this.chain, null, 2), "utf-8");
  }

  savePendingTransactions() {
    fs.writeFileSync(
      pendingTxPath,
      JSON.stringify(this.pendingTransactions, null, 2),
      "utf-8"
    );
  }

  clearBlockchain() {
    this.chain = [];
    this.pendingTransactions = [
      { product: "Genesis Block for Transaction Initialization" },
    ];
    this.createBlock(1, "0"); // Create Genesis Block
    this.saveBlockchain();
    this.savePendingTransactions();
  }
}

export default Blockchain;
