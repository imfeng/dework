declare module 'connectkit' {
  import { ReactNode } from 'react';
  
  export interface ConnectKitProviderProps {
    children: ReactNode;
  }

  export function ConnectKitProvider(props: ConnectKitProviderProps): JSX.Element;
}

declare module 'connectkit/wallets' {
  import { Chain } from 'wagmi/chains';
  
  interface WalletConfig {
    chains: Chain[];
  }
  
  export function metaMaskWallet(config: WalletConfig): any;
  export function coinbaseWallet(config: WalletConfig): any;
  export function walletConnectWallet(config: WalletConfig): any;
  export function injectedWallet(config: WalletConfig): any;
} 