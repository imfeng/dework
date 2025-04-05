const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DisputeResolution", function () {
  let dework;
  let disputeResolution;
  let usdc;
  let owner;
  let landlord;
  let tenant;
  let arbitrator1;
  let arbitrator2;
  let arbitrator3;

  beforeEach(async function () {
    [owner, landlord, tenant, arbitrator1, arbitrator2, arbitrator3] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.deployed();

    // Deploy Dework
    const Dework = await ethers.getContractFactory("Dework");
    dework = await Dework.deploy(usdc.address);
    await dework.deployed();

    // Deploy DisputeResolution
    const DisputeResolution = await ethers.getContractFactory("DisputeResolution");
    disputeResolution = await DisputeResolution.deploy(dework.address);
    await disputeResolution.deployed();

    // Grant roles
    await dework.grantRole(await dework.LANDLORD_ROLE(), landlord.address);
    await dework.grantRole(await dework.TENANT_ROLE(), tenant.address);
    await disputeResolution.grantRole(await disputeResolution.ARBITRATOR_ROLE(), arbitrator1.address);
    await disputeResolution.grantRole(await disputeResolution.ARBITRATOR_ROLE(), arbitrator2.address);
    await disputeResolution.grantRole(await disputeResolution.ARBITRATOR_ROLE(), arbitrator3.address);

    // Mint USDC to tenant
    await usdc.mint(tenant.address, ethers.utils.parseUnits("1000", 6));
  });

  describe("Dispute Creation", function () {
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

    it("Should allow tenant to create dispute", async function () {
      const description = "Test dispute description";

      await expect(
        disputeResolution.connect(tenant).createDispute(1, description)
      )
        .to.emit(disputeResolution, "DisputeCreated")
        .withArgs(1, description);

      const dispute = await disputeResolution.disputes(1);
      expect(dispute.tenant).to.equal(tenant.address);
      expect(dispute.landlord).to.equal(landlord.address);
      expect(dispute.description).to.equal(description);
      expect(dispute.resolved).to.be.false;
    });

    it("Should not allow non-tenant to create dispute", async function () {
      const description = "Test dispute description";

      await expect(
        disputeResolution.connect(landlord).createDispute(1, description)
      ).to.be.revertedWith("Only tenant can create dispute");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Create a lease and dispute
      const depositAmount = ethers.utils.parseUnits("100", 6);
      const duration = 30 * 24 * 60 * 60;

      await dework.connect(landlord).createLease(
        tenant.address,
        depositAmount,
        duration,
        "test.eth",
        ethers.utils.formatBytes32String("test-world-id")
      );

      await usdc.connect(tenant).approve(dework.address, depositAmount);
      await dework.connect(tenant).deposit(1);
      await disputeResolution.connect(tenant).createDispute(1, "Test dispute");
    });

    it("Should allow arbitrators to vote", async function () {
      await expect(
        disputeResolution.connect(arbitrator1).vote(1, true)
      )
        .to.emit(disputeResolution, "VoteCast")
        .withArgs(1, arbitrator1.address, true);

      const dispute = await disputeResolution.disputes(1);
      expect(dispute.votesFor).to.equal(1);
      expect(dispute.votesAgainst).to.equal(0);
    });

    it("Should not allow non-arbitrators to vote", async function () {
      await expect(
        disputeResolution.connect(tenant).vote(1, true)
      ).to.be.revertedWith("AccessControl");
    });

    it("Should not allow double voting", async function () {
      await disputeResolution.connect(arbitrator1).vote(1, true);

      await expect(
        disputeResolution.connect(arbitrator1).vote(1, false)
      ).to.be.revertedWith("Already voted");
    });

    it("Should resolve dispute when minimum votes reached", async function () {
      await disputeResolution.connect(arbitrator1).vote(1, true);
      await disputeResolution.connect(arbitrator2).vote(1, true);
      await disputeResolution.connect(arbitrator3).vote(1, false);

      const dispute = await disputeResolution.disputes(1);
      expect(dispute.resolved).to.be.true;
      expect(dispute.votesFor).to.equal(2);
      expect(dispute.votesAgainst).to.equal(1);
    });
  });

  describe("Dispute Info", function () {
    it("Should return correct dispute information", async function () {
      // Create a lease and dispute
      const depositAmount = ethers.utils.parseUnits("100", 6);
      const duration = 30 * 24 * 60 * 60;

      await dework.connect(landlord).createLease(
        tenant.address,
        depositAmount,
        duration,
        "test.eth",
        ethers.utils.formatBytes32String("test-world-id")
      );

      await usdc.connect(tenant).approve(dework.address, depositAmount);
      await dework.connect(tenant).deposit(1);

      const description = "Test dispute description";
      await disputeResolution.connect(tenant).createDispute(1, description);

      const [
        disputeTenant,
        disputeLandlord,
        disputeDescription,
        disputeCreatedAt,
        disputeVotesFor,
        disputeVotesAgainst,
        disputeResolved
      ] = await disputeResolution.getDisputeInfo(1);

      expect(disputeTenant).to.equal(tenant.address);
      expect(disputeLandlord).to.equal(landlord.address);
      expect(disputeDescription).to.equal(description);
      expect(disputeVotesFor).to.equal(0);
      expect(disputeVotesAgainst).to.equal(0);
      expect(disputeResolved).to.be.false;
    });
  });
}); 