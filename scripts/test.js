const hre = require("hardhat");

const SMART_ACCOUNT_ADDR = "0x4f6ba4e2f81208a6cba8fc1891fa84389b962244";

async function main() {
    const account = await hre.ethers.getContractAt("Account", SMART_ACCOUNT_ADDR);

    const count = await account.count();
    console.log("count: ", count.toString());
}

main().catch( error => {
    console.error(error);
    process.exit(1);
});
