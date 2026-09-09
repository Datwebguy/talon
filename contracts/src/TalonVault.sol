// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IB20} from "./interfaces/IB20.sol";
import {ITalonVault} from "./interfaces/ITalonVault.sol";
import {ITalonFactory} from "./interfaces/ITalonFactory.sol";
import {ClipToken} from "./tokens/ClipToken.sol";
import {TalonToken} from "./tokens/TalonToken.sol";
import {IEligibilityRegistry} from "./interfaces/IEligibilityRegistry.sol";

/// @title TalonVault
/// @notice Core vault contract for unbundling an official Coinbase B20 token into clip and talon claims.
contract TalonVault is ITalonVault {
    address public immutable override underlying;
    address public immutable override clipToken;
    address public immutable override talonToken;
    address public immutable override factory;
    address public immutable override eligibilityRegistry;
    uint8 public immutable override decimals;

    error ZeroAddress();
    error ZeroAmount();
    error TransferFailed();
    error ProtocolPaused();
    error OnlyFactory();
    error InvalidMultiplier();
    error Ineligible(address account);

    constructor(
        address _underlying,
        address _factory,
        address _eligibilityRegistry,
        string memory _symbolSuffix,
        uint8 _decimals
    ) {
        if (_underlying == address(0) || _factory == address(0) || _eligibilityRegistry == address(0)) revert ZeroAddress();

        underlying = _underlying;
        factory = _factory;
        eligibilityRegistry = _eligibilityRegistry;
        decimals = _decimals;

        // Deploy coupled tokens matching underlying decimals
        clipToken = address(
            new ClipToken(
                string(abi.encodePacked("Talon Clip ", _symbolSuffix)),
                string(abi.encodePacked("clip", _symbolSuffix)),
                _decimals,
                address(this),
                _eligibilityRegistry
            )
        );

        talonToken = address(
            new TalonToken(
                string(abi.encodePacked("Talon Principal ", _symbolSuffix)),
                string(abi.encodePacked("talon", _symbolSuffix)),
                _decimals,
                address(this),
                _eligibilityRegistry
            )
        );
    }

    /// @notice Returns current B20 multiplier from the underlying contract (WAD 1e18)
    function currentMultiplier() public view override returns (uint256) {
        uint256 m = IB20(underlying).multiplier();
        if (m == 0) revert InvalidMultiplier();
        return m;
    }

    /// @notice Tears raw underlying B20 into equal amounts of Clip and Talon tokens
    /// @param rawAmount Amount of raw underlying tokens to deposit (in underlying decimals)
    function tear(uint256 rawAmount) external override {
        if (rawAmount == 0) revert ZeroAmount();
        if (!IEligibilityRegistry(eligibilityRegistry).isEligible(msg.sender)) revert Ineligible(msg.sender);
        if (ITalonFactory(factory).paused()) revert ProtocolPaused();

        uint256 m = currentMultiplier();

        // Pull underlying B20
        bool success = IB20(underlying).transferFrom(msg.sender, address(this), rawAmount);
        if (!success) revert TransferFailed();

        // Mint 1:1 claims
        ClipToken(clipToken).mint(msg.sender, rawAmount, m);
        TalonToken(talonToken).mint(msg.sender, rawAmount);

        emit Torn(msg.sender, rawAmount, m, block.timestamp);
    }

    /// @notice Joins equal amounts of Clip and Talon tokens to redeem 1:1 raw underlying B20
    /// @param rawAmount Amount of raw underlying tokens to redeem
    function join(uint256 rawAmount) external override {
        if (rawAmount == 0) revert ZeroAmount();
        if (!IEligibilityRegistry(eligibilityRegistry).isEligible(msg.sender)) revert Ineligible(msg.sender);

        uint256 m = currentMultiplier();

        // Burns require both tokens in msg.sender's balance. Reverts if either balance is insufficient.
        ClipToken(clipToken).burn(msg.sender, rawAmount);
        TalonToken(talonToken).burn(msg.sender, rawAmount);

        // Push underlying B20 back to user
        bool success = IB20(underlying).transfer(msg.sender, rawAmount);
        if (!success) revert TransferFailed();

        emit Joined(msg.sender, rawAmount, m, block.timestamp);
    }

    /// @notice Returns current vault backing and metrics
    function getVaultStats() external view override returns (uint256 totalRawBacking, uint256 multiplier, uint8 decimals_) {
        totalRawBacking = IB20(underlying).balanceOf(address(this));
        multiplier = currentMultiplier();
        decimals_ = decimals;
    }
}
