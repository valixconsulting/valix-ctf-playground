// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SchoolRunner is Ownable {
    uint256 public constant FIRST_PLACE_REWARD = 5 ether;
    uint256 public constant SECOND_PLACE_REWARD = 4 ether;
    uint256 public constant THIRD_PLACE_REWARD = 3 ether;
    uint256 public constant FOURTH_PLACE_REWARD = 2 ether;
    uint256 public constant FIFTH_PLACE_REWARD = 1 ether;

    uint256 public positionCount;
    mapping(uint256 => address) public studentPositions;

    function register() external {
        require(positionCount < 5);
        studentPositions[positionCount] = msg.sender;
        positionCount++;
    }

    function depositReward() external payable onlyOwner {
        require(msg.value == 15 ether);
    }

    function distributeReward() external onlyOwner {
        uint256[5] memory rewards = [
            FIRST_PLACE_REWARD,
            SECOND_PLACE_REWARD,
            THIRD_PLACE_REWARD,
            FOURTH_PLACE_REWARD,
            FIFTH_PLACE_REWARD
        ];

        for (uint256 i; i < 5; i++) {
            address student = studentPositions[i];
            uint256 amount = rewards[i];
            (bool sent, ) = student.call{value: amount}("");
            require(sent);
        }
    }

    receive() external payable {}
}