// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GamblingOracle is Ownable {
    mapping(address => bool) public authorized;

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Allow only authorized");
        _;
    }

    function addAuthorized(address contractAddr) external onlyOwner() {
        authorized[contractAddr] = true;
    }

    function removeAuthorized(address contractAddr) external onlyOwner() {
        authorized[contractAddr] = false;
    }  

    function getLuckyNumber(uint256 guess) external view onlyAuthorized() returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.number, guess))) % 10;
    }
}