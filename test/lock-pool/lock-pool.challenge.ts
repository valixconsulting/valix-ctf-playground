import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { LockPool } from '../../typechain-types';
import { ValixPlaygroundToken } from '../../typechain-types';
import { ValixPlaygroundNFT } from '../../typechain-types';

describe('Challenge - Lock Pool', function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;

    let pool: LockPool;
    let lockToken: ValixPlaygroundToken;
    let rewardToken: ValixPlaygroundNFT;

    const TOKENS_IN_POOL: bigint = 100n * 10n ** 18n;
    const TOKENS_FOR_PLAYER: bigint = 10n * 10n ** 18n;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player] = await ethers.getSigners();

        const ValixPlaygroundToken = await (await ethers.getContractFactory('ValixPlaygroundToken', deployer));
        lockToken = await ValixPlaygroundToken.deploy();

        const ValixPlaygroundNFT = await (await ethers.getContractFactory('ValixPlaygroundNFT', deployer));
        rewardToken = await ValixPlaygroundNFT.deploy();

        const LockPool = await (await ethers.getContractFactory('LockPool', deployer));
        pool = await LockPool.deploy(lockToken.address, rewardToken.address);

        await rewardToken.connect(deployer).transferOwnership(pool.address);

        await lockToken.transfer(pool.address, TOKENS_IN_POOL);
        await lockToken.transfer(player.address, TOKENS_FOR_PLAYER);

        expect(await pool.lockToken()).to.eq(lockToken.address);
        expect(await pool.rewardToken()).to.eq(rewardToken.address);

        expect(await lockToken.balanceOf(pool.address)).to.equal(TOKENS_IN_POOL);
        expect(await lockToken.balanceOf(player.address)).to.equal(TOKENS_FOR_PLAYER);

        expect(await rewardToken.owner()).to.eq(pool.address);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        //Player has taken all tokens from the pool
        expect(
            await lockToken.balanceOf(player.address)
        ).to.equal(TOKENS_IN_POOL + TOKENS_FOR_PLAYER);
        expect(
            await lockToken.balanceOf(pool.address)
        ).to.equal(0);
    });
});