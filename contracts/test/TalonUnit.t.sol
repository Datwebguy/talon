// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {TalonFactory} from "../src/TalonFactory.sol";
import {TalonVault} from "../src/TalonVault.sol";
import {ClipToken} from "../src/tokens/ClipToken.sol";
import {TalonToken} from "../src/tokens/TalonToken.sol";
import {ERC20} from "../src/tokens/ERC20.sol";
import {IB20} from "../src/interfaces/IB20.sol";

contract MockB20 is ERC20, IB20 {
    uint256 public m = 1e18;

    constructor(string memory sym, uint8 dec) ERC20(sym, sym, dec) {}

    function mint(address to, uint256 amt) external {
        _mint(to, amt);
    }

    function setMultiplier(uint256 newM) external {
        m = newM;
    }

    function multiplier() external view override returns (uint256) {
        return m;
    }

    function scaledBalanceOf(address account) external view override returns (uint256) {
        return (balanceOf[account] * 1e18) / m;
    }

    function toScaledBalance(uint256 raw) external view override returns (uint256) {
        return (raw * 1e18) / m;
    }

    function toRawBalance(uint256 scaled) external view override returns (uint256) {
        return (scaled * m) / 1e18;
    }
}

contract TalonUnitTest is Test {
    TalonFactory public factory;
    MockB20 public mockAapl;
    MockB20 public mockNvda18;

    address public alice = address(0xA11CE);
    address public bob = address(0xB0B);
    address public charlie = address(0xC0FFEE);
    address public eligibilityOperator = address(0xE11B);

    function setUp() public {
        factory = new TalonFactory();
        mockAapl = new MockB20("AAPLc", 8);
        mockNvda18 = new MockB20("NVDAc", 18);

        // Allow our test mock address
        factory.setAllowlist(address(mockAapl), true);
        factory.setAllowlist(address(mockNvda18), true);

        // Give Alice some balance
        mockAapl.mint(alice, 1000 * 1e8);
        factory.setEligible(alice, true);
        factory.setEligible(bob, true);
    }

    function test_FactoryRejectsUnknownToken() public {
        address unknownToken = address(0x9999);
        vm.expectRevert(abi.encodeWithSelector(TalonFactory.NotAllowedUnderlying.selector, unknownToken));
        factory.createVault(unknownToken);
    }

    function test_OfficialCoinbaseB20AllowlistIsExact() public view {
        assertTrue(factory.isAllowedUnderlying(0xb200000000000000000000C2e324d24d7eEcd1fb)); // AAPLc
        assertTrue(factory.isAllowedUnderlying(0xb20000000000000000000078ee7ce2fE4908108C)); // NVDAc
        assertTrue(factory.isAllowedUnderlying(0xb2000000000000000000002D0BA3164cc74f58B7)); // GOOGLc
        assertTrue(factory.isAllowedUnderlying(0xb2000000000000000000008bC8786B856E61707C)); // METAc
        assertFalse(factory.isAllowedUnderlying(0xb200000000000000000000000000000000000001)); // lookalike
    }

    function test_EligibilityOperatorCanApproveWithoutFactoryAdminAccess() public {
        factory.setEligibilityOperator(eligibilityOperator);

        vm.prank(eligibilityOperator);
        factory.setEligible(charlie, true);

        address registry = factory.eligibilityRegistry();
        (bool ok, bytes memory data) = registry.staticcall(abi.encodeWithSignature("isEligible(address)", charlie));
        assertTrue(ok);
        assertTrue(abi.decode(data, (bool)));

        vm.prank(eligibilityOperator);
        vm.expectRevert(TalonFactory.OnlyOwner.selector);
        factory.setPaused(true);
    }

    function test_IneligibleAccountCannotTearOrJoin() public {
        address vaultAddr = factory.createVault(address(mockAapl));
        TalonVault vault = TalonVault(vaultAddr);

        mockAapl.mint(charlie, 100 * 1e8);
        vm.startPrank(charlie);
        mockAapl.approve(vaultAddr, 100 * 1e8);
        vm.expectRevert(abi.encodeWithSelector(TalonVault.Ineligible.selector, charlie));
        vault.tear(100 * 1e8);
        vm.stopPrank();
    }

    function test_DerivedClaimsCannotTransferToIneligibleRecipient() public {
        address vaultAddr = factory.createVault(address(mockAapl));
        TalonVault vault = TalonVault(vaultAddr);
        ClipToken clip = ClipToken(vault.clipToken());

        vm.startPrank(alice);
        mockAapl.approve(vaultAddr, 100 * 1e8);
        vault.tear(100 * 1e8);
        vm.expectRevert(ClipToken.Ineligible.selector);
        clip.transfer(charlie, 1 * 1e8);
        vm.stopPrank();
    }

    function test_DecimalsMatchUnderlyingDynamically() public {
        address vaultAapl = factory.createVault(address(mockAapl));
        address vaultNvda = factory.createVault(address(mockNvda18));

        assertEq(TalonVault(vaultAapl).decimals(), 8, "AAPLc vault should have 8 decimals");
        assertEq(ClipToken(TalonVault(vaultAapl).clipToken()).decimals(), 8, "ClipAAPLc should have 8 decimals");
        assertEq(TalonToken(TalonVault(vaultAapl).talonToken()).decimals(), 8, "TalonAAPLc should have 8 decimals");

        assertEq(TalonVault(vaultNvda).decimals(), 18, "NVDAc vault should have 18 decimals");
        assertEq(ClipToken(TalonVault(vaultNvda).clipToken()).decimals(), 18, "ClipNVDAc should have 18 decimals");
        assertEq(TalonToken(TalonVault(vaultNvda).talonToken()).decimals(), 18, "TalonNVDAc should have 18 decimals");
    }

    function test_TearAndJoin1to1Raw() public {
        address vaultAddr = factory.createVault(address(mockAapl));
        TalonVault vault = TalonVault(vaultAddr);
        ClipToken clip = ClipToken(vault.clipToken());
        TalonToken talon = TalonToken(vault.talonToken());

        uint256 depositAmt = 100 * 1e8; // 100 AAPLc (8 decimals)

        vm.startPrank(alice);
        mockAapl.approve(vaultAddr, depositAmt);
        vault.tear(depositAmt);

        // Check balances after tear
        assertEq(mockAapl.balanceOf(alice), 900 * 1e8);
        assertEq(mockAapl.balanceOf(vaultAddr), 100 * 1e8);
        assertEq(clip.balanceOf(alice), 100 * 1e8);
        assertEq(talon.balanceOf(alice), 100 * 1e8);
        assertEq(clip.userIndex(alice), 1e18);

        // Join back 100%
        vault.join(depositAmt);

        // Check balances after join
        assertEq(mockAapl.balanceOf(alice), 1000 * 1e8);
        assertEq(mockAapl.balanceOf(vaultAddr), 0);
        assertEq(clip.balanceOf(alice), 0);
        assertEq(talon.balanceOf(alice), 0);
        vm.stopPrank();
    }

    function test_CannotJoinOneSidedWithTalonOnly() public {
        address vaultAddr = factory.createVault(address(mockAapl));
        TalonVault vault = TalonVault(vaultAddr);
        ClipToken clip = ClipToken(vault.clipToken());
        TalonToken talon = TalonToken(vault.talonToken());

        uint256 depositAmt = 100 * 1e8;

        vm.startPrank(alice);
        mockAapl.approve(vaultAddr, depositAmt);
        vault.tear(depositAmt);

        // Alice transfers all Clip away to Bob
        clip.transfer(bob, 100 * 1e8);
        assertEq(clip.balanceOf(alice), 0);
        assertEq(talon.balanceOf(alice), 100 * 1e8);

        // Attempting to join with only Talon must revert
        vm.expectRevert(ERC20.InsufficientBalance.selector);
        vault.join(depositAmt);
        vm.stopPrank();
    }

    function test_CannotJoinOneSidedWithClipOnly() public {
        address vaultAddr = factory.createVault(address(mockAapl));
        TalonVault vault = TalonVault(vaultAddr);
        ClipToken clip = ClipToken(vault.clipToken());
        TalonToken talon = TalonToken(vault.talonToken());

        uint256 depositAmt = 100 * 1e8;

        vm.startPrank(alice);
        mockAapl.approve(vaultAddr, depositAmt);
        vault.tear(depositAmt);

        // Alice transfers all Talon away to Bob
        talon.transfer(bob, 100 * 1e8);
        assertEq(clip.balanceOf(alice), 100 * 1e8);
        assertEq(talon.balanceOf(alice), 0);

        // Attempting to join with only Clip must revert
        vm.expectRevert(ERC20.InsufficientBalance.selector);
        vault.join(depositAmt);
        vm.stopPrank();
    }

    function test_MultiplierReadDoesNotMutateBalances() public {
        address vaultAddr = factory.createVault(address(mockAapl));
        TalonVault vault = TalonVault(vaultAddr);

        uint256 m1 = vault.currentMultiplier();
        (uint256 rawBacking, uint256 m2, uint8 dec) = vault.getVaultStats();

        assertEq(m1, 1e18);
        assertEq(m2, 1e18);
        assertEq(rawBacking, 0);
        assertEq(dec, 8);
    }

    function test_ClipIndexTrackingAndTransferSettlement() public {
        address vaultAddr = factory.createVault(address(mockAapl));
        TalonVault vault = TalonVault(vaultAddr);
        ClipToken clip = ClipToken(vault.clipToken());

        // Alice tears at 1.0x
        vm.startPrank(alice);
        mockAapl.approve(vaultAddr, 100 * 1e8);
        vault.tear(100 * 1e8);
        assertEq(clip.userIndex(alice), 1e18);

        // Underlying increases multiplier to 1.05x (+5% dividend reinvestment)
        mockAapl.setMultiplier(1050000000000000000);

        // Alice's accretion claim is 5% of 100 = 5 AAPLc raw
        uint256 acc = clip.userAccretion(alice, mockAapl.multiplier());
        assertEq(acc, 5 * 1e8);

        // Alice transfers 50 Clip to Bob
        clip.transfer(bob, 50 * 1e8);
        // Bob receives Alice's 1.0x entry index!
        assertEq(clip.userIndex(bob), 1e18);
        vm.stopPrank();
    }
}
