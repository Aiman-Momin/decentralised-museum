import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Decentralized Museum contracts to Sepolia...");

  // Deploy MuseumToken first (needed for DAO)
  console.log("\n1. Deploying MuseumToken...");
  const MuseumToken = await ethers.getContractFactory("MuseumToken");
  const museumToken = await MuseumToken.deploy();
  await museumToken.waitForDeployment();
  const tokenAddress = await museumToken.getAddress();
  console.log("✓ MuseumToken deployed to:", tokenAddress);

  // Deploy MuseumNFT
  console.log("\n2. Deploying MuseumNFT...");
  const MuseumNFT = await ethers.getContractFactory("MuseumNFT");
  const museumNFT = await MuseumNFT.deploy();
  await museumNFT.waitForDeployment();
  const nftAddress = await museumNFT.getAddress();
  console.log("✓ MuseumNFT deployed to:", nftAddress);

  // Deploy MuseumDAO
  console.log("\n3. Deploying MuseumDAO...");
  const MuseumDAO = await ethers.getContractFactory("MuseumDAO");
  const museumDAO = await MuseumDAO.deploy(tokenAddress);
  await museumDAO.waitForDeployment();
  const daoAddress = await museumDAO.getAddress();
  console.log("✓ MuseumDAO deployed to:", daoAddress);

  console.log("\n=================================");
  console.log("Deployment Summary:");
  console.log("=================================");
  console.log("MuseumToken:", tokenAddress);
  console.log("MuseumNFT:", nftAddress);
  console.log("MuseumDAO:", daoAddress);
  console.log("=================================\n");

  console.log("Save these addresses in your .env file:");
  console.log(`MUSEUM_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`MUSEUM_NFT_ADDRESS=${nftAddress}`);
  console.log(`MUSEUM_DAO_ADDRESS=${daoAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
