/**
 * Buying $MSPIKE through Pons from the site.
 *
 * The token's bonding curve is priced in META (the Robinhood Meta Platforms
 * stock token), so an ETH buy has to hop ETH → WETH → USDG → META → curve.
 * Pons' own swap router does exactly that in one transaction; this file
 * rebuilds the same call the Pons app sends (read from on-chain buys, since the
 * router's source isn't published).
 *
 * Quotes come from simulating that call (eth_simulateV1) and reading the
 * $MSPIKE Transfer to the buyer, so they include every fee and pool on the
 * way. The router reverts if fewer than `minOut` tokens arrive.
 */

import { encodeAbiParameters, type Address, type Hex } from "viem";
import { siteConfig } from "@/config/site";

export const PONS_ROUTER: Address = "0x65050a9b7e5075a2ba5ced7b1b64ee66262c40dc";
/** Pons' 4-byte selector for "swap ETH/ERC-20 along these steps". */
const SWAP_SELECTOR = "0x4d819a2a";

const WETH: Address = "0x0bd7d308f8e1639fab988df18a8011f41eacad73";
const USDG: Address = "0x5fc5360d0400a0fd4f2af552add042d716f1d168";
const META: Address = "0xc0d6457c16cc70d6790dd43521c899c87ce02f35";
const CURVE: Address = "0x01e22c5cdf8c4da4c2fbc1e84145fa38eeec1613";
const ZERO: Address = "0x0000000000000000000000000000000000000000";

const STEP = {
  type: "tuple[]",
  components: [
    { name: "kind", type: "uint256" },
    { name: "tokenIn", type: "address" },
    { name: "tokenOut", type: "address" },
    { name: "pool", type: "address" },
    { name: "fee", type: "uint256" },
    { name: "tickSpacing", type: "uint256" },
    { name: "extra", type: "address" },
    { name: "data", type: "bytes" },
    { name: "hooks", type: "address" },
    { name: "flags", type: "uint256" },
  ],
} as const;

type Step = {
  kind: bigint;
  tokenIn: Address;
  tokenOut: Address;
  pool: Address;
  fee: bigint;
  tickSpacing: bigint;
  extra: Address;
  data: Hex;
  hooks: Address;
  flags: bigint;
};

const step = (s: Partial<Step> & Pick<Step, "kind" | "tokenIn" | "tokenOut">): Step => ({
  pool: ZERO,
  fee: BigInt(0),
  tickSpacing: BigInt(0),
  extra: ZERO,
  data: "0x",
  hooks: ZERO,
  flags: BigInt(0),
  ...s,
});

const WETH_TO_USDG = step({
  kind: BigInt(1),
  tokenIn: WETH,
  tokenOut: USDG,
  pool: "0x52e65b17fb6e5ba00ed806f37afcd2daa50271ca",
  fee: BigInt(100),
  tickSpacing: BigInt(1),
});
const META_TO_MSPIKE = step({
  kind: BigInt(27),
  tokenIn: META,
  tokenOut: siteConfig.contractAddress.toLowerCase() as Address,
  pool: CURVE,
  data: encodeAbiParameters([{ type: "uint256" }], [BigInt(1)]),
});

/** The two USDG → META pools the Pons app routes through; the best quote wins. */
export const PONS_ROUTES: Step[][] = [
  [
    WETH_TO_USDG,
    step({ kind: BigInt(26), tokenIn: USDG, tokenOut: META, pool: "0xcd3d6b36f79ef74785bd1da226c9827b5a5c2dd8", fee: BigInt(2000) }),
    META_TO_MSPIKE,
  ],
  [
    WETH_TO_USDG,
    step({
      kind: BigInt(2),
      tokenIn: USDG,
      tokenOut: META,
      fee: BigInt(3000),
      tickSpacing: BigInt(60),
      hooks: "0x8366a39cc670b4001a1121b8f6a443a643e40951",
    }),
    META_TO_MSPIKE,
  ],
];

/** Calldata for buying with `amountIn` wei of ETH; reverts on-chain below `minOut`. */
export function encodePonsBuy(route: Step[], amountIn: bigint, minOut: bigint, deadline: bigint): Hex {
  const args = encodeAbiParameters(
    [STEP, { type: "address" }, { type: "uint256" }, { type: "uint256" }, { type: "uint256" }],
    [route, ZERO, amountIn, minOut, deadline],
  );
  return `${SWAP_SELECTOR}${args.slice(2)}` as Hex;
}

/** RPC used for quotes: it supports eth_simulateV1 and browser requests. */
const SIMULATE_RPC = "https://robinhood-rpc.publicnode.com";
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export interface PonsQuote {
  route: Step[];
  /** $MSPIKE (18 decimals) the buyer would receive right now. */
  out: bigint;
}

/** $MSPIKE the buyer would receive along one route, or null if it would revert. */
async function simulateRoute(route: Step[], amountIn: bigint, buyer: Address): Promise<bigint | null> {
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
  const res = await fetch(SIMULATE_RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_simulateV1",
      params: [
        {
          blockStateCalls: [
            {
              // Enough ETH for the simulation even before the wallet is funded
              stateOverrides: { [buyer]: { balance: `0x${(amountIn + BigInt(10) ** BigInt(18)).toString(16)}` } },
              calls: [
                {
                  from: buyer,
                  to: PONS_ROUTER,
                  data: encodePonsBuy(route, amountIn, BigInt(0), deadline),
                  value: `0x${amountIn.toString(16)}`,
                },
              ],
            },
          ],
        },
        "latest",
      ],
    }),
  });
  const json = await res.json();
  const call = json?.result?.[0]?.calls?.[0];
  if (!call || call.status !== "0x1") return null;

  const token = siteConfig.contractAddress.toLowerCase();
  const to = buyer.toLowerCase().slice(2);
  let out = BigInt(0);
  for (const log of call.logs as { address: string; topics: string[]; data: Hex }[]) {
    if (log.address.toLowerCase() === token && log.topics[0] === TRANSFER_TOPIC && log.topics[2]?.toLowerCase().endsWith(to)) {
      out += BigInt(log.data);
    }
  }
  return out > BigInt(0) ? out : null;
}

/** Best quote across the Pons routes, or null when buying through the site isn't possible. */
export async function quotePonsBuy(amountIn: bigint, buyer: Address): Promise<PonsQuote | null> {
  const results = await Promise.all(PONS_ROUTES.map((route) => simulateRoute(route, amountIn, buyer).catch(() => null)));
  let best: PonsQuote | null = null;
  results.forEach((out, i) => {
    if (out !== null && (!best || out > best.out)) best = { route: PONS_ROUTES[i], out };
  });
  return best;
}
