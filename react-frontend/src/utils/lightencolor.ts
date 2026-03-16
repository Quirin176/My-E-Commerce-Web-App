export function lightencolor(hex: string, percent: number) {
  const amt = Math.round(2.55 * percent);
  return hex.replace(/^#/, "").replace(/../g, (c) =>
    ("0" + Math.min(255, Math.max(0, parseInt(c, 16) + amt)).toString(16)).slice(-2)
  );
}