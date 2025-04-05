const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dework", function () {
  let dework;
  let usdc;
  let owner;
  let landlord;
  let tenant;
  let other;

  beforeEach(async function () {
    [owner, landlord, tenant, other] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.deployed();

    // Deploy Dework
    const Dework = await ethers.getContractFactory("Dework");
    dework = await Dework.deploy(usdc.address);
    await dework.deployed();

    // Grant roles
    await dework.grantRole(await dework.LANDLORD_ROLE(), landlord.address);
    await dework.grantRole(await dework.TENANT_ROLE(), tenant.address);

    // Mint USDC to tenant for testing
    await usdc.mint(tenant.address, ethers.utils.parseUnits("1000", 6));
  });

  describe("Lease Creation", function () {
    it("Should create a new lease", async function () {
      const depositAmount = ethers.utils.parseUnits("100", 6);
      const duration = 30 * 24 * 60 * 60; // 30 days
      const ensName = "test.eth";
      const worldId = ethers.utils.formatBytes32String("test-world-id");

      await expect(
        dework.connect(landlord).createLease(
          tenant.address,
          depositAmount,
          duration,
          ensName,
          worldId
        )
      )
        .to.emit(dework, "LeaseCreated")
        .withArgs(1, landlord.address, tenant.address);

      const lease = await dework.leases(1);
      expect(lease.depositAmount).to.equal(depositAmount);
      expect(lease.landlord).to.equal(landlord.address);
      expect(lease.tenant).to.equal(tenant.address);
      expect(lease.ensName).to.equal(ensName);
      expect(lease.worldId).to.equal(worldId);
    });

    it("Should not allow non-landlord to create lease", async function () {
      const depositAmount = ethers.utils.parseUnits("100", 6);
      const duration = 30 * 24 * 60 * 60;

      await expect(
        dework.connect(tenant).createLease(
          tenant.address,
          depositAmount,
          duration,
          "test.eth",
          ethers.utils.formatBytes32String("test-world-id")
        )
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Deposit", function () {
    beforeEach(async function () {
      const depositAmount = ethers.utils.parseUnits("100", 6);
      const duration = 30 * 24 * 60 * 60;

      await dework.connect(landlord).createLease(
        tenant.address,
        depositAmount,
        duration,
        "test.eth",
        ethers.utils.formatBytes32String("test-world-id")
      );
    });

    it("Should allow tenant to deposit", async function () {
      const depositAmount = ethers.utils.parseUnits("100", 6);
      
      // Approve USDC transfer
      await usdc.connect(tenant).approve(dework.address, depositAmount);

      await expect(
        dework.connect(tenant).deposit(1)
      )
        .to.emit(dework, "DepositReceived")
        .withArgs(1, depositAmount);

      const lease = await dework.leases(1);
      expect(lease.status).to.equal(1); // Active
    });

    it("Should not allow non-tenant to deposit", async function () {
      const depositAmount = ethers.utils.parseUnits("100", 6);
      
      await usdc.connect(tenant).approve(dework.address, depositAmount);

      await expect(
        dework.connect(other).deposit(1)
      ).to.be.revertedWith("Only tenant can deposit");
    });
  });

  describe("Dispute Resolution", function () {
    beforeEach(async function () {
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

    it("Should allow tenant to raise dispute", async function () {
      await expect(
        dework.connect(tenant).raiseDispute(1)
      )
        .to.emit(dework, "DisputeRaised")
        .withArgs(1, tenant.address);

      const lease = await dework.leases(1);
      expect(lease.status).to.equal(3); // Disputed
    });

    it("Should allow admin to resolve dispute", async function () {
      await dework.connect(tenant).raiseDispute(1);

      await expect(
        dework.connect(owner).resolveDispute(1, true)
      )
        .to.emit(dework, "DisputeResolved")
        .withArgs(1, true);

      const lease = await dework.leases(1);
      expect(lease.status).to.equal(2); // Completed
    });
  });
}); 