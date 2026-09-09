// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "./ERC20.sol";
import {IClipToken} from "../interfaces/IClipToken.sol";
import {IEligibilityRegistry} from "../interfaces/IEligibilityRegistry.sol";

/// @title ClipToken
/// @notice Accretion claim token for Talon protocol. Tracks multiplier growth without rebasing balances.
contract ClipToken is ERC20, IClipToken {
    address public immutable vault;
    address public immutable eligibilityRegistry;

    /// @notice User entry multiplier in WAD (1e18)
    mapping(address => uint256) public userIndex;

    error OnlyVault();
    error InvalidMultiplier();

    modifier onlyVault() {
        if (msg.sender != vault) revert OnlyVault();
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _vault,
        address _eligibilityRegistry
    ) ERC20(_name, _symbol, _decimals) {
        if (_vault == address(0) || _eligibilityRegistry == address(0)) revert ZeroAddress();
        vault = _vault;
        eligibilityRegistry = _eligibilityRegistry;
    }

    /// @notice Mints clip tokens with the current underlying multiplier as the entry index
    /// @param to Recipient address
    /// @param amount Amount to mint (in underlying raw decimals)
    /// @param currentMultiplier Current B20 multiplier at time of deposit (WAD 1e18)
    function mint(address to, uint256 amount, uint256 currentMultiplier) external onlyVault {
        if (currentMultiplier == 0) revert InvalidMultiplier();

        uint256 currentBal = balanceOf[to];
        if (currentBal == 0) {
            userIndex[to] = currentMultiplier;
        } else {
            // Weighted average entry index
            userIndex[to] = (userIndex[to] * currentBal + currentMultiplier * amount) / (currentBal + amount);
        }

        _mint(to, amount);
    }

    /// @notice Burns clip tokens upon joining back to the underlying
    /// @param from Account to burn from
    /// @param amount Amount to burn
    function burn(address from, uint256 amount) external onlyVault {
        _burn(from, amount);
        if (balanceOf[from] == 0) {
            userIndex[from] = 0;
        }
    }

    /// @notice Internal transfer with index tracking for sender and recipient
    function _transfer(address from, address to, uint256 amount) internal override {
        if (!IEligibilityRegistry(eligibilityRegistry).isEligible(from) || !IEligibilityRegistry(eligibilityRegistry).isEligible(to)) {
            revert Ineligible();
        }
        uint256 fromIdx = userIndex[from];
        if (fromIdx == 0) {
            fromIdx = 1e18; // Default 1.0x baseline fallback
        }

        uint256 toBal = balanceOf[to];
        if (toBal == 0) {
            userIndex[to] = fromIdx;
        } else {
            userIndex[to] = (userIndex[to] * toBal + fromIdx * amount) / (toBal + amount);
        }

        super._transfer(from, to, amount);

        if (balanceOf[from] == 0) {
            userIndex[from] = 0;
        }
    }

    error Ineligible();

    /// @notice Calculates the raw unit equivalent of multiplier accretion since user's entry
    /// @param account Address to query
    /// @param liveMultiplier Current B20 multiplier (WAD 1e18)
    function userAccretion(address account, uint256 liveMultiplier) external view returns (uint256) {
        uint256 entryIdx = userIndex[account];
        if (entryIdx == 0 || liveMultiplier <= entryIdx) {
            return 0;
        }
        uint256 growth = liveMultiplier - entryIdx;
        return (balanceOf[account] * growth) / 1e18;
    }
}
