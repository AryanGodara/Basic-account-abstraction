const hre = require("hardhat");

const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

    await entryPoint.depositTo(PM_ADDRESS, {
        value: hre.ethers.parseEther("0.5"),
    });

    console.log("deposit was successful!");
}

main().catch( error => {
    console.error(error);
    process.exit(1);
});
