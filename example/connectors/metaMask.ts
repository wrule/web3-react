import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

export const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({
  actions,
  options: {
    // mustBeMetaMask: true,
    silent: true,
    timeout: 30 * 1000,
  },
}))
