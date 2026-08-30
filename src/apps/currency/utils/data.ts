export const MAX_PINNED = 12;

export const DEFAULT_PINNED = ['EUR', 'USD', 'CNY', 'GBP'];

export const BIG_UNIT = new Set(['JPY', 'KRW', 'IDR', 'VND']);

export function getFlagUrl(code: string): string {
  const overrides: Record<string, string> = { EUR: 'eu' };
  const country = overrides[code] ?? code.slice(0, 2).toLowerCase();
  return `https://flagcdn.com/32x24/${country}.png`;
}

export function formatRate(code: string, value: number): string {
  const decimals = BIG_UNIT.has(code) ? 0 : 2;
  return value.toFixed(decimals);
}
