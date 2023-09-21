import { ethers } from 'hardhat';
import { expect } from 'chai';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import { DressColor } from '../../typechain-types';

describe("Challenge - Alice in The Dark", function () {
    let alice: SignerWithAddress;
    let player: SignerWithAddress;
    let dressColor: DressColor;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [alice, player] = await ethers.getSigners();

        // Deploy the DressColor contract with her favorite color (pink)
        const ColorBoard = await (await ethers.getContractFactory('DressColor', alice));
        dressColor = await ColorBoard.deploy(255, 0, 255);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        // Player must suggest the black dress to Alice
        expect(await dressColor.color()).to.be.eq('0x000000');
    });
});