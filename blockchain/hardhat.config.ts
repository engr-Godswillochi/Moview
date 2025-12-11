import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        celoSepolia: {
            url: "https://forno.celo-sepolia.celo-testnet.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11142220,
        },
    },
    etherscan: {
        apiKey: {
            celoSepolia: process.env.CELOSCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "celoSepolia",
                chainId: 11142220,
                urls: {
                    apiURL: "https://celo-sepolia.blockscout.com/api",
                    browserURL: "https://celo-sepolia.blockscout.com/",
                },
            },
        ],
    },
    sourcify: {
        enabled: true,
    },
};

export default config;
