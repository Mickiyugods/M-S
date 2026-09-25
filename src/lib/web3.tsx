"use client";

/**
 * Wallet layer: Reown AppKit + wagmi on Robinhood Chain (4663), the network
 * Pons trades on.
 *
 * Components only use `useWallet()`. For the real swap later, use wagmi hooks
 * (useWriteContract, useSendTransaction, …) inside <WalletProvider>.
 */

import { createAppKit, useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { robinhood, type AppKitNetwork } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { WagmiProvider, fallback, http, useBalance, useReadContracts } from "wagmi";
import { erc20Abi, formatUnits, isAddress, type Address } from "viem";
import { coinbaseWallet } from "wagmi/connectors/coinbaseWallet";
import { siteConfig } from "@/config/site";

const projectId = siteConfig.wallet.projectId;
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [robinhood];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  transports: { [robinhood.id]: fallback(siteConfig.wallet.rpcUrls.map((url) => http(url))) },
  // Supplying Coinbase Wallet ourselves stops AppKit from adding its default one,
  // which sends telemetry to Coinbase on every page load.
  connectors: [coinbaseWallet({ appName: siteConfig.name, preference: { options: "all", telemetry: false } })],
});
const queryClient = new QueryClient();

const origin = typeof window !== "undefined" ? window.location.origin : siteConfig.url;

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: robinhood,
  metadata: {
    name: siteConfig.name,
    description: siteConfig.description,
    url: origin,
    icons: [`${origin}${siteConfig.images.avatar}`],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#A8F33D",
    "--w3m-color-mix": "#0E3518",
    "--w3m-color-mix-strength": 35,
    "--w3m-border-radius-master": "3px",
    "--w3m-font-family": "var(--font-nunito), ui-sans-serif, system-ui, sans-serif",
    "--w3m-z-index": 1000,
  },
});

type WalletStatus = "disconnected" | "connecting" | "reconnecting" | "connected";

interface WalletContextValue {
  message: string | null;
  notify: (message: string) => void;
  clearMessage: () => void;
}

const WalletMessageContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const value = useMemo<WalletContextValue>(
    () => ({ message, notify: setMessage, clearMessage: () => setMessage(null) }),
    [message],
  );

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletMessageContext.Provider value={value}>{children}</WalletMessageContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletMessageContext);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");

  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();

  /** Opens the Reown modal: wallet picker when disconnected, account view when connected. */
  const connect = useCallback(() => open(), [open]);

  return {
    address: isConnected && address ? address : null,
    isConnected,
    status: (status ?? "disconnected") as WalletStatus,
    connect,
    message: ctx.message,
    notify: ctx.notify,
    clearMessage: ctx.clearMessage,
  };
}

export function shortenAddress(addr: string, chars = 4) {
  return addr.length > chars * 2 + 2 ? `${addr.slice(0, chars + 2)}…${addr.slice(-chars)}` : addr;
}

export interface TokenBalance {
  value: bigint;
  decimals: number;
  symbol: string;
  /** Full-precision decimal string (for inputs / comparisons). */
  exact: string;
}

/**
 * Live balances for the connected wallet on Robinhood Chain: native ETH, and the
 * token at siteConfig.contractAddress once it is set (NEXT_PUBLIC_TOKEN_ADDRESS).
 * Both refresh every 15 s while the page is open.
 */
export function useWalletBalances() {
  const { address } = useWallet();
  const owner = address && isAddress(address) ? (address as Address) : undefined;
  const token = isAddress(siteConfig.contractAddress) ? (siteConfig.contractAddress as Address) : undefined;

  const eth = useBalance({
    address: owner,
    chainId: robinhood.id,
    query: { enabled: !!owner, refetchInterval: 15_000 },
  });

  const tokenReads = useReadContracts({
    allowFailure: false,
    contracts: token && owner
      ? [
          { address: token, abi: erc20Abi, functionName: "balanceOf", args: [owner], chainId: robinhood.id },
          { address: token, abi: erc20Abi, functionName: "decimals", chainId: robinhood.id },
          { address: token, abi: erc20Abi, functionName: "symbol", chainId: robinhood.id },
        ]
      : [],
    query: { enabled: !!(token && owner), refetchInterval: 15_000 },
  });

  const ethBalance: TokenBalance | undefined = eth.data
    ? { ...eth.data, exact: formatUnits(eth.data.value, eth.data.decimals) }
    : undefined;

  let tokenBalance: TokenBalance | undefined;
  if (tokenReads.data && tokenReads.data.length === 3) {
    const [value, decimals, symbol] = tokenReads.data as [bigint, number, string];
    tokenBalance = { value, decimals, symbol, exact: formatUnits(value, decimals) };
  }

  return {
    eth: ethBalance,
    token: tokenBalance,
    /** True once a valid contract address is configured. */
    hasToken: !!token,
    loading: eth.isLoading || tokenReads.isLoading,
  };
}

/** Human-friendly balance: up to 4 decimals for small amounts, compact for large ones. */
export function formatBalance(exact: string) {
  const n = Number(exact);
  if (!Number.isFinite(n) || n === 0) return "0";
  if (n < 0.0001) return "<0.0001";
  if (n >= 1_000_000) return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: n < 1 ? 4 : 2 }).format(n);
}
