import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TheSecretSource } from '../../typechain-types';
import { ValixPlaygroundToken } from '../../typechain-types';

describe('Challenge - The Secret Source', function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;
    let theSecretSource: TheSecretSource;
    let token: ValixPlaygroundToken;

    const REWARD_AMOUNT: bigint = 1_000_000n * 10n ** 18n;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player] = await ethers.getSigners();

        // Deploy Token contract
        const ValixPlaygroundToken = await (await ethers.getContractFactory('ValixPlaygroundToken', deployer));
        token = await ValixPlaygroundToken.deploy();

        // Deploy The Secret Source contract
        const TheSecretSource = await (await ethers.getContractFactory('TheSecretSource', deployer));
        theSecretSource = await TheSecretSource.deploy(token.address);

        // Set the secret source
        await theSecretSource.setSecret("nothing");

        // Initialize the winner's reward
        await token.transfer(theSecretSource.address, REWARD_AMOUNT);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        //Player must become the winner and retrieved reward
        expect(await token.balanceOf(player.address)).to.eq(REWARD_AMOUNT);
    });
});