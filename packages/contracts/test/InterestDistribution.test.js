const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InterestDistribution", function () {
  let dework;
  let interestDistribution;
  let usdc;
  let owner;
  let landlord;
  let tenant;
  let defiProtocol;

  beforeEach(async function () {
    [owner, landlord, tenant, defiProtocol] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.deployed();

    // Deploy Dework
    const Dework = await ethers.getContractFactory("Dework");
    dework = await Dework.deploy(usdc.address);
    await dework.deployed();

    // Deploy InterestDistribution
    const InterestDistribution = await ethers.getContractFactory("InterestDistribution");
    interestDistribution = await InterestDistribution.deploy(dework.address, usdc.address);
    await interestDistribution.deployed();

    // Grant roles
    await dework.grantRole(await dework.LANDLORD_ROLE(), landlord.address);
    await dework.grantRole(await dework.TENANT_ROLE(), tenant.address);

    // Set DeFi protocol
    await interestDistribution.setDefiProtocol(defiProtocol.address);

    // Mint USDC to tenant and DeFi protocol
    await usdc.mint(tenant.address, ethers.utils.parseUnits("1000", 6));
    await usdc.mint(defiProtocol.address, ethers.utils.parseUnits("1000", 6));
  });

  describe("Yield Management", function () {
    beforeEach(async function () {
      // Create a lease
      const depositAmount = ethers.utils.parseUnits("100", 6);
      const duration = 30 * 24 * 60 * 60;

      await dework.connect(landlord).createLease(
        tenant.address,
        depositAmount,
        duration,
        "test.eth",
        ethers.utils.formatBytes32String("test-world-id")
      );

      // Approve and deposit
      await usdc.connect(tenant).approve(dework.address, depositAmount);
      await dework.connect(tenant).deposit(1);
    });

    it("Should allow DeFi protocol to deposit yield", async function () {
      const yieldAmount = ethers.utils.parseUnits("10", 6);

      await expect(
        interestDistribution.connect(defiProtocol).depositYield(1, yieldAmount)
      )
        .to.emit(interestDistribution, "YieldDeposited")
        .withArgs(1, yieldAmount);

      const leaseYield = await interestDistribution.leaseYields(1);
      expect(leaseYield).to.equal(yieldAmount);
    });

    it("Should not allow non-DeFi protocol to deposit yield", async function () {
      const yieldAmount = ethers.utils.parseUnits("10", 6);

      await expect(
        interestDistribution.connect(tenant).depositYield(1, yieldAmount)
      ).to.be.revertedWith("Only DeFi protocol can deposit yield");
    });

    it("Should distribute yield correctly", async function () {
      const yieldAmount = ethers.utils.parseUnits("10", 6);
      await interestDistribution.connect(defiProtocol).depositYield(1, yieldAmount);

      // Fast forward time to end of lease
      await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      const landlordBalanceBefore = await usdc.balanceOf(landlord.address);
      const platformBalanceBefore = await usdc.balanceOf(interestDistribution.address);

      await interestDistribution.distributeYield(1);

      const landlordBalanceAfter = await usdc.balanceOf(landlord.address);
      const platformBalanceAfter = await usdc.balanceOf(interestDistribution.address);

      // 70% to landlord, 30% to platform
      expect(landlordBalanceAfter.sub(landlordBalanceBefore)).to.equal(
        yieldAmount.mul(7000).div(10000)
      );
      expect(platformBalanceAfter.sub(platformBalanceBefore)).to.equal(
        yieldAmount.mul(3000).div(10000)
      );
    });

    it("Should not distribute yield before lease end", async function () {
      const yieldAmount = ethers.utils.parseUnits("10", 6);
      await interestDistribution.connect(defiProtocol).depositYield(1, yieldAmount);

      await expect(
        interestDistribution.distributeYield(1)
      ).to.be.revertedWith("Lease not ended");
    });
  });

  describe("Platform Funds", function () {
    it("Should allow admin to withdraw platform funds", async function () {
      const amount = ethers.utils.parseUnits("100", 6);
      await usdc.transfer(interestDistribution.address, amount);

      const balanceBefore = await usdc.balanceOf(owner.address);
      await interestDistribution.withdrawPlatformFunds(amount);
      const balanceAfter = await usdc.balanceOf(owner.address);

      expect(balanceAfter.sub(balanceBefore)).to.equal(amount);
    });

    it("Should not allow non-admin to withdraw platform funds", async function () {
      const amount = ethers.utils.parseUnits("100", 6);
      await usdc.transfer(interestDistribution.address, amount);

      await expect(
        interestDistribution.connect(tenant).withdrawPlatformFunds(amount)
      ).to.be.revertedWith("AccessControl");
    });
  });
}); 