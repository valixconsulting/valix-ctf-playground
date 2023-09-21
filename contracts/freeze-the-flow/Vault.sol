// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable {
    address public vaultHelpaer;
    mapping(address => uint256) private balance;

    event Deposit(address sender, uint256 amount);
    event Withdraw(address sender, uint256 amount);
    event SetVaultHelper(address prevVaultHelper, address newVaultHelper);

    modifier onlyVaultHelper() {
        require(msg.sender == address(vaultHelpaer), "Only VaultHelper can call to this action");
        _;
    }

    function deposit(address _to) external payable onlyVaultHelper {
        require(_to != address(0), "Invalid address");
        require(msg.value > 0, "No deposit");
        balance[_to] += msg.value;

        emit Deposit(_to, msg.value);
    }

    function withdraw(address _to, uint256 _amount) external onlyVaultHelper {
        require(_to != address(0), "Invalid address");
        require(_amount > 0, "Amount withdraw should above zero");

        require(balance[_to] >= _amount);
        balance[_to] -= _amount;
        payable(_to).transfer(_amount);

        emit Withdraw(_to, _amount);
    }

    function setVaultHelper(address _newVaultHelper) external onlyOwner {
        address prevVaultHelper = address(vaultHelpaer);
        vaultHelpaer = _newVaultHelper;

        emit SetVaultHelper(prevVaultHelper, _newVaultHelper);
    }

    function getUserBalance(address _user) public view returns(uint256) {
        return balance[_user];
    }
    
    function getVaultBalance() public view returns(uint256) {
        return address(this).balance;
    }
}