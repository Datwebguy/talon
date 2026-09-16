async function rpc(method, params = []) {
  const rpcs = [
    'https://base-rpc.publicnode.com',
    'https://mainnet.base.org',
  ];
  for (const url of rpcs) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 })
      });
      const data = await res.json();
      if (data.result !== undefined || data.error !== undefined) return data;
    } catch (e) {}
  }
  return { error: 'All RPCs failed' };
}

async function run() {
  const factory = '0x7e16011cafead7ffdc5cdd96e67b167f9b1f9711';
  const tokens = [
    { s: 'AAPLc', a: '0xb200000000000000000000C2e324d24d7eEcd1fb' },
    { s: 'NVDAc', a: '0xb20000000000000000000078ee7ce2fE4908108C' },
    { s: 'GOOGLc', a: '0xb2000000000000000000002D0BA3164cc74f58B7' },
    { s: 'METAc', a: '0xb2000000000000000000008bC8786B856E61707C' },
    { s: 'AMZNc', a: '0xb200000000000000000000d9192b6B456483C2E8' },
    { s: 'MSFTc', a: '0xB200000000000000000000Ab99cFa739E253872B' },
    { s: 'MSTRc', a: '0xb2000000000000000000004884b426556b92883d' },
    { s: 'SNDKc', a: '0xb200000000000000000000397293Cb8cda9a10c5' },
    { s: 'SPCXc', a: '0xb2000000000000000000007b9fcbd005511aCBd5' },
    { s: 'TSLAc', a: '0xb2000000000000000000001e800a7f5189430cD0' },
  ];

  for (const t of tokens) {
    const data = '0xb4bd6f46' + t.a.replace('0x', '').padStart(64, '0');
    const sim = await rpc('eth_call', [{
      from: '0x000000000000000000000000000000000000dEaD',
      to: factory,
      data: data
    }, 'latest']);
    
    if (sim.result) {
      console.log(`${t.s}: ALLOWED -> createVault succeeds (predicted vault: 0x${sim.result.slice(-40)})`);
    } else {
      const err = sim.error?.data || sim.error?.message;
      console.log(`${t.s}: not allowlisted in factory (${err})`);
    }
  }
}

run();
