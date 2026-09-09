// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "./IERC20.sol";

interface IB20 is IERC20 {
    function multiplier() external view returns (uint256);
    function scaledBalanceOf(address account) external view returns (uint256);
    function toScaledBalance(uint256 raw) external view returns (uint256);
    function toRawBalance(uint256 scaled) external view returns (uint256);
}
