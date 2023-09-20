// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./RichBoyNFT.sol";

contract RichBoyTraitNFT is ERC721 {
    RichBoyNFT public rbNFT;
    mapping (address => bool) public alreadyMinted;
    uint256 public tokenIdCounter;
    uint256 public constant PREMIUM_MEMBER_REQUIREMENT = 2;

    constructor(address rbNFTAddress) ERC721("RichBoyTraitNFT", "RBTNFT") {
        rbNFT = RichBoyNFT(rbNFTAddress);
    }

    function mint() external {
        require(!alreadyMinted[msg.sender], "Only One Token/Account");
        require(rbNFT.balanceOf(msg.sender) > 0, "Allows Only RichBoyTraitNFT Owner");

        alreadyMinted[msg.sender] = true;
        uint256 tokenId = tokenIdCounter;
        tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
    }

    function isPremiumMember(address member) external view returns (bool) {
        return balanceOf(member) >= PREMIUM_MEMBER_REQUIREMENT;
    }
}