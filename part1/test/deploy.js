const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("CustomToken", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("CustomToken");
        token = await Token.deploy("MyToken", "MTK", ethers.parseUnits("1000", 18));
    });

    it("Should assign the initial supply to the owner", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should allow only MINTER_ROLE to mint new tokens", async function () {
        await expect(
            token.connect(addr1).mint(addr1.address, ethers.parseUnits("100", 18))
        ).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
    });

    it("Should allow users to burn their own tokens", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      console.log("Initial owner balance before burn:", initialBalance.toString());
  
      const burnAmount = ethers.parseUnits("100", 18);
      await token.connect(owner).burn(burnAmount);
  
      const balanceAfterBurn = await token.balanceOf(owner.address);
      console.log("Owner balance after burn:", balanceAfterBurn.toString());
  
      // Fix: Use "-" instead of .sub()
      expect(balanceAfterBurn).to.equal(initialBalance - burnAmount);
  });
  
  

    it("Should not allow users to burn more tokens than they own", async function () {
        await expect(
            token.connect(addr1).burn(ethers.parseUnits("100", 18))
        ).to.be.reverted; // Catch any revert
    });

    it("Should allow token transfers between accounts", async function () {
        await token.transfer(addr1.address, ethers.parseUnits("50", 18));
        expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("50", 18));
    });

    it("Should allow only DEFAULT_ADMIN_ROLE to grant and revoke MINTER_ROLE", async function () {
        const MINTER_ROLE = await token.MINTER_ROLE();

        await expect(
            token.connect(addr1).grantMinterRole(addr2.address)
        ).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");

        await token.grantMinterRole(addr1.address);
        expect(await token.hasRole(MINTER_ROLE, addr1.address)).to.be.true;

        await token.revokeMinterRole(addr1.address);
        expect(await token.hasRole(MINTER_ROLE, addr1.address)).to.be.false;
    });
});

