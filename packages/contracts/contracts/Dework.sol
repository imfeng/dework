// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../core/ERC4907.sol";

contract Dework is ERC4907, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant LANDLORD_ROLE = keccak256("LANDLORD_ROLE");
    bytes32 public constant TENANT_ROLE = keccak256("TENANT_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // USDC token contract
    IERC20 public immutable usdcToken;

    // Lease information
    struct Lease {
        uint256 depositAmount;
        uint256 depositBalance;
        uint256 startDate;
        uint256 endDate;
        uint256 interestEarned;
        uint8 status; // 0: Not Started, 1: Active, 2: Completed, 3: Disputed
        address landlord;
        address tenant;
        string ensName;
        bytes32 worldId;
        string metadataURI;
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
    event DepositUpdated(uint256 indexed tokenId, address indexed to, uint256 amount, bool isDeposit);
    event InterestClaimed(uint256 indexed tokenId, address indexed by, uint256 amount);

    // Add the missing UserInfo struct definition
    struct DeworkUserInfo {
        address user; // address of user role
        uint64 expires; // unix timestamp, user expires
    }
    
    // Add the missing _users mapping
    mapping(uint256 => DeworkUserInfo) private _users;
    
    /// @notice set the user and expires of a NFT
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public virtual override {
        require(
            _isApprovedOrOwner(msg.sender, tokenId) || hasRole(ADMIN_ROLE, msg.sender),
            "ERC721: caller is not owner nor approved nor admin"
        );

        DeworkUserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;

        emit UpdateUser(tokenId, user, expires);
    }

    constructor(address _usdcToken, string memory _baseURI) ERC4907("Dework Lease", "DWORK", _baseURI) {
        usdcToken = IERC20(_usdcToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ARBITRATOR_ROLE, msg.sender);
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
        bytes32 worldId,
        string memory metadataURI
    ) external onlyRole(LANDLORD_ROLE) returns (uint256) {
        require(depositAmount > 0, "Deposit amount must be greater than 0");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + duration;

        leases[tokenId] = Lease({
            depositAmount: depositAmount,
            depositBalance: 0,
            startDate: startDate,
            endDate: endDate,
            interestEarned: 0,
            status: 0,
            landlord: msg.sender,
            tenant: tenant,
            ensName: ensName,
            worldId: worldId,
            metadataURI: metadataURI
        });

        _mint(tenant, tokenId);
        
        // Set the user through the standard interface without calling the parent method
        DeworkUserInfo storage info = _users[tokenId];
        info.user = tenant;
        info.expires = uint64(endDate);
        emit UpdateUser(tokenId, tenant, uint64(endDate));

        emit LeaseCreated(tokenId, msg.sender, tenant);
        return tokenId;
    }

    function deposit(uint256 tokenId) external {
        Lease storage lease = leases[tokenId];
        require(lease.status == 0, "Lease already started");
        require(msg.sender == lease.tenant, "Only tenant can deposit");
        require(lease.depositBalance + lease.depositAmount <= lease.depositAmount, "Deposit exceeds required amount");

        uint256 amount = lease.depositAmount;
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        lease.depositBalance += amount;
        lease.status = 1;
        
        emit DepositReceived(tokenId, amount);
        emit DepositUpdated(tokenId, msg.sender, amount, true);
    }

    function partialDeposit(uint256 tokenId, uint256 amount) external {
        Lease storage lease = leases[tokenId];
        require(lease.status == 0, "Lease already started");
        require(msg.sender == lease.tenant, "Only tenant can deposit");
        require(amount > 0, "Deposit amount must be greater than 0");
        require(lease.depositBalance + amount <= lease.depositAmount, "Deposit exceeds required amount");

        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        lease.depositBalance += amount;
        
        // If deposit is complete, mark lease as active
        if (lease.depositBalance == lease.depositAmount) {
            lease.status = 1;
        }
        
        emit DepositReceived(tokenId, amount);
        emit DepositUpdated(tokenId, msg.sender, amount, true);
    }

    function releaseDeposit(uint256 tokenId, address to, uint256 amount) external onlyLandlord(tokenId) nonReentrant {
        Lease storage lease = leases[tokenId];
        require(lease.status == 1 || lease.status == 2, "Lease not active or completed");
        require(lease.depositBalance >= amount, "Insufficient deposit balance");
        
        lease.depositBalance -= amount;
        
        // If deposit is fully released, mark lease as completed
        if (lease.depositBalance == 0) {
            lease.status = 2;
        }
        
        require(usdcToken.transfer(to, amount), "Transfer failed");
        
        emit DepositUpdated(tokenId, to, amount, false);
    }

    function addInterestEarned(uint256 tokenId, uint256 amount) external onlyRole(ADMIN_ROLE) {
        Lease storage lease = leases[tokenId];
        require(lease.status == 1, "Lease not active");
        
        lease.interestEarned += amount;
        
        emit InterestEarned(tokenId, amount);
    }

    function claimInterest(uint256 tokenId) external onlyLandlord(tokenId) nonReentrant {
        Lease storage lease = leases[tokenId];
        require(lease.status == 1 || lease.status == 2, "Lease not active or completed");
        require(lease.interestEarned > 0, "No interest to claim");
        
        uint256 interestAmount = lease.interestEarned;
        lease.interestEarned = 0;
        
        require(usdcToken.transfer(msg.sender, interestAmount), "Transfer failed");
        
        emit InterestClaimed(tokenId, msg.sender, interestAmount);
    }

    function raiseDispute(uint256 tokenId) external onlyTenant(tokenId) {
        Lease storage lease = leases[tokenId];
        require(lease.status == 1, "Lease not active");
        
        lease.status = 3;
        emit DisputeRaised(tokenId, msg.sender);
    }

    function resolveDispute(uint256 tokenId, bool approved) external onlyRole(ARBITRATOR_ROLE) nonReentrant {
        Lease storage lease = leases[tokenId];
        require(lease.status == 3, "No active dispute");

        if (approved) {
            // Return deposit to tenant
            require(usdcToken.transfer(lease.tenant, lease.depositBalance), "Transfer failed");
        } else {
            // Return deposit to landlord
            require(usdcToken.transfer(lease.landlord, lease.depositBalance), "Transfer failed");
        }

        lease.depositBalance = 0;
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
        // Only restrict transfers, not initial minting or burning
        if (from != address(0) && to != address(0)) {
            require(false, "Transfers not allowed");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // View functions
    function getLeaseInfo(uint256 tokenId) external view returns (
        uint256 depositAmount,
        uint256 depositBalance,
        uint256 interestEarned,
        uint8 status,
        uint256 startDate,
        uint256 endDate,
        string memory metadataURI
    ) {
        Lease memory lease = leases[tokenId];
        return (
            lease.depositAmount,
            lease.depositBalance,
            lease.interestEarned,
            lease.status,
            lease.startDate,
            lease.endDate,
            lease.metadataURI
        );
    }

    function getEscrowBalance(uint256 tokenId) external view returns (uint256) {
        return leases[tokenId].depositBalance;
    }
    
    function leaseMetadata(uint256 tokenId) external view returns (string memory) {
        return leases[tokenId].metadataURI;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC4907, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 