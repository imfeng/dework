// 部署腳本
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment to HashKey network...");
  
  // Get the contract factories
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  
  // Deploy MockUSDC first (only on testnet, on mainnet we'd use the real USDC address)
  console.log("Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log(`MockUSDC deployed to: ${mockUSDCAddress}`);
  
  // Deploy Dework
  console.log("Deploying Dework...");
  const Dework = await hre.ethers.getContractFactory("Dework");
  const dework = await Dework.deploy(mockUSDCAddress, "");
  await dework.waitForDeployment();
  
  const deworkAddress = await dework.getAddress();
  console.log(`Dework deployed to: ${deworkAddress}`);
  
  // Deploy InterestDistribution
  console.log("Deploying InterestDistribution...");
  const InterestDistribution = await hre.ethers.getContractFactory("InterestDistribution");
  const interestDistribution = await InterestDistribution.deploy(deworkAddress, mockUSDCAddress);
  await interestDistribution.waitForDeployment();
  
  const interestDistributionAddress = await interestDistribution.getAddress();
  console.log(`InterestDistribution deployed to: ${interestDistributionAddress}`);
  
  // Deploy DisputeResolution
  console.log("Deploying DisputeResolution...");
  const DisputeResolution = await hre.ethers.getContractFactory("DisputeResolution");
  const disputeResolution = await DisputeResolution.deploy(deworkAddress);
  await disputeResolution.waitForDeployment();
  
  const disputeResolutionAddress = await disputeResolution.getAddress();
  console.log(`DisputeResolution deployed to: ${disputeResolutionAddress}`);
  
  // Set up roles and permissions
  console.log("Setting up roles and permissions...");
  
  // Grant ADMIN_ROLE to InterestDistribution
  const ADMIN_ROLE = await dework.ADMIN_ROLE();
  await dework.grantRole(ADMIN_ROLE, interestDistributionAddress);
  console.log("Granted ADMIN_ROLE to InterestDistribution contract");
  
  // Define a sample DeFi protocol address (this would be different in production)
  const defiProtocolAddress = deployer.address; // Using deployer as mock DeFi protocol for now
  
  // Set DeFi protocol in InterestDistribution
  await interestDistribution.setDefiProtocol(defiProtocolAddress);
  console.log(`Set DeFi protocol to: ${defiProtocolAddress}`);
  
  // Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      mockUSDC: mockUSDCAddress,
      dework: deworkAddress,
      interestDistribution: interestDistributionAddress,
      disputeResolution: disputeResolutionAddress
    },
    defiProtocol: defiProtocolAddress
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  // Save deployment info to JSON file
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`Deployment information saved to ${deploymentFile}`);
  
  console.log("Deployment completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });