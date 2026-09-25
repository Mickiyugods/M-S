"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Copy, Wallet } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatUnits, parseEther, type Address } from "viem";
import { useAccount, usePublicClient, useSendTransaction, useSwitchChain } from "wagmi";
import { robinhood } from "@reown/appkit/networks";
import { ContractText, useCopyContract } from "@/components/ui/ContractAddress";
import { siteConfig } from "@/config/site";
import { PONS_ROUTER, encodePonsBuy, quotePonsBuy } from "@/lib/pons";
import { formatBalance, useWallet, useWalletBalances } from "@/lib/web3";
import GlassCard from "@/components/ui/GlassCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { SceneBackdrop, SceneInline, SceneSoftBackdrop } from "@/components/ui/Scene";

/** ETH kept back by MAX so the wallet can still pay the network fee. */
const GAS_RESERVE = 0.0005;
/** Max price movement accepted between quote and execution (3%). */
const SLIPPAGE_BPS = BigInt(300);
/** Address used for quotes before a wallet is connected. */
const QUOTE_ADDRESS: Address = "0x1111111111111111111111111111111111111111";

function parseAmount(value: string) {
  try {
    const wei = parseEther(value || "0");
    return wei > BigInt(0) ? wei : null;
  } catch {
    return null;
  }
}

const withSlippage = (out: bigint) => (out * (BigInt(10_000) - SLIPPAGE_BPS)) / BigInt(10_000);

