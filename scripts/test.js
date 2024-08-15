const hre = require("hardhat");

const EP_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const SMART_ACCOUNT_ADDR = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
    const account = await hre.ethers.getContractAt("Account", SMART_ACCOUNT_ADDR);

    const count = await account.count();
    console.log("count: ", count.toString());
}

main().catch( error => {
    console.error(error);
    process.exit(1);
});
