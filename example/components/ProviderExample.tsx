import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import type { Network } from '@web3-react/network'
import type { WalletConnect } from '@web3-react/walletconnect'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../connectors/coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { hooks as walletConnectV2Hooks, walletConnectV2 } from '../connectors/walletConnectV2'
import { getName } from '../utils'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

const connectors: [MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
]

const { useProvider } = metaMaskHooks;

const useBalance = (address: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [balance, setBalance] = useState<BigNumber | null>(null);
  const provider = useProvider();

  const updateBalance = useCallback(async () => {
    setLoading(true);
    try {
      if (address && provider) {
        setBalance(await provider.getBalance(address));
      } else {
        setBalance(null);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [address, provider, setLoading, setBalance]);

  useEffect(() => {
    updateBalance();
  }, [address, provider]);

  return { balance, loading };
}

function Child() {
  const { connector } = useWeb3React();
  const { useAccounts, useAccount, useIsActive, useIsActivating } = metaMaskHooks;

  const isActive = useIsActive();
  const isActivating = useIsActivating();
  const account = useAccount();
  const balanceInfo = useBalance(account);

  useEffect(() => {
    if (!isActive && !isActivating) {
      // 尝试自动重连
      connector.connectEagerly();
    }
  }, []);

  return (
    <div>
      <span>isActive: {isActive.toString()}</span>
      <span>isActivating: {isActivating.toString()}</span>
      <span>账户：{account}</span>
      <span>余额：{balanceInfo.balance?.toString()}</span>
      <button onClick={async () => {
        await connector.activate();
      }}>连接</button>
    </div>
  );
}

export default function ProviderExample() {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child />
    </Web3ReactProvider>
  )
}
