require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"sepolia",
  solidity: "0.8.21",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },  
   
    sepolia:{
      url:`https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_KEY}`,
      accounts:[process.env.PRIVATE_KEY]
     },
  }
};
