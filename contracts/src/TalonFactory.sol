// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IB20} from "./interfaces/IB20.sol";
import {ITalonFactory} from "./interfaces/ITalonFactory.sol";
import {TalonVault} from "./TalonVault.sol";
import {EligibilityRegistry} from "./EligibilityRegistry.sol";

/// @title TalonFactory
/// @notice Factory managing official Coinbase B20 token allowlist and deploying coupled TalonVaults.
contract TalonFactory is ITalonFactory {
    address public override owner;
    address public eligibilityOperator;
    address public immutable override eligibilityRegistry;
    uint16 public override feeBps; // default 0
    bool public override paused;

    mapping(address => bool) public override isAllowedUnderlying;
    mapping(address => address) public override getVault;
    address[] public override allVaults;

    error OnlyOwner();
    error OnlyOwnerOrEligibilityOperator();
    error NotAllowedUnderlying(address underlying);
    error VaultAlreadyExists(address underlying);
    error ZeroAddress();

    event EligibilityOperatorUpdated(address indexed operator);

    constructor() {
        owner = msg.sender;
        eligibilityRegistry = address(new EligibilityRegistry(address(this)));

        // Official Coinbase Tokenized Stocks on Base
        _setAllowlist(0xb200000000000000000000C2e324d24d7eEcd1fb, true); // AAPLc
        _setAllowlist(0xb20000000000000000000078ee7ce2fE4908108C, true); // NVDAc
        _setAllowlist(0xb2000000000000000000002D0BA3164cc74f58B7, true); // GOOGLc
        _setAllowlist(0xb2000000000000000000008bC8786B856E61707C, true); // METAc
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier onlyOwnerOrEligibilityOperator() {
        if (msg.sender != owner && msg.sender != eligibilityOperator) revert OnlyOwnerOrEligibilityOperator();
        _;
    }

    function allVaultsLength() external view override returns (uint256) {
        return allVaults.length;
    }

    function setAllowlist(address underlying, bool allowed) external override onlyOwner {
        _setAllowlist(underlying, allowed);
    }

    function _setAllowlist(address underlying, bool allowed) internal {
        if (underlying == address(0)) revert ZeroAddress();
        isAllowedUnderlying[underlying] = allowed;
        emit UnderlyingAllowlistUpdated(underlying, allowed);
    }

    function setFeeBps(uint16 newFeeBps) external override onlyOwner {
        feeBps = newFeeBps;
        emit FeeUpdated(newFeeBps);
    }

    function setPaused(bool _paused) external override onlyOwner {
        paused = _paused;
        if (_paused) {
            emit Paused(msg.sender);
        } else {
            emit Unpaused(msg.sender);
        }
    }

    function setEligibilityOperator(address operator) external override onlyOwner {
        if (operator == address(0)) revert ZeroAddress();
        eligibilityOperator = operator;
        emit EligibilityOperatorUpdated(operator);
    }

    function setEligible(address account, bool eligible) external override onlyOwnerOrEligibilityOperator {
        EligibilityRegistry(eligibilityRegistry).setEligible(account, eligible);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        owner = newOwner;
    }

    /// @notice Deploys a new TalonVault for an approved official B20 token
    /// @param underlying Address of the Coinbase tokenized stock
    /// @return vault Address of newly created vault
    function createVault(address underlying) external override returns (address vault) {
        if (!isAllowedUnderlying[underlying]) revert NotAllowedUnderlying(underlying);
        if (getVault[underlying] != address(0)) revert VaultAlreadyExists(underlying);

        uint8 underlyingDecimals = IB20(underlying).decimals();
        string memory sym = IB20(underlying).symbol();

        TalonVault newVault = new TalonVault(
            underlying,
            address(this),
            eligibilityRegistry,
            sym,
            underlyingDecimals
        );

        vault = address(newVault);
        getVault[underlying] = vault;
        allVaults.push(vault);

        emit VaultCreated(
            underlying,
            vault,
            newVault.clipToken(),
            newVault.talonToken()
        );
    }
}
