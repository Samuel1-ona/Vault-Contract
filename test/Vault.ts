import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  
  describe("Vault", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployVault() {
    
      // Contracts are deployed using the first signer/account by default
      const [owner, account1] = await ethers.getSigners();
  
      const Vault = await ethers.getContractFactory("Vault");
      const vault = await Vault.deploy();
  
      return { vault, owner, account1 };
    }

    describe("Vault validations check", function () {
        describe("Validations", function () {
          it("Should check all the validation check for owner and revert  with can't deposit zero amount", async function () {
            const {owner,account1,vault } = await loadFixture(deployVault);
    
             expect(await vault.owner()).to.be.equal(owner.address);
  
            const DonorAmmount = ethers.parseEther("0");
  
            await expect(vault.donorDeposit(account1.address ,DonorAmmount )).to.be.revertedWith("Can't deposit zero amount");
          });
  
    describe("Deposit", function () {
        it("Should deposit and return the correct id", async function () {
            const { owner, account1,vault } = await loadFixture(deployVault);
    
            const grantTime = 60;
            await expect(
                vault.donorDeposit(owner.address ,grantTime,{value: ethers.parseEther("10")})
            )
        });
         
      
        it("Should send grant to the user when time is greater than unlock time", async function () {
            const {owner, account1, vault} = await loadFixture(deployVault);
            
           
            const grantTime = 60; 
            const depositAmount = ethers.parseEther("10");
            
            
            await vault.connect(owner).donorDeposit(account1.address, grantTime, {value: depositAmount});
            const id = 1; 
            
        // Fast forward time by 61 seconds to ensure claimerTime has passed
            await ethers.provider.send("evm_increaseTime", [61]);
            await ethers.provider.send("evm_mine", []); 
            
            // Claim the grant
            await expect(() => vault.connect(account1).claimGrant(id))
                .to.changeEtherBalances([account1], [depositAmount]); // This checks if the account1 balance is increased by depositAmount
       
    });

      });
     });
  });

});