const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, data, previousHash = '', index = 0) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }

    mine(difficulty) {
        let hashAttempts = 0;
        let date = new Date().getTime();
        while (this.hash.substr(0, difficulty) !== Array(difficulty + 1).join("0")) {
            let end = new Date().getTime();
            if(date + 10000 == end){
                console.log(`Calculated total of ${hashAttempts} hashes for block ${this.index + 1}`);
                date = new Date().getTime();
            }
            hashAttempts++;
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.chain.push(this.generateGensisBlock());
    }

    generateGensisBlock() {
        return new Block(0, Date.now(), {
            "Name": "Genesis Block",
            "CurrentAccount": 0
        }, null);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        if (block instanceof Block) {
            block.previousHash = this.getLatestBlock().hash;
            block.index = this.chain.length;
            block.mine(this.chain.length);
            this.chain.push(block);
        }
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i];
            const lastBlock = this.chain[i - 1];

            if (currBlock.hash !== currBlock.calculateHash()) {
                return false;
            }
            if (currBlock.previousHash !== lastBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let chain = new Blockchain();

while (true) {
    let block = new Block(Date.now(), { "Name": "First Guy", "CurrentAccount": 10, "TransactionTo": 0, "Transaction": 0 });
    let d1 = new Date().getTime();
    chain.addBlock(block);
    let d2 = new Date().getTime();
    console.log(`Added block ${chain.chain.length}. Hash computation time: ${d2 - d1} miliseconds`);
}
// console.log(JSON.stringify(chain, null, 4));