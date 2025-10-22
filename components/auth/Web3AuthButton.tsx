"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { BrowserProvider } from "ethers";

interface Web3AuthButtonProps {
  provider: "ethereum" | "solana";
  redirectTo?: string;
  disabled?: boolean;
}

export function Web3AuthButton({ provider, redirectTo = "/", disabled = false }: Web3AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEthereumAuth = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask extension to sign in with Ethereum.",
          variant: "destructive",
        });
        window.open("https://metamask.io/download/", "_blank");
        return;
      }

      setIsLoading(true);

      // Request account access
      const ethProvider = new BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      const address = accounts[0];

      if (!address) {
        throw new Error("No Ethereum address found");
      }

      // Create a message to sign (EIP-4361: Sign-In with Ethereum)
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = "Sign in to docverse with your Ethereum wallet";
      const nonce = Math.random().toString(36).substring(7);
      const issuedAt = new Date().toISOString();

      const message = `${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${origin}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuedAt}`;

      // Sign the message with MetaMask
      const signer = await ethProvider.getSigner();
      const signature = await signer.signMessage(message);

      // Store auth data (you'll need to verify this on your backend)
      const authData = {
        address,
        signature,
        message,
        timestamp: Date.now(),
      };

      // Store in localStorage for now (in production, verify on backend)
      localStorage.setItem("web3_auth", JSON.stringify(authData));
      localStorage.setItem("web3_provider", "ethereum");

      toast({
        title: "Welcome! 🎉",
        description: `Successfully signed in with Ethereum wallet: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      // Redirect after successful auth
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    } catch (error: any) {
      console.error("Ethereum auth error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to sign in with Ethereum. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolanaAuth = async () => {
    try {
      // Check if Phantom wallet is installed
      if (typeof window.solana === "undefined" || !window.solana.isPhantom) {
        toast({
          title: "Phantom Wallet Not Found",
          description: "Please install Phantom wallet extension to sign in with Solana.",
          variant: "destructive",
        });
        window.open("https://phantom.app/", "_blank");
        return;
      }

      setIsLoading(true);

      // Connect to Phantom wallet
      const resp = await window.solana.connect();
      const publicKey = resp.publicKey.toString();

      if (!publicKey) {
        throw new Error("No Solana address found");
      }

      // Create message to sign (SIWS: Sign-In with Solana)
      const domain = window.location.host;
      const statement = "Sign in to docverse with your Solana wallet";
      const nonce = Math.random().toString(36).substring(7);
      const issuedAt = new Date().toISOString();

      const messageText = `${domain} wants you to sign in with your Solana account:
${publicKey}

${statement}

Nonce: ${nonce}
Issued At: ${issuedAt}`;

      const message = new TextEncoder().encode(messageText);

      // Sign the message
      const signedMessage = await window.solana.signMessage(message, "utf8");
      const signature = Buffer.from(signedMessage.signature).toString("base64");

      // Store auth data (you'll need to verify this on your backend)
      const authData = {
        address: publicKey,
        signature,
        message: messageText,
        timestamp: Date.now(),
      };

      // Store in localStorage for now (in production, verify on backend)
      localStorage.setItem("web3_auth", JSON.stringify(authData));
      localStorage.setItem("web3_provider", "solana");

      toast({
        title: "Welcome! 🎉",
        description: `Successfully signed in with Solana wallet: ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
      });

      // Redirect after successful auth
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    } catch (error: any) {
      console.error("Solana auth error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to sign in with Solana. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = provider === "ethereum" ? handleEthereumAuth : handleSolanaAuth;

  return (
    <Button
      type="button"
      onClick={handleAuth}
      disabled={isLoading || disabled}
      className="w-full bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white font-semibold py-4 sm:py-5 rounded-xl relative text-base sm:text-lg shadow-lg hover:scale-[1.02] transition-all duration-300 focus:ring-4 focus:ring-primary/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group border border-border"
    >
      <div className="flex items-center justify-center gap-3 relative z-20">
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            {provider === "ethereum" ? (
              <>
                <svg className="h-5 w-5" viewBox="0 0 256 417" fill="none">
                  <path
                    d="M127.961 0L125.635 7.89L125.635 285.168L127.961 287.492L255.922 212.32L127.961 0Z"
                    fill="#8C8C8C"
                  />
                  <path
                    d="M127.962 0L0 212.32L127.962 287.492V153.455V0Z"
                    fill="#C0C0C0"
                  />
                  <path
                    d="M127.961 312.187L126.635 313.854V406.006L127.961 410.616L256 237.023L127.961 312.187Z"
                    fill="#8C8C8C"
                  />
                  <path
                    d="M127.962 410.616V312.187L0 237.023L127.962 410.616Z"
                    fill="#C0C0C0"
                  />
                  <path
                    d="M127.961 287.492L255.922 212.32L127.961 153.455V287.492Z"
                    fill="#6C6C6C"
                  />
                  <path
                    d="M0 212.32L127.962 287.492V153.455L0 212.32Z"
                    fill="#8C8C8C"
                  />
                </svg>
                <span className="font-semibold">
                  Sign in with Ethereum
                </span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 397.7 311.7" fill="none">
                  <linearGradient
                    id="solana-gradient"
                    x1="360.879"
                    y1="351.455"
                    x2="141.213"
                    y2="-69.294"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#00FFA3" />
                    <stop offset="1" stopColor="#DC1FFF" />
                  </linearGradient>
                  <path
                    d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
                    fill="url(#solana-gradient)"
                  />
                  <path
                    d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
                    fill="url(#solana-gradient)"
                  />
                  <path
                    d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
                    fill="url(#solana-gradient)"
                  />
                </svg>
                <span className="font-semibold">
                  Sign in with Solana
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* Enhanced effects */}
      <div className="absolute inset-0 shimmer opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-xl"></div>
    </Button>
  );
}
