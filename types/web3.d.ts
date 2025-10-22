import { PublicKey, Transaction } from "@solana/web3.js";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      publicKey?: PublicKey;
    };
  }
}

export {};
