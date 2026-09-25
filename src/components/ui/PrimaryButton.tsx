"use client";

import { motion } from "framer-motion";
import type { ComponentType, ReactNode } from "react";

/** Any Lucide icon, or a custom SVG icon component that accepts a className. */
type ButtonIcon = ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;

type Variant = "primary" | "secondary" | "cream";
type Size = "md" | "lg" | "xl";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ButtonIcon;
  className?: string;
  ariaLabel?: string;
}

type ButtonProps =
  | (BaseProps & { href: string; onClick?: never; type?: never; disabled?: never })
  | (BaseProps & {
      href?: undefined;
      onClick?: () => void;
      type?: "button" | "submit";
      disabled?: boolean;
    });

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-soft-lime to-lime text-ink border border-white/60 shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-4px_0_rgba(72,169,43,0.55),0_10px_30px_-8px_rgba(168,243,61,0.7)] hover:shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-4px_0_rgba(72,169,43,0.55),0_16px_40px_-6px_rgba(168,243,61,0.9)]",
  secondary:
    "bg-deep/70 text-cream border-2 border-lime/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_30px_-12px_rgba(4,24,8,0.8)] hover:bg-forest/80 hover:border-lime hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_30px_-6px_rgba(168,243,61,0.55)]",
  cream:
    "bg-gradient-to-b from-white to-cream text-forest border border-white/80 shadow-[inset_0_-3px_0_rgba(243,214,166,0.9),0_8px_24px_-10px_rgba(4,24,8,0.6)] hover:shadow-[inset_0_-3px_0_rgba(243,214,166,0.9),0_12px_30px_-8px_rgba(255,241,210,0.6)]",
};

const iconColors: Record<Variant, string> = { primary: "", secondary: "text-lime", cream: "text-primary" };

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-base gap-2",
  lg: "min-h-14 px-8 text-lg gap-2.5",
  xl: "min-h-14 px-6 text-lg gap-2.5 sm:min-h-16 sm:px-10 sm:text-xl",
};

export default function PrimaryButton(props: ButtonProps) {
  const { children, variant = "primary", size = "md", icon: Icon, className = "", ariaLabel } = props;

  const classes = `inline-flex items-center justify-center rounded-full font-display font-semibold tracking-wide transition-[box-shadow,background-color,border-color] duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  const motionProps = {
    whileHover: { y: -3, scale: 1.03 },
    whileTap: { y: 0, scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  const content = (
    <>
      {Icon && (
        <Icon
          aria-hidden
          className={`${size === "md" ? "size-[18px]" : size === "lg" ? "size-5" : "size-6"} ${iconColors[variant]}`}
          strokeWidth={2.4}
        />
      )}
      <span>{children}</span>
    </>
  );

  if (props.href !== undefined) {
    const external = /^https?:\/\//.test(props.href);
    return (
      <motion.a
        href={props.href}
        className={classes}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
