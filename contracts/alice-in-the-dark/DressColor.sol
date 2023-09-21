// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

contract DressColor {
    bytes3 public color;

    constructor(uint8, uint8, uint8) {
        assembly {
            let p := mload(0x40)
            mstore(p, shl(0xf8, mload(0x80)))
            mstore(add(p, 1), shl(0xf8, mload(0xa0)))
            mstore(add(p, 2), shl(0xf8, mload(0xc0)))

            sstore(0, shr(0xe8, mload(p)))
        }
    }

    function fill(bytes3 colorToFill) external {
        color = bytes3(uint24(color) + uint24(colorToFill));
    }
}