// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "./ERC20.sol";
import {ITalonToken} from "../interfaces/ITalonToken.sol";
import {IEligibilityRegistry} from "../interfaces/IEligibilityRegistry.sol";

/// @title TalonToken
/// @notice 1:1 Raw principal claim token for Talon protocol.
contract TalonToken is ERC20, ITalonToken {
    address public immutable vault;
    address public immutable eligibilityRegistry;

    error OnlyVault();

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

    /// @notice Mints talon tokens upon deposit into the vault
    /// @param to Recipient address
    /// @param amount Amount to mint (in underlying raw decimals)
    function mint(address to, uint256 amount) external onlyVault {
        _mint(to, amount);
    }

    /// @notice Burns talon tokens upon joining back to the underlying
    /// @param from Account to burn from
    /// @param amount Amount to burn
    function burn(address from, uint256 amount) external onlyVault {
        _burn(from, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        if (!IEligibilityRegistry(eligibilityRegistry).isEligible(from) || !IEligibilityRegistry(eligibilityRegistry).isEligible(to)) {
            revert Ineligible();
        }
        super._transfer(from, to, amount);
    }

    error Ineligible();
}
