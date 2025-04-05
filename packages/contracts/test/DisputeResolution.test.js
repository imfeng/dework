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
    
    // Deploy Dework
    const Dework = await ethers.getContractFactory("Dework");
    dework = await Dework.deploy(await usdc.getAddress(), "");
    
    // Deploy DisputeResolution
    const DisputeResolution = await ethers.getContractFactory("DisputeResolution");
    disputeResolution = await DisputeResolution.deploy(await dework.getAddress());
    
    // Grant roles
    await dework.grantRole(await dework.LANDLORD_ROLE(), await landlord.getAddress());
    await dework.grantRole(await dework.TENANT_ROLE(), await tenant.getAddress());
    await dework.grantRole(await dework.ARBITRATOR_ROLE(), await disputeResolution.getAddress());
    // Add ADMIN_ROLE to DisputeResolution contract in Dework
    await dework.grantRole(await dework.ADMIN_ROLE(), await disputeResolution.getAddress());
    
    await disputeResolution.grantRole(await disputeResolution.ARBITRATOR_ROLE(), await arbitrator1.getAddress());
    await disputeResolution.grantRole(await disputeResolution.ARBITRATOR_ROLE(), await arbitrator2.getAddress());
    await disputeResolution.grantRole(await disputeResolution.ARBITRATOR_ROLE(), await arbitrator3.getAddress());

    // Mint USDC to tenant
    await usdc.mint(await tenant.getAddress(), ethers.parseUnits("1000", 6));
  });

  describe("Dispute Creation", function () {
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

    it("Should allow tenant to create dispute", async function () {
      const description = "Test dispute description";

      // Create dispute
      await disputeResolution.connect(tenant).createDispute(1, description);

      // Check dispute data
      const dispute = await disputeResolution.disputes(1);
      expect(dispute.tenant).to.equal(await tenant.getAddress());
      expect(dispute.landlord).to.equal(await landlord.getAddress());
      expect(dispute.description).to.equal(description);
      expect(dispute.resolved).to.equal(false);
    });

    it("Should not allow non-tenant to create dispute", async function () {
      const description = "Test dispute description";

      let error;
      try {
        await disputeResolution.connect(landlord).createDispute(1, description);
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.message.includes("Only tenant can create dispute")).to.equal(true);
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Create a lease and dispute
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

      await usdc.connect(tenant).approve(await dework.getAddress(), depositAmount);
      await dework.connect(tenant).deposit(1);
      
      // Raise dispute in Dework before creating it in DisputeResolution
      await dework.connect(tenant).raiseDispute(1);
      await disputeResolution.connect(tenant).createDispute(1, "Test dispute");
    });

    it("Should allow arbitrators to vote", async function () {
      // Initial votes
      const initialDispute = await disputeResolution.disputes(1);
      expect(Number(initialDispute.votesFor)).to.equal(0);
      expect(Number(initialDispute.votesAgainst)).to.equal(0);
      
      // Vote
      await disputeResolution.connect(arbitrator1).vote(1, true);

      // Check votes updated
      const dispute = await disputeResolution.disputes(1);
      expect(Number(dispute.votesFor)).to.equal(1);
      expect(Number(dispute.votesAgainst)).to.equal(0);
    });

    it("Should not allow non-arbitrators to vote", async function () {
      let error;
      try {
        await disputeResolution.connect(tenant).vote(1, true);
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.message.includes("AccessControl")).to.equal(true);
    });

    it("Should not allow double voting", async function () {
      // First vote
      await disputeResolution.connect(arbitrator1).vote(1, true);

      // Try to vote again
      let error;
      try {
        await disputeResolution.connect(arbitrator1).vote(1, false);
      } catch (e) {
        error = e;
      }
      
      expect(error).to.exist;
      expect(error.message.includes("Already voted")).to.equal(true);
    });

    it("Should resolve dispute when minimum votes reached", async function () {
      // Vote
      await disputeResolution.connect(arbitrator1).vote(1, true);
      await disputeResolution.connect(arbitrator2).vote(1, true);
      await disputeResolution.connect(arbitrator3).vote(1, false);

      // Check dispute was resolved
      const dispute = await disputeResolution.disputes(1);
      expect(dispute.resolved).to.equal(true);
      expect(Number(dispute.votesFor)).to.equal(2);
      expect(Number(dispute.votesAgainst)).to.equal(1);
      
      // Check lease status
      const lease = await dework.leases(1);
      expect(Number(lease.status)).to.equal(2); // Completed
    });
  });

  describe("Dispute Info", function () {
    it("Should return correct dispute information", async function () {
      // Create a lease and dispute
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

      await usdc.connect(tenant).approve(await dework.getAddress(), depositAmount);
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

      expect(disputeTenant).to.equal(await tenant.getAddress());
      expect(disputeLandlord).to.equal(await landlord.getAddress());
      expect(disputeDescription).to.equal(description);
      expect(Number(disputeVotesFor)).to.equal(0);
      expect(Number(disputeVotesAgainst)).to.equal(0);
      expect(disputeResolved).to.equal(false);
    });
  });
}); 