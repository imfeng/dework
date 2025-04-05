// End-to-end testing script
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Load deployment information from deployments directory
function loadDeploymentInfo(network) {
  const deploymentsDir = path.join(__dirname, "../deployments");
  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment file not found for network ${network}`);
  }
  
  return JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
}

async function main() {
  console.log("Starting end-to-end testing...");
  
  // Load deployment information
  const network = hre.network.name;
  console.log(`Network: ${network}`);
  
  const deployment = loadDeploymentInfo(network);
  console.log("Loaded deployment information");
  
  // Create contract instances
  const mockUSDC = await hre.ethers.getContractAt("MockUSDC", deployment.contracts.mockUSDC);
  const dework = await hre.ethers.getContractAt("Dework", deployment.contracts.dework);
  const interestDistribution = await hre.ethers.getContractAt("InterestDistribution", deployment.contracts.interestDistribution);
  const disputeResolution = await hre.ethers.getContractAt("DisputeResolution", deployment.contracts.disputeResolution);
  
  // Get signers
  const [owner, landlord, tenant, arbitrator] = await hre.ethers.getSigners();
  console.log(`Owner: ${owner.address}`);
  console.log(`Landlord: ${landlord.address}`);
  console.log(`Tenant: ${tenant.address}`);
  console.log(`Arbitrator: ${arbitrator.address}`);
  
  // Setup roles
  console.log("Setting up roles...");
  const LANDLORD_ROLE = await dework.LANDLORD_ROLE();
  const TENANT_ROLE = await dework.TENANT_ROLE();
  const ARBITRATOR_ROLE = await dework.ARBITRATOR_ROLE();
  
  await dework.grantRole(LANDLORD_ROLE, landlord.address);
  await dework.grantRole(TENANT_ROLE, tenant.address);
  await dework.grantRole(ARBITRATOR_ROLE, arbitrator.address);
  await disputeResolution.grantRole(ARBITRATOR_ROLE, arbitrator.address);
  
  console.log("Roles assigned");
  
  // Mint USDC to tenant and owner (for interest distribution)
  const tenantAmount = hre.ethers.parseUnits("1000", 6);
  const ownerAmount = hre.ethers.parseUnits("500", 6);
  
  await mockUSDC.mint(tenant.address, tenantAmount);
  await mockUSDC.mint(owner.address, ownerAmount);
  
  console.log(`Minted ${tenantAmount} USDC to tenant`);
  console.log(`Minted ${ownerAmount} USDC to owner (for simulating DeFi yield)`);
  
  // E2E Test Workflow:
  // 1. Create Lease
  console.log("\n1. Creating lease...");
  const depositAmount = hre.ethers.parseUnits("100", 6);
  const duration = 30 * 24 * 60 * 60; // 30 days
  const ensName = "dework.eth";
  const worldId = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("dework-world-id"));
  const metadataURI = "ipfs://QmXyZ123456789";
  
  let tx = await dework.connect(landlord).createLease(
    tenant.address,
    depositAmount,
    duration,
    ensName,
    worldId,
    metadataURI
  );
  
  let receipt = await tx.wait();
  console.log("Lease created");
  
  // // Get lease ID
  const leaseId = 1; // First lease
  
  // 2. Tenant Deposits
  console.log("\n2. Tenant depositing funds...");
  await mockUSDC.connect(tenant).approve(dework.getAddress(), depositAmount);
  tx = await dework.connect(tenant).deposit(leaseId);
  await tx.wait();
  
  console.log(`Tenant deposited ${depositAmount} USDC`);
  
  // 3. Simulate DeFi Protocol Yield
  console.log("\n3. Simulating DeFi protocol yield...");
  const yieldAmount = hre.ethers.parseUnits("10", 6);
  
  // Transfer USDC to interestDistribution
  await mockUSDC.connect(owner).approve(interestDistribution.getAddress(), yieldAmount);
  await mockUSDC.connect(owner).transfer(interestDistribution.getAddress(), yieldAmount);
  
  // Deposit yield on behalf of the DeFi protocol
  tx = await interestDistribution.connect(owner).depositYield(leaseId, yieldAmount);
  await tx.wait();
  
  console.log(`Deposited ${yieldAmount} USDC as yield for lease #${leaseId}`);
  
  // // 4. Fast forward time to end of lease
  // console.log("\n4. Fast forwarding time to end of lease...");
  // await hre.network.provider.send("evm_increaseTime", [duration]);
  // await hre.network.provider.send("evm_mine");
  
  // console.log("Time fast-forwarded to end of lease");
  
  // // 5. Distribute Yield
  // console.log("\n5. Distributing yield...");
  // tx = await interestDistribution.distributeYield(leaseId);
  // await tx.wait();
  
  // console.log("Yield distributed");
  
  // 6. Landlord Releases Deposit
  console.log("\n6. Releasing deposit to tenant...");
  tx = await dework.connect(landlord).releaseDeposit(leaseId, tenant.address, depositAmount);
  await tx.wait();
  
  console.log(`Deposit of ${depositAmount} USDC released to tenant`);
  
  // 7. Check Final Balances
  console.log("\n7. Checking final balances...");
  
  const landlordBalance = await mockUSDC.balanceOf(landlord.address);
  const tenantBalance = await mockUSDC.balanceOf(tenant.address);
  const platformBalance = await mockUSDC.balanceOf(interestDistribution.getAddress());
  
  console.log(`Landlord USDC balance: ${landlordBalance}`);
  console.log(`Tenant USDC balance: ${tenantBalance}`);
  console.log(`Platform USDC balance: ${platformBalance}`);
  
  console.log("\nEnd-to-end test completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
