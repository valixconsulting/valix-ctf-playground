import { ethers } from 'hardhat';
import { expect } from 'chai';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");
import { SchoolRunner } from '../../typechain-types';

describe("Challenge - Bullied Boy", function () {
    let teacher: SignerWithAddress;
    let player: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let dan: SignerWithAddress;

    let schoolRunner: SchoolRunner;

    const TEACHER_INITIAL_ETH_BALANCE = 100n * 10n ** 18n; // 100 ETHER
    const STUDENT_INITIAL_ETH_BALANCE = 1n * 10n ** 17n; // 0.1 ETHER
    const TOTAL_REWARD = 15n * 10n ** 18n; // 15 ETHER

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [teacher, player, alice, bob, carol, dan] = await ethers.getSigners();

        // Setup teacher and student balance
        setBalance(teacher.address, TEACHER_INITIAL_ETH_BALANCE);
        setBalance(player.address, STUDENT_INITIAL_ETH_BALANCE);
        setBalance(alice.address, STUDENT_INITIAL_ETH_BALANCE);
        setBalance(bob.address, STUDENT_INITIAL_ETH_BALANCE);
        setBalance(carol.address, STUDENT_INITIAL_ETH_BALANCE);
        setBalance(dan.address, STUDENT_INITIAL_ETH_BALANCE);

        // Setup SchoolRunner
        const SchoolRunner = await (await ethers.getContractFactory('SchoolRunner', teacher));
        schoolRunner = await SchoolRunner.deploy();

        // Teacher deposit reward
        await schoolRunner.depositReward({value: TOTAL_REWARD});
        expect(await ethers.provider.getBalance(schoolRunner.address)).to.eq(TOTAL_REWARD);

        // Register Student
        await schoolRunner.connect(alice).register();
        await schoolRunner.connect(bob).register();
        await schoolRunner.connect(carol).register();
        await schoolRunner.connect(dan).register();
        expect(await schoolRunner.studentPositions(0)).to.eq(alice.address);
        expect(await schoolRunner.studentPositions(1)).to.eq(bob.address);
        expect(await schoolRunner.studentPositions(2)).to.eq(carol.address);
        expect(await schoolRunner.studentPositions(3)).to.eq(dan.address);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */

    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        // Ensure the transaction reverts when the teacher attempts to distribute rewards.
        await expect(schoolRunner.connect(teacher).distributeReward()).to.reverted;
        expect(await ethers.provider.getBalance(schoolRunner.address)).to.eq(TOTAL_REWARD);
        
        // Ensures that none of the students can receive a reward after distribution.
        expect(await ethers.provider.getBalance(alice.address)).to.lessThan(STUDENT_INITIAL_ETH_BALANCE);
        expect(await ethers.provider.getBalance(bob.address)).to.lessThan(STUDENT_INITIAL_ETH_BALANCE);
        expect(await ethers.provider.getBalance(carol.address)).to.lessThan(STUDENT_INITIAL_ETH_BALANCE);
        expect(await ethers.provider.getBalance(dan.address)).to.lessThan(STUDENT_INITIAL_ETH_BALANCE);
        expect(await ethers.provider.getBalance(player.address)).to.lessThan(STUDENT_INITIAL_ETH_BALANCE);
    });
});