import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.7.6" },
      { version: "0.8.19" }
    ],
  },
};

export default config;