function sanitizeAmount(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("")}` : whole;
}

export default function BuyMspike() {
  const ids = useId();
  const [fromAmount, setFromAmount] = useState("");
  const { connect, status, address, notify } = useWallet();
  const { eth, token, hasToken } = useWalletBalances();
  const busy = status === "connecting" || status === "reconnecting";
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient({ chainId: robinhood.id });
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<"idle" | "confirm" | "pending">("idle");

  // Quote once typing pauses, then keep the price fresh while it's shown
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(fromAmount), 400);
    return () => clearTimeout(t);
  }, [fromAmount]);
  const amountIn = parseAmount(debounced);
  const buyer = (address as Address | null) ?? QUOTE_ADDRESS;
  const quote = useQuery({
    queryKey: ["pons-quote", amountIn?.toString(), buyer],
    queryFn: () => quotePonsBuy(amountIn!, buyer),
    enabled: !!amountIn && hasToken,
    refetchInterval: 15_000,
  });
  const quoting = fromAmount !== debounced || (quote.isFetching && !quote.data);
  const unavailable = !!amountIn && !quoting && quote.isFetched && !quote.data;

  const insufficient = !!eth && fromAmount !== "" && Number(fromAmount) > Number(eth.exact);
  const setMax = () => {
    if (!eth) return;
    const max = Math.max(Number(eth.exact) - GAS_RESERVE, 0);
    setFromAmount(max > 0 ? String(Math.floor(max * 1e6) / 1e6) : "0");
  };

  const { contract, copied, copy } = useCopyContract();

  const buy = async () => {
    if (!address || !amountIn || !publicClient) return;
    try {
      if (chainId !== robinhood.id) await switchChainAsync({ chainId: robinhood.id });
      // Re-quote right before sending so the minimum reflects the latest price
      const fresh = await quotePonsBuy(amountIn, address as Address);
      if (!fresh) {
        notify("Couldn't get a price right now. Try again, or buy on Pons.");
        return;
      }
      setPhase("confirm");
      const hash = await sendTransactionAsync({
        chainId: robinhood.id,
        to: PONS_ROUTER,
        data: encodePonsBuy(fresh.route, amountIn, withSlippage(fresh.out), BigInt(Math.floor(Date.now() / 1000) + 600)),
        value: amountIn,
      });
      setPhase("pending");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === "success") {
        notify(`Bought ~${formatBalance(formatUnits(fresh.out, 18))} $MSPIKE. Welcome to the forest!`);
        setFromAmount("");
      } else {
        notify("The price moved too much, so the buy was cancelled and your ETH stayed in your wallet. Please try again.");
      }
      queryClient.invalidateQueries();
    } catch (err) {
      const rejected = /reject|denied|cancel/i.test(String((err as Error)?.message));
      notify(rejected ? "Transaction cancelled." : "Something went wrong with the buy. Please try again.");
    } finally {
      setPhase("idle");
    }
  };

  const hasAmount = !!parseAmount(fromAmount);
  const canBuy = !!address && phase === "idle" && hasAmount && !insufficient && !quoting && !!quote.data;
  let label = "Buy $MSPIKE";
  if (!address) label = busy ? "Connecting…" : "Connect Wallet";
  else if (phase === "confirm") label = "Confirm in your wallet…";
  else if (phase === "pending") label = "Buying…";
  else if (!hasAmount) label = "Enter an amount";
  else if (insufficient) label = "Insufficient ETH balance";
  else if (quoting) label = "Getting price…";

  const fieldClass =
    "w-full min-w-0 bg-transparent font-display text-3xl font-semibold text-white placeholder:text-cream/35 focus:outline-none";

  return (
    <section id="buy" aria-labelledby="buy-title" className="relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      {/* HERO.png: the mascot lies on the right, the title and swap card sit on the left */}
      <SceneBackdrop
        src={siteConfig.images.heroBackground}
        alt="Mspike lying happily in a sunny meadow full of white flowers"
        side="right"
        widthClass="w-full"
        position="20% 50%"
        fullBleed
      />
      <SceneSoftBackdrop src={siteConfig.images.heroBackground} position="0% 100%" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTitle
            align="center-lg-left"
            id="buy-title"
            eyebrow="Swap"
            title="Buy Mspike"
            subtitle="Swap your crypto and join the Mspike community."
          />

          <Reveal className="mx-auto mt-14 max-w-lg lg:mx-0">
            <GlassCard blur className="p-5 sm:p-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!address) connect();
                  else if (canBuy) buy();
                }}
                aria-describedby={`${ids}-note`}
              >
                {/* FROM */}
                <div className="glass-soft p-4 sm:p-5">
                  <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-cream/70">
                    <label htmlFor={`${ids}-from`}>From</label>
                    <span className="flex items-center gap-2 normal-case tracking-normal" aria-live="polite">
                      Balance: {address ? (eth ? `${formatBalance(eth.exact)} ETH` : "…") : "—"}
                      {eth && eth.value > BigInt(0) && (
                        <button
                          type="button"
                          onClick={setMax}
                          className="rounded-full bg-lime/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-soft-lime ring-1 ring-lime/40 transition-colors hover:bg-lime hover:text-ink"
                        >
                          Max
                        </button>
                      )}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      id={`${ids}-from`}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(sanitizeAmount(e.target.value))}
                      className={fieldClass}
                    />
                    <span className="flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-white/20 bg-deep/70 py-1.5 pl-1.5 pr-4 font-display text-lg font-semibold text-cream">
                      <EthMark />
                      ETH
                    </span>
                  </div>
                </div>

                <div className="relative z-10 -my-3 flex justify-center">
                  <span className="grid size-11 place-items-center rounded-2xl border-4 border-forest bg-lime text-ink shadow-[0_0_20px_rgba(168,243,61,0.6)]">
                    <ArrowDown aria-hidden className="size-5" strokeWidth={2.6} />
                  </span>
                </div>

                {/* TO */}
                <div className="glass-soft p-4 sm:p-5">
                  <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-cream/70">
                    <label htmlFor={`${ids}-to`}>To</label>
                    <span className="normal-case tracking-normal" aria-live="polite">
                      {address && hasToken
                        ? `Balance: ${token ? `${formatBalance(token.exact)} ${token.symbol}` : "…"}`
                        : "Estimated"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      id={`${ids}-to`}
                      readOnly
                      placeholder="0.0"
                      value={quote.data && !quoting ? formatBalance(formatUnits(quote.data.out, 18)) : ""}
                      aria-readonly
                      aria-busy={quoting}
                      className={fieldClass}
                    />
                    <span className="flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-white/20 bg-deep/70 py-1.5 pl-1.5 pr-4 font-display text-lg font-semibold text-cream">
                      <span className="relative size-9">
                        <Image
                          src={siteConfig.images.avatar}
                          alt=""
                          fill
                          unoptimized
                          className="object-contain drop-shadow-[0_2px_4px_rgba(4,24,8,0.45)]"
                        />
                      </span>
                      {siteConfig.name}
                    </span>
                  </div>
                </div>

                {unavailable ? (
                  <PrimaryButton href={siteConfig.links.chart} icon={ArrowUpRight} size="lg" className="mt-5 w-full">
                    Buy on Pons
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    type="submit"
                    icon={Wallet}
                    size="lg"
                    className="mt-5 w-full"
                    disabled={address ? !canBuy : busy}
                  >
                    {label}
                  </PrimaryButton>
                )}

                <p id={`${ids}-note`} className="mt-3 text-center text-sm text-cream/60" aria-live="polite">
                  {unavailable
                    ? "Buying here isn't available right now. You can still buy on Pons."
                    : quote.data && !quoting
                      ? `Min. received ${formatBalance(formatUnits(withSlippage(quote.data.out), 18))} (3% slippage). Routed through Pons: ETH → META → $MSPIKE, fees included.`
                      : "Buy with ETH on Robinhood Chain, routed through Pons."}
                </p>
              </form>

              {/* Contract address */}
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-sm font-bold uppercase tracking-widest text-soft-lime">Contract Address</p>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/15 bg-deep/60 p-2 pl-4">
                  <code
                    className="min-w-0 flex-1 truncate font-mono text-sm text-cream/90 sm:text-base"
                    title={contract || undefined}
                  >
                    <ContractText contract={contract} fallback="Contract Address Coming Soon" />
                  </code>
                  <button
                    type="button"
                    onClick={copy}
                    disabled={!contract}
                    aria-label={copied ? "Contract address copied" : "Copy contract address"}
                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-lime/15 text-soft-lime ring-1 ring-lime/40 transition-colors hover:bg-lime hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-lime/15 disabled:hover:text-soft-lime"
                  >
                    {copied ? <Check aria-hidden className="size-5" /> : <Copy aria-hidden className="size-5" />}
                  </button>
                </div>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Copied to clipboard" : ""}
                </span>
              </div>
            </GlassCard>
          </Reveal>
        </div>

        <SceneInline
          src={siteConfig.images.heroBackground}
          alt="Mspike lying happily in a sunny meadow full of white flowers"
          className="mt-8 aspect-[1672/941]"
          position="center"
        />
      </div>
    </section>
  );
}

/** Small Ethereum diamond for the ETH chip. */
function EthMark() {
  return (
    <span aria-hidden className="grid size-9 place-items-center rounded-full bg-cream/95">
      <svg viewBox="0 0 24 24" className="size-5">
        <path d="M12 2 5.5 12.3 12 16l6.5-3.7Z" fill="#343434" />
        <path d="M12 2v14l6.5-3.7Z" fill="#8C8C8C" />
        <path d="M5.5 13.6 12 22l6.5-8.4L12 17.3Z" fill="#3C3C3B" />
        <path d="M12 17.3V22l6.5-8.4Z" fill="#8C8C8C" />
      </svg>
    </span>
  );
}
