import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { NftMarketplace } from '../../typechain-types';
import { ValixPlaygroundNFT } from '../../typechain-types';
import { ValixPlaygroundTokenLite } from '../../typechain-types';

describe('Challenge - Trick or Thieve', function () {
    let deployer: SignerWithAddress;
    let player: SignerWithAddress;
    let seller: SignerWithAddress;
    let targetTokenId: BigInteger;

    let marketplace: NftMarketplace;
    let token: ValixPlaygroundTokenLite;
    let nft: ValixPlaygroundNFT;

    const PRICE_FOR_SALE: bigint = 999n * 10n ** 18n;
    const TOKEN_FOR_PLAYER: bigint = 0n * 10n ** 18n;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, player, seller] = await ethers.getSigners();

        const ValixPlaygroundTokenLite = await (await ethers.getContractFactory('ValixPlaygroundTokenLite', deployer));
        token = await ValixPlaygroundTokenLite.deploy();

        const ValixPlaygroundNFT = await (await ethers.getContractFactory('ValixPlaygroundNFT', deployer));
        nft = await ValixPlaygroundNFT.deploy();

        const NftMarketplace = await (await ethers.getContractFactory('NftMarketplace', deployer));
        marketplace = await NftMarketplace.deploy(token.address, nft.address);

        // Mint NFT token to seller
        const mintNFTTx = await nft.safeMint(seller.address);
        const waitTx = await mintNFTTx.wait();
        const event = waitTx.events?.find((event: any) => event.event === 'Transfer');
        targetTokenId = event?.args?.tokenId;

        expect(await nft.ownerOf(targetTokenId)).to.eq(seller.address);

        // Seller approve and list NFT into the marketplace
        await nft.connect(seller).approve(marketplace.address, targetTokenId);
        await marketplace.connect(seller).listItem(0, PRICE_FOR_SALE);

        expect((await marketplace.getListing(targetTokenId)).price).to.eq(PRICE_FOR_SALE);
        expect((await marketplace.getListing(targetTokenId)).seller).to.eq(seller.address);
    });

    it('Execution', async function () {
        /** CODE YOUR SOLUTION HERE */

    });

    after(async function () {
        /** SUCCESS CONDITIONS - NO NEED TO CHANGE ANYTHING HERE */

        //Player retrieve the NFT without purchase anything
        expect(
            await token.balanceOf(player.address)
        ).to.equal(TOKEN_FOR_PLAYER);
        expect(
            await nft.ownerOf(targetTokenId)
        ).to.equal(player.address);
    });
});