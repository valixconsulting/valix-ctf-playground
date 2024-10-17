// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./AddOnFactory.sol";

contract Factory {
    address private _owner = msg.sender;
    event CreateAddOnFactory(address addr);
    
    function createFactory(
        bytes32 _salt
    ) external{
        require(msg.sender == _owner, "Permission denied");
        address factoryAddress = address(new AddOnFactory{salt: _salt}());
        emit CreateAddOnFactory(factoryAddress);
    }
}