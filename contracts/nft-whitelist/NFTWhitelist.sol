// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract NFTWhitelist is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    mapping(address => bool) private whitelists;

    function init() external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function add(address user) external onlyOwner {
        require(whitelists[user] == false, "already in whitelist");
        whitelists[user] = true;
    }

    function remove(address user) external onlyOwner {
        require(whitelists[user] == true, "not in whitelist");
        whitelists[user] = false;
    }

    function hasWhitelist(address user) external view returns (bool) {
        return whitelists[user];
    }

    function upgradeTo(address newImplementation) public override {
        _authorizeUpgrade(newImplementation);
        _upgradeTo(newImplementation);
    }

    function upgradeToAndCall(address newImplementation, bytes memory data) public payable override {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, data, true);
    }

    function _authorizeUpgrade(address imp) internal override onlyOwner {}
}
