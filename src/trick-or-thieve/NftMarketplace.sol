// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./ValixPlaygroundTokenLite.sol";
import "../ValixPlaygroundNFT.sol";

// NFT Simple Marketplace adapted from: https://github.com/PatrickAlphaC/hardhat-nft-marketplace-fcc/blob/main/contracts/NftMarketplace.sol

contract NftMarketplace is ReentrancyGuard {
    ValixPlaygroundTokenLite public immutable token;
    ValixPlaygroundNFT public immutable nft;

    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );
    event ItemCanceled(address indexed seller, uint256 indexed tokenId);
    event ItemBought(
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 price
    );

    mapping(uint256 => Listing) private listings;

    constructor(ValixPlaygroundTokenLite _token, ValixPlaygroundNFT _nft) {
        token = _token;
        nft = _nft;
    }

    modifier notListed(uint256 tokenId) {
        Listing memory listing = listings[tokenId];
        require(listing.price == 0, "Already listed");
        _;
    }

    modifier isListed(uint256 tokenId) {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Not listed");
        _;
    }

    modifier isOwner(uint256 tokenId) {
        require(msg.sender == nft.ownerOf(tokenId), "Permission denied");
        _;
    }

    function listItem(
        uint256 tokenId,
        uint256 price
    ) external isOwner(tokenId) notListed(tokenId) {
        require(price > 0, "Listing price must above zero");
        require(
            nft.getApproved(tokenId) == address(this),
            "No Approval For Marketplace"
        );

        listings[tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, tokenId, price);
    }

    function cancelListing(
        uint256 tokenId
    ) external isOwner(tokenId) isListed(tokenId) {
        delete (listings[tokenId]);
        emit ItemCanceled(msg.sender, tokenId);
    }

    function buyItem(
        uint256 tokenId
    ) external payable isListed(tokenId) nonReentrant {
        require(
            msg.sender != nft.ownerOf(tokenId),
            "Owner cannot buy their owned item"
        );
        Listing memory listedItem = listings[tokenId];

        delete (listings[tokenId]);
        token.transferFrom(msg.sender, listedItem.seller, listedItem.price);
        nft.safeTransferFrom(listedItem.seller, msg.sender, tokenId);

        emit ItemBought(msg.sender, tokenId, listedItem.price);
    }

    function updateListing(
        uint256 tokenId,
        uint256 newPrice
    ) external isOwner(tokenId) isListed(tokenId) nonReentrant {
        require(newPrice > 0, "Listing price must above zero");
        listings[tokenId].price = newPrice;
        emit ItemListed(msg.sender, tokenId, newPrice);
    }

    function getListing(
        uint256 tokenId
    ) external view returns (Listing memory) {
        return listings[tokenId];
    }
}
