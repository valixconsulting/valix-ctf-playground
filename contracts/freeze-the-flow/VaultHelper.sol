// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./Vault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VaultHelper is Ownable {

    Vault public vault;
        
    event SetVault(address prevVault, address newVault);

    constructor(Vault _vault) {
        vault = _vault;
    }
    
    function depositToVault(
        address _user
    ) external payable {
        require(msg.sender == _user, "Sender can only deposit for self");
        require(msg.value > 0, "No forwarded deposited value");
        require(_user != address(0), "Invalid Address");
        vault.deposit{value: msg.value}(_user);

        require(address(this).balance == 0);
    }

    function withdrawFromVault(
        address _user,
        uint256 _amount
    ) external payable {
        require(msg.sender == _user, "Sender can only withdraw for self");
        require(_user != address(0), "Invalid Address");
        vault.withdraw(_user, _amount);
    }

    function setVaultHelper(address _newVault) external onlyOwner {
        address prevVault = address(vault);
        vault = Vault(_newVault);

        emit SetVault(prevVault, _newVault);
    }

    receive() external payable { revert(); }
}