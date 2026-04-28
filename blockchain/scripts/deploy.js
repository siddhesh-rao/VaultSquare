const hre = require("hardhat");

async function main() {
  const RentalAgreement = await hre.ethers.getContractFactory("RentalAgreement");
  const contract = await RentalAgreement.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`RentalAgreement deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
