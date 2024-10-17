// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../ValixPlaygroundNFT.sol";
import "./NFTWhitelist.sol";

contract NFTMarket {
    ValixPlaygroundNFT nft;
    NFTWhitelist whitelist;
    mapping(address => bool) private minted;
    error PermissionDenied();
    constructor(ValixPlaygroundNFT _nft, NFTWhitelist _whitelist) {
        nft = _nft;
        whitelist = _whitelist;
    }

    function buy() payable external {
        require(minted[msg.sender] == false, "already minted");
        require(msg.value == 1 ether, "insufficient");

        minted[msg.sender] = true;
        nft.safeMint(msg.sender);
    }

    function claim() external {
        require(minted[msg.sender] == false, "already minted");
        if (!hasWhitelist(msg.sender)) {
            revert PermissionDenied();
        }

        minted[msg.sender] = true;
        nft.safeMint(msg.sender);
    }

    function hasWhitelist(address user) public view returns (bool) {
        assembly { 
            let target := sload(1)
            let p := mload(0x40)
            mstore(p, shl(0xe0, 0x8cdb7e8b))
            mstore(add(p, 0x04), user)
            if iszero(staticcall(gas(), target, p, 0x24, p, 0x20)) {return(0, 0)}
            if and(not(iszero(returndatasize())), iszero(mload(p))) {return(0, 0)}
        }
        return true;
    }
}