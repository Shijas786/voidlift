const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const IdleGame = await ethers.getContractFactory("IdleGame");
  const idleGame = await IdleGame.deploy();

  await idleGame.deployed();

  console.log("IdleGame deployed to:", idleGame.address);
  console.log("Please update frontend/src/constants/contracts.ts with this address.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
