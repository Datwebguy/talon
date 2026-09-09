// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {TalonFactory} from "../src/TalonFactory.sol";
import {TalonVault} from "../src/TalonVault.sol";
import {ClipToken} from "../src/tokens/ClipToken.sol";
import {TalonToken} from "../src/tokens/TalonToken.sol";
import {IB20} from "../src/interfaces/IB20.sol";

interface IAggregatorV3 {
    function decimals() external view returns (uint8);
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract TalonForkTest is Test {
    address constant AAPLC = 0xb200000000000000000000C2e324d24d7eEcd1fb;
    address constant AAPL_FEED = 0x787f13dEa48Db0897CbCDD985de77809D837F988;

    TalonFactory public factory;

    function setUp() public {
        try vm.activeFork() returns (uint256) {} catch {
            vm.createSelectFork("https://mainnet.base.org");
        }
        factory = new TalonFactory();
    }

    /// @notice Verifies that Chainlink total-return feed on Base mainnet returns valid live data
    function test_Fork_ChainlinkFeedRead() public view {
        IAggregatorV3 feed = IAggregatorV3(AAPL_FEED);
        uint8 feedDec = feed.decimals();
        console.log("Chainlink AAPL feed decimals:", feedDec);
        assertEq(feedDec, 8, "Chainlink equity feed must have 8 decimals");

        (, int256 price,,,) = feed.latestRoundData();
        console.log("Chainlink AAPL latest price (8 dec):", uint256(price));
        assertGt(price, 0, "Price should be positive");
    }

    /// @notice Tests execution against live AAPLc address on Base mainnet.
    /// @dev B20 tokens on Base mainnet use bytecode 0xef (native Base L2 precompile handled by op-geth).
    /// In local revm fork environments without Base's native precompile module, execution of 0xef reverts with OpcodeNotFound.
    function test_Fork_AAPLcExecutionBehavior() public {
        console.log("Checking AAPLc bytecode length on fork:");
        bytes memory code = AAPLC.code;
        console.log("Bytecode length:", code.length);
        if (code.length > 0) {
            console.log("First byte (hex):");
            console.logBytes(code);
        }

        // Attempt createVault which triggers staticcall to AAPLc.decimals()
        try factory.createVault(AAPLC) returns (address vaultAddr) {
            console.log("SUCCESS: createVault created at:", vaultAddr);
            TalonVault vault = TalonVault(vaultAddr);
            console.log("Vault decimals:", vault.decimals());
        } catch Error(string memory reason) {
            console.log("createVault reverted with reason:", reason);
        } catch (bytes memory lowLevelData) {
            console.log("createVault reverted (OpcodeNotFound/PrecompileUnimplemented in revm). Length:", lowLevelData.length);
        }
    }
}
