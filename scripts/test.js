const hre = require("hardhat");

const EP_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const SMART_ACCOUNT_ADDR = "0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81";

async function main() {
    const account = await hre.ethers.getContractAt("Account", SMART_ACCOUNT_ADDR);

    const count = await account.count();

    console.log(`Smart Account count: ${count}`);
}

main().catch( error => {
    console.error(error);
    process.exit(1);
});
