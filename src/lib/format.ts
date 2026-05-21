export function formatRobux(n: number): string {
  if (n < 10000) return n.toLocaleString("en-US");
  if (n < 1_000_000) return (n / 1_000).toFixed(n < 100_000 ? 1 : 0).replace(/\.0$/, "") + "K";
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(n < 100_000_000 ? 1 : 0).replace(/\.0$/, "") + "M";
  if (n < 1_000_000_000_000) return (n / 1_000_000_000).toFixed(n < 100_000_000_000 ? 1 : 0).replace(/\.0$/, "") + "B";
  return (n / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
}

export function formatFull(n: number): string {
  return n.toLocaleString("en-US");
}
