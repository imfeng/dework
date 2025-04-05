// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Dework.sol";

contract InterestDistribution is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    Dework public immutable dework;
    IERC20 public immutable usdcToken;

    // Distribution ratios (in basis points, 10000 = 100%)
    uint256 public constant LANDLORD_RATIO = 7000; // 70%
    uint256 public constant PLATFORM_RATIO = 3000; // 30%

    // DeFi protocol integration
    address public defiProtocol;
    mapping(uint256 => uint256) public leaseYields;

    event YieldDeposited(uint256 indexed tokenId, uint256 amount);
    event YieldDistributed(uint256 indexed tokenId, uint256 landlordAmount, uint256 platformAmount);

    constructor(address _dework, address _usdcToken) {
        dework = Dework(_dework);
        usdcToken = IERC20(_usdcToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function setDefiProtocol(address _defiProtocol) external onlyRole(ADMIN_ROLE) {
        defiProtocol = _defiProtocol;
    }

    function depositYield(uint256 tokenId, uint256 amount) external {
        require(msg.sender == defiProtocol, "Only DeFi protocol can deposit yield");
        leaseYields[tokenId] += amount;
        emit YieldDeposited(tokenId, amount);
    }

    function distributeYield(uint256 tokenId) external {
        uint256 yieldAmount = leaseYields[tokenId];
        require(yieldAmount > 0, "No yield to distribute");

        // Get lease information
        (,,,uint256 startDate, uint256 endDate) = dework.getLeaseInfo(tokenId);
        require(block.timestamp >= endDate, "Lease not ended");

        // Calculate distribution amounts
        uint256 landlordAmount = (yieldAmount * LANDLORD_RATIO) / 10000;
        uint256 platformAmount = yieldAmount - landlordAmount;

        // Transfer to respective parties
        usdcToken.transfer(dework.leases(tokenId).landlord, landlordAmount);
        usdcToken.transfer(address(this), platformAmount);

        // Update lease information
        dework.leases(tokenId).interestEarned += yieldAmount;
        leaseYields[tokenId] = 0;

        emit YieldDistributed(tokenId, landlordAmount, platformAmount);
    }

    function withdrawPlatformFunds(uint256 amount) external onlyRole(ADMIN_ROLE) {
        usdcToken.transfer(msg.sender, amount);
    }
} 