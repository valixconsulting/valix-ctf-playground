// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract ExtraBank {
    address public owner;
    address public operator;

    address public addOnContract;
    mapping(address => uint256) private balance;

    event Deposit(address sender, uint256 amount);
    event Withdraw(address sender, uint256 amount);
    event SetOpeartor(address prevOperator, address newOperator);
    event SetAddOn(address prevAddOn, address newAddOn);

    constructor(address _operator) {
        require(_operator != address(0), "Invald address");
        owner = msg.sender;
        operator = _operator;
    }
    
    function deposit() external payable{
        require(msg.value > 0, "No deposit");
        balance[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) external {
        require(balance[msg.sender] >= _amount);
        balance[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Withdraw(msg.sender, _amount);
    }

    function emergencyWithdraw() external {
        require(msg.sender == owner, "Permission denied");
        payable(msg.sender).transfer(address(this).balance);

        emit Withdraw(owner, address(this).balance);
    }

    function getUserBalance(address _user) public view returns(uint256){
        return balance[_user];
    }
    
    function getBankBalance() public view returns(uint256){
        return address(this).balance;
    }

    function setOperator(address _newOperator) external {
        address prevOperator = operator;
        operator = _newOperator;

        emit SetOpeartor(prevOperator, operator);
    }

    function setAddOn(address _newAddOn) external {
        require(msg.sender == operator || msg.sender == owner, "Permission denied");
        address prevAddOn = _newAddOn;
        addOnContract = _newAddOn;

        emit SetAddOn(prevAddOn, _newAddOn);
    }

    function executeAddOn() external returns (bytes memory){
        (bool success, bytes memory data) = addOnContract.delegatecall(abi.encodeWithSignature("addOn()"));
        require(success, "delegatecall failed");

        return data;
    }
}