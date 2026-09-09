// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {TalonVault} from "../src/TalonVault.sol";
import {IB20} from "../src/interfaces/IB20.sol";

contract DustTearScript is Script {
    address constant AAPLC = 0xb200000000000000000000C2e324d24d7eEcd1fb;

    function run(address vaultAddr, uint256 rawAmount) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Approve vault
        console.log("Approving vault:", vaultAddr, "for amount:", rawAmount);
        bool appOk = IB20(AAPLC).approve(vaultAddr, rawAmount);
        require(appOk, "Approve failed");

        // 2. Tear
        console.log("Executing tear on vault...");
        TalonVault(vaultAddr).tear(rawAmount);
        console.log("Tear complete!");

        vm.stopBroadcast();
    }
}
