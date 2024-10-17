// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ValixPlaygroundNFT is ERC721, Ownable {
    uint256 public tokenIdCounter;
    constructor() ERC721("ValixPlaygroundNFT", "VLXPNFT") {}

    function safeMint(address to) public onlyOwner returns (uint256 tokenId) {
        tokenId = tokenIdCounter;
        _safeMint(to, tokenId);
        ++tokenIdCounter;
    }
}