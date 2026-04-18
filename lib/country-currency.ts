import koinfuCountryData from "@/lib/country-data.koinfu.json";
import koinfuCountryMetadata from "@/lib/country-metadata.koinfu.json";

type KoinfuCountryRow = {
  name?: string;
  currencyCode?: string;
};

type KoinfuCountryMetadataRow = {
  name: string;
  code: string;
  locale: string;
  phoneCode: string;
};

export type CountryCurrencyOption = {
  code: string;
  name: string;
  currency: string;
  currencyName: string;
  locale: string;
  phoneCode: string;
};

function resolveCurrencyName(currencyCode: string): string {
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
    return displayNames.of(currencyCode) ?? currencyCode;
  } catch {
    return currencyCode;
  }
}

function createFallbackCountryCode(countryName: string): string {
  const letters = countryName.replace(/[^A-Za-z]/g, "").toUpperCase();
  const first = letters.slice(0, 1) || "C";
  const second = letters.slice(1, 2) || "X";
  return `${first}${second}`;
}

const dedupedByCountryName = (koinfuCountryData as KoinfuCountryRow[]).reduce<Map<string, KoinfuCountryRow>>(
  (accumulator, row) => {
    const name = row.name?.trim();
    const currencyCode = row.currencyCode?.trim();
    if (!name || !currencyCode) return accumulator;
    if (!accumulator.has(name)) accumulator.set(name, row);
    return accumulator;
  },
  new Map<string, KoinfuCountryRow>()
);

const sortedRows = Array.from(dedupedByCountryName.values()).sort((a, b) =>
  (a.name ?? "").localeCompare(b.name ?? "", "en")
);

const metadataByName = new Map(
  (koinfuCountryMetadata as KoinfuCountryMetadataRow[]).map((entry) => [entry.name, entry] as const)
);

export const COUNTRY_CURRENCY_OPTIONS: CountryCurrencyOption[] = sortedRows.map((row) => {
  const name = row.name!.trim();
  const currencyCode = row.currencyCode!.trim().toUpperCase();
  const metadata = metadataByName.get(name);

  return {
    code: metadata?.code ?? createFallbackCountryCode(name),
    name,
    currency: currencyCode,
    currencyName: resolveCurrencyName(currencyCode),
    locale: metadata?.locale ?? "en-US",
    phoneCode: metadata?.phoneCode ?? "+"
  };
});

export const DEFAULT_COUNTRY_CODE = "US";

const fallbackRateBase = COUNTRY_CURRENCY_OPTIONS.reduce<Record<string, number>>((accumulator, country) => {
  accumulator[country.currency] = 1;
  return accumulator;
}, {});

export const FALLBACK_USD_RATES: Record<string, number> = {
  ...fallbackRateBase,
  USD: 1,
  NGN: 1550,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  AUD: 1.53,
  INR: 83.2,
  KES: 129.3,
  ZAR: 18.4,
  BRL: 5.1,
  JPY: 152.8,
  AED: 3.67,
  SAR: 3.75,
  GHS: 15.2,
  EGP: 48.5,
  MXN: 17.1,
  SGD: 1.35,
  CNY: 7.24,
  CHF: 0.9,
  TRY: 32.2
};

const COUNTRY_MAP = new Map(COUNTRY_CURRENCY_OPTIONS.map((entry) => [entry.code, entry]));

export function getCountryOptionByCode(code: string | null | undefined): CountryCurrencyOption {
  if (!code) return COUNTRY_MAP.get(DEFAULT_COUNTRY_CODE)!;
  return COUNTRY_MAP.get(code) ?? COUNTRY_MAP.get(DEFAULT_COUNTRY_CODE)!;
}
