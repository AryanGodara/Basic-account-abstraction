// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";


contract Account is IAccount {
    uint256 public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256)
    external view returns (uint256 validationData)
    {
        address recovered = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature
        );

        return owner == recovered ? 0 : 1;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address owner) external returns (address) {
        // address Account = Create2: deploy(amount, salt, byteCode
        bytes32 salt = bytes32(uint256(uint160(owner)));
        bytes memory bytecode = abi.encodePacked( type(Account).creationCode, abi.encode(owner) );

        address addr = Create2.computeAddress(salt, keccak256(bytecode));
        if ( addr.code.length > 0 ) {
            return addr; // Account already exists
        }

        return Create2.deploy(0, salt, bytecode);
    }
}
