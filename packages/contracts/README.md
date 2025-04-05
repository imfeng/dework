
# Dework Protocol Documentation

## Overview
Dework is a blockchain-based property leasing protocol that enables secure and transparent lease management between landlords and tenants. The protocol handles security deposits, rental rights, dispute resolution, and yield generation from deposited funds.

## Core Components
- **Dework**: Main contract handling leases, deposits, and rental management
- **DisputeResolution**: Decentralized dispute resolution system with arbitrator voting
- **InterestDistribution**: Manages yield generated from deposited funds and its distribution

## Use Cases

### 1. Lease Creation and Management

**For Landlords:**
- Create property leases with customizable parameters:
  - Deposit amount requirements
  - Lease duration
  - ENS domain integration
  - World ID verification
  - Metadata URI for property details
- View active leases and their status
- Release deposits partially or fully when lease conditions are met
- Claim interest generated from security deposits

**For Tenants:**
- Browse available properties through their metadata
- Complete security deposits (full or partial payments)
- Occupy properties through the ERC4907 rental standard
- Initiate disputes if necessary

**Example:**
```javascript
// Landlord creates a new lease
await dework.connect(landlord).createLease(
  tenantAddress,
  ethers.parseUnits("100", 6), // 100 USDC deposit
  30 * 24 * 60 * 60, // 30 days duration
  "property.eth",
  worldIdHash,
  "ipfs://property-metadata"
);
```

### 2. Security Deposit Handling

**Features:**
- Secure USDC-based deposit system
- Support for full or partial deposits
- Automated status tracking (Not Started, Active, Completed, Disputed)
- Flexible deposit release mechanism

**For Tenants:**
- Make full deposits to activate leases immediately
- Make partial deposits to gradually fund lease requirements
- Receive deposit refunds when leases end successfully

**For Landlords:**
- Release deposits partially during lease
- Release full deposit upon successful completion

**Example:**
```javascript
// Tenant approves and deposits funds
await usdc.connect(tenant).approve(deworkAddress, depositAmount);
await dework.connect(tenant).deposit(leaseId);

// Or make a partial deposit
await dework.connect(tenant).partialDeposit(leaseId, partialAmount);

// Landlord releases deposit at end of lease
await dework.connect(landlord).releaseDeposit(leaseId, tenantAddress, depositAmount);
```

### 3. ERC4907 User Rental Functionality

**Features:**
- Implementation of EIP-4907 standard for NFT rental
- Time-limited user rights assignment
- Automatic expiration of rental rights

**For Tenants:**
- Receive digital access rights through NFT user assignment
- Rights automatically expire after lease period
- Proof of tenancy through blockchain verification

**For Landlords:**
- Grant temporary usage rights without transferring ownership
- Automatic revocation of rights upon expiration

**Example:**
```javascript
// User rights are assigned during lease creation
// View current user of a property
const currentUser = await dework.userOf(tokenId);

// Check when user rights expire
const expiration = await dework.userExpires(tokenId);

// Admin can update user rights if needed
await dework.connect(admin).setUser(tokenId, newUser, newExpiration);
```

### 4. Interest/Yield Management

**Features:**
- Deposit funds can generate yield through DeFi integrations
- Interest distribution between landlords and platform
- Secure claiming mechanism

**For Landlords:**
- Earn passive income from deposit funds
- Claim interest after it's generated

**For Protocol/Admin:**
- Track interest earned on deposits
- Distribute interest according to predefined rules
- Retain platform fee from generated yield

**Example:**
```javascript
// DeFi protocol deposits yield for a lease
await interestDistribution.connect(defiProtocol).depositYield(leaseId, yieldAmount);

// Landlord claims accrued interest
await dework.connect(landlord).claimInterest(leaseId);

// Admin distributes yield after lease ends
await interestDistribution.distributeYield(leaseId);
```

### 5. Dispute Resolution

**Features:**
- Tenant-initiated dispute system
- Multi-arbitrator voting mechanism
- Automatic deposit distribution based on resolution

**For Tenants:**
- Raise disputes for lease-related issues
- Potential deposit recovery based on arbitration outcome

**For Arbitrators:**
- Vote on disputes with transparent recording
- Contribute to decentralized decision-making

**For Admins:**
- Oversee dispute resolution process
- Execute final dispute resolutions

**Example:**
```javascript
// Tenant raises a dispute
await dework.connect(tenant).raiseDispute(leaseId);

// DisputeResolution contract handles the case
await disputeResolution.connect(tenant).createDispute(leaseId, "Description of issue");

// Arbitrators vote on the dispute
await disputeResolution.connect(arbitrator1).vote(leaseId, true); // Support tenant
await disputeResolution.connect(arbitrator2).vote(leaseId, false); // Support landlord

// After minimum votes, dispute is automatically resolved
// Deposit goes to tenant if approved, landlord if rejected
```

### 6. Administrative Functions

**Features:**
- Role-based access control (RBAC) system
- Platform fund management
- Process oversight and intervention capabilities

**For Admins:**
- Grant roles (LANDLORD_ROLE, TENANT_ROLE, ARBITRATOR_ROLE)
- Resolve disputes when necessary
- Withdraw platform funds

**Example:**
```javascript
// Grant roles
await dework.grantRole(await dework.LANDLORD_ROLE(), landlordAddress);
await disputeResolution.grantRole(await disputeResolution.ARBITRATOR_ROLE(), arbitratorAddress);

// Admin resolves a dispute directly
await dework.connect(admin).resolveDispute(leaseId, true);

// Withdraw platform funds
await interestDistribution.connect(admin).withdrawPlatformFunds(amount);
```

## Integration Flow

1. **Lease Creation**: Landlord creates a lease specifying deposit, duration, and tenant
2. **Deposit Payment**: Tenant approves and deposits USDC to activate the lease
3. **Active Lease**: Tenant receives user rights via ERC4907 for the lease duration
4. **Yield Generation**: Deposits generate yield through DeFi integrations
5. **Normal Completion**: Landlord releases deposit to tenant, claims interest
6. **Dispute Scenario**: Tenant raises dispute, arbitrators vote, funds distributed based on outcome

## Security Considerations

- All deposit and yield transactions use the secure ERC20 approve/transferFrom pattern
- Role-based access control restricts sensitive operations
- Non-reentrant modifiers protect against reentrancy attacks
- Status checks prevent invalid state transitions
- Decentralized dispute resolution minimizes central authority risks
