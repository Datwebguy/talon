// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "./IERC20.sol";

interface IClipToken is IERC20 {
    function vault() external view returns (address);
    function userIndex(address account) external view returns (uint256);
    function userAccretion(address account, uint256 currentMultiplier) external view returns (uint256);

    function mint(address to, uint256 amount, uint256 currentMultiplier) external;
    function burn(address from, uint256 amount) external;
}
