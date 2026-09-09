// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ITalonVault {
    event Torn(address indexed user, uint256 rawAmount, uint256 multiplier, uint256 timestamp);
    event Joined(address indexed user, uint256 rawAmount, uint256 multiplier, uint256 timestamp);

    function underlying() external view returns (address);
    function clipToken() external view returns (address);
    function talonToken() external view returns (address);
    function factory() external view returns (address);
    function eligibilityRegistry() external view returns (address);
    function decimals() external view returns (uint8);

    function currentMultiplier() external view returns (uint256);
    function getVaultStats() external view returns (uint256 totalRawBacking, uint256 multiplier, uint8 decimals_);

    function tear(uint256 rawAmount) external;
    function join(uint256 rawAmount) external;
}
