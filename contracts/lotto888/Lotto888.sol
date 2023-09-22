// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GamblingOracle.sol";

contract Lotto888 is Ownable {
    GamblingOracle public oracle;
    mapping(address => bool) public winner;

    event Deposit(uint256 value);
    event BetPlaced(address indexed player, uint256 guess, uint256 random, bool isWinner);
    constructor(address _oracle) {
        oracle = GamblingOracle(_oracle);
    }

    function placeBet(uint256 guess) external payable {
        require(msg.value == 0.1 ether, "Require 0.1 ether to place a bet");
        require(!winner[msg.sender], "Winner only bet once");

        uint256 answer = oracle.getLuckyNumber(guess);
        if (guess == answer) {
            winner[msg.sender] = true;
            payable(msg.sender).transfer(1 ether);
            emit BetPlaced(msg.sender, guess, answer, true);
        } else {
            emit BetPlaced(msg.sender, guess, answer, false);
        }
    }

    function balance() external view returns (uint256) {
        return address(this).balance;
    }

    function deposit() external payable onlyOwner() { 
        emit Deposit(msg.value);
    }
}