import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
const { setBalance } = require('@nomicfoundation/hardhat-network-helpers');
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ValixPlaygroundNFT } from '../../typechain-types';
import { NFTWhitelist } from '../../typechain-types';
import { NFTMarket } from '../../typechain-types';

describe('Challenge - NFT Whitelist', function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;
    let nft: ValixPlaygroundNFT;
    let nftMarket: NFTMarket;
    let nftWhitelist: NFTWhitelist;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player] = await ethers.getSigners();
        const [,, alice, bob] = await ethers.getSigners();

        // Initialize balance of Bob account
        setBalance(bob.address, ethers.utils.parseEther("10.0"));

        const ValixPlaygroundNFT = await (await ethers.getContractFactory('ValixPlaygroundNFT', deployer));
        nft = await ValixPlaygroundNFT.deploy();
        
        // Deploy NFTWhitelist with the corresponding proxy
        const proxy = await upgrades.deployProxy(
            await ethers.getContractFactory('NFTWhitelist', deployer),
            [],
            { kind: 'uups', initializer: 'init', unsafeAllow: ["delegatecall"] }
        );
        nftWhitelist = await (
            await ethers.getContractFactory('NFTWhitelist')
        ).attach(proxy.address);

        // Deploy the NFTMarket
        const NFTMarket = await (await ethers.getContractFactory('NFTMarket', deployer));
        nftMarket = await NFTMarket.deploy(nft.address, nftWhitelist.address);
        await nft.transferOwnership(nftMarket.address);
        
        // Add Alice to whitelist
        await nftWhitelist.add(alice.address);

        // Alice claims their NFT with the whitelisted
        await nftMarket.connect(alice).claim();
        // Bob bought the NFT by spending the standard price
        await nftMarket.connect(bob).buy({value: ethers.utils.parseEther("1.0")});

        expect(await nft.balanceOf(alice.address)).to.eq(1);
        expect(await nft.balanceOf(bob.address)).to.eq(1);
        expect(await nft.balanceOf(player.address)).to.eq(0);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        // Player must owned nft
        expect(await nft.balanceOf(player.address)).to.eq(1);
    });
});