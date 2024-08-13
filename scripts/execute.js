const hre = require("hardhat");

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

    // CREATE: hash(deployer + nonce) -> deployer is the account factory here
    const sender = hre.ethers.getCreateAddress({
        from: FACTORY_ADDRESS,
        nonce: FACTORY_NONCE,
    });

    const [signer0] = await hre.ethers.getSigners(); // Take the first private key from the ones generated when running local hardhat node
    const address0 = await signer0.getAddress();

    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const initCode = "0x"; // We only need to send init code once, else SenderCreator will try to initialize the smart account again
        // FACTORY_ADDRESS +
        // AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2); // remove the 0x prefix

    console.log("sender address: ", sender)

    const Account = await hre.ethers.getContractFactory("Account");

    /**
     * User Operation struct
     * @param sender the sender account of this request.
     * @param nonce unique value the sender uses to verify it is not a replay.
     * @param initCode if set, the account contract will be created by this constructor/
     * @param callData the method call to execute on this account.
     * @param callGasLimit the gas limit passed to the callData method call.
     * @param verificationGasLimit gas used for validateUserOp and validatePaymasterUserOp.
     * @param preVerificationGas gas not calculated by the handleOps method, but added to the gas paid. Covers batch overhead.
     * @param maxFeePerGas same as EIP-1559 gas parameter.
     * @param maxPriorityFeePerGas same as EIP-1559 gas parameter.
     * @param paymasterAndData if set, this field holds the paymaster address and paymaster-specific data. the paymaster will pay for the transaction instead of the sender.
     * @param signature sender-verified signature over the entire request, the EntryPoint address and the chain ID.
     */
    const userOp = {
        sender, // smart account address
        nonce: await entryPoint.getNonce(sender, 0),
        initCode,
        callData: Account.interface.encodeFunctionData("execute"),
        callGasLimit: 200_000,
        verificationGasLimit: 200_000,
        preVerificationGas: 50_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: "0x",
        signature: "0x",
    }

    // Prefund the EntryPoint (since we don't have a paymaster at the moment)
    // await entryPoint.depositTo(sender, {
    //     value: hre.ethers.parseEther("100"),
    // });

    const tx = await entryPoint.handleOps([userOp], address0);
    const receipt = await tx.wait();

    console.log(receipt);
}

main().catch( error => {
    console.error(error);
    process.exit(1);
});
