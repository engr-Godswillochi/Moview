import { ethers } from "hardhat";

async function main() {
    console.log("Deploying MovieReviews contract to Celo Sepolia testnet...");

    const [deployer] = await ethers.getSigners();
    if (!deployer) {
        console.error("❌ No deployer account found! Check your PRIVATE_KEY in .env");
        process.exit(1);
    }
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const MovieReviews = await ethers.getContractFactory("MovieReviews");
    const movieReviews = await MovieReviews.deploy();

    await movieReviews.waitForDeployment();

    const address = await movieReviews.getAddress();

    console.log("✅ MovieReviews deployed to:", address);
    console.log("\n📝 Add this to your .env.local file:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
    console.log("\n🔍 Verify on CeloScan:");
    console.log(`https://celo-sepolia.blockscout.com/address/${address}`);
    console.log("\n⚡ To verify the contract, run:");
    console.log(`npx hardhat verify --network celoSepolia ${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
