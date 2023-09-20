// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract AddOn {
    event Message(string message);

    function addOn() external {
        emit Message("Excuted code approved by Bank");
    }

    function emergencyKill() external {
        selfdestruct(payable(address(0)));
    }
}