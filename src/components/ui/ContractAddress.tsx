"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

/** Copies the configured contract address and reports success for 2 s. */
export function useCopyContract() {
  const contract = siteConfig.contractAddress;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!contract) return;
    try {
      await navigator.clipboard.writeText(contract);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return { contract, copied, copy };
}

/**
 * The address in full whenever it fits, and as start…end only when it doesn't,
 * so both ends can always be checked. Copy always uses the full address.
 */
export function ContractText({ contract, fallback }: { contract: string; fallback: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const full = useRef<HTMLSpanElement>(null);
  const [short, setShort] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setShort((full.current?.offsetWidth ?? 0) > el.clientWidth);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [contract]);

  if (!contract) return <>{fallback}</>;
  return (
    <span ref={box} className="relative block min-w-0 overflow-hidden">
      {/* Invisible full-length copy, measured to decide whether the address fits */}
      <span ref={full} aria-hidden className="invisible absolute whitespace-nowrap">
        {contract}
      </span>
      <span className="block truncate">{short ? `${contract.slice(0, 10)}…${contract.slice(-11)}` : contract}</span>
    </span>
  );
}

/** Compact "CA" pill with a copy button, used in the hero. */
export default function ContractAddressPill({ className = "" }: { className?: string }) {
  const { contract, copied, copy } = useCopyContract();

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-full border border-lime/45 bg-deep/80 py-1.5 pl-1.5 pr-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_30px_-12px_rgba(4,24,8,0.9)] backdrop-blur-md ${className}`}
    >
      <span className="shrink-0 rounded-full bg-lime px-3 py-1.5 font-display text-sm font-bold tracking-wider text-ink">CA</span>
      <code className="min-w-0 flex-1 truncate font-mono text-sm text-cream sm:text-[15px] lg:text-[13px] xl:text-[15px]" title={contract || undefined}>
        <ContractText contract={contract} fallback="Coming Soon" />
      </code>
      <button
        type="button"
        onClick={copy}
        disabled={!contract}
        aria-label={copied ? "Contract address copied" : "Copy contract address"}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-lime/15 text-soft-lime ring-1 ring-lime/40 transition-colors hover:bg-lime hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-lime/15 disabled:hover:text-soft-lime"
      >
        {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
