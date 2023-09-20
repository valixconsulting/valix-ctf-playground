import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");
import { RichBoyNFT } from '../../typechain-types';
import { RichBoyTraitNFT } from '../../typechain-types';
import { RichBoyNFTLendingPool } from '../../typechain-types';

describe("Challenge - Poor Boy", function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;
    let rbNFT: RichBoyNFT;
    let rbTraitNFT: RichBoyTraitNFT;
    let rbNFTLendingPool: RichBoyNFTLendingPool;

    const AMOUNT_OF_NFTS_IN_LENDING_POOL = 1;
    const PLAYER_INITIAL_ETH_BALANCE = 2n * 10n ** 17n; // 0.2 ETHER
    const LENDING_POOL_FEE = 1n * 10n ** 17n; // 0.1 ETHER

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player] = await ethers.getSigners();

        // Player starts with limited ETH balance
        setBalance(player.address, PLAYER_INITIAL_ETH_BALANCE);
        expect(await ethers.provider.getBalance(player.address)).to.eq(PLAYER_INITIAL_ETH_BALANCE);

        const RichBoyNFT = await (await ethers.getContractFactory('RichBoyNFT', deployer));
        rbNFT = await RichBoyNFT.deploy();
        
        const RichBoyTraitNFT = await (await ethers.getContractFactory('RichBoyTraitNFT', deployer));
        rbTraitNFT = await RichBoyTraitNFT.deploy(rbNFT.address);

        const RichBoyNFTLendingPool = await (await ethers.getContractFactory('RichBoyNFTLendingPool', deployer));
        rbNFTLendingPool = await RichBoyNFTLendingPool.deploy(rbNFT.address);

        // Allocate RichBoyNFT for lending pool
        await rbNFT.allocateForLendingPool(rbNFTLendingPool.address);
        expect(await rbNFT.balanceOf(rbNFTLendingPool.address)).to.equal(AMOUNT_OF_NFTS_IN_LENDING_POOL);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */

    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */
        expect(await rbTraitNFT.balanceOf(player.address)).to.equal(2);
        expect(await rbTraitNFT.isPremiumMember(player.address)).to.equal(true);
    });
});