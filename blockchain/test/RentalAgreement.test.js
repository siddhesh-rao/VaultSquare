const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentalAgreement", function () {
  async function deployFixture() {
    const [owner, renter] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("RentalAgreement");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    return { contract, owner, renter };
  }

  it("creates a rental agreement", async function () {
    const { contract, owner, renter } = await deployFixture();

    await expect(
      contract.createRentalAgreement(
        renter.address,
        owner.address,
        "product-1",
        1000,
        2000,
        ethers.parseEther("0.5")
      )
    )
      .to.emit(contract, "RentalAgreementCreated")
      .withArgs(1, renter.address, owner.address, "product-1", 1000, 2000, ethers.parseEther("0.5"));

    const agreement = await contract.agreements(1);
    expect(agreement.productId).to.equal("product-1");
  });

  it("releases payment and refunds deposit", async function () {
    const { contract, owner, renter } = await deployFixture();

    await contract.createRentalAgreement(
      renter.address,
      owner.address,
      "product-2",
      1000,
      2000,
      ethers.parseEther("1")
    );

    await expect(contract.releasePayment(1)).to.emit(contract, "PaymentReleased");
    await expect(contract.refundDeposit(1)).to.emit(contract, "DepositRefunded");
  });
});
