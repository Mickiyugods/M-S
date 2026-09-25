"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { shortenAddress, useWallet } from "@/lib/web3";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { connect, address, status } = useWallet();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const busy = status === "connecting" || status === "reconnecting";
  const walletLabel = address ? shortenAddress(address) : busy ? "Connecting…" : "Connect Wallet";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/15 px-3 py-2.5 pl-3 backdrop-blur-md transition-[background-color,box-shadow] duration-500 sm:px-4 ${
          scrolled
            ? "bg-deep/75 shadow-[0_18px_40px_-18px_rgba(4,24,8,0.9),inset_0_1px_0_rgba(255,255,255,0.15)]"
            : "bg-forest/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
        }`}
      >
        <a href="#home" className="flex items-center gap-3 rounded-full pr-2" aria-label={`${siteConfig.name} home`}>
          <span className="relative size-11">
            <Image src={siteConfig.images.avatar} alt="" fill unoptimized className="object-contain drop-shadow-[0_2px_4px_rgba(4,24,8,0.45)]" />
          </span>
          <span className="font-display text-xl font-bold tracking-wide text-cream">{siteConfig.name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {siteConfig.navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-2 font-semibold text-cream/85 xl:px-4 transition-colors hover:bg-white/10 hover:text-soft-lime"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden whitespace-nowrap sm:block">
            <PrimaryButton icon={Wallet} onClick={connect} variant="cream">
              {walletLabel}
            </PrimaryButton>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/5 text-cream lg:hidden"
          >
            {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            aria-hidden
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 -z-10 bg-deep/40 backdrop-blur-sm lg:hidden"
          />
        )}
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass mx-auto mt-3 max-w-7xl !bg-deep/95 p-4 lg:hidden"
          >
            <ul className="flex flex-col">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3.5 font-display text-lg font-semibold text-cream transition-colors hover:bg-white/10 hover:text-soft-lime"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 sm:hidden">
              <PrimaryButton
                icon={Wallet}
                onClick={() => {
                  connect();
                  setOpen(false);
                }}
                className="w-full"
              >
                {walletLabel}
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
