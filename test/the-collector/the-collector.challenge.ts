import { ethers } from 'hardhat';
import { expect } from 'chai';
import { setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TheCollectorNFT } from '../../typechain-types';
import { ValixPlaygroundToken } from '../../typechain-types';
import { TheCollectorMarket } from '../../typechain-types';

describe('Challenge - The Collector', function () {
    let player: SignerWithAddress;
    let nft: TheCollectorNFT;
    let token: ValixPlaygroundToken;
    let theCollectorMarket: TheCollectorMarket;

    const TOKENS_FOR_PLAYER: bigint = 100n * 10n ** 18n;
    const ETH_FOR_PLAYER: bigint = 1n * 10n ** 18n;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const [deployer] = await ethers.getSigners();
        [, player] = await ethers.getSigners();

        // Deploy Token contract
        const ValixPlaygroundToken = await (await ethers.getContractFactory('ValixPlaygroundToken', deployer));
        token = await ValixPlaygroundToken.deploy();

        // Deploy The Collector NFT contract
        const TheCollectorNFT = await (await ethers.getContractFactory('TheCollectorNFT', deployer));
        nft = await TheCollectorNFT.deploy();

        // Deploy the The Collector Market contract
        const TheCollectorMarket = await (await ethers.getContractFactory('TheCollectorMarket', deployer));
        theCollectorMarket = await TheCollectorMarket.deploy(token.address, nft.address);
        await nft.transferOwnership(theCollectorMarket.address);

        // Setup initial token balances of player
        setBalance(player.address, ETH_FOR_PLAYER);
        await token.transfer(player.address, TOKENS_FOR_PLAYER);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */
    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        // Player must owned 4 NFTs
        expect(await nft.balanceOf(player.address)).to.eq(4);
    });
});