import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { Vault } from '../../typechain-types';
import { VaultHelper } from '../../typechain-types';

describe('Challenge - Fleeze The Flow', function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;
    let someUser: SignerWithAddress;

    let vault: Vault;
    let vaultHelper: VaultHelper;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player, someUser] = await ethers.getSigners();

        // Deploy VaultHelper & Vault Contracts
        const Vault = await (await ethers.getContractFactory('Vault', deployer));
        vault = await Vault.deploy();

        const VaultHelper = await (await ethers.getContractFactory('VaultHelper', deployer));
        vaultHelper = await VaultHelper.deploy(vault.address);

        await vault.setVaultHelper(vaultHelper.address);

        expect(await vault.owner()).to.eq(deployer.address);
        expect(await vaultHelper.owner()).to.eq(deployer.address);

        expect(await vault.vaultHelpaer()).to.eq(vaultHelper.address);
        expect(await vaultHelper.vault()).to.eq(vault.address);

        // someUser interact with the Vault contract through VaultHelper contract;
        await vaultHelper.connect(someUser).depositToVault(someUser.address, { value: ethers.utils.parseEther("100") });
        expect(await vault.getUserBalance(someUser.address)).to.eq(ethers.utils.parseEther("100"));
        expect(await vault.getVaultBalance()).to.eq(ethers.utils.parseEther("100"));

        // someUser cannot directly interact to Vault contract
        await expect(vault.connect(someUser).deposit(someUser.address, { value: ethers.utils.parseEther("100") })).to.be.reverted;
        // someUser cannot directly send ether to VaultHelper contract
        await expect(someUser.sendTransaction({
            to: vaultHelper.address,
            value: ethers.utils.parseEther("100"),
        })).to.be.reverted;
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        // Player has stopped the deposit process
        await expect(vaultHelper.connect(someUser).depositToVault(someUser.address, { value: ethers.utils.parseEther("100") })).to.be.reverted;
    });
});