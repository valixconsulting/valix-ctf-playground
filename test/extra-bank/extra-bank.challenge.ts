import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { ExtraBank } from '../../typechain-types';
import { AddOnFactory } from '../../typechain-types';
import { Factory } from '../../typechain-types';

import addOnJson from './utils/AddOn.json';

describe('Challenge - Extra Bank', function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;
    let newOperator: SignerWithAddress;
    let user1: SignerWithAddress;

    let bank: ExtraBank;
    let addOnFactory: AddOnFactory;
    let factory: Factory;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player, newOperator, user1] = await ethers.getSigners();

        // Deploy ExtraBank Contract
        const ExtraBank = await (await ethers.getContractFactory('ExtraBank', deployer));
        bank = await ExtraBank.deploy(player.address);

        expect(await bank.owner()).to.eq(deployer.address);
        expect(await bank.operator()).to.eq(player.address);

        // Player Actions as an operator of the Extrabank Contract
        const Factory = await (await ethers.getContractFactory('Factory', player));
        factory = await Factory.deploy();

        const salt = "0x504c454153452053454355524520594f55522041535345540000000000000000"

        const createAddOnFactoryTx = await factory.connect(player).createFactory(salt);
        const waitAddOnFactory = await createAddOnFactoryTx.wait();
        const eventFactory = waitAddOnFactory.events?.find((event: any) => event.event === 'CreateAddOnFactory');
        const addOnFactoryAddress = eventFactory?.args?.addr;

        const AddOnFactory = await ethers.getContractFactory('AddOnFactory');
        addOnFactory = await AddOnFactory.attach(addOnFactoryAddress)

        const createAddOnTx = await addOnFactory.connect(player).createAddOn(addOnJson.bytecode);
        const waitAddOn = await createAddOnTx.wait();
        const eventAddOn = waitAddOn.events?.find((event: any) => event.event === 'CreateAddOn');
        const addOnAddress = eventAddOn?.args?.addr;

        const AddOn = await ethers.getContractFactory(addOnJson.abi, addOnJson.bytecode);
        const addOn = await AddOn.attach(addOnAddress);
           
        await bank.connect(player).setAddOn(addOn.address);
        expect(await bank.addOnContract()).to.eq(addOn.address);
        await expect(bank.connect(deployer).executeAddOn()).not.to.be.reverted;

        // User interact with the ExtraBank contract;
        await bank.connect(user1).deposit({ value: ethers.utils.parseEther("100") });
        expect(await bank.getUserBalance(user1.address)).to.eq(ethers.utils.parseEther("100"));
        expect(await bank.getBankBalance()).to.eq(ethers.utils.parseEther("100"));

        // Bank owner removes the player from the operator role, change to new operator
        await bank.connect(deployer).setOperator(newOperator.address);
        expect(await bank.operator()).to.eq(newOperator.address);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        // Player has taken ownership of the bank
        expect(
            await bank.owner()
        ).to.equal(player.address);
        // Player has taken all funds from the bank
        expect(
            await ethers.provider.getBalance(bank.address)
        ).to.equal(ethers.utils.parseEther("0"));
    });
});