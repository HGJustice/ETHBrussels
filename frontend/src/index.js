import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

const projectId = process.env.REACT_APP_PROJECT_ID;

// 2. Set chains
const ethereum = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const base = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://base.blockscout.com/',
  rpcUrl: 'wss://base-rpc.publicnode.com',
};

const baseSepolia = {
  chainId: 8453,
  name: 'Base Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://base.blockscout.com/',
  rpcUrl: 'https://base-sepolia.blockpi.network/v1/rpc/public',
};

// 3. Create a metadata object
const metadata = {
  name: 'EthBrussels',
  description: 'SafeGaurd against leaks',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

// 4. Create Ethers config with auth parameter
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
  auth: {
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    showWallets: true, // default to true
    walletFeatures: true, // default to true
  },
  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  //rpcUrl: '...', // used for the Coinbase SDK
  //defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [ethereum, base, baseSepolia],
  projectId,
  enableAnalytics: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
