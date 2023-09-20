// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./TheCollectorNFT.sol";
import "../ValixPlaygroundToken.sol";

contract TheCollectorMarket {
    uint256 public constant BASE_PRICE = 100e18;
    uint256 public constant MINIMUM_PRICE = 25e18;
    TheCollectorNFT public immutable nft;
    ValixPlaygroundToken public immutable token;

    event Buy(address indexed sender, uint256 indexed tokenId, uint256 price);

    constructor(ValixPlaygroundToken _token, TheCollectorNFT _nft) {
        token = _token;
        nft = _nft;
    }

    function calculatePrice() public view returns (uint256) {
        uint256 balances = nft.balanceOf(msg.sender);
        if (balances > 0) {
            uint256 reducedPrice = BASE_PRICE / balances;
            uint256 newPrice = reducedPrice <= MINIMUM_PRICE ? MINIMUM_PRICE : reducedPrice;

            return newPrice;
        } else {
            return BASE_PRICE;
        }
    }

    function buy() external {
        uint256 tokenId = nft.safeMint(msg.sender);
        uint256 price = calculatePrice();
        token.transferFrom(msg.sender, address(this), price);
        emit Buy(msg.sender, tokenId, price);
    }
}