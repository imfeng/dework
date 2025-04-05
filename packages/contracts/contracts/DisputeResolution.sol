// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./Dework.sol";

contract DisputeResolution is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");
    
    Dework public immutable dework;

    struct Dispute {
        uint256 tokenId;
        address tenant;
        address landlord;
        string description;
        uint256 createdAt;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasVoted;
        bool resolved;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTES = 3;

    event DisputeCreated(uint256 indexed tokenId, string description);
    event VoteCast(uint256 indexed tokenId, address indexed voter, bool support);
    event DisputeResolved(uint256 indexed tokenId, bool approved);

    constructor(address _dework) {
        dework = Dework(_dework);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Helper function to get lease tenant
    function getLeaseTenant(uint256 tokenId) internal view returns (address) {
        (,,,,, , , address tenant,,, ) = dework.leases(tokenId);
        return tenant;
    }

    // Helper function to get lease landlord
    function getLeaseLandlord(uint256 tokenId) internal view returns (address) {
        (,,,,, , address landlord,,,, ) = dework.leases(tokenId);
        return landlord;
    }

    function createDispute(uint256 tokenId, string memory description) external {
        require(getLeaseTenant(tokenId) == msg.sender, "Only tenant can create dispute");
        require(!disputes[tokenId].resolved, "Dispute already resolved");

        Dispute storage dispute = disputes[tokenId];
        dispute.tokenId = tokenId;
        dispute.tenant = msg.sender;
        dispute.landlord = getLeaseLandlord(tokenId);
        dispute.description = description;
        dispute.createdAt = block.timestamp;
        dispute.resolved = false;

        emit DisputeCreated(tokenId, description);
    }

    function vote(uint256 tokenId, bool support) external onlyRole(ARBITRATOR_ROLE) {
        Dispute storage dispute = disputes[tokenId];
        require(!dispute.hasVoted[msg.sender], "Already voted");
        require(block.timestamp <= dispute.createdAt + VOTING_PERIOD, "Voting period ended");
        require(!dispute.resolved, "Dispute already resolved");

        dispute.hasVoted[msg.sender] = true;
        if (support) {
            dispute.votesFor++;
        } else {
            dispute.votesAgainst++;
        }

        emit VoteCast(tokenId, msg.sender, support);

        // Check if voting should be finalized
        if (dispute.votesFor + dispute.votesAgainst >= MIN_VOTES) {
            _finalizeVoting(tokenId);
        }
    }

    function _finalizeVoting(uint256 tokenId) internal {
        Dispute storage dispute = disputes[tokenId];
        require(!dispute.resolved, "Already resolved");

        bool approved = dispute.votesFor > dispute.votesAgainst;
        dispute.resolved = true;

        // Resolve the dispute in the main contract
        dework.resolveDispute(tokenId, approved);

        emit DisputeResolved(tokenId, approved);
    }

    function getDisputeInfo(uint256 tokenId) external view returns (
        address tenant,
        address landlord,
        string memory description,
        uint256 createdAt,
        uint256 votesFor,
        uint256 votesAgainst,
        bool resolved
    ) {
        Dispute storage dispute = disputes[tokenId];
        return (
            dispute.tenant,
            dispute.landlord,
            dispute.description,
            dispute.createdAt,
            dispute.votesFor,
            dispute.votesAgainst,
            dispute.resolved
        );
    }
} 