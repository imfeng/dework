// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC4907.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RentalNFT is ERC4907 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    constructor(
        string memory name,
        string memory symbol
    ) ERC4907(name, symbol) {}

    function mint(uint256 tokenId, address to) public {
        _mint(to, tokenId);
    }
    
    function nftMint() public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        return tokenId;
    }
}
