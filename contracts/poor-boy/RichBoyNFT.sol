// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RichBoyNFT is ERC721, Ownable {
    uint256 public tokenIdCounter;

    constructor() ERC721("RichBoyNFT", "RBNFT") { 
        tokenIdCounter = 1;
    }

    function allocateForLendingPool(address lendingPool) external onlyOwner {
        _safeMint(lendingPool, 0);
    }

    function mint(address to) external payable {
        require(msg.value == 1 ether, "Please send 1 ETH");
        uint256 tokenId = tokenIdCounter;
        tokenIdCounter++;
        _safeMint(to, tokenId);
    }
}