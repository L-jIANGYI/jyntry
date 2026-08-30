import type { RatesCache } from '../types';

const ratesCache = new Map<string, RatesCache>();
let currenciesCache: Record<string, string> | null = null;

const BASE_URL = import.meta.env.DEV ? '/api/frankfurter' : 'https://api.frankfurter.dev/v1';

export async function fetchCurrencies(): Promise<Record<string, string>> {
  if (currenciesCache) return currenciesCache;

  const res = await fetch(`${BASE_URL}/currencies`);
  if (!res.ok) throw new Error('Failed to fetch currencies');

  currenciesCache = await res.json();
  return currenciesCache!;
}

export async function fetchRates(base: string): Promise<RatesCache> {
  if (ratesCache.has(base)) return ratesCache.get(base)!;

  const res = await fetch(`${BASE_URL}/latest?from=${base}`);
  if (!res.ok) throw new Error(`Failed to fetch rates for ${base}`);

  const data = await res.json();

  const result: RatesCache = {
    rates: { ...data.rates, [base]: 1 },
    date: data.date,
  };

  ratesCache.set(base, result);
  return result;
}
