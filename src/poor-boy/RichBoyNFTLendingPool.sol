// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./RichBoyNFT.sol";

contract RichBoyNFTLendingPool is IERC721Receiver {
    uint256 public constant FEE = 0.1 ether;
    RichBoyNFT public rbNFT;

    error RepayFailed();

    constructor(address rbNFTAddress) {
        rbNFT = RichBoyNFT(rbNFTAddress);
    }

    function nftInPoolBalance() public view returns (uint256) {
        return rbNFT.balanceOf(address(this));
    }

    function flashLoan(
        address receiver,
        uint256 tokenId
    ) external payable returns (bool) {
        require(msg.value == FEE, "Incorrect fee");
        uint256 nftInPoolBalanceBefore = nftInPoolBalance();

        rbNFT.safeTransferFrom(address(this), receiver, tokenId);

        uint256 nftInPoolBalanceAfter = nftInPoolBalance();
        if (nftInPoolBalanceAfter < nftInPoolBalanceBefore)
            revert RepayFailed();

        return true;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {}
}