// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../ValixPlaygroundToken.sol";
import "../ValixPlaygroundNFT.sol";

contract LockPool is ReentrancyGuard{
    ValixPlaygroundToken public immutable lockToken;
    ValixPlaygroundNFT public immutable rewardToken;

    address public owner;

    uint256 public constant REWARD_DURATION = 17 days;
    uint256 public constant OPEN_DURATION = 2 days;
    uint256 public constant REQUIRED_LOCK_AMOUNT = 10 * 1e18;

    uint256 public immutable openPeriod;
    uint256 public immutable rewardApplicableAt;

    mapping(address => uint) public balanceOf;

    event Lock(address sender, uint256 amount, uint256 ts);
    event EmergencyWithdraw(address sender, address to, uint256 amount, uint256 ts);
    event WithdrawAndClaim(address sender, uint256 tokenId, uint256 ts);

    constructor(ValixPlaygroundToken _lockToken, ValixPlaygroundNFT _rewardToken) {
        owner = msg.sender;

        lockToken = _lockToken;
        rewardToken = _rewardToken;

        openPeriod = block.timestamp + OPEN_DURATION;
        rewardApplicableAt = block.timestamp + REWARD_DURATION;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    function lock() external {
        require(block.timestamp < openPeriod, "LockPool: Open period is closed");
        balanceOf[msg.sender] += REQUIRED_LOCK_AMOUNT;
        lockToken.transferFrom(msg.sender, address(this), REQUIRED_LOCK_AMOUNT);

        emit Lock(msg.sender, REQUIRED_LOCK_AMOUNT, block.timestamp);
    }

    function emergencyWithdraw(address _to) external {
        uint256 userBalance = balanceOf[msg.sender];

        require(balanceOf[msg.sender] >= 0);
        balanceOf[_to] += userBalance;
        balanceOf[msg.sender] = 0;

        emit EmergencyWithdraw(msg.sender, _to, userBalance, block.timestamp);
    }

    function withdrawAndClaim() external nonReentrant {
        uint256 userBalance = balanceOf[msg.sender];

        require(block.timestamp >= rewardApplicableAt, "LockPool: Not yet reach the withdraw and claim period");
        require(userBalance >= REQUIRED_LOCK_AMOUNT, "LockPool: Inadequate amount for withdraw and claim");

        lockToken.transfer(msg.sender, userBalance);
        uint256 tokenId = rewardToken.safeMint(msg.sender);  

        balanceOf[msg.sender] = 0;
        
        emit WithdrawAndClaim(msg.sender, tokenId, block.timestamp);
    }
}