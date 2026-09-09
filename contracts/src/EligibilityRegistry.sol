// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Fail-closed eligibility registry for protocol entrypoints.
/// @dev Eligibility is intentionally explicit and revocable. A production
/// attestation service should update this registry after its jurisdictional
/// checks; the UI is not a security boundary.
contract EligibilityRegistry {
    address public owner;
    mapping(address => bool) public isEligible;

    error OnlyOwner();
    error ZeroAddress();

    event EligibilityUpdated(address indexed account, bool eligible);

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        owner = initialOwner;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    function setEligible(address account, bool eligible) external onlyOwner {
        if (account == address(0)) revert ZeroAddress();
        isEligible[account] = eligible;
        emit EligibilityUpdated(account, eligible);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        owner = newOwner;
    }
}
