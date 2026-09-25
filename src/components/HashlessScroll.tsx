"use client";

import { useEffect } from "react";

/**
 * In-page links (href="#section") scroll smoothly to their section without
 * adding "#section" to the address bar. A hash already present on load
 * (e.g. a shared link) is honoured once, then removed from the URL.
 */
export default function HashlessScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollToId = (id: string, smooth: boolean) => {
      const target = id === "home" || id === "" ? null : document.getElementById(id);
      if (id !== "" && id !== "home" && !target) return false;

      if (target) {
        target.scrollIntoView({ behavior: smooth && !reduceMotion ? "smooth" : "auto", block: "start" });
        // Move keyboard focus with the scroll so screen-reader/keyboard users land in the section
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: 0, behavior: smooth && !reduceMotion ? "smooth" : "auto" });
      }
      return true;
    };

    const clearHash = () => {
      if (window.location.hash) {
        history.replaceState(history.state, "", window.location.pathname + window.location.search);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!link) return;

      e.preventDefault();
      scrollToId(decodeURIComponent(link.getAttribute("href")!.slice(1)), true);
      clearHash();
    };

    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      // wait a frame so layout (images, fonts) has settled
      requestAnimationFrame(() => {
        scrollToId(id, false);
        clearHash();
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
