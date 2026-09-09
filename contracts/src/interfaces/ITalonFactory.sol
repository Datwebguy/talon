// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ITalonFactory {
    event VaultCreated(address indexed underlying, address indexed vault, address clipToken, address talonToken);
    event UnderlyingAllowlistUpdated(address indexed underlying, bool allowed);
    event FeeUpdated(uint16 feeBps);
    event Paused(address account);
    event Unpaused(address account);

    function owner() external view returns (address);
    function eligibilityRegistry() external view returns (address);
    function feeBps() external view returns (uint16);
    function paused() external view returns (bool);

    function isAllowedUnderlying(address underlying) external view returns (bool);
    function getVault(address underlying) external view returns (address);
    function allVaultsLength() external view returns (uint256);
    function allVaults(uint256 index) external view returns (address);

    function setAllowlist(address underlying, bool allowed) external;
    function setFeeBps(uint16 newFeeBps) external;
    function setPaused(bool _paused) external;
    function setEligibilityOperator(address operator) external;
    function setEligible(address account, bool eligible) external;

    function createVault(address underlying) external returns (address vault);
}
