require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const kovanPrivateKey = process.env["KOVAN_PRIVATE_KEY"];
const mnemonic = process.env["MNEMONIC"];

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    kovan: {
      network_id: 3,
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/" + kovanPrivateKey);
      },
      gas: 1500000,
      gasPrice: 2000000000,
    },
  }
};
