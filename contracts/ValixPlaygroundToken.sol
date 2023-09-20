// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ValixPlaygroundToken is ERC20 {
    constructor() ERC20("ValixPlaygroundToken", "VLXP") {
        _mint(msg.sender, type(uint256).max);
    }
}
