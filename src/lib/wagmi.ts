import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Brier Terminal',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // TODO: Replace with actual Project ID from WalletConnect
    chains: [base, baseSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
