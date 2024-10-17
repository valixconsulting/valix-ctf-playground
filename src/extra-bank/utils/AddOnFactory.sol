// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract AddOnFactory {
    address private _owner;

    event CreateAddOn(address addr);

    constructor() {
        _owner = tx.origin;
    }

    function createAddOn(bytes calldata _bytecode) external {
        require(msg.sender == _owner, "Permission denied");
        address addr;
        bytes memory bytecode = abi.encodePacked(_bytecode);
        assembly {
            addr := create(0, add(bytecode, 0x20), mload(bytecode))
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit CreateAddOn(addr);
    }

    function emergencyKill() external {
        selfdestruct(payable(address(0)));
    }
}