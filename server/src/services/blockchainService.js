const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

let cachedAbi;

const getContractAbi = () => {
  if (cachedAbi) {
    return cachedAbi;
  }

  const relativeAbiPath =
    process.env.BLOCKCHAIN_ABI_PATH ||
    "../blockchain/artifacts/contracts/RentalAgreement.sol/RentalAgreement.json";
  const abiPath = path.resolve(__dirname, "..", "..", relativeAbiPath);

  if (!fs.existsSync(abiPath)) {
    throw new Error(`Contract ABI not found at ${abiPath}. Compile blockchain project first.`);
  }

  const file = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
  cachedAbi = file.abi;
  return cachedAbi;
};

const getContract = () => {
  const rpcUrl = process.env.CHAIN_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error("Blockchain environment variables are incomplete");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  return new ethers.Contract(contractAddress, getContractAbi(), wallet);
};

const createRentalAgreement = async ({
  renterAddress,
  ownerAddress,
  productId,
  startDate,
  endDate,
  depositAmount
}) => {
  const contract = getContract();

  const tx = await contract.createRentalAgreement(
    renterAddress,
    ownerAddress,
    productId,
    Math.floor(new Date(startDate).getTime() / 1000),
    Math.floor(new Date(endDate).getTime() / 1000),
    ethers.parseEther(String(depositAmount))
  );

  const receipt = await tx.wait();
  const agreementId = (await contract.agreementCounter()).toString();

  return {
    agreementId,
    transactionHash: receipt.hash
  };
};

const releasePayment = async (agreementId) => {
  const contract = getContract();
  const tx = await contract.releasePayment(agreementId);
  const receipt = await tx.wait();

  return {
    transactionHash: receipt.hash
  };
};

const refundDeposit = async (agreementId) => {
  const contract = getContract();
  const tx = await contract.refundDeposit(agreementId);
  const receipt = await tx.wait();

  return {
    transactionHash: receipt.hash
  };
};

module.exports = {
  createRentalAgreement,
  releasePayment,
  refundDeposit
};
