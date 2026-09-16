import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const FACTORY_ADDRESS = '0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711';
const FACTORY_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'underlying', type: 'address' }],
    name: 'getVault',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allVaultsLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'allVaults',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isAllowed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  }
];

const VAULT_ABI = [
  {
    inputs: [],
    name: 'underlying',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'clipToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'talonToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const OFFICIAL_TOKENS = [
  { symbol: 'AAPLc', address: '0xb200000000000000000000C2e324d24d7eEcd1fb' },
  { symbol: 'NVDAc', address: '0xb20000000000000000000078ee7ce2fE4908108C' },
  { symbol: 'GOOGLc', address: '0xb2000000000000000000002D0BA3164cc74f58B7' },
  { symbol: 'METAc', address: '0xb2000000000000000000008bC8786B856E61707C' },
  { symbol: 'AMZNc', address: '0xb200000000000000000000d9192b6B456483C2E8' },
  { symbol: 'MSFTc', address: '0xB200000000000000000000Ab99cFa739E253872B' },
  { symbol: 'MSTRc', address: '0xb2000000000000000000004884b426556b92883d' },
  { symbol: 'SNDKc', address: '0xb200000000000000000000397293Cb8cda9a10c5' },
  { symbol: 'SPCXc', address: '0xb2000000000000000000007b9fcbd005511aCBd5' },
  { symbol: 'TSLAc', address: '0xb2000000000000000000001e800a7f5189430cD0' },
];

const client = createPublicClient({ chain: base, transport: http('https://mainnet.base.org') });

async function main() {
  const total = await client.readContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'allVaultsLength',
  });
  console.log('Total vaults count in factory:', total.toString());

  for (let i = 0; i < Number(total); i++) {
    const vaultAddr = await client.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'allVaults',
      args: [BigInt(i)],
    });
    const underlying = await client.readContract({
      address: vaultAddr,
      abi: VAULT_ABI,
      functionName: 'underlying',
    });
    const clip = await client.readContract({
      address: vaultAddr,
      abi: VAULT_ABI,
      functionName: 'clipToken',
    });
    const talon = await client.readContract({
      address: vaultAddr,
      abi: VAULT_ABI,
      functionName: 'talonToken',
    });
    console.log(`Vault[${i}]: ${vaultAddr} (underlying: ${underlying}, clip: ${clip}, talon: ${talon})`);
  }

  console.log('\n--- Token Allowance & getVault Status ---');
  for (const t of OFFICIAL_TOKENS) {
    let allowed = false;
    try {
      allowed = await client.readContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'isAllowed',
        args: [t.address],
      });
    } catch (e) {}

    const vault = await client.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'getVault',
      args: [t.address],
    });
    console.log(`${t.symbol} (${t.address}): allowed=${allowed}, vault=${vault}`);
  }
}

main().catch(console.error);
