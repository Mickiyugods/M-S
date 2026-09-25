"use client";

import { motion } from "framer-motion";
import { Camera, Gift, Search, ShieldCheck, Sprout, TrendingUp, Wallet, X, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";
import { erc20Abi, formatUnits, isAddress, type Address } from "viem";
import { useReadContracts } from "wagmi";
import { robinhood } from "@reown/appkit/networks";
import { siteConfig } from "@/config/site";
import { formatBalance, shortenAddress, useWallet } from "@/lib/web3";
import GlassCard from "@/components/ui/GlassCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { MeadowBackground } from "@/components/ui/Scene";

const { rewards } = siteConfig;
const NOT_YET = "Announced on X";

const steps: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Buy & Hold",
    description: "Hold official $MSPIKE in your own wallet. Only the official contract counts.",
    Icon: Sprout,
  },
  {
    title: "Snapshot",
    description: "Holder balances are recorded at each snapshot to see who qualifies.",
    Icon: Camera,
  },
  {
    title: "Receive META",
    description: "Qualifying holders receive META stock tokens straight to their wallet on Robinhood Chain.",
    Icon: Gift,
  },
];

export default function Rewards() {
  const ids = useId();
  const { address, connect } = useWallet();
  // Any address can be checked without connecting; a connected wallet is shown by default
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState<Address | null>(null);
  const [inputError, setInputError] = useState(false);
  const target = checked ?? (address as Address | null);
  const own = !checked;

  // Without a contract address nobody holds $MSPIKE yet, so only META is read
  const hasToken = isAddress(siteConfig.contractAddress);
  const balances = useReadContracts({
    allowFailure: false,
    contracts: target
      ? [
          { address: rewards.token as Address, abi: erc20Abi, functionName: "balanceOf", args: [target], chainId: robinhood.id },
          ...(hasToken
            ? [
                {
                  address: siteConfig.contractAddress as Address,
                  abi: erc20Abi,
                  functionName: "balanceOf",
                  args: [target],
                  chainId: robinhood.id,
                } as const,
              ]
            : []),
        ]
      : [],
    query: { enabled: !!target, refetchInterval: 15_000 },
  });
  const [metaRaw, tokenRaw] = (balances.data ?? []) as bigint[];
  const heldRaw = hasToken ? tokenRaw : metaRaw !== undefined ? BigInt(0) : undefined;
  const held = heldRaw !== undefined ? Number(formatUnits(heldRaw, 18)) : 0;
  const eligible = rewards.minHolding > 0 ? held >= rewards.minHolding : null;

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (isAddress(value)) {
      setChecked(value as Address);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const details = [
    { label: "Reward", value: "META (Meta Platforms stock token)" },
    {
      label: "Minimum holding",
      value: rewards.minHolding > 0 ? `${new Intl.NumberFormat("en-US").format(rewards.minHolding)} $MSPIKE` : NOT_YET,
    },
    { label: "Schedule", value: rewards.schedule || NOT_YET },
    { label: "Network", value: "Robinhood Chain" },
  ];

  return (
    <section id="rewards" aria-labelledby="rewards-title" className="relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      <MeadowBackground position="50% 40%" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionTitle
          id="rewards-title"
          eyebrow="Holder Rewards"
          title="Earn META Rewards"
          subtitle="Hold official $MSPIKE and get rewarded in META, the tokenized Meta Platforms stock on Robinhood Chain."
        />

        <ol className="mt-16 grid gap-5 md:grid-cols-3">
          {steps.map(({ title, description, Icon }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard hover blur className="h-full p-7">
                <div className="flex items-center justify-between">
                  <span
                    aria-label={`Step ${i + 1}`}
                    className="grid size-14 place-items-center rounded-full bg-gradient-to-b from-soft-lime to-lime font-display text-2xl font-bold text-ink shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-3px_0_rgba(72,169,43,0.5),0_0_24px_rgba(168,243,61,0.55)]"
                  >
                    {i + 1}
                  </span>
                  <Icon aria-hidden className="size-8 text-soft-lime/70" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-2 leading-relaxed text-cream/80">{description}</p>
              </GlassCard>
            </motion.li>
          ))}
        </ol>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GlassCard blur className="h-full p-7">
              <h3 className="flex items-center gap-3 font-display text-2xl font-semibold text-white">
                <TrendingUp aria-hidden className="size-7 text-soft-lime" />
                Reward details
              </h3>
              <dl className="mt-6 divide-y divide-white/10">
                {details.map(({ label, value }) => (
                  <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                    <dt className="text-sm font-bold uppercase tracking-widest text-cream/60">{label}</dt>
                    <dd className={`font-semibold ${value === NOT_YET ? "text-cream/60" : "text-cream"}`}>{value}</dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          </Reveal>

          <Reveal>
            <GlassCard blur className="flex h-full flex-col p-7">
              <h3 className="flex items-center gap-3 font-display text-2xl font-semibold text-white">
                <Wallet aria-hidden className="size-7 text-soft-lime" />
                Your wallet
              </h3>
              {target ? (
                <>
                  <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-cream/70">
                    {own ? "Connected wallet" : "Checking"}
                    <code className="rounded-full bg-deep/60 px-3 py-1 font-mono text-cream">{shortenAddress(target, 6)}</code>
                    {checked && (
                      <button
                        type="button"
                        onClick={() => {
                          setChecked(null);
                          setInput("");
                        }}
                        aria-label="Clear checked address"
                        className="grid size-7 place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-lime hover:text-ink"
                      >
                        <X aria-hidden className="size-4" />
                      </button>
                    )}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    <div className="glass-soft p-4">
                      <dt className="text-sm font-bold uppercase tracking-widest text-cream/60">$MSPIKE</dt>
                      <dd className="mt-1 font-display text-2xl font-semibold text-white">
                        {heldRaw !== undefined ? formatBalance(formatUnits(heldRaw, 18)) : "…"}
                      </dd>
                    </div>
                    <div className="glass-soft p-4">
                      <dt className="text-sm font-bold uppercase tracking-widest text-cream/60">META held</dt>
                      <dd className="mt-1 font-display text-2xl font-semibold text-white">
                        {metaRaw !== undefined ? formatBalance(formatUnits(metaRaw, 18)) : "…"}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-5 flex items-start gap-2 text-cream/80" aria-live="polite">
                    <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-soft-lime" />
                    {heldRaw === undefined
                      ? "Checking balances…"
                      : eligible === null
                        ? held > 0
                          ? `${own ? "You hold" : "This wallet holds"} $MSPIKE. Keep holding for the next snapshot!`
                          : `${own ? "You don't" : "This wallet doesn't"} hold $MSPIKE yet. Buy and hold to start earning META.`
                        : eligible
                          ? `${own ? "You qualify" : "This wallet qualifies"} for the next META reward. Keep holding!`
                          : `Hold at least ${new Intl.NumberFormat("en-US").format(rewards.minHolding)} $MSPIKE to qualify.`}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 leading-relaxed text-cream/80">
                    Connect your wallet, or paste any wallet address below to check its $MSPIKE and META balance.
                  </p>
                  <PrimaryButton onClick={connect} icon={Wallet} className="mt-5 self-start">
                    Connect Wallet
                  </PrimaryButton>
                </>
              )}

              {/* Check any address without connecting */}
              <form onSubmit={check} className="mt-6 border-t border-white/10 pt-6" noValidate>
                <label htmlFor={`${ids}-addr`} className="text-sm font-bold uppercase tracking-widest text-soft-lime">
                  Check a wallet
                </label>
                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/15 bg-deep/60 p-2 pl-4 focus-within:border-lime/60">
                  <input
                    id={`${ids}-addr`}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setInputError(false);
                    }}
                    placeholder="0x… wallet address"
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={inputError}
                    aria-describedby={inputError ? `${ids}-err` : undefined}
                    className="min-w-0 flex-1 bg-transparent font-mono text-sm text-cream placeholder:text-cream/40 focus:outline-none sm:text-base"
                  />
                  <button
                    type="submit"
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-lime px-4 py-2.5 font-display font-semibold text-ink transition-colors hover:bg-soft-lime"
                  >
                    <Search aria-hidden className="size-4" />
                    Check
                  </button>
                </div>
                {inputError && (
                  <p id={`${ids}-err`} role="alert" className="mt-2 text-sm text-honey">
                    That doesn&apos;t look like a wallet address. It should start with 0x and be 42 characters long.
                  </p>
                )}
              </form>
            </GlassCard>
          </Reveal>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-cream/60">
          Rewards go only to holders of the official $MSPIKE contract. Amounts depend on the reward pool and can
          change. Follow {siteConfig.socials.twitter?.replace("https://", "") ?? "our X"} for snapshot announcements.
          This is not financial advice.
        </p>
      </div>
    </section>
  );
}
