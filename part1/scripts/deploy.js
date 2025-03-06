const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const CustomToken = await ethers.getContractFactory("CustomToken");
    const token = await CustomToken.deploy("MyToken", "MTK", ethers.parseUnits("1000", 18));

    await token.waitForDeployment();

    console.log("Token deployed at:", await token.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
