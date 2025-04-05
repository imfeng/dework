// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IERC4907.sol";


/**
 * The standard EIP-4907 is an extension of EIP-721. It proposes an additional role (user) which can
 * be granted to addresses, and a time where the role is automatically revoked (expires). The user role
 * represents permission to "use" the NFT, but not the ability to transfer it or set users.
 */
contract ERC4907 is ERC721, IERC4907 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    mapping(uint256 => UserInfo) private _users;
    
    string private _baseTokenURI;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_
    ) ERC721(name_, symbol_) {
        _baseTokenURI = baseTokenURI_;
    }

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
            _isApprovedOrOwner(msg.sender, tokenId),
            "ERC721: caller is not owner nor approved"
        );

        UserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;

        emit UpdateUser(tokenId, user, expires);
    }

    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(
        uint256 tokenId
    ) public view virtual override returns (address) {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        }
        return address(0);
    }

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(
        uint256 tokenId
    ) public view virtual override returns (uint256) {
        return _users[tokenId].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721) returns (bool) {
        return
            interfaceId == type(IERC4907).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Base URI for computing {tokenURI}.
     * Override from ERC721 to return the custom base URI.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        if (from != to && _users[tokenId].user != address(0)) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        }
    }
}
