// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {TalonFactory} from "../src/TalonFactory.sol";
import {TalonVault} from "../src/TalonVault.sol";

contract DeployScript is Script {
    address constant AAPLC = 0xb200000000000000000000C2e324d24d7eEcd1fb;

    function run() external {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerPrivateKey != 0) {
            vm.startBroadcast(deployerPrivateKey);
        } else {
            vm.startBroadcast();
        }

        TalonFactory factory = new TalonFactory();
        console.log("TalonFactory deployed at:", address(factory));
        console.log("EligibilityRegistry deployed at:", factory.eligibilityRegistry());
        factory.setEligible(tx.origin, true);

        address vault = factory.createVault(AAPLC);
        console.log("TalonVault (AAPLc) deployed at:", vault);

        address clip = TalonVault(vault).clipToken();
        console.log("ClipToken (clipAAPLc) deployed at:", clip);

        address talon = TalonVault(vault).talonToken();
        console.log("TalonToken (talonAAPLc) deployed at:", talon);

        vm.stopBroadcast();
    }
}
