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
    
    // Deploy Dework
    const Dework = await ethers.getContractFactory("Dework");
    dework = await Dework.deploy(await usdc.getAddress(), "");
    
    // Deploy InterestDistribution
    const InterestDistribution = await ethers.getContractFactory("InterestDistribution");
    interestDistribution = await InterestDistribution.deploy(await dework.getAddress(), await usdc.getAddress());
    
    // Grant roles
    await dework.grantRole(await dework.LANDLORD_ROLE(), await landlord.getAddress());
    await dework.grantRole(await dework.TENANT_ROLE(), await tenant.getAddress());
    // Grant ADMIN_ROLE to InterestDistribution contract to call addInterestEarned
    await dework.grantRole(await dework.ADMIN_ROLE(), await interestDistribution.getAddress());

    // Set DeFi protocol
    await interestDistribution.setDefiProtocol(await defiProtocol.getAddress());

    // Mint USDC to tenant and DeFi protocol
    await usdc.mint(await tenant.getAddress(), ethers.parseUnits("1000", 6));
    await usdc.mint(await defiProtocol.getAddress(), ethers.parseUnits("1000", 6));
  });

  describe("Yield Management", function () {
    beforeEach(async function () {
      // Create a lease
      const depositAmount = ethers.parseUnits("100", 6);
      const duration = 30 * 24 * 60 * 60;
      const metadataURI = "ipfs://test";

      await dework.connect(landlord).createLease(
        await tenant.getAddress(),
        depositAmount,
        duration,
        "test.eth",
        ethers.keccak256(ethers.toUtf8Bytes("test-world-id")),
        metadataURI
      );

      // Approve and deposit
      await usdc.connect(tenant).approve(await dework.getAddress(), depositAmount);
      await dework.connect(tenant).deposit(1);
    });

    it("Should allow DeFi protocol to deposit yield", async function () {
      const yieldAmount = ethers.parseUnits("10", 6);

      // Initial yield
      const initialYield = await interestDistribution.leaseYields(1);
      
      // Deposit yield
      await interestDistribution.connect(defiProtocol).depositYield(1, yieldAmount);

      // Verify yield was added
      const finalYield = await interestDistribution.leaseYields(1);
      expect(finalYield - initialYield).to.equal(yieldAmount);
    });

    it("Should not allow non-DeFi protocol to deposit yield", async function () {
      const yieldAmount = ethers.parseUnits("10", 6);

      let error;
      try {
        await interestDistribution.connect(tenant).depositYield(1, yieldAmount);
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.message.includes("Only DeFi protocol can deposit yield")).to.equal(true);
    });

    it("Should distribute yield correctly", async function () {
      const yieldAmount = ethers.parseUnits("10", 6);
      
      // First transfer USDC to the defiProtocol address
      await usdc.mint(await defiProtocol.getAddress(), yieldAmount);
      // Approve and transfer tokens to the InterestDistribution contract
      await usdc.connect(defiProtocol).approve(await interestDistribution.getAddress(), yieldAmount);
      await usdc.connect(defiProtocol).transfer(await interestDistribution.getAddress(), yieldAmount);
      
      await interestDistribution.connect(defiProtocol).depositYield(1, yieldAmount);

      // Fast forward time to end of lease
      await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      const landlordBalanceBefore = await usdc.balanceOf(await landlord.getAddress());
      const platformBalanceBefore = await usdc.balanceOf(await interestDistribution.getAddress());

      await interestDistribution.distributeYield(1);

      const landlordBalanceAfter = await usdc.balanceOf(await landlord.getAddress());
      const platformBalanceAfter = await usdc.balanceOf(await interestDistribution.getAddress());

      // 70% to landlord, 30% to platform
      expect(landlordBalanceAfter - landlordBalanceBefore).to.equal(
        (yieldAmount * 7000n) / 10000n
      );
      expect(platformBalanceAfter - platformBalanceBefore).to.equal(
        (yieldAmount * 3000n) / 10000n - yieldAmount
      );
    });

    it("Should not distribute yield before lease end", async function () {
      const yieldAmount = ethers.parseUnits("10", 6);
      await interestDistribution.connect(defiProtocol).depositYield(1, yieldAmount);

      let error;
      try {
        await interestDistribution.distributeYield(1);
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.message.includes("Lease not ended")).to.equal(true);
    });
  });

  describe("Platform Funds", function () {
    it("Should allow admin to withdraw platform funds", async function () {
      const amount = ethers.parseUnits("100", 6);
      await usdc.transfer(await interestDistribution.getAddress(), amount);

      const balanceBefore = await usdc.balanceOf(await owner.getAddress());
      await interestDistribution.withdrawPlatformFunds(amount);
      const balanceAfter = await usdc.balanceOf(await owner.getAddress());

      expect(balanceAfter - balanceBefore).to.equal(amount);
    });

    it("Should not allow non-admin to withdraw platform funds", async function () {
      const amount = ethers.parseUnits("100", 6);
      await usdc.transfer(await interestDistribution.getAddress(), amount);

      let error;
      try {
        await interestDistribution.connect(tenant).withdrawPlatformFunds(amount);
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.message.includes("AccessControl")).to.equal(true);
    });
  });
}); 