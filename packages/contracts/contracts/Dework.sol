// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC4907.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dework is ERC4907, AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant LANDLORD_ROLE = keccak256("LANDLORD_ROLE");
    bytes32 public constant TENANT_ROLE = keccak256("TENANT_ROLE");

    // USDC token contract
    IERC20 public immutable usdcToken;

    // Lease information
    struct Lease {
        uint256 depositAmount;
        uint256 startDate;
        uint256 endDate;
        uint256 interestEarned;
        uint8 status; // 0: Not Started, 1: Active, 2: Completed, 3: Disputed
        address landlord;
        address tenant;
        string ensName;
        bytes32 worldId;
    }

    // Mapping from token ID to lease information
    mapping(uint256 => Lease) public leases;
    
    // Mapping from user address to role
    mapping(address => bytes32) public userRoles;

    // Events
    event LeaseCreated(uint256 indexed tokenId, address indexed landlord, address indexed tenant);
    event DepositReceived(uint256 indexed tokenId, uint256 amount);
    event InterestEarned(uint256 indexed tokenId, uint256 amount);
    event DisputeRaised(uint256 indexed tokenId, address indexed by);
    event DisputeResolved(uint256 indexed tokenId, bool approved);

    constructor(address _usdcToken) ERC4907("Dework Lease", "DWORK") {
        usdcToken = IERC20(_usdcToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Modifiers
    modifier onlyLandlord(uint256 tokenId) {
        require(leases[tokenId].landlord == msg.sender, "Not the landlord");
        _;
    }

    modifier onlyTenant(uint256 tokenId) {
        require(leases[tokenId].tenant == msg.sender, "Not the tenant");
        _;
    }

    // Functions
    function createLease(
        address tenant,
        uint256 depositAmount,
        uint256 duration,
        string memory ensName,
        bytes32 worldId
    ) external onlyRole(LANDLORD_ROLE) returns (uint256) {
        uint256 tokenId = totalSupply() + 1;
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + duration;

        leases[tokenId] = Lease({
            depositAmount: depositAmount,
            startDate: startDate,
            endDate: endDate,
            interestEarned: 0,
            status: 0,
            landlord: msg.sender,
            tenant: tenant,
            ensName: ensName,
            worldId: worldId
        });

        _mint(tenant, tokenId);
        _setUser(tokenId, tenant, uint64(endDate));

        emit LeaseCreated(tokenId, msg.sender, tenant);
        return tokenId;
    }

    function deposit(uint256 tokenId) external {
        Lease storage lease = leases[tokenId];
        require(lease.status == 0, "Lease already started");
        require(msg.sender == lease.tenant, "Only tenant can deposit");

        uint256 amount = lease.depositAmount;
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        lease.status = 1;
        emit DepositReceived(tokenId, amount);
    }

    function raiseDispute(uint256 tokenId) external onlyTenant(tokenId) {
        Lease storage lease = leases[tokenId];
        require(lease.status == 1, "Lease not active");
        
        lease.status = 3;
        emit DisputeRaised(tokenId, msg.sender);
    }

    function resolveDispute(uint256 tokenId, bool approved) external onlyRole(ADMIN_ROLE) {
        Lease storage lease = leases[tokenId];
        require(lease.status == 3, "No active dispute");

        if (approved) {
            // Return deposit to tenant
            usdcToken.transfer(lease.tenant, lease.depositAmount);
        } else {
            // Return deposit to landlord
            usdcToken.transfer(lease.landlord, lease.depositAmount);
        }

        lease.status = 2;
        emit DisputeResolved(tokenId, approved);
    }

    // Override ERC721 transfer functions to prevent transfers
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0) || to == address(0), "Transfers not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // View functions
    function getLeaseInfo(uint256 tokenId) external view returns (
        uint256 depositAmount,
        uint256 interestEarned,
        uint8 status,
        uint256 startDate,
        uint256 endDate
    ) {
        Lease memory lease = leases[tokenId];
        return (
            lease.depositAmount,
            lease.interestEarned,
            lease.status,
            lease.startDate,
            lease.endDate
        );
    }
} 