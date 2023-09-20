// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../ValixPlaygroundToken.sol";

contract TheSecretSource is Ownable {
    uint256 public constant REWARD_AMOUNT = 1_000_000 * 1e18;
    ValixPlaygroundToken public immutable token;
    bytes32 private secretSource;
    address public winner;

    event Guess(address indexed sender, bytes32 secret, bool isWinner);

    constructor(ValixPlaygroundToken _token) {
        token = _token;
    }

    function setSecret(string memory secret) external onlyOwner {
        require(uint256(secretSource) == 0, "Already set");
        secretSource = keccak256(abi.encode(secret, block.timestamp));
    }

    function guess(bytes32 secret) payable external {
        require(uint256(secretSource) > 0, "Not ready to play");
        require(winner == address(0x0), "Game ended");

        if (secret == secretSource) {
            winner = msg.sender;
            token.transfer(msg.sender, REWARD_AMOUNT);

            emit Guess(msg.sender, secret, true);
        }else {
            emit Guess(msg.sender, secret, false);
        }
    }
}