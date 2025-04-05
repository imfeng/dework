// 部署腳本
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get signers
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy USDC mock token for testing
  const USDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await USDC.deploy();
  await usdc.deployed();
  console.log("USDC deployed to:", usdc.address);

  // Deploy Dework main contract
  const Dework = await hre.ethers.getContractFactory("Dework");
  const dework = await Dework.deploy(usdc.address);
  await dework.deployed();
  console.log("Dework deployed to:", dework.address);

  // Deploy InterestDistribution contract
  const InterestDistribution = await hre.ethers.getContractFactory("InterestDistribution");
  const interestDistribution = await InterestDistribution.deploy(dework.address, usdc.address);
  await interestDistribution.deployed();
  console.log("InterestDistribution deployed to:", interestDistribution.address);

  // Deploy DisputeResolution contract
  const DisputeResolution = await hre.ethers.getContractFactory("DisputeResolution");
  const disputeResolution = await DisputeResolution.deploy(dework.address);
  await disputeResolution.deployed();
  console.log("DisputeResolution deployed to:", disputeResolution.address);

  // Grant roles
  await dework.grantRole(await dework.LANDLORD_ROLE(), deployer.address);
  await dework.grantRole(await dework.TENANT_ROLE(), deployer.address);
  console.log("Roles granted to deployer");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    usdc: usdc.address,
    dework: dework.address,
    interestDistribution: interestDistribution.address,
    disputeResolution: disputeResolution.address,
    deployer: deployer.address,
  };

  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });