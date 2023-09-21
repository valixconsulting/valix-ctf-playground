import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");
import { GamblingOracle } from '../../typechain-types';
import { Lotto888 } from '../../typechain-types';

describe("Challenge - Lotto888", function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;
    let oracle: GamblingOracle;
    let lotto888: Lotto888;

    const ONE_ETHER = 10n ** 18n;
    const POOL_INITIAL_ETH_BALANCE = 10n * 10n ** 18n
    const PLAYER_INITIAL_ETH_BALANCE = 2n * 10n ** 17n; // 0.2 ETHER

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player] = await ethers.getSigners();
        // Player starts with limited ETH balance
        setBalance(player.address, PLAYER_INITIAL_ETH_BALANCE);
        expect(await ethers.provider.getBalance(player.address)).to.eq(PLAYER_INITIAL_ETH_BALANCE);

        const GamblingOracle = await (await ethers.getContractFactory('GamblingOracle', deployer));
        oracle = await GamblingOracle.deploy();
        
        const Lotto888 = await (await ethers.getContractFactory('Lotto888', deployer));
        lotto888 = await Lotto888.deploy(oracle.address);

        // Deposit initial balance for Lotto888 pool
        await lotto888.deposit({value: POOL_INITIAL_ETH_BALANCE});
        expect(await lotto888.balance()).to.eq(POOL_INITIAL_ETH_BALANCE);
        
        // Set authorized contract
        await oracle.addAuthorized(lotto888.address);
        expect(await oracle.authorized(lotto888.address)).to.eq(true);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */

    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */
        // Take money from the pool
        expect(await ethers.provider.getBalance(player.address)).to.greaterThan(PLAYER_INITIAL_ETH_BALANCE);
        
        // Special Bonus - Drain until pool balance less than 1 ether
        expect(await lotto888.balance()).to.lessThan(ONE_ETHER);
    });
});